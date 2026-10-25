// js/controllers/agente/reservasController.js
// CONTROLADOR de "Reservas" del agente (Sprint 2 · Tarea 8):
//   - Lista las reservas REALES de los eventos del agente en sesión (GET /api/reservas).
//   - Filtros por texto, evento, estado y fecha del evento + paginación.
//   - Ver el detalle de una reserva.
//   - Actualizar el estado: Reservada -> Confirmada / Cancelada · Confirmada -> Cancelada
//     (PATCH /api/reservas/:id/estado). Al cancelar, la causa es obligatoria.

import { iniciarPanel } from '../comun/panelController.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { ReservasAgenteView } from '../../views/agente/reservasAgenteView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const POR_PAGINA = 8
const $ = (id) => document.getElementById(id)
let reservas = []
let pagina = 1

// Los ids de data-ver="..." son texto y los de la BD son número: se comparan como texto
const buscarReserva = (id) => reservas.find(r => String(r.id) === String(id))

function reservasFiltradas() {
  const q = $('buscar').value.trim().toLowerCase()
  const evento = $('filtro-evento').value
  const estado = $('filtro-estado').value
  const fecha = $('filtro-fecha').value // "2026-10-31" (input type="date")
  return reservas.filter(r =>
    (!q || [r.cliente, r.correo, r.evento, r.codigo].some(t => t.toLowerCase().includes(q))) &&
    (!evento || String(r.id_evento) === evento) &&
    (!estado || r.estado === estado) &&
    (!fecha || r.fechaEventoISO === fecha))
}

function dibujarReservas() {
  const lista = reservasFiltradas()
  // Si la página actual quedó vacía (por filtrar), vuelve a la última con datos
  const ultima = Math.max(1, Math.ceil(lista.length / POR_PAGINA))
  if (pagina > ultima) pagina = ultima
  ReservasAgenteView.mostrarIndicadores(reservas)
  ReservasAgenteView.mostrarReservas(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA, reservas.length > 0)
}

// Select de eventos: uno por cada evento que tenga reservas (sin repetir)
function llenarEventos() {
  const unicos = new Map()
  reservas.forEach(r => unicos.set(String(r.id_evento), r.evento))
  const eventos = [...unicos].map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  const elegido = $('filtro-evento').value
  ReservasAgenteView.opcionesEventos(eventos)
  if (unicos.has(elegido)) $('filtro-evento').value = elegido // conserva el filtro al recargar
}

// Pide las reservas al backend (el backend ya devuelve solo las de MIS eventos)
async function cargar() {
  try {
    reservas = await ReservaModel.delAgente()
  } catch (error) {
    reservas = []
    ReservasAgenteView.mostrarIndicadores(reservas)
    ReservasAgenteView.mostrarError(error.message)
    return
  }
  llenarEventos()
  dibujarReservas()
}

// ─── Ventana para confirmar / cancelar ───────────────────────────────────────
function actualizarEstado(reserva) {
  if (!reserva || reserva.siguientesEstados.length === 0) return
  let elegido = null
  let guardando = false
  const caja = abrirModal(ReservasAgenteView.modalActualizar(reserva), { cerrarAlHacerClicFuera: false })

  caja.querySelector('#opciones-estado').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-estado]')
    if (!boton) return
    elegido = boton.dataset.estado
    ReservasAgenteView.marcarEstado(elegido)
    ReservasAgenteView.errorCausa(false)
    ReservasAgenteView.errorEstado('')
  })
  caja.querySelector('#causa').addEventListener('input', () => ReservasAgenteView.errorCausa(false))

  caja.querySelector('#guardar-estado').addEventListener('click', async () => {
    if (guardando || !elegido) return
    const causa = caja.querySelector('#causa').value.trim()
    if (elegido === 'Cancelada' && !causa) return ReservasAgenteView.errorCausa(true)

    guardando = true
    ReservasAgenteView.guardando(true)
    try {
      // PATCH /api/reservas/:id/estado (el backend revisa que la reserva sea de MIS eventos)
      const actualizada = await ReservaModel.cambiarEstadoPorNombre(
        reserva.id, elegido, elegido === 'Cancelada' ? causa : null)
      reservas = reservas.map(r => String(r.id) === String(reserva.id) ? actualizada : r)
      cerrarModal()
      dibujarReservas()
      mostrarToast(`Reserva ${elegido === 'Confirmada' ? 'confirmada' : 'cancelada'}.`, { detalle: actualizada.codigo })
    } catch (error) {
      // p. ej. 409 "No se puede confirmar: el evento está Finalizado."
      ReservasAgenteView.errorEstado(error.message)
      ReservasAgenteView.guardando(false)
      guardando = false
    }
  })
}

async function iniciar() {
  await iniciarPanel({ rol: 'agente', activo: 'reservas' })
  await cargar()

  $('buscar').addEventListener('input', () => { pagina = 1; dibujarReservas() })
  $('filtro-fecha').addEventListener('input', () => { pagina = 1; dibujarReservas() })
  ;['filtro-evento', 'filtro-estado'].forEach(id => $(id).addEventListener('change', () => { pagina = 1; dibujarReservas() }))

  $('contenido').addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]')
    const actualizar = e.target.closest('[data-actualizar]')
    const irA = e.target.closest('[data-pagina]')
    if (ver) {
      const r = buscarReserva(ver.dataset.ver)
      if (r) abrirModal(ReservasAgenteView.modalDetalle(r), { cerrarAlHacerClicFuera: false })
    } else if (actualizar && !actualizar.disabled) {
      actualizarEstado(buscarReserva(actualizar.dataset.actualizar))
    } else if (irA && !irA.disabled) {
      pagina = Number(irA.dataset.pagina); dibujarReservas()
    } else if (e.target.closest('[data-accion="reintentar"]')) {
      cargar()
    }
  })
}

iniciar()