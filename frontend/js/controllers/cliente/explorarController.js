// js/controllers/cliente/explorarController.js
// CONTROLADOR de "Explorar eventos": búsqueda, filtros y categorías.

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ExplorarView } from '../../views/cliente/explorarView.js'

const filtros = {
  buscar: document.getElementById('buscar'),
  pais: document.getElementById('filtro-pais'),
  departamento: document.getElementById('filtro-departamento'),
  ciudad: document.getElementById('filtro-ciudad'),
  fecha: document.getElementById('filtro-fecha'),
  estado: document.getElementById('filtro-estado'),
}
let categoria = 'Todos'
let eventos = []

const CIUDADES_POR_DEPTO = {
  'Antioquia': ['Medellín'],
  'Bogotá D.C.': ['Bogotá'],
  'Valle del Cauca': ['Cali'],
}
const TODAS_LAS_CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena']

function hayFiltros() {
  return Object.values(filtros).some(f => f.value) || categoria !== 'Todos'
}

function aplicarFiltros() {
  const q = filtros.buscar.value.toLowerCase()
  const resultado = eventos.filter(e =>
    (!q || e.nombre.toLowerCase().includes(q) || e.descripcion.toLowerCase().includes(q) || e.ciudad.toLowerCase().includes(q) || e.categoria.toLowerCase().includes(q)) &&
    (!filtros.pais.value || e.pais === filtros.pais.value) &&
    (!filtros.departamento.value || e.departamento === filtros.departamento.value) &&
    (!filtros.ciudad.value || e.ciudad === filtros.ciudad.value) &&
    (!filtros.estado.value || e.estado === filtros.estado.value) &&
    (categoria === 'Todos' || e.categoria === categoria) &&
    e.estado !== 'Finalizado' && e.estado !== 'Cancelado'
  )
  ExplorarView.mostrarEventos(resultado, hayFiltros())
  document.getElementById('limpiar-busqueda').hidden = !filtros.buscar.value
}

function limpiarFiltros() {
  Object.values(filtros).forEach(f => { f.value = '' })
  categoria = 'Todos'
  ExplorarView.marcarCategoria(categoria)
  ExplorarView.opcionesCiudad(TODAS_LAS_CIUDADES)
  aplicarFiltros()
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()
  eventos = await EventoModel.obtenerCatalogo()
  aplicarFiltros()

  filtros.buscar.addEventListener('input', aplicarFiltros)
  filtros.pais.addEventListener('change', () => { filtros.departamento.value = ''; filtros.ciudad.value = ''; aplicarFiltros() })
  filtros.departamento.addEventListener('change', () => {
    ExplorarView.opcionesCiudad(CIUDADES_POR_DEPTO[filtros.departamento.value] || TODAS_LAS_CIUDADES)
    aplicarFiltros()
  })
  ;[filtros.ciudad, filtros.estado].forEach(f => f.addEventListener('change', aplicarFiltros))
  filtros.fecha.addEventListener('input', aplicarFiltros)

  document.getElementById('categorias').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-categoria]')
    if (!boton) return
    categoria = boton.dataset.categoria
    ExplorarView.marcarCategoria(categoria)
    aplicarFiltros()
  })
  document.getElementById('limpiar-busqueda').addEventListener('click', () => { filtros.buscar.value = ''; aplicarFiltros() })
  document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros)
  document.getElementById('resultados').addEventListener('click', (e) => {
    if (e.target.closest('[data-accion="limpiar-filtros"]')) limpiarFiltros()
  })
}

iniciar()
