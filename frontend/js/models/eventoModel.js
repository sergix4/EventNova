// js/models/eventoModel.js
// MODELO de eventos en el frontend: conecta con /api/eventos y adapta
// las filas de PostgreSQL al formato que esperan las Vistas.

import { peticion } from './api.js'
import { EVENTOS, CALIFICACIONES } from './datosEjemplo.js'
import { capitalizarMes } from '../utils/formato.js'

const img = (id, w = 600, h = 380) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`
const IMAGEN_DEFECTO = img('1501386761578-eac5c94b800a')

// Equivalencia del estado del evento con el texto que muestra la página de inicio
const ESTADO_EN_INICIO = {
  'Programado':   { texto: 'Disponible',       color: 'verde' },
  'En Boletería': { texto: 'Últimas entradas', color: 'ambar' },
  'En boletería': { texto: 'Últimas entradas', color: 'ambar' },
  'En Vivo':      { texto: 'Disponible',       color: 'verde' },
  'En vivo':      { texto: 'Disponible',       color: 'verde' },
  'Finalizado':   { texto: 'Agotado',          color: 'rojo'  },
  'Cancelado':    { texto: 'Agotado',          color: 'rojo'  },
}

// Formatea un timestamp ISO de PostgreSQL a fecha legible ("15 oct 2026"), input date ("2026-10-15") y hora ("18:00")
function desglosarFecha(iso) {
  if (!iso) return { fechaLegible: '', fechaInput: '', horaInput: '' }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { fechaLegible: String(iso), fechaInput: '', horaInput: '' }

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')

  const fechaCorta = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
  return {
    fechaLegible: capitalizarMes(fechaCorta),
    fechaInput: `${yyyy}-${mm}-${dd}`,
    horaInput: `${hh}:${min}`,
  }
}

// Adapta una fila de PostgreSQL (SELECT_BASE) al objeto que usan MisEventosView y FormularioEventoView
function adaptarEventoBD(fila) {
  const inicio = desglosarFecha(fila.fecha_inicio)
  const fin = desglosarFecha(fila.fecha_fin)
  const precioNum = Number(fila.precio_base) || 0

  return {
    id: fila.id_evento,
    id_evento: fila.id_evento,
    codigo: fila.codigo_evento,
    nombre: fila.nombre_evento,
    descripcion: fila.descripcion_evento || '',
    teatro: fila.teatro || '',
    direccion: fila.direccion_evento || '',
    observaciones: fila.observaciones || '',
    informacion: fila.observaciones || '',
    imagen: fila.imagen_evento || IMAGEN_DEFECTO,
    imagen_evento: fila.imagen_evento || '',
    id_ciudad: fila.id_ciudad,
    ciudad: fila.nombre_ciudad,
    id_departamento: fila.id_departamento,
    departamento: fila.nombre_departamento,
    id_pais: fila.id_pais,
    pais: fila.nombre_pais,
    fecha: inicio.fechaLegible,
    fecha_inicio_input: inicio.fechaInput,
    hora_inicio_input: inicio.horaInput,
    fecha_fin_input: fin.fechaInput,
    hora_fin_input: fin.horaInput,
    capacidad: Number(fila.capacidad) || 0,
    precio_base: precioNum,
    precio: precioNum === 0 ? 'Gratis' : '$ ' + precioNum.toLocaleString('es-CO'),
    reservas: Number(fila.reservas) || 0,
    id_estado: fila.id_estado,
    estado: fila.nombre_estado,
    causa_cancelacion: fila.causa_cancelacion || '',
    id_agente: fila.id_agente,
    nombre_agente: fila.nombre_agente,
    nombre_empresa: fila.nombre_empresa,
  }
}

export const EventoModel = {
  // ─── CRUD real contra /api/eventos (Sprint 2 - Tarea 3) ───────────────────

  /** Lista eventos desde PostgreSQL con filtros opcionales { id_estado, id_ciudad, id_agente, mis_eventos } */
  async listar(filtros = {}) {
    const params = new URLSearchParams()
    if (filtros.id_estado) params.set('id_estado', filtros.id_estado)
    if (filtros.id_ciudad) params.set('id_ciudad', filtros.id_ciudad)
    if (filtros.id_agente) params.set('id_agente', filtros.id_agente)
    if (filtros.mis_eventos) params.set('mis_eventos', '1')

    const qs = params.toString()
    const filas = await peticion(`/eventos${qs ? `?${qs}` : ''}`)
    return filas.map(adaptarEventoBD)
  },

  /** Eventos registrados por el agente en sesión (tabla "Mis eventos") */
  async obtenerDelAgente() {
    return this.listar({ mis_eventos: 1 })
  },

  /** Obtiene un evento por su ID desde PostgreSQL */
  async obtenerPorId(id) {
    const fila = await peticion(`/eventos/${id}`)
    return adaptarEventoBD(fila)
  },

  /** Lista los 5 estados de la tabla ESTADO */
  async listarEstados() {
    return peticion('/eventos/estados')
  },

  /** Crea un evento nuevo en PostgreSQL (POST /api/eventos) */
  async crear(datos) {
    const creado = await peticion('/eventos', { metodo: 'POST', datos })
    return adaptarEventoBD(creado)
  },

  /** Actualiza los datos de un evento existente (PUT /api/eventos/:id) */
  async actualizar(id, datos) {
    const actualizado = await peticion(`/eventos/${id}`, { metodo: 'PUT', datos })
    return adaptarEventoBD(actualizado)
  },

  /** Cambia el estado de un evento (PATCH /api/eventos/:id/estado) */
  async cambiarEstado(id, id_estado, causa_cancelacion = null) {
    const actualizado = await peticion(`/eventos/${id}/estado`, {
      metodo: 'PATCH',
      datos: { id_estado, causa_cancelacion },
    })
    return adaptarEventoBD(actualizado)
  },

  /** Elimina un evento sin reservas (DELETE /api/eventos/:id) */
  async eliminar(id) {
    return peticion(`/eventos/${id}`, { metodo: 'DELETE' })
  },

  // ─── Métodos usados por Inicio, Catálogo y Detalle ────────────────────────

  /** 4 eventos destacados de la página principal */
  async obtenerDestacados() {
    try {
      const reales = await this.listar()
      if (reales.length > 0) {
        return reales.slice(0, 4).map((e) => {
          const est = ESTADO_EN_INICIO[e.estado] ?? ESTADO_EN_INICIO['Programado']
          return {
            id: e.id,
            nombre: e.nombre,
            ciudad: e.ciudad,
            fecha: e.fecha,
            hora: e.hora_inicio_input,
            precio: e.precio,
            estadoTexto: est.texto,
            estadoColor: est.color,
            categoria: e.teatro || 'Evento',
            imagen: e.imagen,
          }
        })
      }
    } catch {
      // Si falla la red, usa datos de respaldo
    }
    return EVENTOS.slice(0, 4).map((e, i) => {
      const estado = ESTADO_EN_INICIO[e.estado] ?? ESTADO_EN_INICIO['Programado']
      return {
        id: i + 1, nombre: e.nombre, ciudad: e.ciudad, fecha: capitalizarMes(e.fecha), hora: e.hora,
        precio: e.precioStr, estadoTexto: estado.texto, estadoColor: estado.color, categoria: e.categoria, imagen: e.image,
      }
    })
  },

  /** Detalle de un evento (subtarea 3.1: lee ?id=... de la URL si existe) */
  async obtenerDetalle(idParam) {
    const id = idParam || new URLSearchParams(window.location.search).get('id')
    if (id) {
      const ev = await this.obtenerPorId(id)
      return {
        id: ev.id,
        codigo: ev.codigo,
        nombre: ev.nombre,
        categoria: ev.teatro || 'General',
        estado: ev.estado,
        ciudad: ev.ciudad,
        departamento: ev.departamento,
        pais: ev.pais,
        recinto: ev.teatro + (ev.direccion ? ` · ${ev.direccion}` : ''),
        fechaLarga: ev.fecha,
        fechaCorta: ev.fecha,
        horaInicio: ev.hora_inicio_input,
        horaFin: ev.hora_fin_input,
        precio: ev.precio_base,
        capacidad: ev.capacidad,
        vendidas: ev.reservas,
        imagen: ev.imagen,
        parrafos: (ev.descripcion || 'Sin descripción disponible.')
          .split(/\n+/)
          .filter(Boolean),
      }
    }
    // Si entran sin ?id=, intenta mostrar el primer evento real
    const lista = await this.listar()
    if (lista.length > 0) return this.obtenerDetalle(lista[0].id)
    return null
  },

    /** Eventos disponibles para el cliente (Inicio y Explorar). No muestra Cancelados ni Finalizados. */
  async obtenerCatalogo() {
    const eventos = await this.listar()
    return eventos
      .filter(e => e.estado !== 'Cancelado' && e.estado !== 'Finalizado')
      .map(e => ({
        id: e.id,
        nombre: e.nombre,
        descripcion: e.descripcion,
        pais: e.pais,
        departamento: e.departamento,
        ciudad: e.ciudad,
        fecha: e.fecha,
        hora: e.hora_inicio_input,
        precio: e.precio,
        cuposTotal: e.capacidad,
        cuposVendidos: e.reservas,
        estado: e.estado,
        categoria: e.teatro || 'Evento',
        imagen: e.imagen,
        calificacion: 0,
      }))
  },

  /** Primeros 6 eventos para la página de inicio del cliente */
  async obtenerParaInicioCliente() {
    return (await this.obtenerCatalogo()).slice(0, 6)
  },

  /** Calificaciones de un evento (para el modal de detalle del agente) */
  async obtenerCalificaciones(idEjemplo) {
    return CALIFICACIONES.filter(c => c.eventoId === idEjemplo)
  },
}