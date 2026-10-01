// js/models/reporteModel.js
// MODELO de reportes del administrador.
// Por ahora devuelve datos de ejemplo. En el Sprint 3 cada función se
// reemplaza por una consulta SQL expuesta en /api/reportes/...

import { EVENTOS, RESERVAS, AGENTES, CALIFICACIONES, PAGOS, ULTIMOS_REGISTROS } from './datosEjemplo.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// ─── Dashboard ──────────────────────────────────────────────────────────────
const INGRESOS_MES = [18400000, 22150000, 31800000, 27600000, 38200000, 45750000, 41300000, 53900000, 49100000, 62400000, 58800000, 74200000]
const RESERVAS_MES = {
  confirmadas: [142, 189, 264, 218, 312, 378, 341, 427, 394, 486, 452, 538],
  pendientes: [38, 52, 71, 44, 88, 96, 79, 112, 93, 128, 104, 147],
  canceladas: [21, 17, 29, 33, 24, 41, 38, 52, 44, 61, 57, 68],
}
const EVENTOS_MES = [14, 19, 28, 23, 34, 31, 27, 38, 42, 36, 29, 51]
const COBERTURA = [
  { pais: 'Colombia', departamento: 'Bogotá D.C.', ciudad: 'Bogotá', eventos: 112 },
  { pais: 'Colombia', departamento: 'Antioquia', ciudad: 'Medellín', eventos: 78 },
  { pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali', eventos: 54 },
  { pais: 'Colombia', departamento: 'Atlántico', ciudad: 'Barranquilla', eventos: 31 },
  { pais: 'Colombia', departamento: 'Caldas', ciudad: 'Manizales', eventos: 18 },
  { pais: 'Colombia', departamento: 'Santander', ciudad: 'Bucaramanga', eventos: 14 },
  { pais: 'México', departamento: 'Jalisco', ciudad: 'Guadalajara', eventos: 9 },
  { pais: 'Argentina', departamento: 'Buenos Aires', ciudad: 'Buenos Aires', eventos: 10 },
]
const ACTIVIDAD = [
  { tipo: 'cliente', titulo: 'Nuevo cliente registrado', detalle: 'María López', hora: 'Hoy, 10:42 AM' },
  { tipo: 'agente', titulo: 'Nuevo agente registrado', detalle: 'SonidosPro S.A.S.', hora: 'Hoy, 09:18 AM' },
  { tipo: 'evento', titulo: 'Nuevo evento creado', detalle: 'Festival Electrónico Bogotá', hora: 'Hoy, 08:55 AM' },
  { tipo: 'reserva', titulo: 'Nueva reserva registrada', detalle: 'Concierto Talento Local · 3 entradas', hora: 'Ayer, 11:30 PM' },
  { tipo: 'cancelada', titulo: 'Reserva cancelada', detalle: 'Noche de Comedia Stand Up · Causa: cambio de planes', hora: 'Ayer, 09:14 PM' },
  { tipo: 'evento', titulo: 'Nuevo evento creado', detalle: 'Feria Gastronómica Cali 2026', hora: 'Ayer, 06:02 PM' },
  { tipo: 'cliente', titulo: 'Nuevo cliente registrado', detalle: 'Sebastián Ruiz', hora: 'Ayer, 03:47 PM' },
  { tipo: 'reserva', titulo: 'Nueva reserva registrada', detalle: 'Gran Concierto de Diciembre · 5 entradas', hora: 'Ayer, 02:11 PM' },
]
const TOTALES = { clientes: 1248, agentes: 86, administradores: 4, reservas: 3842, eventos: 326 }

// ─── Reportes generales ─────────────────────────────────────────────────────
const RESERVAS_EVENTOS_MES = {
  reservas: [201, 258, 364, 295, 424, 515, 458, 591, 531, 675, 613, 753],
  eventos: [14, 19, 28, 23, 34, 31, 27, 38, 42, 36, 29, 51],
}

// ─── Reportes comerciales ───────────────────────────────────────────────────
const INGRESOS_COMERCIALES = [42800000, 58300000, 74100000, 63500000, 89700000, 112400000, 98200000, 127600000, 118900000, 143300000, 135800000, 162400000]
const RESERVAS_POR_EVENTO = [
  { evento: 'Maluma · World Tour', datos: [58, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { evento: 'Festival Estéreo Picnic', datos: [0, 0, 143, 128, 0, 0, 0, 0, 0, 0, 0, 0] },
  { evento: 'Gran Concierto Diciembre', datos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 318] },
  { evento: 'Feria Gastronómica Cali', datos: [0, 0, 0, 0, 88, 102, 0, 0, 0, 0, 0, 0] },
  { evento: 'Teatro · Obra Contemporánea', datos: [0, 0, 0, 0, 0, 0, 74, 89, 81, 0, 0, 0] },
  { evento: 'Festival Electrónico Bogotá', datos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 201, 187, 0] },
  { evento: 'Stand-Up Comedy Night', datos: [31, 28, 35, 0, 0, 0, 0, 0, 0, 0, 0, 42] },
]
const DEPTO_POR_CIUDAD = {
  'Medellín': 'Antioquia', 'Bogotá': 'Cundinamarca', 'Cali': 'Valle del Cauca',
  'Barranquilla': 'Atlántico', 'Bucaramanga': 'Santander', 'Cartagena': 'Bolívar', 'Pereira': 'Risaralda',
}

// ─── Cobertura ──────────────────────────────────────────────────────────────
const GEOGRAFIA = {
  'Colombia': {
    'Antioquia': ['Medellín', 'Bello', 'Envigado'], 'Cundinamarca': ['Bogotá', 'Soacha', 'Chía'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira'], 'Atlántico': ['Barranquilla', 'Soledad'],
    'Santander': ['Bucaramanga', 'Floridablanca'], 'Bolívar': ['Cartagena', 'Magangué'], 'Risaralda': ['Pereira', 'Dosquebradas'],
  },
  'Ecuador': { 'Pichincha': ['Quito', 'Cayambe'], 'Guayas': ['Guayaquil', 'Samborondón'] },
  'Perú': { 'Lima': ['Lima', 'Miraflores'], 'Cusco': ['Cusco', 'Urubamba'] },
  'Panamá': { 'Panamá': ['Ciudad de Panamá', 'San Miguelito'], 'Colón': ['Colón'] },
}

// ─── Operación ──────────────────────────────────────────────────────────────
const OTROS_EVENTOS_CANCELADOS = [
  { nombre: 'Rock Fest Cali 2026', agente: 'Ana Rodríguez', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali', fechaEvento: '28 ago 2026', hora: '3:00 PM', capacidad: 7000, reservasAfectadas: 148, fechaCancelacion: '2 Ago 2026', causa: 'Problemas de organización' },
  { nombre: 'Feria Tecnológica Bquilla', agente: 'Javier Nieto', pais: 'Colombia', departamento: 'Atlántico', ciudad: 'Barranquilla', fechaEvento: '5 sep 2026', hora: '9:00 AM', capacidad: 2500, reservasAfectadas: 61, fechaCancelacion: '20 Ago 2026', causa: 'Baja demanda' },
  { nombre: 'Concierto Salsa Clásica', agente: 'Ana Rodríguez', pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali', fechaEvento: '17 oct 2026', hora: '8:00 PM', capacidad: 3500, reservasAfectadas: 204, fechaCancelacion: '25 Sep 2026', causa: 'Problemas de ubicación' },
  { nombre: 'Encuentro Folclórico Pacífico', agente: 'NovaStar Events', pais: 'Colombia', departamento: 'Chocó', ciudad: 'Quibdó', fechaEvento: '12 sep 2026', hora: '4:00 PM', capacidad: 1800, reservasAfectadas: 37, fechaCancelacion: '5 Sep 2026', causa: 'Cambio de fecha' },
  { nombre: 'Maratón Musical Bogotá', agente: 'Pedro Vanegas', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá', fechaEvento: '6 nov 2026', hora: '10:00 AM', capacidad: 5000, reservasAfectadas: 89, fechaCancelacion: '15 Oct 2026', causa: 'Otro' },
]
const ACTIVIDAD_OPERACION = [
  { tipo: 'reserva-nueva', descripcion: 'Liliana Castro reservó 3 entradas para Feria Gastronómica 2026', usuario: 'Liliana Castro', fecha: '11 Sep 2026, 10:42', estado: 'Confirmada' },
  { tipo: 'reserva-cancelada', descripcion: 'Roberto Varón canceló su reserva para Concierto Talento Local', usuario: 'Roberto Varón', fecha: '14 Sep 2026, 09:18', estado: 'Cancelada' },
  { tipo: 'evento-cancelado', descripcion: 'Maratón Musical Bogotá cancelado por Pedro Vanegas', usuario: 'Pedro Vanegas', fecha: '15 Oct 2026, 08:55', estado: 'Cancelado' },
  { tipo: 'reserva-confirmada', descripcion: 'Paula Moreno confirmó reserva para Gran Concierto de Diciembre', usuario: 'Paula Moreno', fecha: '8 Sep 2026, 11:30', estado: 'Confirmada' },
  { tipo: 'reserva-nueva', descripcion: 'Marcelo Suárez reservó 4 entradas para Festival Electrónico', usuario: 'Marcelo Suárez', fecha: '6 Sep 2026, 03:47', estado: 'Pendiente' },
  { tipo: 'evento-cancelado', descripcion: 'Concierto Salsa Clásica cancelado — problemas de ubicación', usuario: 'Ana Rodríguez', fecha: '25 Sep 2026, 06:02', estado: 'Cancelado' },
  { tipo: 'reserva-cancelada', descripcion: 'Tomás Heredia canceló su reserva para Panama Jazz Festival', usuario: 'Tomás Heredia', fecha: '17 Sep 2026, 02:11', estado: 'Cancelada' },
  { tipo: 'reserva-confirmada', descripcion: 'Isabel Mora confirmó reserva para Quito en Escena', usuario: 'Isabel Mora', fecha: '14 Sep 2026, 04:33', estado: 'Confirmada' },
  { tipo: 'evento-nuevo', descripcion: 'Festival de Música Urbana registrado por Carlos Martínez', usuario: 'Carlos Martínez', fecha: '1 Ago 2026, 01:20', estado: 'Programado' },
  { tipo: 'reserva-nueva', descripcion: 'Juan Ospina reservó 2 entradas para Lima Music Week', usuario: 'Juan Ospina', fecha: '3 Sep 2026, 09:05', estado: 'Confirmada' },
]

// ─── Perfil del administrador ───────────────────────────────────────────────
const PERFIL_ADMIN = {
  nombre: 'Alejandro Estrada', correo: 'a.estrada@eventnova.co', identificacion: '1.098.234.567',
  telefono: '+57 310 845 2190', direccion: 'Cra. 7 #32-16, Oficina 504', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá',
}
const ACTIVIDAD_CUENTA = [
  { actividad: 'Inicio de sesión', fecha: '31 Ago 2026, 08:12', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Consulta de reportes', fecha: '30 Ago 2026, 15:44', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Actualización de perfil', fecha: '28 Ago 2026, 11:20', dispositivo: 'Safari · macOS', estado: 'Exitoso' },
  { actividad: 'Cambio de contraseña', fecha: '20 Ago 2026, 09:05', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Inicio de sesión', fecha: '18 Ago 2026, 07:58', dispositivo: 'Firefox · Ubuntu', estado: 'Fallido' },
  { actividad: 'Inicio de sesión', fecha: '18 Ago 2026, 08:01', dispositivo: 'Firefox · Ubuntu', estado: 'Exitoso' },
  { actividad: 'Consulta de reportes', fecha: '15 Ago 2026, 14:30', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Cierre de sesión', fecha: '14 Ago 2026, 17:00', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
]

export const ReporteModel = {
  MESES,

  async dashboard() {
    const pagado = PAGOS.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.valor, 0)
    return {
      totales: TOTALES,
      ingresosMes: INGRESOS_MES,
      reservasMes: RESERVAS_MES,
      eventosMes: EVENTOS_MES,
      cobertura: COBERTURA,
      actividad: ACTIVIDAD,
      pagos: PAGOS,
      // Ingresos por pagos de la plataforma (solo meses con datos)
      ingresosPagos: [600000, 450000, 780000, 520000, 860000, 1100000, 950000, pagado],
    }
  },

  async generales() {
    return {
      totales: TOTALES,
      reservasEventosMes: RESERVAS_EVENTOS_MES,
      ultimosRegistros: ULTIMOS_REGISTROS,
      calificaciones: CALIFICACIONES,
      eventos: EVENTOS,
    }
  },

  async comerciales() {
    const agentes = AGENTES.map(a => ({ nombre: a.nombre, ciudad: a.ciudad, eventos: a.eventos, reservas: a.reservas, ingresos: a.ingresos }))
    const porAgenteYCiudad = AGENTES.map(a => {
      const cancelados = Math.max(1, Math.round(a.eventos * 0.12))
      const finalizados = Math.round(a.eventos * 0.55)
      return {
        agente: a.nombre, ciudad: a.ciudad, departamento: DEPTO_POR_CIUDAD[a.ciudad] ?? a.ciudad,
        creados: a.eventos, activos: Math.max(1, a.eventos - finalizados - cancelados), finalizados, cancelados,
      }
    })
    return { ingresosMes: INGRESOS_COMERCIALES, agentes, reservasPorEvento: RESERVAS_POR_EVENTO, porAgenteYCiudad }
  },

  async cobertura() {
    const eventos = EVENTOS.map(e => ({
      nombre: e.nombre, descripcion: e.descripcion, pais: e.pais, departamento: e.departamento, ciudad: e.ciudad,
      direccion: e.direccion, fecha: e.fecha, hora: e.hora, agente: e.agente, capacidad: e.capacidad,
      reservas: e.reservas, precio: e.precioStr, estado: e.estado, causaCancelacion: e.causaCancelacion,
    }))
    return { eventos, geografia: GEOGRAFIA }
  },

  async operacion() {
    const reservas = RESERVAS.map(r => {
      const ev = EVENTOS.find(e => e.id === r.eventoId)
      return {
        cliente: r.clienteNombre, correo: r.clienteCorreo, evento: r.eventoNombre, agente: r.agente,
        fechaReserva: r.fechaReserva, fechaEvento: ev.fechaLarga, hora: ev.hora, entradas: r.entradas,
        valor: r.valorTotal, estado: r.estado, ciudad: ev.ciudad, pais: ev.pais,
        causaCancelacion: r.causaCancelacion, fechaCancelacion: r.fechaCancelacion,
      }
    })
    const eventosCancelados = [
      ...EVENTOS.filter(e => e.estado === 'Cancelado').map(e => ({
        nombre: e.nombre, agente: e.agente, pais: e.pais, departamento: e.departamento, ciudad: e.ciudad,
        fechaEvento: e.fechaLarga, hora: e.hora, capacidad: e.capacidad,
        reservasAfectadas: RESERVAS.filter(r => r.eventoId === e.id && r.estado === 'Cancelada').length,
        fechaCancelacion: '4 Sep 2026', causa: 'Fuerza mayor',
      })),
      ...OTROS_EVENTOS_CANCELADOS,
    ]
    return { reservas, eventosCancelados, actividad: ACTIVIDAD_OPERACION, totalEventos: 16, eventosActivos: 8, eventosFinalizados: 4 }
  },

  async perfilAdmin() {
    return { perfil: { ...PERFIL_ADMIN }, actividad: ACTIVIDAD_CUENTA }
  },
}
