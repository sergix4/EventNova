// database/seed_demo.js
// Sprint 3 · Tarea 3: Script de datos de demostración.
//
// Carga datos de PRUEBA para que el sistema y los reportes muestren información:
//   - 5 agentes (con los 3 planes) y 12 clientes, con teléfono y ciudad
//   - 22 eventos en 15 ciudades de 5 países, en TODOS los estados
//     (Programado, En Boletería, En Vivo, Finalizado y Cancelado con su causa)
//   - 82 reservas repartidas en los meses de 2026, en los 3 estados
//     (Reservada, Confirmada y Cancelada con su causa)
//
// Uso:
//   npm run db:demo              -> CARGA la demo
//   npm run db:demo -- --borrar  -> QUITA solo los datos de la demo
// Antes: npm run db:init, npm run db:ubicaciones (y opcional npm run db:admin)
//
// - Al cargar NO borra nada. Si se ejecuta dos veces NO duplica: antes de insertar revisa
//   si ya existe el correo / número de identificación (usuarios), el nombre del
//   evento para ese agente (eventos) o la reserva de ese cliente para ese
//   evento (reservas).
// - Todo va en una transacción: si algo falla, no queda nada a medias.
// - Contraseña de todos los usuarios demo: Demo12345 (se cambia con DEMO_PASSWORD en el .env)
// - Con --borrar quita SOLO lo de la demo: los usuarios con correo
//   @demo.eventnova.com, los eventos de los agentes demo y las reservas de esos
//   clientes o de esos eventos. Los demás datos del sistema no se tocan.
//
// FECHAS: los eventos ya pasados tienen fechas FIJAS de 2026 (enero a octubre).
// Los eventos actuales y futuros se calculan desde el DÍA en que se ejecuta el
// script (ej. "dentro de 30 días"), para que siempre haya eventos en boletería,
// uno en vivo y reservas del mes actual, sin importar cuándo se cargue la demo.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const PASSWORD_DEMO = process.env.DEMO_PASSWORD || 'Demo12345';
const BORRAR = process.argv.includes('--borrar');
const DOMINIO_DEMO = '@demo.eventnova.com'; // así se reconocen los usuarios demo

// ════════════════════════════════════════════════════════════════════════════
// 1. Ayudas para las fechas (todo en hora de Colombia, UTC-5 sin horario de verano)
// ════════════════════════════════════════════════════════════════════════════
const DESFASE_COLOMBIA = 5 * 60 * 60 * 1000;

// Date -> 'AAAA-MM-DD HH:MM:SS' en hora de Colombia
function aTexto(fecha) {
  return new Date(fecha.getTime() - DESFASE_COLOMBIA).toISOString().slice(0, 19).replace('T', ' ');
}

// Día de hoy (en Colombia) + "dias" (negativo = hacia atrás), a la hora indicada
// Ej: enDias(30, '19:00') -> dentro de 30 días a las 7:00 p. m.
function enDias(dias, hora = '10:00') {
  const hoy = new Date(Date.now() - DESFASE_COLOMBIA);
  const dia = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate() + dias));
  return `${dia.toISOString().slice(0, 10)} ${hora}:00`;
}
const haceDias = (dias, hora) => enDias(-dias, hora);

// Hace "dias" días, pero SIN salirse del mes actual (para los indicadores
// "nuevos este mes" del dashboard). Si cae en el mes anterior, usa el día 1.
function esteMes(dias) {
  const ahora = Date.now();
  const hoy = new Date(ahora - DESFASE_COLOMBIA);
  const inicioMes = Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1, 0, 5) + DESFASE_COLOMBIA;
  const fecha = Math.max(ahora - dias * 24 * 60 * 60 * 1000 - 60 * 60 * 1000, inicioMes);
  return aTexto(new Date(Math.min(fecha, ahora - 60 * 1000)));
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Ciudades que usa la demo (deben existir: las crea npm run db:ubicaciones)
// ════════════════════════════════════════════════════════════════════════════
const CIUDADES = {
  cali:         ['Colombia', 'Valle del Cauca', 'Cali'],
  palmira:      ['Colombia', 'Valle del Cauca', 'Palmira'],
  tulua:        ['Colombia', 'Valle del Cauca', 'Tuluá'],
  buga:         ['Colombia', 'Valle del Cauca', 'Guadalajara de Buga'],
  cartago:      ['Colombia', 'Valle del Cauca', 'Cartago'],
  bogota:       ['Colombia', 'Bogotá D.C.', 'Bogotá D.C.'],
  medellin:     ['Colombia', 'Antioquia', 'Medellín'],
  barranquilla: ['Colombia', 'Atlántico', 'Barranquilla'],
  cartagena:    ['Colombia', 'Bolívar', 'Cartagena de Indias'],
  pereira:      ['Colombia', 'Risaralda', 'Pereira'],
  manizales:    ['Colombia', 'Caldas', 'Manizales'],
  bucaramanga:  ['Colombia', 'Santander', 'Bucaramanga'],
  quito:        ['Ecuador', 'Pichincha', 'Quito'],
  buenosaires:  ['Argentina', 'Buenos Aires', 'Buenos Aires'],
  cdmx:         ['México', 'Ciudad de México', 'Ciudad de México'],
  madrid:       ['España', 'Madrid', 'Madrid'],
};

// ════════════════════════════════════════════════════════════════════════════
// 3. Agentes (uno o más por plan)
// ════════════════════════════════════════════════════════════════════════════
const AGENTES = {
  A01: { numero_id: '1000000001', correo: 'valle.producciones@demo.eventnova.com', nombre: 'Carlos Mejía Ospina',
         ciudad: 'cali', direccion: 'Av. 6N # 23-45, Cali', telefono: '+57 315 482 1100',
         plan: 'Plan Empresa', empresa: 'Valle Producciones S.A.S.',
         descripcion: 'Conciertos y festivales del Valle del Cauca.', comision: 8.5, experiencia: 12,
         registro: '2026-01-05 09:00:00' },
  A02: { numero_id: '1000000002', correo: 'pacifico.live@demo.eventnova.com', nombre: 'Natalia Bermúdez Rey',
         ciudad: 'bogota', direccion: 'Calle 93 # 11-27, Bogotá', telefono: '+57 310 220 3344',
         plan: 'Plan Profesional', empresa: 'Pacífico Live Entertainment',
         descripcion: 'Comedia, jazz y giras internacionales.', comision: 10, experiencia: 7,
         registro: '2026-01-12 14:30:00' },
  A03: { numero_id: '1000000003', correo: 'andes.teatro@demo.eventnova.com', nombre: 'Ricardo Salazar Vélez',
         ciudad: 'medellin', direccion: 'Cra. 43A # 1-50, Medellín', telefono: '+57 304 118 9020',
         plan: 'Plan Profesional', empresa: 'Andes Teatro y Cultura',
         descripcion: 'Teatro, ópera y danza.', comision: 9, experiencia: 15,
         registro: '2026-02-01 11:15:00' },
  A04: { numero_id: '1000000004', correo: 'caribe.sound@demo.eventnova.com', nombre: 'Paola Fuentes Barrios',
         ciudad: 'barranquilla', direccion: 'Calle 72 # 54-10, Barranquilla', telefono: '+57 300 765 4312',
         plan: 'Plan Básico', empresa: 'Caribe Sound Eventos',
         descripcion: 'Música tropical y eventos de la costa.', comision: 7, experiencia: 4,
         registro: '2026-03-15 16:45:00' },
  A05: { numero_id: '1000000005', correo: 'eje.cafetero@demo.eventnova.com', nombre: 'Felipe Arango Giraldo',
         ciudad: 'manizales', direccion: 'Cra. 23 # 64-12, Manizales', telefono: '+57 312 900 1188',
         plan: 'Plan Básico', empresa: 'Eje Cafetero Shows',
         descripcion: 'Trova y música andina en el Eje Cafetero.', comision: 6, experiencia: 2,
         registro: esteMes(0) },  // agente nuevo de este mes
};

// ════════════════════════════════════════════════════════════════════════════
// 4. Clientes (registrados a lo largo del año; los 2 últimos, este mes)
// ════════════════════════════════════════════════════════════════════════════
const CLIENTES = {
  C01: { numero_id: '1100000001', correo: 'laura.gomez@demo.eventnova.com',     nombre: 'Laura Gómez Restrepo',   ciudad: 'cali',         telefono: '+57 316 555 0101', registro: '2026-01-08 09:15:00' },
  C02: { numero_id: '1100000002', correo: 'andres.munoz@demo.eventnova.com',    nombre: 'Andrés Felipe Muñoz',    ciudad: 'palmira',      telefono: '+57 317 555 0102', registro: '2026-01-20 18:40:00' },
  C03: { numero_id: '1100000003', correo: 'valentina.rios@demo.eventnova.com',  nombre: 'Valentina Ríos Cárdenas', ciudad: 'tulua',       telefono: '+57 318 555 0103', registro: '2026-02-03 12:05:00' },
  C04: { numero_id: '1100000004', correo: 'santiago.herrera@demo.eventnova.com', nombre: 'Santiago Herrera Pinto', ciudad: 'bogota',       telefono: '+57 319 555 0104', registro: '2026-02-17 20:10:00' },
  C05: { numero_id: '1100000005', correo: 'camila.ortiz@demo.eventnova.com',    nombre: 'Camila Ortiz Londoño',   ciudad: 'medellin',     telefono: '+57 320 555 0105', registro: '2026-03-05 08:30:00' },
  C06: { numero_id: '1100000006', correo: 'juan.castro@demo.eventnova.com',     nombre: 'Juan David Castro',      ciudad: 'cali',         telefono: '+57 321 555 0106', registro: '2026-03-22 15:20:00' },
  C07: { numero_id: '1100000007', correo: 'mariana.lopez@demo.eventnova.com',   nombre: 'Mariana López Zapata',   ciudad: 'buga',         telefono: '+57 322 555 0107', registro: '2026-04-10 10:00:00' },
  C08: { numero_id: '1100000008', correo: 'sebastian.torres@demo.eventnova.com', nombre: 'Sebastián Torres Díaz', ciudad: 'barranquilla', telefono: '+57 323 555 0108', registro: '2026-05-14 19:45:00' },
  C09: { numero_id: '1100000009', correo: 'isabella.vargas@demo.eventnova.com', nombre: 'Isabella Vargas Mora',   ciudad: 'cartago',      telefono: '+57 324 555 0109', registro: '2026-06-02 11:25:00' },
  C10: { numero_id: '1100000010', correo: 'daniel.rojas@demo.eventnova.com',    nombre: 'Daniel Rojas Quintero',  ciudad: 'pereira',      telefono: '+57 325 555 0110', registro: '2026-07-19 17:00:00' },
  C11: { numero_id: '1100000011', correo: 'sofia.martinez@demo.eventnova.com',  nombre: 'Sofía Martínez Arias',   ciudad: 'cali',         telefono: '+57 301 555 0111', registro: esteMes(1) },
  C12: { numero_id: '1100000012', correo: 'mateo.jimenez@demo.eventnova.com',   nombre: 'Mateo Jiménez Cruz',     ciudad: 'bucaramanga',  telefono: '+57 302 555 0112', registro: esteMes(0) },
};

// ════════════════════════════════════════════════════════════════════════════
// 5. Eventos y sus reservas
//    Cada reserva: [cliente, entradas, estado, fecha de la reserva, causa, fecha de cancelación]
//    (causa y fecha de cancelación solo para las "Cancelada")
// ════════════════════════════════════════════════════════════════════════════
const T_MUNICIPAL = 'Teatro Municipal Enrique Buenaventura';
const T_COLSUBSIDIO = 'Teatro Colsubsidio Roberto Arias Pérez';
const NO_ASISTE = 'El cliente informó que no podrá asistir';
const CAMBIO = 'Cambio de planes del cliente';

const EVENTOS = [
  // ── FINALIZADOS (enero a octubre de 2026) ─────────────────────────────────
  { agente: 'A01', nombre: 'Concierto Sinfónico de Año Nuevo', ciudad: 'cali', teatro: T_MUNICIPAL, direccion: 'Cra. 5 # 6-64, Cali',
    descripcion: 'La Orquesta Filarmónica de Cali abre la temporada con obras clásicas.',
    inicio: '2026-02-14 19:00:00', fin: '2026-02-14 21:30:00', capacidad: 800, precio: 60000, estado: 'Finalizado', registro: '2026-01-10 10:00:00',
    reservas: [
      ['C01', 2, 'Confirmada', '2026-01-15 10:20:00'],
      ['C02', 4, 'Confirmada', '2026-01-23 18:05:00'],
      ['C03', 1, 'Cancelada',  '2026-02-04 09:40:00', NO_ASISTE, '2026-02-09 08:30:00'],
    ] },
  { agente: 'A02', nombre: 'Stand-up Comedy: Risas del Pacífico', ciudad: 'bogota', teatro: T_COLSUBSIDIO, direccion: 'Calle 26 # 25-40, Bogotá',
    descripcion: 'Noche de comedia con humoristas del Pacífico colombiano.',
    inicio: '2026-03-07 20:00:00', fin: '2026-03-07 22:00:00', capacidad: 600, precio: 45000, estado: 'Finalizado', registro: '2026-01-25 15:00:00',
    reservas: [
      ['C01', 3, 'Confirmada', '2026-02-02 11:00:00'],
      ['C03', 2, 'Confirmada', '2026-02-10 19:30:00'],
      ['C04', 5, 'Confirmada', '2026-02-20 21:15:00'],
      ['C02', 2, 'Cancelada',  '2026-02-12 13:45:00', CAMBIO, '2026-02-28 09:00:00'],
    ] },
  { agente: 'A03', nombre: 'Teatro: La Casa de Bernarda Alba', ciudad: 'medellin', teatro: 'Teatro Pablo Tobón Uribe', direccion: 'Cra. 40 # 51-24, Medellín',
    descripcion: 'Montaje clásico de la obra de Federico García Lorca.',
    inicio: '2026-04-18 19:30:00', fin: '2026-04-18 21:30:00', capacidad: 500, precio: 55000, estado: 'Finalizado', registro: '2026-02-20 09:30:00',
    reservas: [
      ['C04', 2, 'Confirmada', '2026-03-01 10:10:00'],
      ['C05', 4, 'Confirmada', '2026-03-08 16:00:00'],
      ['C06', 2, 'Confirmada', '2026-03-25 12:30:00'],
      ['C01', 1, 'Cancelada',  '2026-03-10 08:50:00', NO_ASISTE, '2026-04-02 17:20:00'],
    ] },
  { agente: 'A01', nombre: 'Festival de Salsa al Parque', ciudad: 'cali', teatro: 'Coliseo El Pueblo', direccion: 'Calle 9 # 39-00, Cali',
    descripcion: 'Las mejores orquestas de salsa de Cali en un solo escenario.',
    inicio: '2026-05-23 16:00:00', fin: '2026-05-23 23:00:00', capacidad: 3000, precio: 80000, estado: 'Finalizado', registro: '2026-03-10 11:00:00',
    reservas: [
      ['C01', 6, 'Confirmada', '2026-04-05 10:00:00'],
      ['C02', 4, 'Confirmada', '2026-04-14 20:30:00'],
      ['C06', 2, 'Confirmada', '2026-04-20 14:15:00'],
      ['C07', 3, 'Confirmada', '2026-05-02 09:45:00'],
      ['C05', 8, 'Confirmada', '2026-05-12 18:00:00'],
      ['C03', 2, 'Cancelada',  '2026-04-22 11:30:00', CAMBIO, '2026-05-10 10:00:00'],
    ] },
  { agente: 'A04', nombre: 'Carnaval Rock Barranquilla', ciudad: 'barranquilla', teatro: 'Centro de Eventos Puerta de Oro', direccion: 'Vía 40 # 77B-57, Barranquilla',
    descripcion: 'Bandas de rock nacional con sabor caribeño.',
    inicio: '2026-06-20 17:00:00', fin: '2026-06-20 23:30:00', capacidad: 2500, precio: 95000, estado: 'Finalizado', registro: '2026-04-02 16:00:00',
    reservas: [
      ['C08', 4, 'Confirmada', '2026-05-18 12:00:00'],
      ['C04', 2, 'Confirmada', '2026-05-25 19:10:00'],
      ['C07', 5, 'Confirmada', '2026-06-05 15:40:00'],
      ['C05', 2, 'Cancelada',  '2026-05-28 10:30:00', NO_ASISTE, '2026-06-10 08:15:00'],
    ] },
  { agente: 'A03', nombre: 'Ballet Folclórico de Colombia', ciudad: 'pereira', teatro: 'Teatro Santiago Londoño', direccion: 'Calle 20 # 4-31, Pereira',
    descripcion: 'Danzas tradicionales de todas las regiones del país.',
    inicio: '2026-07-11 18:00:00', fin: '2026-07-11 20:00:00', capacidad: 700, precio: 50000, estado: 'Finalizado', registro: '2026-05-15 10:20:00',
    reservas: [
      ['C09', 2, 'Confirmada', '2026-06-08 09:00:00'],
      ['C06', 3, 'Confirmada', '2026-06-15 17:30:00'],
      ['C01', 2, 'Confirmada', '2026-06-22 20:00:00'],
      ['C08', 1, 'Cancelada',  '2026-06-25 13:00:00', CAMBIO, '2026-07-01 11:45:00'],
    ] },
  { agente: 'A02', nombre: 'Noche de Tango en Buenos Aires', ciudad: 'buenosaires', teatro: 'Teatro Gran Rex', direccion: 'Av. Corrientes 857, Buenos Aires',
    descripcion: 'Orquesta típica y bailarines profesionales de tango.',
    inicio: '2026-08-08 21:00:00', fin: '2026-08-08 23:00:00', capacidad: 900, precio: 120000, estado: 'Finalizado', registro: '2026-06-01 08:00:00',
    reservas: [
      ['C05', 2, 'Confirmada', '2026-06-20 10:40:00'],
      ['C04', 2, 'Confirmada', '2026-07-03 22:00:00'],
      ['C10', 3, 'Confirmada', '2026-07-25 12:15:00'],
      ['C02', 1, 'Cancelada',  '2026-07-10 16:20:00', NO_ASISTE, '2026-07-30 09:30:00'],
    ] },
  { agente: 'A01', nombre: 'Festival Gastronómico y Musical del Valle', ciudad: 'palmira', teatro: 'Coliseo de Ferias de Palmira', direccion: 'Cra. 28 # 42-00, Palmira',
    descripcion: 'Comida típica vallecaucana y música en vivo todo el día.',
    inicio: '2026-08-29 12:00:00', fin: '2026-08-29 22:00:00', capacidad: 1500, precio: 40000, estado: 'Finalizado', registro: '2026-07-01 14:00:00',
    reservas: [
      ['C02', 5, 'Confirmada', '2026-07-08 11:00:00'],
      ['C07', 4, 'Confirmada', '2026-07-15 18:30:00'],
      ['C09', 3, 'Confirmada', '2026-08-02 10:15:00'],
      ['C10', 6, 'Confirmada', '2026-08-10 20:45:00'],
      ['C06', 4, 'Confirmada', '2026-08-18 13:20:00'],
      ['C01', 2, 'Cancelada',  '2026-08-12 09:10:00', CAMBIO, '2026-08-20 16:00:00'],
    ] },
  { agente: 'A04', nombre: 'Concierto Vallenato en Cartagena', ciudad: 'cartagena', teatro: 'Centro de Convenciones Cartagena de Indias', direccion: 'Calle 24 # 8A-344, Cartagena',
    descripcion: 'Grandes voces del vallenato frente al mar Caribe.',
    inicio: '2026-09-19 20:00:00', fin: '2026-09-19 23:30:00', capacidad: 2000, precio: 110000, estado: 'Finalizado', registro: '2026-07-20 09:00:00',
    reservas: [
      ['C08', 6, 'Confirmada', '2026-08-05 15:00:00'],
      ['C03', 2, 'Confirmada', '2026-08-14 10:30:00'],
      ['C05', 3, 'Confirmada', '2026-09-01 19:20:00'],
      ['C09', 4, 'Confirmada', '2026-09-08 12:40:00'],
      ['C10', 2, 'Cancelada',  '2026-08-22 17:00:00', NO_ASISTE, '2026-09-05 08:00:00'],
    ] },
  { agente: 'A03', nombre: 'Gran Gala de Ópera', ciudad: 'madrid', teatro: 'Teatro Real', direccion: 'Plaza de Isabel II s/n, Madrid',
    descripcion: 'Arias célebres de Verdi y Puccini con orquesta en vivo.',
    inicio: '2026-10-10 20:00:00', fin: '2026-10-10 22:30:00', capacidad: 1200, precio: 150000, estado: 'Finalizado', registro: '2026-08-05 11:30:00',
    reservas: [
      ['C04', 2, 'Confirmada', '2026-08-20 21:00:00'],
      ['C05', 2, 'Confirmada', '2026-09-02 09:30:00'],
      ['C10', 1, 'Confirmada', '2026-09-15 14:00:00'],
      ['C06', 2, 'Cancelada',  '2026-09-10 18:10:00', CAMBIO, '2026-09-28 10:30:00'],
    ] },
  { agente: 'A02', nombre: 'Feria de Jazz de Tuluá', ciudad: 'tulua', teatro: 'Teatro Sarmiento', direccion: 'Cra. 26 # 26-20, Tuluá',
    descripcion: 'Cuartetos y big bands de jazz del suroccidente.',
    inicio: '2026-10-24 19:00:00', fin: '2026-10-24 22:00:00', capacidad: 400, precio: 35000, estado: 'Finalizado', registro: '2026-09-01 10:00:00',
    reservas: [
      ['C03', 4, 'Confirmada', '2026-09-10 12:00:00'],
      ['C07', 2, 'Confirmada', '2026-09-20 17:15:00'],
      ['C09', 2, 'Confirmada', '2026-10-02 11:40:00'],
      ['C02', 3, 'Confirmada', '2026-10-08 20:00:00'],
      ['C01', 1, 'Confirmada', '2026-10-12 09:20:00'],
      ['C08', 2, 'Cancelada',  '2026-10-05 15:30:00', NO_ASISTE, '2026-10-15 13:00:00'],
    ] },

  // ── CANCELADOS (con su causa; sus reservas quedan canceladas) ─────────────
  { agente: 'A03', nombre: 'Concierto de Rock Andino', ciudad: 'quito', teatro: 'Coliseo General Rumiñahui', direccion: 'Av. Gran Colombia, Quito',
    descripcion: 'Bandas de rock latinoamericano con instrumentos andinos.',
    inicio: '2026-05-09 19:00:00', fin: '2026-05-09 23:00:00', capacidad: 1800, precio: 90000, estado: 'Cancelado', registro: '2026-03-01 09:00:00',
    causa: 'Cierre del recinto por mantenimiento estructural', cancelacion: '2026-04-25 10:00:00',
    reservas: [
      ['C05', 3, 'Cancelada', '2026-03-12 11:00:00'],
      ['C06', 2, 'Cancelada', '2026-03-28 19:30:00'],
      ['C07', 4, 'Cancelada', '2026-04-12 14:20:00'],
    ] },
  { agente: 'A04', nombre: 'Festival Electrónico Buga Sound', ciudad: 'buga', teatro: 'Coliseo de Ferias de Buga', direccion: 'Cra. 8 # 1-00, Guadalajara de Buga',
    descripcion: 'DJs nacionales e internacionales de música electrónica.',
    inicio: enDias(20, '18:00'), fin: enDias(20, '23:59'), capacidad: 1200, precio: 75000, estado: 'Cancelado', registro: haceDias(40, '09:00'),
    causa: 'El artista principal canceló su gira', cancelacion: haceDias(5, '11:00'),
    reservas: [
      ['C07', 3, 'Cancelada', haceDias(30, '15:00')],
      ['C03', 2, 'Cancelada', haceDias(22, '20:10')],
      ['C09', 4, 'Cancelada', haceDias(12, '10:30')],
    ] },
  { agente: 'A02', nombre: 'Taller de Teatro Infantil', ciudad: 'bogota', teatro: T_COLSUBSIDIO, direccion: 'Calle 26 # 25-40, Bogotá',
    descripcion: 'Taller de expresión teatral para niños de 6 a 12 años.',
    inicio: enDias(35, '09:00'), fin: enDias(35, '12:00'), capacidad: 60, precio: 25000, estado: 'Cancelado', registro: haceDias(20, '16:00'),
    causa: 'Baja inscripción de participantes', cancelacion: haceDias(3, '09:30'),
    reservas: [] },

  // ── EN VIVO (empezó hace 3 días y sigue abierto) ──────────────────────────
  { agente: 'A01', nombre: 'Exposición Inmersiva: Mundos de Luz', ciudad: 'cali', teatro: 'Centro Cultural de Cali', direccion: 'Cra. 5 # 6-05, Cali',
    descripcion: 'Exposición de arte digital con proyecciones 360°.',
    inicio: haceDias(3, '10:00'), fin: enDias(25, '20:00'), capacidad: 5000, precio: 30000, estado: 'En Vivo', registro: haceDias(45, '10:00'),
    reservas: [
      ['C01', 4, 'Confirmada', haceDias(40, '12:00')],
      ['C06', 2, 'Confirmada', haceDias(30, '18:30')],
      ['C09', 3, 'Confirmada', haceDias(20, '09:15')],
      ['C10', 2, 'Confirmada', haceDias(10, '21:00')],
      ['C02', 2, 'Cancelada',  haceDias(25, '14:00'), CAMBIO, haceDias(15, '10:00')],
    ] },

  // ── EN BOLETERÍA (próximos días: se pueden reservar) ──────────────────────
  { agente: 'A01', nombre: 'Concierto Navideño Sinfónico', ciudad: 'cali', teatro: T_MUNICIPAL, direccion: 'Cra. 5 # 6-64, Cali',
    descripcion: 'Villancicos y clásicos navideños con coro y orquesta.',
    inicio: enDias(30, '19:00'), fin: enDias(30, '21:30'), capacidad: 800, precio: 70000, estado: 'En Boletería', registro: haceDias(50, '09:00'),
    reservas: [
      ['C04', 4, 'Confirmada', haceDias(28, '11:30')],
      ['C06', 3, 'Confirmada', haceDias(20, '19:45')],
      ['C01', 2, 'Reservada',  haceDias(15, '10:10')],
      ['C05', 2, 'Reservada',  haceDias(6, '16:30')],
      ['C08', 2, 'Cancelada',  haceDias(18, '13:00'), NO_ASISTE, haceDias(9, '08:40')],
      ['C10', 5, 'Reservada',  esteMes(1)],
      ['C02', 2, 'Reservada',  esteMes(0)],
    ] },
  { agente: 'A02', nombre: 'Stand-up: Noche de Impro', ciudad: 'bogota', teatro: T_COLSUBSIDIO, direccion: 'Calle 26 # 25-40, Bogotá',
    descripcion: 'Comedia de improvisación con el público.',
    inicio: enDias(12, '20:00'), fin: enDias(12, '22:00'), capacidad: 600, precio: 50000, estado: 'En Boletería', registro: haceDias(30, '12:00'),
    reservas: [
      ['C04', 2, 'Confirmada', haceDias(25, '20:00')],
      ['C05', 3, 'Reservada',  haceDias(10, '09:30')],
      ['C07', 2, 'Cancelada',  haceDias(20, '17:10'), CAMBIO, haceDias(8, '12:00')],
      ['C03', 1, 'Reservada',  esteMes(0)],
    ] },
  { agente: 'A03', nombre: 'Festival de Música del Pacífico', ciudad: 'medellin', teatro: 'Teatro Metropolitano José Gutiérrez Gómez', direccion: 'Calle 41 # 57-30, Medellín',
    descripcion: 'Marimba, chirimía y currulao en el corazón de Medellín.',
    inicio: enDias(18, '19:00'), fin: enDias(18, '22:00'), capacidad: 1400, precio: 85000, estado: 'En Boletería', registro: haceDias(35, '10:30'),
    reservas: [
      ['C05', 4, 'Confirmada', haceDias(30, '14:20')],
      ['C09', 2, 'Confirmada', haceDias(21, '18:00')],
      ['C03', 2, 'Reservada',  haceDias(14, '11:00')],
      ['C10', 1, 'Reservada',  esteMes(2)],
    ] },
  { agente: 'A02', nombre: 'Concierto de Fin de Año en Ciudad de México', ciudad: 'cdmx', teatro: 'Auditorio Nacional', direccion: 'Paseo de la Reforma 50, Ciudad de México',
    descripcion: 'Gran concierto de pop latino para despedir el año.',
    inicio: enDias(45, '21:00'), fin: enDias(45, '23:59'), capacidad: 3000, precio: 180000, estado: 'En Boletería', registro: haceDias(25, '08:30'),
    reservas: [
      ['C04', 2, 'Reservada',  haceDias(20, '22:00')],
      ['C08', 2, 'Confirmada', haceDias(12, '10:45')],
      ['C01', 3, 'Reservada',  haceDias(4, '19:00')],
    ] },
  { agente: 'A04', nombre: 'Noche de Boleros', ciudad: 'bucaramanga', teatro: 'Teatro Santander', direccion: 'Calle 33 # 18-63, Bucaramanga',
    descripcion: 'Tríos y solistas interpretan los boleros de siempre.',
    inicio: enDias(8, '20:00'), fin: enDias(8, '22:00'), capacidad: 450, precio: 40000, estado: 'En Boletería', registro: haceDias(20, '15:00'),
    reservas: [
      ['C08', 2, 'Reservada',  haceDias(15, '12:30')],
      ['C06', 2, 'Confirmada', haceDias(11, '20:15')],
      ['C07', 1, 'Reservada',  esteMes(0)],
    ] },

  // ── PROGRAMADOS (visibles pero todavía sin venta de entradas) ─────────────
  { agente: 'A01', nombre: 'Festival de Verano 2027', ciudad: 'cartagena', teatro: 'Centro de Convenciones Cartagena de Indias', direccion: 'Calle 24 # 8A-344, Cartagena',
    descripcion: 'Tres escenarios con artistas de música tropical y urbana.',
    inicio: enDias(70, '15:00'), fin: enDias(70, '23:00'), capacidad: 4000, precio: 120000, estado: 'Programado', registro: esteMes(0),
    reservas: [] },
  { agente: 'A05', nombre: 'Gira Café y Trova', ciudad: 'manizales', teatro: 'Teatro Los Fundadores', direccion: 'Cra. 22 # 33-00, Manizales',
    descripcion: 'Trova, bambuco y pasillo con café de origen.',
    inicio: enDias(60, '19:00'), fin: enDias(60, '21:00'), capacidad: 900, precio: 45000, estado: 'Programado', registro: esteMes(0),
    reservas: [] },
];

// ════════════════════════════════════════════════════════════════════════════
// 6. Funciones que insertan (cada una revisa antes si ya existe)
// ════════════════════════════════════════════════════════════════════════════

// Busca el id de cada ciudad de la demo. Si falta alguna, avisa qué hacer.
async function buscarCiudades(client) {
  const ids = {};
  for (const [clave, [pais, depto, ciudad]] of Object.entries(CIUDADES)) {
    const { rows } = await client.query(
      `SELECT c.id_ciudad
       FROM public."CIUDAD" c
       JOIN public."DEPARTAMENTO" d ON d.id_departamento = c.id_departamento
       JOIN public."PAIS" p         ON p.id_pais = d.id_pais
       WHERE LOWER(p.nombre_pais) = LOWER($1)
         AND LOWER(d.nombre_departamento) = LOWER($2)
         AND LOWER(c.nombre_ciudad) = LOWER($3)
       LIMIT 1`,
      [pais, depto, ciudad],
    );
    if (rows.length === 0) {
      throw new Error(`No existe la ciudad "${ciudad}" (${depto}, ${pais}). Ejecuta primero: npm run db:ubicaciones`);
    }
    ids[clave] = rows[0].id_ciudad;
  }
  return ids;
}

// Crea USUARIO + TELEFONOS. Devuelve false si el usuario ya existía.
async function crearUsuario(client, u, idCiudad, hash) {
  const existe = await client.query(
    'SELECT 1 FROM public."USUARIO" WHERE correo = $1 OR numero_id = $2',
    [u.correo, u.numero_id],
  );
  if (existe.rowCount > 0) return false;

  await client.query(
    `INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, direccion, id_ciudad, fecha_registro)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [u.numero_id, u.correo, u.nombre, hash, u.direccion || null, idCiudad, u.registro],
  );
  await client.query(
    'INSERT INTO public."TELEFONOS" (numero_id, telefono) VALUES ($1, $2)',
    [u.numero_id, u.telefono],
  );
  return true;
}

async function crearAgente(client, a, idCiudad, hash) {
  if (!(await crearUsuario(client, a, idCiudad, hash))) return false;
  await client.query(
    `INSERT INTO public."AGENTE" (numero_id, id_plan, nombre_empresa, descripcion_agente, comision, experiencia)
     VALUES ($1, (SELECT id_plan FROM public."TIPO_PLAN" WHERE nombre_plan = $2), $3, $4, $5, $6)`,
    [a.numero_id, a.plan, a.empresa, a.descripcion, a.comision, a.experiencia],
  );
  return true;
}

async function crearCliente(client, c, idCiudad, hash) {
  if (!(await crearUsuario(client, c, idCiudad, hash))) return false;
  await client.query(
    `INSERT INTO public."CLIENTE" (numero_id, codigo_cliente, visualizar_publicidad)
     VALUES ($1, $2, TRUE)`,
    [c.numero_id, `CLI-${c.numero_id}`],  // mismo formato que el registro normal
  );
  return true;
}

// Crea el evento si ese agente no tiene ya uno con el mismo nombre.
// Devuelve { id, nuevo }.
async function crearEvento(client, ev, idCiudad, idAgente) {
  const existe = await client.query(
    'SELECT id_evento FROM public."EVENTO" WHERE nombre_evento = $1 AND id_agente = $2',
    [ev.nombre, idAgente],
  );
  if (existe.rowCount > 0) return { id: existe.rows[0].id_evento, nuevo: false };

  const { rows } = await client.query(
    `INSERT INTO public."EVENTO"
       (nombre_evento, descripcion_evento, teatro, direccion_evento, id_ciudad,
        fecha_inicio, fecha_fin, capacidad, precio_base, id_estado,
        causa_cancelacion, fecha_cancelacion, id_agente, fecha_registro)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
             (SELECT id_estado FROM public."ESTADO" WHERE nombre_estado = $10),
             $11, $12, $13,
             -- fecha_registro se guarda en la zona de la BD (UTC en Neon), igual que NOW()
             ($14::timestamp AT TIME ZONE 'America/Bogota'))
     RETURNING id_evento`,
    [ev.nombre, ev.descripcion, ev.teatro, ev.direccion, idCiudad,
     ev.inicio, ev.fin, ev.capacidad, ev.precio, ev.estado,
     ev.causa || null, ev.cancelacion || null, idAgente, ev.registro],
  );
  return { id: rows[0].id_evento, nuevo: true };
}

// Crea la reserva si ese cliente no tiene ya una para ese evento.
// valor_total = entradas x precio_base del evento (igual que el backend).
async function crearReserva(client, ev, idEvento, [claveCliente, entradas, estado, fecha, causa, fechaCancel]) {
  const idCliente = CLIENTES[claveCliente].numero_id;
  const existe = await client.query(
    'SELECT 1 FROM public."RESERVA" WHERE id_cliente = $1 AND id_evento = $2',
    [idCliente, idEvento],
  );
  if (existe.rowCount > 0) return false;

  // Si el EVENTO se canceló, sus reservas se cancelan con el mismo texto que usa el sistema
  if (ev.estado === 'Cancelado') {
    causa = `Evento cancelado por el organizador: ${ev.causa}`;
    fechaCancel = ev.cancelacion;
  }

  await client.query(
    `INSERT INTO public."RESERVA"
       (fecha_hora_reserva, numero_entradas, valor_total, id_estado_reserva,
        causa_cancelacion, fecha_cancelacion, id_cliente, id_evento)
     VALUES ($1, $2::int,
             $2::int * (SELECT precio_base FROM public."EVENTO" WHERE id_evento = $7),
             (SELECT id_estado_reserva FROM public."ESTADO_RESERVA" WHERE nombre_estado = $3),
             $4, $5, $6, $7)`,
    [fecha, entradas, estado, causa || null, fechaCancel || null, idCliente, idEvento],
  );
  return true;
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Cargar la demo (npm run db:demo)
// ════════════════════════════════════════════════════════════════════════════
async function cargarDemo(client) {
  const cuenta = { agentes: 0, clientes: 0, eventos: 0, reservas: 0 };

  // Requisitos: planes y estados (db:init) y ciudades (db:ubicaciones)
  const base = await client.query(`
    SELECT (SELECT COUNT(*) FROM public."TIPO_PLAN")::int      AS planes,
           (SELECT COUNT(*) FROM public."ESTADO")::int         AS estados,
           (SELECT COUNT(*) FROM public."ESTADO_RESERVA")::int AS estados_reserva`);
  const { planes, estados, estados_reserva } = base.rows[0];
  if (planes < 3 || estados < 5 || estados_reserva < 3) {
    throw new Error('Faltan los planes o los estados. Ejecuta primero: npm run db:init');
  }

  await client.query('BEGIN');

  const ciudades = await buscarCiudades(client);
  const hash = await bcrypt.hash(PASSWORD_DEMO, 10); // la misma contraseña para todos

  for (const a of Object.values(AGENTES)) {
    if (await crearAgente(client, a, ciudades[a.ciudad], hash)) cuenta.agentes++;
  }
  for (const c of Object.values(CLIENTES)) {
    if (await crearCliente(client, c, ciudades[c.ciudad], hash)) cuenta.clientes++;
  }

  for (const ev of EVENTOS) {
    const { id, nuevo } = await crearEvento(client, ev, ciudades[ev.ciudad], AGENTES[ev.agente].numero_id);
    if (nuevo) cuenta.eventos++;
    for (const r of ev.reservas) {
      if (await crearReserva(client, ev, id, r)) cuenta.reservas++;
    }
  }

  await client.query('COMMIT');

  const totalReservas = EVENTOS.reduce((s, e) => s + e.reservas.length, 0);
  console.log('\n¡Datos de demostración cargados!');
  console.log(`  Agentes nuevos:  ${cuenta.agentes} de ${Object.keys(AGENTES).length}`);
  console.log(`  Clientes nuevos: ${cuenta.clientes} de ${Object.keys(CLIENTES).length}`);
  console.log(`  Eventos nuevos:  ${cuenta.eventos} de ${EVENTOS.length}`);
  console.log(`  Reservas nuevas: ${cuenta.reservas} de ${totalReservas}`);
  if (cuenta.agentes + cuenta.clientes + cuenta.eventos + cuenta.reservas === 0) {
    console.log('  (Ya estaban todos: no se duplicó nada.)');
  }
  console.log(`\nUsuarios demo (contraseña: ${PASSWORD_DEMO})`);
  console.log(`  Agente:  ${AGENTES.A01.correo}`);
  console.log(`  Cliente: ${CLIENTES.C01.correo}`);
  console.log('Para quitar la demo: npm run db:demo -- --borrar');
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Quitar la demo (npm run db:demo -- --borrar)
//    Se borra en orden por las llaves foráneas:
//    RESERVA -> EVENTO -> TELEFONOS / CLIENTE / AGENTE -> USUARIO
// ════════════════════════════════════════════════════════════════════════════
// Usuarios demo = los que tienen correo @demo.eventnova.com
const USUARIOS_DEMO = `SELECT numero_id FROM public."USUARIO" WHERE LOWER(correo) LIKE '%' || $1`;
const EVENTOS_DEMO  = `SELECT id_evento FROM public."EVENTO" WHERE id_agente IN (${USUARIOS_DEMO})`;

async function borrarDemo(client) {
  // 1. Contar antes, para mostrar qué se va a borrar
  const { rows } = await client.query(
    `SELECT
       (SELECT COUNT(*) FROM public."CLIENTE" WHERE numero_id IN (${USUARIOS_DEMO}))::int AS clientes,
       (SELECT COUNT(*) FROM public."AGENTE"  WHERE numero_id IN (${USUARIOS_DEMO}))::int AS agentes,
       (SELECT COUNT(*) FROM public."EVENTO"  WHERE id_evento IN (${EVENTOS_DEMO}))::int  AS eventos,
       (SELECT COUNT(*) FROM public."RESERVA"
         WHERE id_cliente IN (${USUARIOS_DEMO}) OR id_evento IN (${EVENTOS_DEMO}))::int AS reservas,
       -- reservas de clientes que NO son demo hechas sobre eventos demo
       (SELECT COUNT(*) FROM public."RESERVA"
         WHERE id_evento IN (${EVENTOS_DEMO}) AND id_cliente NOT IN (${USUARIOS_DEMO}))::int AS reservas_ajenas`,
    [DOMINIO_DEMO],
  );
  const c = rows[0];
  if (c.clientes + c.agentes + c.eventos + c.reservas === 0) {
    console.log('\nNo hay datos de demostración en esta base. No se borró nada.');
    return;
  }

  // 2. Borrar todo en una transacción
  await client.query('BEGIN');
  await client.query(
    `DELETE FROM public."RESERVA"
     WHERE id_cliente IN (${USUARIOS_DEMO}) OR id_evento IN (${EVENTOS_DEMO})`,
    [DOMINIO_DEMO],
  );
  await client.query(`DELETE FROM public."EVENTO"    WHERE id_agente IN (${USUARIOS_DEMO})`, [DOMINIO_DEMO]);
  await client.query(`DELETE FROM public."TELEFONOS" WHERE numero_id IN (${USUARIOS_DEMO})`, [DOMINIO_DEMO]);
  await client.query(`DELETE FROM public."CLIENTE"   WHERE numero_id IN (${USUARIOS_DEMO})`, [DOMINIO_DEMO]);
  await client.query(`DELETE FROM public."AGENTE"    WHERE numero_id IN (${USUARIOS_DEMO})`, [DOMINIO_DEMO]);
  const usuarios = await client.query(
    `DELETE FROM public."USUARIO" WHERE LOWER(correo) LIKE '%' || $1`,
    [DOMINIO_DEMO],
  );
  await client.query('COMMIT');

  console.log('\n¡Datos de demostración eliminados!');
  console.log(`  Usuarios: ${usuarios.rowCount} (${c.agentes} agentes y ${c.clientes} clientes)`);
  console.log(`  Eventos:  ${c.eventos}`);
  console.log(`  Reservas: ${c.reservas}`);
  if (c.reservas_ajenas > 0) {
    const n = c.reservas_ajenas;
    console.log(`  (De esas reservas, ${n} ${n === 1 ? 'era de un cliente que no es demo' : 'eran de clientes que no son demo'},`);
    console.log('   en eventos demo: se borraron junto con su evento.)');
  }
  console.log('El resto de los datos del sistema quedó igual.');
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Programa principal: carga o borra según el comando
// ════════════════════════════════════════════════════════════════════════════
(async () => {
  const inicio = Date.now();
  const client = await pool.connect();
  try {
    if (BORRAR) await borrarDemo(client);
    else await cargarDemo(client);
    console.log(`Tiempo: ${((Date.now() - inicio) / 1000).toFixed(1)} s`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(`Error al ${BORRAR ? 'borrar' : 'cargar'} los datos de demostración:`, error.message);
    console.error('No se cambió nada (se deshizo la transacción).');
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();