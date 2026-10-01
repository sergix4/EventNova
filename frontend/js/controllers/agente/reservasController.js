// js/controllers/agente/reservasController.js
// CONTROLADOR de "Reservas" del agente: filtros, paginación, detalle,
// actualización del estado de una reserva y pagos recibidos.

import { iniciarPanel } from '../comun/panelController.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { ReservasAgenteView } from '../../views/agente/reservasAgenteView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'

const POR_PAGINA = 8
const POR_PAGINA_PAGOS = 5
const $ = (id) => document.getElementById(id)
let reservas = []
let pagos = []
let pagina = 1
let paginaPagos = 1

function reservasFiltradas() {
  const q = $('buscar').value.toLowerCase()
  const evento = $('filtro-evento').value
  const estado = $('filtro-estado').value
  const fecha = $('filtro-fecha').value.toLowerCase()
  return reservas.filter(r =>
    (r.cliente.toLowerCase().includes(q) || r.evento.toLowerCase().includes(q)) &&
    (evento === 'Todos los eventos' || r.evento === evento) &&
    (estado === 'Todos' || r.estado === estado) &&
    (!fecha || r.fechaEvento.toLowerCase().includes(fecha) || r.fechaReserva.toLowerCase().includes(fecha)))
}

function pagosFiltrados() {
  const q = $('buscar-pagos').value.toLowerCase()
  const estado = $('filtro-pagos').value
  return pagos.filter(p =>
    (p.clienteNombre.toLowerCase().includes(q) || p.eventoNombre.toLowerCase().includes(q) || p.codigoTransaccion.toLowerCase().includes(q)) &&
    (estado === 'Todos' || p.estado === estado))
}

function dibujarReservas() {
  const lista = reservasFiltradas()
  ReservasAgenteView.mostrarIndicadores(reservas)
  ReservasAgenteView.mostrarReservas(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA)
}

function dibujarPagos() {
  const lista = pagosFiltrados()
  ReservasAgenteView.mostrarPagos(paginar(lista, paginaPagos, POR_PAGINA_PAGOS), lista.length, paginaPagos, POR_PAGINA_PAGOS)
}

function actualizarEstado(reserva) {
  let elegido = reserva.estado
  let guardando = false
  const caja = abrirModal(ReservasAgenteView.modalActualizar(reserva), { cerrarAlHacerClicFuera: false })

  caja.querySelector('#opciones-estado').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-estado]')
    if (!boton) return
    elegido = boton.dataset.estado
    ReservasAgenteView.marcarEstado(elegido)
    ReservasAgenteView.errorCausa(false)
  })
  caja.querySelector('#causa').addEventListener('input', () => ReservasAgenteView.errorCausa(false))
  caja.querySelector('#guardar-estado').addEventListener('click', async (e) => {
    if (guardando) return
    const causa = caja.querySelector('#causa').value.trim()
    if (elegido === 'Cancelada' && !causa) return ReservasAgenteView.errorCausa(true)
    guardando = true
    e.currentTarget.disabled = true
    caja.querySelector('#exito').hidden = false
    await ReservaModel.actualizarEstado(reserva.id, elegido, causa) // pendiente: PUT /api/reservas/:id
    setTimeout(() => {
      reserva.estado = elegido
      reserva.causaCancelacion = elegido === 'Cancelada' ? causa : undefined
      cerrarModal()
      dibujarReservas()
    }, 900)
  })
}

async function iniciar() {
  await iniciarPanel({ rol: 'agente', activo: 'reservas' })
  ;[reservas, pagos] = await Promise.all([ReservaModel.delAgente(), ReservaModel.pagosDelAgente()])

  ReservasAgenteView.opcionesEventos([...new Set(reservas.map(r => r.evento))])
  ReservasAgenteView.mostrarIndicadoresPagos(pagos)
  dibujarReservas()
  dibujarPagos()

  ;['buscar', 'filtro-fecha'].forEach(id => $(id).addEventListener('input', () => { pagina = 1; dibujarReservas() }))
  ;['filtro-evento', 'filtro-estado'].forEach(id => $(id).addEventListener('change', () => { pagina = 1; dibujarReservas() }))
  $('buscar-pagos').addEventListener('input', () => { paginaPagos = 1; dibujarPagos() })
  $('filtro-pagos').addEventListener('change', () => { paginaPagos = 1; dibujarPagos() })

  $('contenido').addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]')
    const actualizar = e.target.closest('[data-actualizar]')
    const pago = e.target.closest('[data-pago]')
    const irA = e.target.closest('[data-pagina]')
    if (ver) abrirModal(ReservasAgenteView.modalDetalle(reservas.find(r => r.id === Number(ver.dataset.ver))), { cerrarAlHacerClicFuera: false })
    else if (actualizar) actualizarEstado(reservas.find(r => r.id === Number(actualizar.dataset.actualizar)))
    else if (pago) abrirModal(ReservasAgenteView.modalPago(pagos.find(p => p.id === pago.dataset.pago)))
    else if (irA && !irA.disabled) {
      if (irA.closest('#paginacion-pagos')) { paginaPagos = Number(irA.dataset.pagina); dibujarPagos() }
      else { pagina = Number(irA.dataset.pagina); dibujarReservas() }
    }
  })
}

iniciar()
