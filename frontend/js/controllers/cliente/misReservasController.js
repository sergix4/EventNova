// js/controllers/cliente/misReservasController.js
// CONTROLADOR de "Mis reservas": filtros, paginación, detalle y calificación.

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { MisReservasView } from '../../views/cliente/misReservasView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'

const POR_PAGINA = 5
const buscar = document.getElementById('buscar')
const filtroEstado = document.getElementById('filtro-estado')
const filtroFecha = document.getElementById('filtro-fecha')
let reservas = []
let pagina = 1
const calificaciones = {} // { idReserva: { estrellas, comentario } }

function filtradas() {
  const q = buscar.value.toLowerCase()
  return reservas.filter(r =>
    (!q || r.evento.toLowerCase().includes(q) || r.ciudad.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q)) &&
    (!filtroEstado.value || r.estado === filtroEstado.value))
}

function dibujar() {
  const lista = filtradas()
  const hayFiltros = !!(buscar.value || filtroEstado.value || filtroFecha.value)
  MisReservasView.mostrarBarraFiltros(lista.length, hayFiltros, !!buscar.value)
  MisReservasView.mostrarLista(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA, calificaciones, hayFiltros)
}

function limpiar() {
  buscar.value = ''; filtroEstado.value = ''; filtroFecha.value = ''; pagina = 1
  dibujar()
}

// ─── Panel lateral de detalle ────────────────────────────────────────────────
function abrirDetalle(id) {
  const r = reservas.find(x => x.id === id)
  cerrarDetalle()
  const fondo = document.createElement('div')
  fondo.className = 'cajon-fondo'
  fondo.innerHTML = MisReservasView.cajonDetalle(r, calificaciones[id])
  document.body.appendChild(fondo)
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo || e.target.closest('[data-cerrar]')) return cerrarDetalle()
    const calificar = e.target.closest('[data-calificar]')
    if (calificar) abrirCalificacion(calificar.dataset.calificar)
  })
}
function cerrarDetalle() {
  document.querySelector('.cajon-fondo')?.remove()
}

// ─── Ventana de calificación ─────────────────────────────────────────────────
function abrirCalificacion(id) {
  const r = reservas.find(x => x.id === id)
  let elegidas = calificaciones[id]?.estrellas || 0
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
    calificaciones[id] = { estrellas: elegidas, comentario: caja.querySelector('#comentario').value }
    cerrarModal()
    dibujar()
    if (document.querySelector('.cajon-fondo')) abrirDetalle(id)
  })
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'reservas' })
  iniciarNotificaciones()
  reservas = await ReservaModel.delCliente()
  MisReservasView.mostrarEstadisticas(reservas)
  dibujar()

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
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarDetalle() })
}

iniciar()
