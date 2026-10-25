// js/models/reservaModel.js
// MODELO de reservas en el frontend.
//   - Parte 1: CRUD real contra /api/reservas (Sprint 2 · Tarea 6).
//   - Parte 2: datos de ejemplo que todavía usan "Mis reservas" (tarea 7)
//     y "Reservas" del agente (tarea 8). Se quitan cuando se hagan esas tareas.

import { peticion } from './api.js'
import { RESERVAS_AGENTE_DEMO, PAGOS_AGENTE_DEMO, EVENTOS } from './datosEjemplo.js'
import { capitalizarMes } from '../utils/formato.js'

// Fecha legible: "24 oct 2026 · 3:15 p. m."
function fechaHoraLegible(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  const fecha = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
  const hora = d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
  return `${capitalizarMes(fecha)} · ${hora}`
}

// Adapta una fila de PostgreSQL (SELECT_BASE de backend/models/reservaModel.js)
// al objeto que usan las Vistas
function adaptarReservaBD(fila) {
  const valor = Number(fila.valor_total) || 0
  return {
    id: fila.id_reserva,
    id_reserva: fila.id_reserva,
    codigo: fila.codigo_reserva,
    fechaReserva: fechaHoraLegible(fila.fecha_hora_reserva),
    entradas: Number(fila.numero_entradas) || 0,
    valorTotal: valor,
    valorTexto: '$ ' + valor.toLocaleString('es-CO'),
    observaciones: fila.observaciones || '',
    id_estado_reserva: fila.id_estado_reserva,
    estado: fila.estado_reserva,                 // Reservada | Confirmada | Cancelada
    causaCancelacion: fila.causa_cancelacion || '',
    id_evento: fila.id_evento,
    codigoEvento: fila.codigo_evento,
    evento: fila.nombre_evento,
    teatro: fila.teatro || '',
    ciudad: fila.nombre_ciudad,
    fechaEvento: fechaHoraLegible(fila.fecha_inicio),
    estadoEvento: fila.estado_evento,
    imagen: fila.imagen_evento || '',
    id_cliente: fila.id_cliente,
    cliente: fila.nombre_cliente,
    correo: fila.correo_cliente,
  }
}

// Los estados casi no cambian: se piden una sola vez
let estadosCache = null

const img = (id) => `https://images.unsplash.com/photo-${id}?w=120&h=80&fit=crop&auto=format`

// Reservas del cliente (pantalla "Mis reservas")
const RESERVAS_CLIENTE = [
  { id: 'R001', codigo: 'RES-2025-0912-001', evento: 'Festival de Música Urbana', categoria: 'Festival', imagen: img('1501386761578-eac5c94b800a'), fechaEvento: '12 Sep 2025', horaEvento: '6:00 PM', ciudad: 'Medellín', entradas: 2, reservadoEl: '3 Ago 2025', total: 190000, estado: 'Confirmada', eventoFinalizado: true, estadoPago: 'Pagado', metodoPago: 'PSE', fechaPago: '4 Ago 2025', codigoPago: 'TXN-712201' },
  { id: 'R002', codigo: 'RES-2025-0920-002', evento: 'Noche de Comedia Stand-Up', categoria: 'Comedia', imagen: img('1580188928585-0ef5c1a5c4dd'), fechaEvento: '20 Sep 2025', horaEvento: '8:30 PM', ciudad: 'Bogotá', entradas: 1, reservadoEl: '10 Ago 2025', total: 70000, estado: 'Reservada', estadoPago: 'Pendiente', metodoPago: 'Nequi', fechaPago: '10 Ago 2025', codigoPago: 'TXN-712202' },
  { id: 'R003', codigo: 'RES-2025-1005-003', evento: 'Teatro bajo las Estrellas', categoria: 'Teatro', imagen: img('1576724196706-3f23f51ea351'), fechaEvento: '5 Oct 2025', horaEvento: '7:00 PM', ciudad: 'Cali', entradas: 3, reservadoEl: '15 Ago 2025', total: 165000, estado: 'Confirmada', eventoFinalizado: true, estadoPago: 'Pagado', metodoPago: 'Tarjeta crédito', fechaPago: '15 Ago 2025', codigoPago: 'TXN-712203' },
  { id: 'R004', codigo: 'RES-2025-0801-004', evento: 'Maluma · World Tour 2025', categoria: 'Concierto', imagen: img('1470229722913-7c0e2dbbafd3'), fechaEvento: '15 Ago 2025', horaEvento: '8:00 PM', ciudad: 'Bogotá', entradas: 2, reservadoEl: '22 Jul 2025', total: 240000, estado: 'Cancelada', causaCancelacion: 'El cliente solicitó cancelación voluntaria antes de la fecha límite.', estadoPago: 'Reembolsado', metodoPago: 'Tarjeta débito', fechaPago: '23 Jul 2025', codigoPago: 'TXN-712204' },
  { id: 'R005', codigo: 'RES-2025-1018-005', evento: 'Concierto Sinfónico — Beethoven', categoria: 'Clásica', imagen: img('1519682718457-c82ce8296645'), fechaEvento: '18 Oct 2025', horaEvento: '5:00 PM', ciudad: 'Bogotá', entradas: 2, reservadoEl: '20 Ago 2025', total: 240000, estado: 'Reservada', eventoFinalizado: true, estadoPago: 'Pendiente', metodoPago: 'PSE', fechaPago: '20 Ago 2025', codigoPago: 'TXN-712205' },
  { id: 'R006', codigo: 'RES-2025-0710-006', evento: 'Rock en el Parque 2025', categoria: 'Festival', imagen: img('1506157786151-b8491531f063'), fechaEvento: '10 Jul 2025', horaEvento: '12:00 PM', ciudad: 'Bogotá', entradas: 4, reservadoEl: '1 Jun 2025', total: 0, estado: 'Cancelada', causaCancelacion: 'Evento cancelado por el organizador debido a condiciones climáticas adversas.', estadoPago: 'Cancelado', metodoPago: 'Nequi', fechaPago: '2 Jun 2025', codigoPago: 'TXN-712206' },
]

export const ReservaModel = {
  // ─── Parte 1: CRUD real contra /api/reservas (Sprint 2 · Tarea 6) ─────────

  /** Lista reservas. El backend ya filtra según el rol de la sesión
   *  (cliente: las suyas · agente: las de sus eventos · admin: todas).
   *  Filtros opcionales: { id_evento, id_estado_reserva } */
  async listar(filtros = {}) {
    const params = new URLSearchParams()
    if (filtros.id_evento) params.set('id_evento', filtros.id_evento)
    if (filtros.id_estado_reserva) params.set('id_estado_reserva', filtros.id_estado_reserva)
    const qs = params.toString()
    const filas = await peticion(`/reservas${qs ? `?${qs}` : ''}`)
    return filas.map(adaptarReservaBD)
  },

  /** Una reserva por su id (GET /api/reservas/:id) */
  async obtenerPorId(id) {
    return adaptarReservaBD(await peticion(`/reservas/${id}`))
  },

  /** Los 3 estados de la tabla ESTADO_RESERVA */
  async listarEstados() {
    if (!estadosCache) estadosCache = await peticion('/reservas/estados')
    return estadosCache
  },

  /** Entradas que le quedan a un evento (GET /api/reservas/cupos/:idEvento) */
  async cuposDisponibles(idEvento) {
    const { disponibles } = await peticion(`/reservas/cupos/${idEvento}`)
    return disponibles
  },

  /** El cliente crea una reserva (POST /api/reservas).
   *  datos = { id_evento, numero_entradas, observaciones } */
  async crear(datos) {
    return adaptarReservaBD(await peticion('/reservas', { metodo: 'POST', datos }))
  },

  /** Cambia número de entradas y observaciones (PUT /api/reservas/:id) */
  async actualizar(id, datos) {
    return adaptarReservaBD(await peticion(`/reservas/${id}`, { metodo: 'PUT', datos }))
  },

  /** Cambia el estado (PATCH /api/reservas/:id/estado) */
  async cambiarEstado(id, id_estado_reserva, causa_cancelacion = null) {
    const fila = await peticion(`/reservas/${id}/estado`, {
      metodo: 'PATCH',
      datos: { id_estado_reserva, causa_cancelacion },
    })
    return adaptarReservaBD(fila)
  },

  /** Atajo: cambia la reserva al estado "Cancelada" */
  async cancelar(id, causa = null) {
    const estados = await this.listarEstados()
    const cancelada = estados.find(e => e.nombre_estado === 'Cancelada')
    return this.cambiarEstado(id, cancelada.id_estado_reserva, causa)
  },

  /** Elimina una reserva (DELETE /api/reservas/:id, solo administrador) */
  async eliminar(id) {
    return peticion(`/reservas/${id}`, { metodo: 'DELETE' })
  },

  // ─── Parte 2: datos de ejemplo (se reemplazan en las tareas 7 y 8) ────────

  /** Resumen que se muestra en la página de inicio del cliente */
  async resumenInicioCliente() {
    return { activas: 3, confirmadas: 7, proximoEvento: { fecha: '12 Sep', detalle: 'Festival de Música Urbana · 6:00 PM' } }
  },

  /** Reservas del cliente con sesión iniciada */
  async delCliente() {
    return RESERVAS_CLIENTE
  },

  /** Reservas que recibió el agente en sus eventos */
  async delAgente() {
    return RESERVAS_AGENTE_DEMO.map((r, i) => {
      const evento = EVENTOS.find(e => e.id === r.eventoId)
      return {
        id: i + 1,
        cliente: r.clienteNombre,
        correo: r.clienteCorreo,
        evento: r.eventoNombre,
        fechaEvento: capitalizarMes(evento.fecha),
        horaEvento: evento.hora,
        entradas: r.entradas,
        valorTexto: r.valorTotalStr,
        valor: r.valorTotal,
        fechaReserva: r.fechaReserva,
        estado: r.estado,
        causaCancelacion: r.causaCancelacion,
      }
    })
  },

  /** Pagos recibidos por el agente */
  async pagosDelAgente() {
    return PAGOS_AGENTE_DEMO
  },

  /** Simula un cambio de estado (pendiente: PUT /api/reservas/:id) */
  async actualizarEstado(id, estado, causa) {
    return { id, estado, causaCancelacion: causa }
  },
}
