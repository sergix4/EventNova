// js/models/eventoModel.js
// MODELO de eventos.
// Por ahora devuelve datos de ejemplo (la tabla EVENTO aún no tiene CRUD en
// el backend). Todas las funciones son async para que, cuando exista
// /api/eventos, solo haya que cambiar el cuerpo por:  return peticion('/eventos')

import { EVENTOS, EVENTOS_AGENTE_DEMO, CALIFICACIONES } from './datosEjemplo.js'
import { capitalizarMes } from '../utils/formato.js'

const img = (id, w = 600, h = 380) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`

// Equivalencia del estado del evento con el texto que muestra la página de inicio
const ESTADO_EN_INICIO = {
  'Programado':   { texto: 'Disponible',       color: 'verde' },
  'En boletería': { texto: 'Últimas entradas', color: 'ambar' },
  'En vivo':      { texto: 'Disponible',       color: 'verde' },
  'Finalizado':   { texto: 'Agotado',          color: 'rojo'  },
  'Cancelado':    { texto: 'Agotado',          color: 'rojo'  },
}

// Eventos que ve el cliente en su página de inicio
const EVENTOS_INICIO_CLIENTE = [
  { id: 1, nombre: 'Festival de Música Urbana', ciudad: 'Medellín', departamento: 'Antioquia', pais: 'Colombia', fecha: '12 Sep 2025', hora: '6:00 PM', precio: '$ 95.000', estado: 'En Boletería', categoria: 'Festival', imagen: img('1501386761578-eac5c94b800a'), calificacion: 4.8 },
  { id: 2, nombre: 'Noche de Comedia Stand-Up', ciudad: 'Bogotá', departamento: 'Bogotá D.C.', pais: 'Colombia', fecha: '20 Sep 2025', hora: '8:30 PM', precio: '$ 70.000', estado: 'Programado', categoria: 'Comedia', imagen: img('1580188928585-0ef5c1a5c4dd'), calificacion: 4.6 },
  { id: 3, nombre: 'Teatro bajo las Estrellas', ciudad: 'Cali', departamento: 'Valle del Cauca', pais: 'Colombia', fecha: '5 Oct 2025', hora: '7:00 PM', precio: '$ 55.000', estado: 'Programado', categoria: 'Teatro', imagen: img('1576724196706-3f23f51ea351'), calificacion: 4.9 },
  { id: 4, nombre: 'Concierto Sinfónico — Beethoven', ciudad: 'Bogotá', departamento: 'Bogotá D.C.', pais: 'Colombia', fecha: '18 Oct 2025', hora: '5:00 PM', precio: '$ 120.000', estado: 'En Boletería', categoria: 'Clásica', imagen: img('1519682718457-c82ce8296645'), calificacion: 4.7 },
  { id: 5, nombre: 'Rock en el Parque 2025', ciudad: 'Bogotá', departamento: 'Bogotá D.C.', pais: 'Colombia', fecha: '1 Nov 2025', hora: '12:00 PM', precio: 'Gratis', estado: 'Programado', categoria: 'Festival', imagen: img('1506157786151-b8491531f063'), calificacion: 4.5 },
  { id: 6, nombre: 'Feria de las Flores — Tarde Cultural', ciudad: 'Medellín', departamento: 'Antioquia', pais: 'Colombia', fecha: '8 Nov 2025', hora: '3:00 PM', precio: '$ 40.000', estado: 'En Vivo', categoria: 'Cultural', imagen: img('1582711012124-a56cf82307a0'), calificacion: 4.3 },
]

// Catálogo completo de "Explorar eventos"
const CATALOGO = [
  { id: 1, nombre: 'Festival de Música Urbana', descripcion: 'Tres escenarios simultáneos, más de 20 artistas de reggaetón, trap, hip-hop y R&B en el Estadio Atanasio Girardot.', pais: 'Colombia', departamento: 'Antioquia', ciudad: 'Medellín', fecha: '12 Sep 2025', hora: '6:00 PM', precio: '$ 95.000', cuposTotal: 320, cuposVendidos: 218, estado: 'En Boletería', categoria: 'Festival', imagen: img('1501386761578-eac5c94b800a', 600, 360), calificacion: 4.8 },
  { id: 2, nombre: 'Noche de Comedia Stand-Up', descripcion: 'Una noche de risas con los mejores comediantes colombianos en el teatro más íntimo de Bogotá.', pais: 'Colombia', departamento: 'Bogotá D.C.', ciudad: 'Bogotá', fecha: '20 Sep 2025', hora: '8:30 PM', precio: '$ 70.000', cuposTotal: 180, cuposVendidos: 95, estado: 'Programado', categoria: 'Comedia', imagen: img('1580188928585-0ef5c1a5c4dd', 600, 360), calificacion: 4.6 },
  { id: 3, nombre: 'Teatro bajo las Estrellas', descripcion: 'Una obra de teatro contemporáneo al aire libre con las estrellas como telón de fondo en el histórico centro de Cali.', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali', fecha: '5 Oct 2025', hora: '7:00 PM', precio: '$ 55.000', cuposTotal: 250, cuposVendidos: 80, estado: 'Programado', categoria: 'Teatro', imagen: img('1576724196706-3f23f51ea351', 600, 360), calificacion: 4.9 },
  { id: 4, nombre: 'Concierto Sinfónico — Beethoven', descripcion: 'La Filarmónica de Bogotá interpreta las sinfonías más icónicas de Beethoven en una velada de música clásica.', pais: 'Colombia', departamento: 'Bogotá D.C.', ciudad: 'Bogotá', fecha: '18 Oct 2025', hora: '5:00 PM', precio: '$ 120.000', cuposTotal: 400, cuposVendidos: 310, estado: 'En Boletería', categoria: 'Clásica', imagen: img('1519682718457-c82ce8296645', 600, 360), calificacion: 4.7 },
  { id: 5, nombre: 'Rock en el Parque 2025', descripcion: 'El festival de rock más grande de Latinoamérica regresa a Bogotá con bandas nacionales e internacionales. Entrada libre.', pais: 'Colombia', departamento: 'Bogotá D.C.', ciudad: 'Bogotá', fecha: '1 Nov 2025', hora: '12:00 PM', precio: 'Gratis', cuposTotal: 5000, cuposVendidos: 1200, estado: 'Programado', categoria: 'Festival', imagen: img('1506157786151-b8491531f063', 600, 360), calificacion: 4.5 },
  { id: 6, nombre: 'Noche de Jazz y Blues', descripcion: 'Una velada íntima con los mejores músicos de jazz y blues de Colombia en el emblemático Bar El Mono de Chapinero.', pais: 'Colombia', departamento: 'Bogotá D.C.', ciudad: 'Bogotá', fecha: '8 Nov 2025', hora: '8:00 PM', precio: '$ 45.000', cuposTotal: 80, cuposVendidos: 60, estado: 'En Boletería', categoria: 'Jazz', imagen: img('1707944494732-e706d511456d', 600, 360), calificacion: 4.4 },
  { id: 7, nombre: 'Feria de las Flores — Tarde Cultural', descripcion: 'Celebra la cultura antioqueña con música, gastronomía y el desfile de flores más famoso de Colombia.', pais: 'Colombia', departamento: 'Antioquia', ciudad: 'Medellín', fecha: '15 Nov 2025', hora: '3:00 PM', precio: '$ 40.000', cuposTotal: 600, cuposVendidos: 390, estado: 'En Vivo', categoria: 'Cultural', imagen: img('1582711012124-a56cf82307a0', 600, 360), calificacion: 4.3 },
  { id: 8, nombre: 'Noche de Salsa Caleña', descripcion: 'Vive la pasión de la salsa con los mejores bailarines y orquestas del Pacífico colombiano en una noche llena de ritmo.', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali', fecha: '22 Nov 2025', hora: '9:00 PM', precio: '$ 60.000', cuposTotal: 200, cuposVendidos: 55, estado: 'Programado', categoria: 'Baile', imagen: img('1718119617938-2a3b376fb7d6', 600, 360), calificacion: 4.8 },
]

// Evento que se muestra en "Detalle del evento"
const DETALLE_DEMO = {
  codigo: 'EVT-2025-0912-MDE',
  nombre: 'Festival de Música Urbana',
  categoria: 'Festival',
  estado: 'En Boletería',
  ciudad: 'Medellín',
  departamento: 'Antioquia',
  pais: 'Colombia',
  recinto: 'Estadio Atanasio Girardot',
  fechaLarga: '12 de septiembre de 2025',
  fechaCorta: '12 de septiembre, 2025',
  horaInicio: '6:00 PM',
  horaFin: '11:30 PM',
  precio: 95000,
  capacidad: 320,
  vendidas: 218,
  imagen: img('1501386761578-eac5c94b800a', 1400, 600),
  parrafos: [
    'El <strong>Festival de Música Urbana</strong> regresa a Medellín con una edición inolvidable. Tres escenarios simultáneos, más de 20 artistas nacionales e internacionales y una experiencia diseñada para los amantes del reggaetón, el trap, el hip-hop y el R&B.',
    'Desde el atardecer hasta la medianoche, el Estadio Atanasio Girardot se convertirá en el epicentro de la cultura urbana colombiana. El evento incluye zonas de gastronomía, arte urbano interactivo, zonas VIP y acceso a plataformas de streaming en vivo.',
    'Este festival cuenta con todas las medidas de seguridad y logística necesarias para garantizar una experiencia segura, organizada y memorable para todos los asistentes.',
  ],
}

export const EventoModel = {
  /** 4 eventos destacados de la página principal */
  async obtenerDestacados() {
    return EVENTOS.slice(0, 4).map((e, i) => {
      const estado = ESTADO_EN_INICIO[e.estado] ?? ESTADO_EN_INICIO['Programado']
      return {
        id: i + 1, nombre: e.nombre, ciudad: e.ciudad, fecha: capitalizarMes(e.fecha), hora: e.hora,
        precio: e.precioStr, estadoTexto: estado.texto, estadoColor: estado.color, categoria: e.categoria, imagen: e.image,
      }
    })
  },

  /** Eventos de la página de inicio del cliente */
  async obtenerParaInicioCliente() {
    return EVENTOS_INICIO_CLIENTE
  },

  /** Catálogo de "Explorar eventos" */
  async obtenerCatalogo() {
    return CATALOGO
  },

  /** Evento de la página de detalle */
  async obtenerDetalle() {
    return DETALLE_DEMO
  },

  /** Eventos registrados por el agente (tabla "Mis eventos") */
  async obtenerDelAgente() {
    return EVENTOS_AGENTE_DEMO.map((e, i) => ({
      id: i + 1,
      idEjemplo: e.id,
      nombre: e.nombre,
      ciudad: e.ciudad,
      fecha: capitalizarMes(e.fecha),
      capacidad: e.capacidad,
      precio: e.precioStr,
      reservas: e.reservas,
      estado: e.estado,
      // datos extra usados por el formulario de edición
      descripcion: e.descripcion,
      categoria: e.categoria,
      pais: e.pais,
      departamento: e.departamento,
      direccion: e.direccion,
      fechaOriginal: e.fecha,
      hora: e.hora,
    }))
  },

  /** Calificaciones de un evento (para el modal de detalle del agente) */
  async obtenerCalificaciones(idEjemplo) {
    return CALIFICACIONES.filter(c => c.eventoId === idEjemplo)
  },

  /** Simula guardar un evento nuevo (pendiente: POST /api/eventos) */
  async crear(datos) {
    return { ...datos, id: Date.now() }
  },
}
