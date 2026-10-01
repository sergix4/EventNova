// js/controllers/cliente/inicioController.js
// CONTROLADOR de la página de inicio del cliente.
// Une el Modelo (eventos y reservas) con la Vista y maneja la búsqueda y filtros.

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { InicioClienteView } from '../../views/cliente/inicioClienteView.js'

const filtros = {
  buscar: document.getElementById('buscar'),
  pais: document.getElementById('filtro-pais'),
  departamento: document.getElementById('filtro-departamento'),
  ciudad: document.getElementById('filtro-ciudad'),
  fecha: document.getElementById('filtro-fecha'),
  estado: document.getElementById('filtro-estado'),
}
let eventos = []

function hayFiltros() {
  return Object.values(filtros).some(f => f.value)
}

function aplicarFiltros() {
  const q = filtros.buscar.value.toLowerCase()
  const resultado = eventos.filter(e =>
    (!q || e.nombre.toLowerCase().includes(q) || e.ciudad.toLowerCase().includes(q) || e.categoria.toLowerCase().includes(q)) &&
    (!filtros.pais.value || e.pais === filtros.pais.value) &&
    (!filtros.departamento.value || e.departamento === filtros.departamento.value) &&
    (!filtros.ciudad.value || e.ciudad === filtros.ciudad.value) &&
    (!filtros.estado.value || e.estado === filtros.estado.value) &&
    e.estado !== 'Finalizado' && e.estado !== 'Cancelado'
  )
  InicioClienteView.mostrarEventos(resultado, hayFiltros())
  InicioClienteView.mostrarBotonLimpiarBusqueda(!!filtros.buscar.value)
}

function limpiarFiltros() {
  Object.values(filtros).forEach(f => { f.value = '' })
  aplicarFiltros()
}

async function iniciar() {
  const usuario = await iniciarPanel({ rol: 'cliente', activo: 'inicio' })
  iniciarNotificaciones()
  InicioClienteView.mostrarSaludo(usuario)

  const [resumen, lista] = await Promise.all([ReservaModel.resumenInicioCliente(), EventoModel.obtenerParaInicioCliente()])
  eventos = lista
  InicioClienteView.mostrarEstadisticas(resumen)
  aplicarFiltros()

  Object.values(filtros).forEach(f => f.addEventListener(f.tagName === 'SELECT' ? 'change' : 'input', aplicarFiltros))
  document.getElementById('limpiar-busqueda').addEventListener('click', () => { filtros.buscar.value = ''; aplicarFiltros() })
  document.getElementById('boton-filtros').addEventListener('click', limpiarFiltros)
  document.getElementById('resultados').addEventListener('click', (e) => {
    if (e.target.closest('[data-accion="limpiar-filtros"]')) limpiarFiltros()
  })
}

iniciar()
