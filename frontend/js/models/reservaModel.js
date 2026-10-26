// js/models/reservaModel.js
// MODELO de reservas en el frontend. Todo es REAL contra /api/reservas:
//   - CRUD de reservas (Tarea 6)
//   - "Mis reservas" del cliente (Tarea 7)
//   - "Reservas" del agente: listar y confirmar / cancelar (Tarea 8)

import { peticion } from './api.js'
import { capitalizarMes } from '../utils/formato.js'

// Imagen que se muestra cuando el evento no tiene imagen guardada
const IMAGEN_DEFECTO = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=120&h=80&fit=crop&auto=format'

// Estados del EVENTO en los que el cliente ya no puede cancelar su reserva
const EVENTO_NO_CANCELABLE = ['En Vivo', 'Finalizado']

// Convierte lo que llega de PostgreSQL en un Date válido (o null)
function aFecha(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

// "24 Oct 2026"
function fechaLegible(iso) {
  const d = aFecha(iso)
  if (!d) return ''
  const fecha = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
  return capitalizarMes(fecha)
}

// "3:15 p. m."
function horaLegible(iso) {
  const d = aFecha(iso)
  return d ? d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : ''
}

// Fecha legible: "24 Oct 2026 · 3:15 p. m."
function fechaHoraLegible(iso) {
  const d = aFecha(iso)
  if (!d) return iso ? String(iso) : ''
  return `${fechaLegible(iso)} · ${horaLegible(iso)}`
}

// "2026-10-24" (en hora local) para compararla con el <input type="date">
function fechaISO(iso) {
  const d = aFecha(iso)
  if (!d) return ''
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Estados a los que se puede pasar una reserva desde el perfil agente (Tarea 8):
//   Reservada  -> Confirmada / Cancelada
//   Confirmada -> Cancelada
//   Cancelada  -> (ninguno)
// Si el evento ya está Finalizado o Cancelado, solo queda la opción de cancelar.
function siguientesEstados(fila) {
  if (fila.estado_reserva === 'Cancelada') return []
  const eventoCerrado = ['Finalizado', 'Cancelado'].includes(fila.estado_evento)
  if (fila.estado_reserva === 'Reservada' && !eventoCerrado) return ['Confirmada', 'Cancelada']
  return ['Cancelada']
}

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
    evento: fila.nombre_evento || '',
    teatro: fila.teatro || '',
    ciudad: fila.nombre_ciudad || '',
    fechaEvento: fechaLegible(fila.fecha_inicio),   // "24 Oct 2026"
    horaEvento: horaLegible(fila.fecha_inicio),     // "7:00 p. m."
    fechaEventoISO: fechaISO(fila.fecha_inicio),    // "2026-10-24" (filtro por fecha)
    fechaInicio: fila.fecha_inicio,                 // fecha original (para ordenar)
    estadoEvento: fila.estado_evento,
    eventoFinalizado: fila.estado_evento === 'Finalizado',
    precioBase: Number(fila.precio_base) || 0,
    imagen: fila.imagen_evento || IMAGEN_DEFECTO,
    // El cliente puede cancelar mientras la reserva no esté cancelada
    // y el evento todavía no haya empezado
    cancelable: fila.estado_reserva !== 'Cancelada' && !EVENTO_NO_CANCELABLE.includes(fila.estado_evento),
    // Estados a los que el agente puede cambiarla (Tarea 8)
    siguientesEstados: siguientesEstados(fila),
        // > 0 cuando el cliente ya tenía reserva de este evento y se le SUMARON entradas
    entradasAgregadas: Number(fila.entradas_agregadas) || 0,
    id_cliente: fila.id_cliente,
    cliente: fila.nombre_cliente || '',
    correo: fila.correo_cliente || '',
  }
}

// Los estados casi no cambian: se piden una sola vez
let estadosCache = null

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

  /** Cambia el estado (PATCH /api/reservas/:id/estado).
   *  entradas_cancelar (opcional): cuántas entradas cancelar. Si son menos que
   *  las de la reserva, el backend solo quita esas y la reserva sigue activa. */
  async cambiarEstado(id, id_estado_reserva, causa_cancelacion = null, entradas_cancelar = null) {
    const fila = await peticion(`/reservas/${id}/estado`, {
      metodo: 'PATCH',
      datos: { id_estado_reserva, causa_cancelacion, entradas_cancelar },
    })
    return adaptarReservaBD(fila)
  },

  /** Atajo: cancela la reserva completa o solo "entradas" de ellas */
  async cancelar(id, causa = null, entradas = null) {
    return this.cambiarEstadoPorNombre(id, 'Cancelada', causa, entradas)
  },

  /** Elimina una reserva (DELETE /api/reservas/:id, solo administrador) */
  async eliminar(id) {
    return peticion(`/reservas/${id}`, { metodo: 'DELETE' })
  },

  /** "Mis reservas" (Tarea 7): reservas del cliente con sesión iniciada.
   *  GET /api/reservas -> el backend ya devuelve SOLO las del cliente en sesión */
  async delCliente() {
    return this.listar()
  },
  
  /** Tarjetas del inicio del cliente, calculadas con sus reservas REALES */
  async resumenInicioCliente() {
    const reservas = await this.delCliente()
    const ahora = new Date()

    // Activas: no canceladas y cuyo evento no ha terminado
    const vigentes = reservas.filter(r =>
      r.estado !== 'Cancelada' && !['Finalizado', 'Cancelado'].includes(r.estadoEvento))

    // Próximo evento: el más cercano de hoy en adelante
    const proxima = vigentes
      .filter(r => r.fechaInicio && new Date(r.fechaInicio) >= ahora)
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))[0]

    let proximoEvento = null
    if (proxima) {
      const d = new Date(proxima.fechaInicio)
      const mes = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')
      proximoEvento = {
        fecha: `${d.getDate()} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`,   // "31 Oct"
        detalle: `${proxima.evento} · ${proxima.horaEvento}`,
      }
    }

    return {
      activas: vigentes.length,
      confirmadas: reservas.filter(r => r.estado === 'Confirmada').length,
      proximoEvento,
    }
  },

  // ─── Parte 2: datos de ejemplo (se reemplazan en la tarea 8) ──────────────



  /** "Reservas" del agente (Tarea 8): reservas de los eventos del agente en sesión.
   *  GET /api/reservas -> el backend ya devuelve SOLO las de sus eventos */
  async delAgente() {
    return this.listar()
  },

  /** Cambia el estado usando su NOMBRE ('Confirmada' | 'Cancelada').
   *  Busca el id en ESTADO_RESERVA y llama a PATCH /api/reservas/:id/estado */
  async cambiarEstadoPorNombre(id, nombreEstado, causa = null, entradas = null) {
    const estados = await this.listarEstados()
    const estado = estados.find(e => e.nombre_estado === nombreEstado)
    if (!estado) throw new Error(`El estado "${nombreEstado}" no existe.`)
    return this.cambiarEstado(id, estado.id_estado_reserva, causa, entradas)
  },
}