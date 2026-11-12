// js/controllers/admin/operacionController.js
// CONTROLADOR de "Reservas y operación": pide al Modelo el reporte REAL del
// período elegido (GET /api/reportes/operacion), se lo pasa a la Vista y maneja:
//   - el historial por cliente (selector de cliente, estado y buscador)
//   - los filtros de reservas canceladas (quién canceló, agente, evento)
//   - las dos paginaciones y los modales de detalle
// Los eventos (clics, cambios) se escuchan UNA sola vez en #contenido
// ("delegación"), así no se duplican al recargar los datos.

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { OperacionView, ESTADOS_RESERVA, QUIENES } from '../../views/admin/operacionView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { paginar } from '../../views/componentes/paginacion.js'

const POR_PAGINA_HISTORIAL = 8
const POR_PAGINA_CANCELADAS = 7
const TODOS = 'Todos'

let datos = null   // respuesta del backend: { anio, anios, resumen, reservas, parciales, eventosCancelados, actividad }
let paginaHistorial = 1
let paginaCanceladas = 1

const $ = (id) => document.getElementById(id)
/** Quita tildes y pasa a minúsculas para que "gomez" encuentre "Gómez" */
const normalizar = (texto) => String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
/** Valores únicos de un campo, ordenados */
const unicos = (lista, campo) => [...new Set(lista.map(x => x[campo]))].sort((a, b) => a.localeCompare(b))

// ── 10.1 Historial de reservas por cliente ──────────────────────────────────
/** Clientes con reservas en el período: { valor: id_cliente, texto: "Laura Gómez (10)" } */
function clientes() {
  const mapa = new Map()
  datos.reservas.forEach(r => {
    const c = mapa.get(r.id_cliente) || { id: r.id_cliente, nombre: r.cliente, correo: r.correo, reservas: 0 }
    c.reservas++
    mapa.set(r.id_cliente, c)
  })
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre))
}

function dibujarHistorial() {
  const cliente = $('h-cliente').value
  const estado = $('h-estado').value
  const texto = normalizar($('h-buscar').value.trim())

  const delCliente = datos.reservas.filter(r => cliente === TODOS || r.id_cliente === cliente)
  const lista = delCliente.filter(r =>
    (estado === TODOS || r.estado === estado) &&
    (!texto || [r.cliente, r.correo, r.evento, r.codigo, r.codigo_evento].some(v => normalizar(v).includes(texto))))

  OperacionView.fichaCliente(clientes().find(c => c.id === cliente), delCliente)
  paginaHistorial = Math.min(paginaHistorial, Math.max(1, Math.ceil(lista.length / POR_PAGINA_HISTORIAL)))
  OperacionView.historial(paginar(lista, paginaHistorial, POR_PAGINA_HISTORIAL), lista.length, paginaHistorial, POR_PAGINA_HISTORIAL)
}

// ── 10.2 Reservas canceladas ────────────────────────────────────────────────
function dibujarCanceladas() {
  const quien = $('c-quien').value
  const agente = $('c-agente').value
  const evento = $('c-evento').value
  const lista = datos.reservas.filter(r => r.estado === 'Cancelada' &&
    (quien === TODOS || (r.cancelada_por || 'Sin registro') === quien) &&
    (agente === TODOS || r.agente === agente) &&
    (evento === TODOS || r.evento === evento))

  paginaCanceladas = Math.min(paginaCanceladas, Math.max(1, Math.ceil(lista.length / POR_PAGINA_CANCELADAS)))
  OperacionView.canceladas(paginar(lista, paginaCanceladas, POR_PAGINA_CANCELADAS), lista.length, paginaCanceladas, POR_PAGINA_CANCELADAS)
}

function llenarFiltros() {
  const conteo = (lista, f) => lista.filter(f).length
  OperacionView.opciones('h-cliente', clientes().map(c => ({ valor: c.id, texto: `${c.nombre} (${c.reservas})` })), TODOS, 'Todos los clientes')
  OperacionView.opciones('h-estado', ESTADOS_RESERVA.map(e => ({ valor: e, texto: `${e} (${conteo(datos.reservas, r => r.estado === e)})` })))

  const canceladas = datos.reservas.filter(r => r.estado === 'Cancelada')
  OperacionView.opciones('c-quien', QUIENES
    .map(q => ({ valor: q, texto: `${q} (${conteo(canceladas, r => (r.cancelada_por || 'Sin registro') === q)})` }))
    .filter(o => !o.texto.endsWith('(0)')))
  OperacionView.opciones('c-agente', unicos(canceladas, 'agente').map(a => ({ valor: a, texto: a })))
  OperacionView.opciones('c-evento', unicos(canceladas, 'evento').map(e => ({ valor: e, texto: e })))
}

// ── Eventos de la página (se conectan UNA sola vez) ─────────────────────────
function conectar() {
  const contenido = $('contenido')

  contenido.addEventListener('change', (e) => {
    if (!datos) return
    if (['h-cliente', 'h-estado'].includes(e.target.id)) { paginaHistorial = 1; dibujarHistorial() }
    if (['c-quien', 'c-agente', 'c-evento'].includes(e.target.id)) { paginaCanceladas = 1; dibujarCanceladas() }
  })
  contenido.addEventListener('input', (e) => {
    if (datos && e.target.id === 'h-buscar') { paginaHistorial = 1; dibujarHistorial() }
  })
  // Enter dentro de los formularios no recarga la página
  contenido.addEventListener('submit', (e) => e.preventDefault())

  contenido.addEventListener('click', (e) => {
    if (!datos) return
    if (e.target.closest('#h-limpiar')) {
      $('h-cliente').value = TODOS; $('h-estado').value = TODOS; $('h-buscar').value = ''
      paginaHistorial = 1
      return dibujarHistorial()
    }
    if (e.target.closest('#c-limpiar')) {
      ['c-quien', 'c-agente', 'c-evento'].forEach(id => { $(id).value = TODOS })
      paginaCanceladas = 1
      return dibujarCanceladas()
    }

    const pagina = e.target.closest('[data-pagina]')
    if (pagina && !pagina.disabled) {
      if (pagina.closest('#paginacion-historial')) { paginaHistorial = Number(pagina.dataset.pagina); dibujarHistorial() }
      if (pagina.closest('#paginacion-canceladas')) { paginaCanceladas = Number(pagina.dataset.pagina); dibujarCanceladas() }
      return
    }

    const verReserva = e.target.closest('[data-reserva]')
    if (verReserva) {
      const r = datos.reservas.find(x => String(x.id_reserva) === verReserva.dataset.reserva)
      if (r) {
        const caja = abrirModal(OperacionView.modalReserva(r, datos.parciales.filter(p => p.codigo === r.codigo)), { clase: 'modal--lg' })
        caja.querySelector('[data-eliminar-reserva]')?.addEventListener('click', () => eliminarReserva(r))
      }
      return
    }
    const verEvento = e.target.closest('[data-evento]')
    if (verEvento) {
      const ev = datos.eventosCancelados.find(x => x.codigo === verEvento.dataset.evento)
      if (ev) abrirModal(OperacionView.modalEvento(ev), { clase: 'modal--lg' })
    }
  })
}

// ── Eliminar reserva (CRUD de reservas · solo el administrador) ────────────
function eliminarReserva(r) {
  const caja = abrirModal(OperacionView.confirmarEliminarReserva(r), { clase: 'modal--sm' })
  caja.querySelector('#confirmar-eliminar').addEventListener('click', async () => {
    cerrarModal()
    try {
      await ReservaModel.eliminar(r.id_reserva) // DELETE /api/reservas/:id
      mostrarToast(`La reserva ${r.codigo} fue eliminada.`, { duracion: 2500 })
      await cargar() // los reportes se recalculan sin esa reserva
    } catch (error) {
      mostrarToast('No se pudo eliminar', { detalle: error.message, error: true, duracion: 5000, cerrable: true })
    }
  })
}

// ── Carga de datos ──────────────────────────────────────────────────────────
async function cargar() {
  try {
    datos = await ReporteModel.operacion(periodoActual())
    OperacionView.mostrarPeriodos(datos.anios, datos.anio)
    OperacionView.mostrar(datos)
    // Con cada carga cambian los clientes y eventos: los filtros vuelven a "Todos"
    paginaHistorial = 1
    paginaCanceladas = 1
    llenarFiltros()
    dibujarHistorial()
    dibujarCanceladas()
  } catch (error) {
    datos = null
    OperacionView.mostrarError(error.message)
  }
}

await iniciarAdmin('reservas-operacion', { alActualizar: cargar, alCambiarPeriodo: cargar })
conectar()
OperacionView.mostrarCargando()
cargar()