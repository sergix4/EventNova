// js/controllers/admin/coberturaController.js
// CONTROLADOR de "Cobertura y eventos": filtros en cascada
// (país → departamento → ciudad), paginación y modal de detalle.

import { iniciarAdmin } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { CoberturaView, ESTADOS } from '../../views/admin/coberturaView.js'
import { abrirModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'

const POR_PAGINA = 6
const TODOS = 'Todos'
let eventos = []
let geografia = {}
let aplicados = { pais: TODOS, depto: TODOS, ciudad: TODOS, estado: TODOS }
let pagina = 1
const valor = (id) => document.getElementById(id).value
const unicos = (lista) => [...new Set(lista)]

// ── Opciones en cascada ─────────────────────────────────────────────────────
function opcionesDepartamento(pais) {
  return pais === TODOS ? unicos(eventos.map(e => e.departamento)) : Object.keys(geografia[pais] || {})
}
function opcionesCiudad(pais, depto) {
  if (depto === TODOS) return pais === TODOS ? unicos(eventos.map(e => e.ciudad)) : Object.values(geografia[pais] || {}).flat()
  return geografia[pais]?.[depto] || unicos(eventos.filter(e => e.departamento === depto).map(e => e.ciudad))
}
function llenarFiltros({ pais, depto, ciudad, estado }) {
  CoberturaView.opciones('f-pais', Object.keys(geografia), pais)
  CoberturaView.opciones('f-depto', opcionesDepartamento(pais), depto)
  CoberturaView.opciones('f-ciudad', opcionesCiudad(pais, depto), ciudad)
  CoberturaView.opciones('f-estado', ESTADOS, estado)
  CoberturaView.etiquetaPadre('f-depto', 'Departamento', pais)
  CoberturaView.etiquetaPadre('f-ciudad', 'Ciudad', depto)
}

// ── Tabla filtrada y paginada ───────────────────────────────────────────────
function filtrados() {
  const { pais, depto, ciudad, estado } = aplicados
  return eventos.filter(e =>
    (pais === TODOS || e.pais === pais) && (depto === TODOS || e.departamento === depto) &&
    (ciudad === TODOS || e.ciudad === ciudad) && (estado === TODOS || e.estado === estado))
}
function dibujarTabla() {
  const lista = filtrados()
  pagina = Math.min(pagina, Math.max(1, Math.ceil(lista.length / POR_PAGINA)))
  CoberturaView.tabla(paginar(lista, pagina, POR_PAGINA), POR_PAGINA, lista.length)
  CoberturaView.paginacion(pagina, lista.length, POR_PAGINA)
  CoberturaView.filtrosActivos(Object.values(aplicados))
}

function limpiar() {
  aplicados = { pais: TODOS, depto: TODOS, ciudad: TODOS, estado: TODOS }
  pagina = 1
  llenarFiltros(aplicados)
  dibujarTabla()
}

function conectar() {
  document.getElementById('f-pais').addEventListener('change', () =>
    llenarFiltros({ pais: valor('f-pais'), depto: TODOS, ciudad: TODOS, estado: valor('f-estado') }))
  document.getElementById('f-depto').addEventListener('change', () =>
    llenarFiltros({ pais: valor('f-pais'), depto: valor('f-depto'), ciudad: TODOS, estado: valor('f-estado') }))

  document.getElementById('form-filtros').addEventListener('submit', (e) => {
    e.preventDefault()
    aplicados = { pais: valor('f-pais'), depto: valor('f-depto'), ciudad: valor('f-ciudad'), estado: valor('f-estado') }
    pagina = 1
    dibujarTabla()
  })
  document.getElementById('limpiar-filtros').addEventListener('click', limpiar)

  document.getElementById('paginacion').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-pagina]')
    if (!boton || boton.disabled) return
    pagina = Number(boton.dataset.pagina)
    dibujarTabla()
  })
  document.getElementById('tabla-eventos').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-detalle]')
    if (!boton) return
    const evento = eventos.find(ev => ev.nombre === boton.dataset.detalle)
    abrirModal(CoberturaView.modalDetalle(evento), { clase: 'modal--lg' })
  })
}

async function cargar() {
  const datos = await ReporteModel.cobertura()
  eventos = datos.eventos
  geografia = datos.geografia
  CoberturaView.mostrar(eventos)
  llenarFiltros(aplicados)
  conectar()
  dibujarTabla()
}

await iniciarAdmin('cobertura', { alActualizar: cargar, alCambiarPeriodo: cargar })
document.getElementById('boton-limpiar-todo').addEventListener('click', limpiar)
cargar()
