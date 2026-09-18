// ─── Shared canonical data for EventNova prototype ────────────────────────────
// All screens import from here instead of maintaining local fake-data arrays.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SharedEvent {
  id: string
  nombre: string
  pais: string
  departamento: string
  ciudad: string
  direccion: string
  fecha: string
  fechaLarga: string
  hora: string
  capacidad: number
  precio: number
  precioStr: string
  agente: string
  estado: string
  reservas: number
  categoria: string
  image: string
  descripcion: string
  causaCancelacion?: string
}

export interface SharedClient {
  id: string
  nombre: string
  correo: string
  telefono: string
  pais: string
  departamento: string
  ciudad: string
}

export interface SharedReservation {
  id: string
  clienteId: string
  clienteNombre: string
  clienteCorreo: string
  eventoId: string
  eventoNombre: string
  agente: string
  fechaReserva: string
  entradas: number
  valorTotal: number
  valorTotalStr: string
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada'
  causaCancelacion?: string
  fechaCancelacion?: string
}

export interface SharedAgent {
  nombre: string
  email: string
  ciudad: string
  eventos: number
  reservas: number
  ingresos: number
}

// ─── Canonical events ─────────────────────────────────────────────────────────

export const SHARED_EVENTS: SharedEvent[] = [
  {
    id: 'ev01', nombre: 'Festival de Música Urbana', pais: 'Colombia', departamento: 'Antioquia', ciudad: 'Medellín',
    direccion: 'Parque Norte, Cl. 73 #52-36', fecha: '15 sep 2026', fechaLarga: '15 de septiembre de 2026', hora: '6:00 PM',
    capacidad: 5000, precio: 60000, precioStr: '$ 60.000', agente: 'Carlos Martínez', estado: 'Programado', reservas: 120,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'El mejor festival de reggaeton y trap del año con los artistas más representativos de la región andina.',
  },
  {
    id: 'ev02', nombre: 'Noche de Comedia Stand-Up', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá',
    direccion: 'Centro Cultural El Camín, Cl. 65 #24-73', fecha: '22 sep 2026', fechaLarga: '22 de septiembre de 2026', hora: '8:00 PM',
    capacidad: 800, precio: 50000, precioStr: '$ 50.000', agente: 'Laura García', estado: 'Programado', reservas: 85,
    categoria: 'Comedia', image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Una velada de risas con los mejores comediantes emergentes de Colombia reunidos en un solo escenario.',
  },
  {
    id: 'ev03', nombre: 'Feria Gastronómica 2026', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali',
    direccion: 'Plaza de las Américas, Cl. 5 #48-30', fecha: '30 sep 2026', fechaLarga: '30 de septiembre de 2026', hora: '11:00 AM',
    capacidad: 3000, precio: 50000, precioStr: '$ 50.000', agente: 'Ana Rodríguez', estado: 'En boletería', reservas: 64,
    categoria: 'Festival', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'La más grande muestra de gastronomía del suroccidente colombiano con más de 60 restaurantes participantes.',
  },
  {
    id: 'ev04', nombre: 'Concierto Talento Local', pais: 'Colombia', departamento: 'Atlántico', ciudad: 'Barranquilla',
    direccion: 'Teatro Amira de la Rosa, Cl. 54 #52B-15', fecha: '10 oct 2026', fechaLarga: '10 de octubre de 2026', hora: '7:00 PM',
    capacidad: 1200, precio: 45000, precioStr: '$ 45.000', agente: 'Carlos Martínez', estado: 'Programado', reservas: 95,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Plataforma para bandas emergentes del Caribe colombiano con música en vivo y actividades culturales.',
  },
  {
    id: 'ev05', nombre: 'Gran Concierto de Diciembre', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá',
    direccion: 'Movistar Arena, Autopista Norte Cl. 205', fecha: '20 dic 2026', fechaLarga: '20 de diciembre de 2026', hora: '9:00 PM',
    capacidad: 15000, precio: 220000, precioStr: '$ 220.000', agente: 'Laura García', estado: 'En boletería', reservas: 318,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'El evento de cierre de año más esperado de la capital con artistas internacionales y fuegos artificiales.',
  },
  {
    id: 'ev06', nombre: 'Festival Electrónico Bogotá', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá',
    direccion: 'Parque Simón Bolívar, Cl. 63', fecha: '14 nov 2026', fechaLarga: '14 de noviembre de 2026', hora: '4:00 PM',
    capacidad: 20000, precio: 160000, precioStr: '$ 160.000', agente: 'Pedro Vanegas', estado: 'Programado', reservas: 201,
    categoria: 'Festival', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Cuatro escenarios simultáneos con los mejores DJs de la escena electrónica latinoamericana.',
  },
  {
    id: 'ev07', nombre: 'Expo Arte Medellín', pais: 'Colombia', departamento: 'Antioquia', ciudad: 'Medellín',
    direccion: 'Centro Colombo Americano, Cl. 45 #53-24', fecha: '5 oct 2026', fechaLarga: '5 de octubre de 2026', hora: '10:00 AM',
    capacidad: 600, precio: 40000, precioStr: '$ 40.000', agente: 'Sofía Restrepo', estado: 'En vivo', reservas: 142,
    categoria: 'Arte', image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Muestra internacional de arte contemporáneo con obras de más de 80 artistas de 15 países.',
  },
  {
    id: 'ev08', nombre: 'Feria del Libro Cali', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali',
    direccion: 'Palacio de Convenciones, Av. 2 Norte', fecha: '12 ago 2026', fechaLarga: '12 de agosto de 2026', hora: '9:00 AM',
    capacidad: 2500, precio: 0, precioStr: 'Entrada libre', agente: 'Ana Rodríguez', estado: 'Finalizado', reservas: 310,
    categoria: 'Cultura', image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Una semana de cultura y literatura con autores colombianos e internacionales y talleres gratuitos.',
  },
  {
    id: 'ev09', nombre: 'Rock al Parque Junior', pais: 'Colombia', departamento: 'Atlántico', ciudad: 'Barranquilla',
    direccion: 'Estadio Romelio Martínez', fecha: '18 jul 2026', fechaLarga: '18 de julio de 2026', hora: '2:00 PM',
    capacidad: 8000, precio: 35000, precioStr: '$ 35.000', agente: 'Javier Nieto', estado: 'Finalizado', reservas: 422,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Festival de rock para artistas menores de 25 años con eliminatorias previas en cinco ciudades.',
  },
  {
    id: 'ev10', nombre: 'Cumbre Empresarial Bucaramanga', pais: 'Colombia', departamento: 'Santander', ciudad: 'Bucaramanga',
    direccion: 'Hotel Dann Carlton, Cl. 50 #27-50', fecha: '8 oct 2026', fechaLarga: '8 de octubre de 2026', hora: '8:00 AM',
    capacidad: 400, precio: 350000, precioStr: '$ 350.000', agente: 'Ricardo Díaz', estado: 'Programado', reservas: 215,
    categoria: 'Empresarial', image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Encuentro de líderes empresariales con conferencias magistrales y espacios de networking.',
  },
  {
    id: 'ev11', nombre: 'Festival Jazz Pereira', pais: 'Colombia', departamento: 'Risaralda', ciudad: 'Pereira',
    direccion: 'Teatro Santiago Londoño, Cl. 25 #11-51', fecha: '25 oct 2026', fechaLarga: '25 de octubre de 2026', hora: '7:30 PM',
    capacidad: 900, precio: 95000, precioStr: '$ 95.000', agente: 'NovaStar Events', estado: 'Programado', reservas: 178,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Encuentro internacional de jazz con músicos de Colombia, Cuba, Brasil y Estados Unidos.',
  },
  {
    id: 'ev12', nombre: 'Carnaval de las Artes', pais: 'Colombia', departamento: 'Bolívar', ciudad: 'Cartagena',
    direccion: 'Avenida del Lago, Centro Histórico', fecha: '3 nov 2026', fechaLarga: '3 de noviembre de 2026', hora: '5:00 PM',
    capacidad: 10000, precio: 0, precioStr: 'Entrada libre', agente: 'María Pérez', estado: 'Cancelado', reservas: 0,
    categoria: 'Festival', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Desfile y espectáculo de arte popular y danzas folclóricas del Caribe colombiano.',
    causaCancelacion: 'Condiciones climáticas adversas registradas en alerta temprana para la fecha programada.',
  },
  {
    id: 'ev13', nombre: 'Quito en Escena', pais: 'Ecuador', departamento: 'Pichincha', ciudad: 'Quito',
    direccion: 'Plaza Grande, García Moreno y Espejo', fecha: '20 oct 2026', fechaLarga: '20 de octubre de 2026', hora: '6:00 PM',
    capacidad: 1500, precio: 45000, precioStr: '$ 45.000', agente: 'EcuaEvents S.A.', estado: 'Programado', reservas: 88,
    categoria: 'Teatro', image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Festival de teatro y artes escénicas en los patios coloniales del centro histórico de Quito.',
  },
  {
    id: 'ev14', nombre: 'Lima Music Week', pais: 'Perú', departamento: 'Lima', ciudad: 'Lima',
    direccion: 'Estadio Nacional de Lima, Jr. José Díaz', fecha: '15 nov 2026', fechaLarga: '15 de noviembre de 2026', hora: '5:00 PM',
    capacidad: 12000, precio: 120000, precioStr: '$ 120.000', agente: 'PeruShow Ltda.', estado: 'En boletería', reservas: 256,
    categoria: 'Concierto', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'Semana de conciertos, talleres y showcases de artistas peruanos y latinoamericanos.',
  },
  {
    id: 'ev15', nombre: 'Panama Jazz Festival', pais: 'Panamá', departamento: 'Panamá', ciudad: 'Ciudad de Panamá',
    direccion: 'Biomuseo, Amador Causeway', fecha: '18 ene 2026', fechaLarga: '18 de enero de 2026', hora: '7:00 PM',
    capacidad: 3500, precio: 200000, precioStr: '$ 200.000', agente: 'PanEvents Corp.', estado: 'Finalizado', reservas: 198,
    categoria: 'Festival', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=380&fit=crop&auto=format',
    descripcion: 'El festival de jazz más importante de Centroamérica, con artistas de talla mundial.',
  },
]

// ─── Canonical clients ────────────────────────────────────────────────────────

export const SHARED_CLIENTS: SharedClient[] = [
  { id: 'cl01', nombre: 'María López',      correo: 'maria.lopez@email.com',  telefono: '+57 314 823 1001', pais: 'Colombia', departamento: 'Cundinamarca',    ciudad: 'Bogotá'       },
  { id: 'cl02', nombre: 'Sebastián Ruiz',   correo: 'sruiz@correo.co',        telefono: '+57 312 745 2002', pais: 'Colombia', departamento: 'Antioquia',       ciudad: 'Medellín'     },
  { id: 'cl03', nombre: 'Valentina Torres', correo: 'vtorres@mail.com',       telefono: '+57 315 631 3003', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali'         },
  { id: 'cl04', nombre: 'Andrés Martínez',  correo: 'amartinez@outlook.com',  telefono: '+57 317 412 4004', pais: 'Colombia', departamento: 'Cundinamarca',    ciudad: 'Bogotá'       },
  { id: 'cl05', nombre: 'Laura Gómez',      correo: 'lgomez@gmail.com',       telefono: '+57 310 527 5005', pais: 'Colombia', departamento: 'Atlántico',       ciudad: 'Barranquilla' },
  { id: 'cl06', nombre: 'Felipe Herrera',   correo: 'fherrera@email.com',     telefono: '+57 316 834 6006', pais: 'Colombia', departamento: 'Risaralda',       ciudad: 'Pereira'      },
  { id: 'cl07', nombre: 'Camila Vargas',    correo: 'cvargas@correo.co',      telefono: '+57 313 290 7007', pais: 'Colombia', departamento: 'Cundinamarca',    ciudad: 'Bogotá'       },
  { id: 'cl08', nombre: 'Diego Salazar',    correo: 'dsalazar@mail.com',      telefono: '+57 311 678 8008', pais: 'Colombia', departamento: 'Santander',       ciudad: 'Bucaramanga'  },
  { id: 'cl09', nombre: 'Natalia Peña',     correo: 'npe@email.co',           telefono: '+57 318 435 9009', pais: 'Colombia', departamento: 'Bolívar',         ciudad: 'Cartagena'    },
  { id: 'cl10', nombre: 'Juan Ospina',      correo: 'jospina@correo.co',      telefono: '+57 319 102 0010', pais: 'Perú',     departamento: 'Lima',            ciudad: 'Lima'         },
]

// ─── Canonical reservations ───────────────────────────────────────────────────

export const SHARED_RESERVATIONS: SharedReservation[] = [
  { id: 'r01', clienteId: 'cl07', clienteNombre: 'Camila Vargas',    clienteCorreo: 'cvargas@correo.co',     eventoId: 'ev01', eventoNombre: 'Festival de Música Urbana',      agente: 'Carlos Martínez',  fechaReserva: '10 Ago 2026', entradas: 1, valorTotal: 60000,  valorTotalStr: '$ 60.000',  estado: 'Confirmada' },
  { id: 'r02', clienteId: 'cl02', clienteNombre: 'Sebastián Ruiz',   clienteCorreo: 'sruiz@correo.co',       eventoId: 'ev05', eventoNombre: 'Gran Concierto de Diciembre',    agente: 'Laura García',     fechaReserva: '12 Ago 2026', entradas: 3, valorTotal: 660000, valorTotalStr: '$ 660.000', estado: 'Confirmada' },
  { id: 'r03', clienteId: 'cl03', clienteNombre: 'Valentina Torres', clienteCorreo: 'vtorres@mail.com',      eventoId: 'ev03', eventoNombre: 'Feria Gastronómica 2026',        agente: 'Ana Rodríguez',    fechaReserva: '15 Ago 2026', entradas: 4, valorTotal: 200000, valorTotalStr: '$ 200.000', estado: 'Confirmada' },
  { id: 'r04', clienteId: 'cl04', clienteNombre: 'Andrés Martínez',  clienteCorreo: 'amartinez@outlook.com', eventoId: 'ev06', eventoNombre: 'Festival Electrónico Bogotá',   agente: 'Pedro Vanegas',    fechaReserva: '18 Ago 2026', entradas: 2, valorTotal: 320000, valorTotalStr: '$ 320.000', estado: 'Pendiente' },
  { id: 'r05', clienteId: 'cl05', clienteNombre: 'Laura Gómez',      clienteCorreo: 'lgomez@gmail.com',      eventoId: 'ev04', eventoNombre: 'Concierto Talento Local',        agente: 'Carlos Martínez',  fechaReserva: '20 Ago 2026', entradas: 1, valorTotal: 45000,  valorTotalStr: '$ 45.000',  estado: 'Pendiente' },
  { id: 'r06', clienteId: 'cl06', clienteNombre: 'Felipe Herrera',   clienteCorreo: 'fherrera@email.com',    eventoId: 'ev11', eventoNombre: 'Festival Jazz Pereira',          agente: 'NovaStar Events',  fechaReserva: '22 Ago 2026', entradas: 2, valorTotal: 190000, valorTotalStr: '$ 190.000', estado: 'Confirmada' },
  { id: 'r07', clienteId: 'cl08', clienteNombre: 'Diego Salazar',    clienteCorreo: 'dsalazar@mail.com',     eventoId: 'ev10', eventoNombre: 'Cumbre Empresarial Bucaramanga', agente: 'Ricardo Díaz',     fechaReserva: '25 Ago 2026', entradas: 1, valorTotal: 350000, valorTotalStr: '$ 350.000', estado: 'Confirmada' },
  { id: 'r08', clienteId: 'cl01', clienteNombre: 'María López',      clienteCorreo: 'maria.lopez@email.com', eventoId: 'ev02', eventoNombre: 'Noche de Comedia Stand-Up',     agente: 'Laura García',     fechaReserva: '26 Ago 2026', entradas: 3, valorTotal: 150000, valorTotalStr: '$ 150.000', estado: 'Confirmada' },
  { id: 'r09', clienteId: 'cl09', clienteNombre: 'Natalia Peña',     clienteCorreo: 'npe@email.co',          eventoId: 'ev12', eventoNombre: 'Carnaval de las Artes',          agente: 'María Pérez',      fechaReserva: '1 Sep 2026',  entradas: 5, valorTotal: 0,      valorTotalStr: '$ 0',       estado: 'Cancelada', causaCancelacion: 'Evento no disponible — el evento fue cancelado por causas climáticas.', fechaCancelacion: '5 Sep 2026' },
  { id: 'r10', clienteId: 'cl10', clienteNombre: 'Juan Ospina',      clienteCorreo: 'jospina@correo.co',     eventoId: 'ev14', eventoNombre: 'Lima Music Week',                agente: 'PeruShow Ltda.',   fechaReserva: '3 Sep 2026',  entradas: 2, valorTotal: 240000, valorTotalStr: '$ 240.000', estado: 'Confirmada' },
  { id: 'r11', clienteId: 'cl02', clienteNombre: 'Sebastián Ruiz',   clienteCorreo: 'sruiz@correo.co',       eventoId: 'ev01', eventoNombre: 'Festival de Música Urbana',      agente: 'Carlos Martínez',  fechaReserva: '5 Sep 2026',  entradas: 1, valorTotal: 60000,  valorTotalStr: '$ 60.000',  estado: 'Cancelada', causaCancelacion: 'Solicitud del cliente — el cliente solicitó cancelación voluntariamente.', fechaCancelacion: '8 Sep 2026' },
  { id: 'r12', clienteId: 'cl04', clienteNombre: 'Andrés Martínez',  clienteCorreo: 'amartinez@outlook.com', eventoId: 'ev06', eventoNombre: 'Festival Electrónico Bogotá',   agente: 'Pedro Vanegas',    fechaReserva: '6 Sep 2026',  entradas: 4, valorTotal: 640000, valorTotalStr: '$ 640.000', estado: 'Pendiente' },
  { id: 'r13', clienteId: 'cl07', clienteNombre: 'Camila Vargas',    clienteCorreo: 'cvargas@correo.co',     eventoId: 'ev05', eventoNombre: 'Gran Concierto de Diciembre',    agente: 'Laura García',     fechaReserva: '8 Sep 2026',  entradas: 2, valorTotal: 440000, valorTotalStr: '$ 440.000', estado: 'Confirmada' },
  { id: 'r14', clienteId: 'cl08', clienteNombre: 'Diego Salazar',    clienteCorreo: 'dsalazar@mail.com',     eventoId: 'ev10', eventoNombre: 'Cumbre Empresarial Bucaramanga', agente: 'Ricardo Díaz',     fechaReserva: '9 Sep 2026',  entradas: 1, valorTotal: 350000, valorTotalStr: '$ 350.000', estado: 'Cancelada', causaCancelacion: 'Problemas de pago — transacción rechazada por la entidad bancaria.', fechaCancelacion: '10 Sep 2026' },
  { id: 'r15', clienteId: 'cl03', clienteNombre: 'Valentina Torres', clienteCorreo: 'vtorres@mail.com',      eventoId: 'ev03', eventoNombre: 'Feria Gastronómica 2026',        agente: 'Ana Rodríguez',    fechaReserva: '11 Sep 2026', entradas: 3, valorTotal: 150000, valorTotalStr: '$ 150.000', estado: 'Confirmada' },
  { id: 'r16', clienteId: 'cl05', clienteNombre: 'Laura Gómez',      clienteCorreo: 'lgomez@gmail.com',      eventoId: 'ev04', eventoNombre: 'Concierto Talento Local',        agente: 'Carlos Martínez',  fechaReserva: '13 Sep 2026', entradas: 2, valorTotal: 90000,  valorTotalStr: '$ 90.000',  estado: 'Cancelada', causaCancelacion: 'Cambio de fecha — el cliente no pudo asistir en la nueva fecha.', fechaCancelacion: '14 Sep 2026' },
  { id: 'r17', clienteId: 'cl01', clienteNombre: 'María López',      clienteCorreo: 'maria.lopez@email.com', eventoId: 'ev13', eventoNombre: 'Quito en Escena',               agente: 'EcuaEvents S.A.',  fechaReserva: '14 Sep 2026', entradas: 2, valorTotal: 90000,  valorTotalStr: '$ 90.000',  estado: 'Confirmada' },
  { id: 'r18', clienteId: 'cl06', clienteNombre: 'Felipe Herrera',   clienteCorreo: 'fherrera@email.com',    eventoId: 'ev15', eventoNombre: 'Panama Jazz Festival',           agente: 'PanEvents Corp.',  fechaReserva: '16 Sep 2026', entradas: 3, valorTotal: 600000, valorTotalStr: '$ 600.000', estado: 'Cancelada', causaCancelacion: 'Otro — causa no especificada por el cliente.', fechaCancelacion: '17 Sep 2026' },
]

// ─── Canonical agents ─────────────────────────────────────────────────────────

export const SHARED_AGENTS: SharedAgent[] = [
  { nombre: 'Carlos Martínez', email: 'cmartinez@events.co',  ciudad: 'Medellín',     eventos: 18, reservas: 642, ingresos: 152400000 },
  { nombre: 'Laura García',    email: 'lgarcia@events.co',    ciudad: 'Bogotá',       eventos: 14, reservas: 518, ingresos: 123750000 },
  { nombre: 'Ana Rodríguez',   email: 'arodriguez@events.co', ciudad: 'Cali',         eventos: 11, reservas: 387, ingresos: 98100000  },
  { nombre: 'Pedro Vanegas',   email: 'pvanegas@events.co',   ciudad: 'Bogotá',       eventos: 9,  reservas: 301, ingresos: 71200000  },
  { nombre: 'Sofía Restrepo',  email: 'srestrepo@events.co',  ciudad: 'Medellín',     eventos: 16, reservas: 580, ingresos: 138900000 },
  { nombre: 'Ricardo Díaz',    email: 'rdiaz@events.co',      ciudad: 'Bucaramanga',  eventos: 7,  reservas: 221, ingresos: 52400000  },
  { nombre: 'Javier Nieto',    email: 'jnieto@events.co',     ciudad: 'Barranquilla', eventos: 12, reservas: 442, ingresos: 104600000 },
  { nombre: 'María Pérez',     email: 'mperez@events.co',     ciudad: 'Cartagena',    eventos: 8,  reservas: 273, ingresos: 64850000  },
]

// ─── Canonical ratings ────────────────────────────────────────────────────────

export interface SharedRating {
  id: string
  eventoId: string
  eventoNombre: string
  reservaId: string
  clienteNombre: string
  agente: string
  estrellas: number
  comentario?: string
  fecha: string
}

export const SHARED_RATINGS: SharedRating[] = [
  // ev08 - Feria del Libro Cali (Finalizado)
  { id: 'rt01', eventoId: 'ev08', eventoNombre: 'Feria del Libro Cali', reservaId: 'rs01', clienteNombre: 'Valentina Torres', agente: 'Ana Rodríguez', estrellas: 5, comentario: 'Excelente organización, muchos autores y actividades para toda la familia.', fecha: '14 Ago 2026' },
  { id: 'rt02', eventoId: 'ev08', eventoNombre: 'Feria del Libro Cali', reservaId: 'rs02', clienteNombre: 'Andrés Martínez', agente: 'Ana Rodríguez', estrellas: 4, comentario: 'Muy buena selección de libros, aunque había mucha afluencia de público.', fecha: '13 Ago 2026' },
  { id: 'rt03', eventoId: 'ev08', eventoNombre: 'Feria del Libro Cali', reservaId: 'rs03', clienteNombre: 'María López', agente: 'Ana Rodríguez', estrellas: 4, fecha: '13 Ago 2026' },
  { id: 'rt04', eventoId: 'ev08', eventoNombre: 'Feria del Libro Cali', reservaId: 'rs04', clienteNombre: 'Felipe Herrera', agente: 'Ana Rodríguez', estrellas: 5, comentario: 'El taller de escritura creativa fue lo mejor del evento.', fecha: '12 Ago 2026' },
  { id: 'rt05', eventoId: 'ev08', eventoNombre: 'Feria del Libro Cali', reservaId: 'rs05', clienteNombre: 'Laura Gómez', agente: 'Ana Rodríguez', estrellas: 3, comentario: 'Bueno pero el espacio era pequeño para tanta gente.', fecha: '12 Ago 2026' },
  // ev09 - Rock al Parque Junior (Finalizado)
  { id: 'rt06', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs06', clienteNombre: 'Sebastián Ruiz', agente: 'Javier Nieto', estrellas: 5, comentario: '¡Las bandas emergentes sorprendieron a todos! Volveré el próximo año.', fecha: '20 Jul 2026' },
  { id: 'rt07', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs07', clienteNombre: 'Camila Vargas', agente: 'Javier Nieto', estrellas: 4, fecha: '20 Jul 2026' },
  { id: 'rt08', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs08', clienteNombre: 'Diego Salazar', agente: 'Javier Nieto', estrellas: 3, comentario: 'Buen evento pero el sonido en el escenario principal tenía problemas.', fecha: '19 Jul 2026' },
  { id: 'rt09', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs09', clienteNombre: 'Natalia Peña', agente: 'Javier Nieto', estrellas: 4, comentario: 'Muy buen ambiente y organización a la altura.', fecha: '19 Jul 2026' },
  { id: 'rt10', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs10', clienteNombre: 'Juan Ospina', agente: 'Javier Nieto', estrellas: 5, fecha: '18 Jul 2026' },
  { id: 'rt11', eventoId: 'ev09', eventoNombre: 'Rock al Parque Junior', reservaId: 'rs11', clienteNombre: 'Andrés Martínez', agente: 'Javier Nieto', estrellas: 4, comentario: 'Increíble talento local. Muy bien curado el cartel de artistas.', fecha: '18 Jul 2026' },
  // ev15 - Panama Jazz Festival (Finalizado)
  { id: 'rt12', eventoId: 'ev15', eventoNombre: 'Panama Jazz Festival', reservaId: 'r18', clienteNombre: 'Felipe Herrera', agente: 'PanEvents Corp.', estrellas: 5, comentario: 'Una experiencia única. Los músicos internacionales fueron espectaculares.', fecha: '20 Ene 2026' },
  { id: 'rt13', eventoId: 'ev15', eventoNombre: 'Panama Jazz Festival', reservaId: 'rs12', clienteNombre: 'Laura Gómez', agente: 'PanEvents Corp.', estrellas: 4, comentario: 'Muy buen festival, la acústica del Biomuseo es impresionante.', fecha: '19 Ene 2026' },
  { id: 'rt14', eventoId: 'ev15', eventoNombre: 'Panama Jazz Festival', reservaId: 'rs13', clienteNombre: 'María López', agente: 'PanEvents Corp.', estrellas: 5, fecha: '19 Ene 2026' },
  { id: 'rt15', eventoId: 'ev15', eventoNombre: 'Panama Jazz Festival', reservaId: 'rs14', clienteNombre: 'Sebastián Ruiz', agente: 'PanEvents Corp.', estrellas: 4, comentario: 'El festival superó mis expectativas en todos los aspectos.', fecha: '18 Ene 2026' },
]

// ─── Canonical payments ───────────────────────────────────────────────────────

export type PaymentStatus = 'Pagado' | 'Pendiente' | 'Cancelado' | 'Reembolsado'
export type PaymentMethod = 'Tarjeta débito' | 'Tarjeta crédito' | 'PSE' | 'Nequi'

export interface SharedPayment {
  id: string
  reservaId: string
  clienteNombre: string
  clienteCorreo: string
  eventoNombre: string
  agente: string
  entradas: number
  valor: number
  valorStr: string
  metodoPago: PaymentMethod
  fechaPago: string
  horaPago: string
  estado: PaymentStatus
  codigoTransaccion: string
}

export const SHARED_PAYMENTS: SharedPayment[] = [
  { id: 'pay01', reservaId: 'r01', clienteNombre: 'Camila Vargas',    clienteCorreo: 'cvargas@correo.co',     eventoNombre: 'Festival de Música Urbana',      agente: 'Carlos Martínez', entradas: 1, valor: 60000,  valorStr: '$ 60.000',  metodoPago: 'PSE',            fechaPago: '11 Ago 2026', horaPago: '10:32 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826341' },
  { id: 'pay02', reservaId: 'r02', clienteNombre: 'Sebastián Ruiz',   clienteCorreo: 'sruiz@correo.co',       eventoNombre: 'Gran Concierto de Diciembre',    agente: 'Laura García',    entradas: 3, valor: 660000, valorStr: '$ 660.000', metodoPago: 'Nequi',          fechaPago: '13 Ago 2026', horaPago: '03:15 PM', estado: 'Pagado',      codigoTransaccion: 'TXN-826342' },
  { id: 'pay03', reservaId: 'r03', clienteNombre: 'Valentina Torres', clienteCorreo: 'vtorres@mail.com',      eventoNombre: 'Feria Gastronómica 2026',        agente: 'Ana Rodríguez',   entradas: 4, valor: 200000, valorStr: '$ 200.000', metodoPago: 'Tarjeta crédito', fechaPago: '16 Ago 2026', horaPago: '09:48 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826343' },
  { id: 'pay04', reservaId: 'r04', clienteNombre: 'Andrés Martínez',  clienteCorreo: 'amartinez@outlook.com', eventoNombre: 'Festival Electrónico Bogotá',   agente: 'Pedro Vanegas',   entradas: 2, valor: 320000, valorStr: '$ 320.000', metodoPago: 'PSE',            fechaPago: '18 Ago 2026', horaPago: '11:07 AM', estado: 'Pendiente',   codigoTransaccion: 'TXN-826344' },
  { id: 'pay05', reservaId: 'r05', clienteNombre: 'Laura Gómez',      clienteCorreo: 'lgomez@gmail.com',      eventoNombre: 'Concierto Talento Local',        agente: 'Carlos Martínez', entradas: 1, valor: 45000,  valorStr: '$ 45.000',  metodoPago: 'Tarjeta débito',  fechaPago: '20 Ago 2026', horaPago: '04:55 PM', estado: 'Pendiente',   codigoTransaccion: 'TXN-826345' },
  { id: 'pay06', reservaId: 'r06', clienteNombre: 'Felipe Herrera',   clienteCorreo: 'fherrera@email.com',    eventoNombre: 'Festival Jazz Pereira',          agente: 'NovaStar Events', entradas: 2, valor: 190000, valorStr: '$ 190.000', metodoPago: 'Nequi',          fechaPago: '23 Ago 2026', horaPago: '07:20 PM', estado: 'Pagado',      codigoTransaccion: 'TXN-826346' },
  { id: 'pay07', reservaId: 'r07', clienteNombre: 'Diego Salazar',    clienteCorreo: 'dsalazar@mail.com',     eventoNombre: 'Cumbre Empresarial Bucaramanga', agente: 'Ricardo Díaz',    entradas: 1, valor: 350000, valorStr: '$ 350.000', metodoPago: 'Tarjeta crédito', fechaPago: '25 Ago 2026', horaPago: '02:41 PM', estado: 'Pagado',      codigoTransaccion: 'TXN-826347' },
  { id: 'pay08', reservaId: 'r08', clienteNombre: 'María López',      clienteCorreo: 'maria.lopez@email.com', eventoNombre: 'Noche de Comedia Stand-Up',      agente: 'Laura García',    entradas: 3, valor: 150000, valorStr: '$ 150.000', metodoPago: 'PSE',            fechaPago: '27 Ago 2026', horaPago: '08:10 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826348' },
  { id: 'pay09', reservaId: 'r09', clienteNombre: 'Natalia Peña',     clienteCorreo: 'npe@email.co',          eventoNombre: 'Carnaval de las Artes',          agente: 'María Pérez',     entradas: 5, valor: 0,      valorStr: '$ 0',       metodoPago: 'Nequi',          fechaPago: '5 Sep 2026',  horaPago: '01:30 PM', estado: 'Cancelado',   codigoTransaccion: 'TXN-826349' },
  { id: 'pay10', reservaId: 'r10', clienteNombre: 'Juan Ospina',      clienteCorreo: 'jospina@correo.co',     eventoNombre: 'Lima Music Week',                agente: 'PeruShow Ltda.',  entradas: 2, valor: 240000, valorStr: '$ 240.000', metodoPago: 'Tarjeta débito',  fechaPago: '4 Sep 2026',  horaPago: '05:22 PM', estado: 'Pagado',      codigoTransaccion: 'TXN-826350' },
  { id: 'pay11', reservaId: 'r11', clienteNombre: 'Sebastián Ruiz',   clienteCorreo: 'sruiz@correo.co',       eventoNombre: 'Festival de Música Urbana',      agente: 'Carlos Martínez', entradas: 1, valor: 60000,  valorStr: '$ 60.000',  metodoPago: 'PSE',            fechaPago: '8 Sep 2026',  horaPago: '09:05 AM', estado: 'Cancelado',   codigoTransaccion: 'TXN-826351' },
  { id: 'pay12', reservaId: 'r12', clienteNombre: 'Andrés Martínez',  clienteCorreo: 'amartinez@outlook.com', eventoNombre: 'Festival Electrónico Bogotá',   agente: 'Pedro Vanegas',   entradas: 4, valor: 640000, valorStr: '$ 640.000', metodoPago: 'Tarjeta crédito', fechaPago: '7 Sep 2026',  horaPago: '06:38 PM', estado: 'Pendiente',   codigoTransaccion: 'TXN-826352' },
  { id: 'pay13', reservaId: 'r13', clienteNombre: 'Camila Vargas',    clienteCorreo: 'cvargas@correo.co',     eventoNombre: 'Gran Concierto de Diciembre',    agente: 'Laura García',    entradas: 2, valor: 440000, valorStr: '$ 440.000', metodoPago: 'Nequi',          fechaPago: '9 Sep 2026',  horaPago: '11:50 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826353' },
  { id: 'pay14', reservaId: 'r14', clienteNombre: 'Diego Salazar',    clienteCorreo: 'dsalazar@mail.com',     eventoNombre: 'Cumbre Empresarial Bucaramanga', agente: 'Ricardo Díaz',    entradas: 1, valor: 350000, valorStr: '$ 350.000', metodoPago: 'Tarjeta débito',  fechaPago: '10 Sep 2026', horaPago: '03:17 PM', estado: 'Cancelado',   codigoTransaccion: 'TXN-826354' },
  { id: 'pay15', reservaId: 'r15', clienteNombre: 'Valentina Torres', clienteCorreo: 'vtorres@mail.com',      eventoNombre: 'Feria Gastronómica 2026',        agente: 'Ana Rodríguez',   entradas: 3, valor: 150000, valorStr: '$ 150.000', metodoPago: 'PSE',            fechaPago: '12 Sep 2026', horaPago: '10:00 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826355' },
  { id: 'pay16', reservaId: 'r16', clienteNombre: 'Laura Gómez',      clienteCorreo: 'lgomez@gmail.com',      eventoNombre: 'Concierto Talento Local',        agente: 'Carlos Martínez', entradas: 2, valor: 90000,  valorStr: '$ 90.000',  metodoPago: 'Nequi',          fechaPago: '14 Sep 2026', horaPago: '02:02 PM', estado: 'Reembolsado', codigoTransaccion: 'TXN-826356' },
  { id: 'pay17', reservaId: 'r17', clienteNombre: 'María López',      clienteCorreo: 'maria.lopez@email.com', eventoNombre: 'Quito en Escena',               agente: 'EcuaEvents S.A.', entradas: 2, valor: 90000,  valorStr: '$ 90.000',  metodoPago: 'Tarjeta crédito', fechaPago: '15 Sep 2026', horaPago: '08:45 AM', estado: 'Pagado',      codigoTransaccion: 'TXN-826357' },
  { id: 'pay18', reservaId: 'r18', clienteNombre: 'Felipe Herrera',   clienteCorreo: 'fherrera@email.com',    eventoNombre: 'Panama Jazz Festival',           agente: 'PanEvents Corp.', entradas: 3, valor: 600000, valorStr: '$ 600.000', metodoPago: 'PSE',            fechaPago: '17 Sep 2026', horaPago: '05:55 PM', estado: 'Cancelado',   codigoTransaccion: 'TXN-826358' },
]

// ─── Derived stats ────────────────────────────────────────────────────────────

export const TOTAL_EVENTOS   = SHARED_EVENTS.length
export const TOTAL_CLIENTES  = SHARED_CLIENTS.length
export const TOTAL_AGENTES   = SHARED_AGENTS.length
export const TOTAL_RESERVAS  = SHARED_RESERVATIONS.length

// ─── Helper: events for Carlos Martínez ──────────────────────────────────────

export const AGENT_CARLOS_EVENTS = SHARED_EVENTS.filter(e => e.agente === 'Carlos Martínez')

// ─── Helper: reservations for Carlos Martínez ────────────────────────────────

export const AGENT_CARLOS_RESERVATIONS = SHARED_RESERVATIONS.filter(r => r.agente === 'Carlos Martínez')

// ─── Helper: payments for Carlos Martínez ────────────────────────────────────

export const AGENT_CARLOS_PAYMENTS = SHARED_PAYMENTS.filter(p => p.agente === 'Carlos Martínez')

// ─── Helper: last-records entries for AdminGeneralReports ────────────────────

export const GENERAL_LAST_RECORDS = [
  { type: 'cliente' as const, descripcion: 'María López se registró como cliente',                    fecha: '20 Ago 2026, 10:42', estado: 'Activo'     },
  { type: 'agente'  as const, descripcion: 'Carlos Martínez registrado como agente',                  fecha: '20 Ago 2026, 09:18', estado: 'Activo'     },
  { type: 'evento'  as const, descripcion: 'Festival Electrónico Bogotá creado',                      fecha: '20 Ago 2026, 08:55', estado: 'Programado' },
  { type: 'reserva' as const, descripcion: 'Reserva r07 — Cumbre Empresarial Bucaramanga',            fecha: '19 Ago 2026, 11:30', estado: 'Confirmada' },
  { type: 'admin'   as const, descripcion: 'Nueva cuenta de administrador creada',                    fecha: '19 Ago 2026, 09:05', estado: 'Activo'     },
  { type: 'cliente' as const, descripcion: 'Sebastián Ruiz se registró como cliente',                 fecha: '19 Ago 2026, 03:47', estado: 'Activo'     },
  { type: 'evento'  as const, descripcion: 'Feria Gastronómica 2026 creada',                          fecha: '18 Ago 2026, 06:02', estado: 'Programado' },
  { type: 'reserva' as const, descripcion: 'Reserva r02 — Gran Concierto de Diciembre',               fecha: '18 Ago 2026, 02:11', estado: 'Pendiente'  },
  { type: 'agente'  as const, descripcion: 'Ana Rodríguez registrada como agente',                    fecha: '17 Ago 2026, 04:33', estado: 'Activo'     },
  { type: 'cliente' as const, descripcion: 'Valentina Torres se registró como cliente',               fecha: '17 Ago 2026, 01:20', estado: 'Activo'     },
]
