// js/controllers/admin/operacionController.js
// CONTROLADOR de "Reservas y operación": filtros de reservas,
// paginación de canceladas y modales de detalle.

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { OperacionView } from '../../views/admin/operacionView.js'
import { abrirModal } from '../../views/componentes/modal.js'

const POR_PAGINA = 7
const CAMPOS = { 'f-evento': 'evento', 'f-agente': 'agente', 'f-estado': 'estado', 'f-pais': 'pais', 'f-ciudad': 'ciudad' }
let datos = null
let aplicados = {}
let canceladas = []
let pagina = 1

const unicos = (campo) => [...new Set(datos.reservas.map(r => r[campo]))]

function dibujarCanceladas() {
  canceladas = datos.reservas.filter(r =>
    r.estado === 'Cancelada' && Object.entries(aplicados).every(([campo, v]) => v === 'Todos' || r[campo] === v))
  pagina = Math.min(pagina, Math.max(1, Math.ceil(canceladas.length / POR_PAGINA)))
  OperacionView.canceladas(canceladas, pagina, POR_PAGINA)
}

function leerFiltros() {
  aplicados = {}
  Object.entries(CAMPOS).forEach(([id, campo]) => { aplicados[campo] = document.getElementById(id).value })
  document.getElementById('f-limpiar').hidden = Object.values(aplicados).every(v => v === 'Todos')
}

function conectarFiltros() {
  const form = document.getElementById('barra-filtros')
  form.addEventListener('submit', (e) => { e.preventDefault(); leerFiltros(); pagina = 1; dibujarCanceladas() })
  document.getElementById('f-limpiar').addEventListener('click', () => {
    Object.keys(CAMPOS).forEach(id => { document.getElementById(id).value = 'Todos' })
    leerFiltros(); pagina = 1; dibujarCanceladas()
  })
}

function conectarContenido() {
  document.getElementById('paginacion').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-pagina]')
    if (!boton || boton.disabled) return
    pagina = Number(boton.dataset.pagina)
    dibujarCanceladas()
  })
  document.getElementById('tabla-canceladas').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-reserva]')
    if (boton) abrirModal(OperacionView.modalReserva(canceladas[boton.dataset.reserva]))
  })
  document.getElementById('tabla-eventos-cancelados').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-evento]')
    if (boton) abrirModal(OperacionView.modalEvento(datos.eventosCancelados[boton.dataset.evento]))
  })
}

async function cargar() {
  datos = await ReporteModel.operacion()
  if (!document.getElementById('f-evento')) {
    OperacionView.filtros({ eventos: unicos('evento'), agentes: unicos('agente'), paises: unicos('pais'), ciudades: unicos('ciudad') })
    conectarFiltros()
  }
  leerFiltros()
  OperacionView.mostrar(datos, periodoActual())
  conectarContenido()
  dibujarCanceladas()
}

await iniciarAdmin('reservas-operacion', { alActualizar: cargar, alCambiarPeriodo: cargar })
cargar()
