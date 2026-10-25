// js/controllers/cliente/misReservasController.js
// CONTROLADOR de "Mis reservas" (Sprint 2 · Tarea 7):
//   - Lista las reservas REALES del cliente en sesión (GET /api/reservas).
//   - Filtros por texto, estado y fecha del evento + paginación.
//   - Panel lateral con el detalle de la reserva y de su evento asociado.
//   - Cancelar una reserva propia (PATCH /api/reservas/:id/estado -> Cancelada).
//   - Calificar el evento (por ahora solo en pantalla: no hay tabla de calificaciones).

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { MisReservasView } from '../../views/cliente/misReservasView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const POR_PAGINA = 5
const buscar = document.getElementById('buscar')
const filtroEstado = document.getElementById('filtro-estado')
const filtroFecha = document.getElementById('filtro-fecha')
let reservas = []
let pagina = 1
const calificaciones = {} // { idReserva: { estrellas, comentario } }

// Los ids que vienen de data-ver="..." son texto y los de la BD son número:
// por eso se comparan como texto
const buscarReserva = (id) => reservas.find(x => String(x.id) === String(id))

function filtradas() {
  const q = buscar.value.trim().toLowerCase()
  return reservas.filter(r =>
    (!q || r.evento.toLowerCase().includes(q) || r.ciudad.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q)) &&
    (!filtroEstado.value || r.estado === filtroEstado.value) &&
    (!filtroFecha.value || r.fechaEventoISO === filtroFecha.value))
}

function dibujar() {
  const lista = filtradas()
  // Si al cancelar/filtrar la página actual se queda vacía, se vuelve a la última que tenga datos
  const ultimaPagina = Math.max(1, Math.ceil(lista.length / POR_PAGINA))
  if (pagina > ultimaPagina) pagina = ultimaPagina
  const hayFiltros = !!(buscar.value || filtroEstado.value || filtroFecha.value)
  MisReservasView.mostrarBarraFiltros(lista.length, hayFiltros, !!buscar.value)
  MisReservasView.mostrarLista(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA, calificaciones, hayFiltros)
}

function limpiar() {
  buscar.value = ''; filtroEstado.value = ''; filtroFecha.value = ''; pagina = 1
  dibujar()
}

// Pide las reservas al backend y redibuja todo
async function cargar() {
  try {
    reservas = await ReservaModel.delCliente()
  } catch (error) {
    reservas = []
    MisReservasView.mostrarEstadisticas(reservas)
    MisReservasView.mostrarError(error.message)
    return
  }
  MisReservasView.mostrarEstadisticas(reservas)
  dibujar()
}

// ─── Panel lateral de detalle ────────────────────────────────────────────────
function abrirDetalle(id) {
  const r = buscarReserva(id)
  if (!r) return
  cerrarDetalle()
  const fondo = document.createElement('div')
  fondo.className = 'cajon-fondo'
  fondo.innerHTML = MisReservasView.cajonDetalle(r, calificaciones[r.id])
  document.body.appendChild(fondo)
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo || e.target.closest('[data-cerrar]')) return cerrarDetalle()
    const calificar = e.target.closest('[data-calificar]')
    if (calificar) return abrirCalificacion(calificar.dataset.calificar)
    const cancelar = e.target.closest('[data-cancelar]')
    if (cancelar) return abrirCancelacion(cancelar.dataset.cancelar)
  })
}
function cerrarDetalle() {
  document.querySelector('.cajon-fondo')?.remove()
}

// ─── Ventana para cancelar una reserva propia ────────────────────────────────
function abrirCancelacion(id) {
  const r = buscarReserva(id)
  if (!r || !r.cancelable) return
  const caja = abrirModal(MisReservasView.modalCancelar(r))
  const confirmar = caja.querySelector('#confirmar-cancelacion')

  confirmar.addEventListener('click', async () => {
    confirmar.disabled = true
    confirmar.textContent = 'Cancelando…'
    const causa = caja.querySelector('#causa-cancelacion').value.trim() || null
    try {
      // PATCH /api/reservas/:id/estado -> Cancelada (el backend revisa que sea suya)
      const actualizada = await ReservaModel.cancelar(r.id, causa)
      reservas = reservas.map(x => String(x.id) === String(r.id) ? actualizada : x)
      cerrarModal()
      MisReservasView.mostrarEstadisticas(reservas)
      dibujar()
      if (document.querySelector('.cajon-fondo')) abrirDetalle(r.id) // refresca el panel
      mostrarToast('Reserva cancelada.', { detalle: actualizada.codigo })
    } catch (error) {
      // p. ej. 409 "Una reserva cancelada ya no se puede cambiar."
      MisReservasView.mostrarErrorCancelacion(error.message)
      confirmar.disabled = false
      confirmar.textContent = 'Sí, cancelar reserva'
    }
  })
}

// ─── Ventana de calificación ─────────────────────────────────────────────────
function abrirCalificacion(id) {
  const r = buscarReserva(id)
  if (!r) return
  let elegidas = calificaciones[r.id]?.estrellas || 0
  const caja = abrirModal(MisReservasView.modalCalificar(r))
  const enviar = caja.querySelector('#enviar-calificacion')
  const fila = caja.querySelector('#fila-estrellas')
  MisReservasView.pintarEstrellas(elegidas)
  enviar.disabled = elegidas === 0

  fila.addEventListener('mouseover', (e) => {
    const b = e.target.closest('[data-estrella]')
    if (b) MisReservasView.pintarEstrellas(Number(b.dataset.estrella))
  })
  fila.addEventListener('mouseleave', () => MisReservasView.pintarEstrellas(elegidas))
  fila.addEventListener('click', (e) => {
    const b = e.target.closest('[data-estrella]')
    if (!b) return
    elegidas = Number(b.dataset.estrella)
    MisReservasView.pintarEstrellas(elegidas)
    enviar.disabled = false
  })
  enviar.addEventListener('click', () => {
    calificaciones[r.id] = { estrellas: elegidas, comentario: caja.querySelector('#comentario').value }
    cerrarModal()
    dibujar()
    if (document.querySelector('.cajon-fondo')) abrirDetalle(r.id)
  })
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'reservas' })
  iniciarNotificaciones()
  await cargar()

  // Si llega desde el detalle del evento (?reserva=ID), abre esa reserva
  const params = new URLSearchParams(window.location.search)
  if (params.get('reserva')) {
    abrirDetalle(params.get('reserva'))
    history.replaceState(null, '', window.location.pathname) // limpia la URL
  }

  buscar.addEventListener('input', () => { pagina = 1; dibujar() })
  filtroEstado.addEventListener('change', () => { pagina = 1; dibujar() })
  filtroFecha.addEventListener('input', () => { pagina = 1; dibujar() })
  document.getElementById('limpiar-busqueda').addEventListener('click', () => { buscar.value = ''; pagina = 1; dibujar() })
  document.getElementById('limpiar-filtros').addEventListener('click', limpiar)

  document.getElementById('resultados').addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]')
    const calificar = e.target.closest('[data-calificar]')
    const irA = e.target.closest('[data-pagina]')
    if (ver) abrirDetalle(ver.dataset.ver)
    else if (calificar) abrirCalificacion(calificar.dataset.calificar)
    else if (irA && !irA.disabled) { pagina = Number(irA.dataset.pagina); dibujar() }
    else if (e.target.closest('[data-accion="limpiar-filtros"]')) limpiar()
    else if (e.target.closest('[data-accion="reintentar"]')) cargar()
  })
  // Escape cierra el panel solo si no hay una ventana modal abierta encima
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.querySelector('.modal-fondo')) cerrarDetalle()
  })
}

iniciar()