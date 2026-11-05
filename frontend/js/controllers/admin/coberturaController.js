// js/controllers/admin/coberturaController.js
// CONTROLADOR de "Cobertura y eventos": pide al Modelo el reporte REAL del
// período elegido (GET /api/reportes/cobertura), se lo pasa a la Vista y maneja
// los filtros encadenados (país → departamento → ciudad + estado), la
// paginación y el modal de detalle.
// Los filtros trabajan con los ID (id_pais, id_departamento, id_ciudad) para
// no confundir lugares que se llaman igual (ej. Panamá país y Panamá provincia).

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { CoberturaView, ESTADOS } from '../../views/admin/coberturaView.js'
import { abrirModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'

const POR_PAGINA = 8
const TODOS = 'Todos'
const sinFiltros = () => ({ pais: TODOS, depto: TODOS, ciudad: TODOS, estado: TODOS, nombres: [] })

let datos = null          // respuesta del backend: { anio, anios, resumen, geografia, eventos }
let aplicados = sinFiltros()
let pagina = 1

const valor = (id) => document.getElementById(id).value
const buscar = (lista, id) => lista.find(x => String(x.id) === String(id))
const coincide = (filtro, dato) => filtro === TODOS || filtro === String(dato)
/** { id, nombre, eventos } → opción del select con el conteo: "Colombia (18)" */
const opcion = (n, nombre = n.nombre) => ({ valor: n.id, nombre, texto: `${nombre} (${n.eventos})` })

// ── Opciones en cascada (salen del árbol geográfico del backend) ────────────
function departamentosDe(pais) {
  if (pais !== TODOS) return buscar(datos.geografia, pais)?.departamentos || []
  // Sin país elegido: todos los departamentos, con el país para no confundirlos
  return datos.geografia
    .flatMap(p => p.departamentos.map(d => ({ ...d, nombre: `${d.nombre} · ${p.nombre}` })))
    .sort((a, b) => b.eventos - a.eventos || a.nombre.localeCompare(b.nombre))
}

function ciudadesDe(pais, depto) {
  const departamentos = departamentosDe(pais)
  const lista = depto !== TODOS
    ? buscar(departamentos, depto)?.ciudades || []
    : departamentos.flatMap(d => d.ciudades)
  return [...lista].sort((a, b) => b.eventos - a.eventos || a.nombre.localeCompare(b.nombre))
}

function llenarFiltros({ pais, depto, ciudad, estado }) {
  const conteoEstado = (e) => datos.eventos.filter(ev => ev.estado === e).length
  CoberturaView.opciones('f-pais', datos.geografia.map(p => opcion(p)), pais)
  CoberturaView.opciones('f-depto', departamentosDe(pais).map(d => opcion(d)), depto)
  CoberturaView.opciones('f-ciudad', ciudadesDe(pais, depto).map(c => opcion(c)), ciudad)
  CoberturaView.opciones('f-estado', ESTADOS.map(e => ({ valor: e, nombre: e, texto: `${e} (${conteoEstado(e)})` })), estado)
  CoberturaView.etiquetaPadre('f-depto', 'Departamento', buscar(datos.geografia, pais)?.nombre)
  CoberturaView.etiquetaPadre('f-ciudad', 'Ciudad', buscar(departamentosDe(pais), depto)?.nombre)
}

// ── Tabla filtrada y paginada ───────────────────────────────────────────────
function filtrados() {
  const { pais, depto, ciudad, estado } = aplicados
  return datos.eventos.filter(e =>
    coincide(pais, e.id_pais) && coincide(depto, e.id_departamento) &&
    coincide(ciudad, e.id_ciudad) && coincide(estado, e.estado))
}

function dibujarTabla() {
  const lista = filtrados()
  pagina = Math.min(pagina, Math.max(1, Math.ceil(lista.length / POR_PAGINA)))
  CoberturaView.tabla(paginar(lista, pagina, POR_PAGINA), lista.length)
  CoberturaView.paginacion(pagina, lista.length, POR_PAGINA)
  CoberturaView.filtrosActivos(aplicados.nombres)
}

function limpiar() {
  if (!datos) return
  aplicados = sinFiltros()
  pagina = 1
  llenarFiltros(aplicados)
  dibujarTabla()
}

/** Nombre (sin el conteo) de la opción elegida en un select */
const nombreElegido = (id) => document.getElementById(id).selectedOptions[0]?.dataset.nombre || TODOS

function conectar() {
  // Al cambiar el país se reinician departamento y ciudad; al cambiar el departamento, la ciudad
  document.getElementById('f-pais').addEventListener('change', () =>
    llenarFiltros({ pais: valor('f-pais'), depto: TODOS, ciudad: TODOS, estado: valor('f-estado') }))
  document.getElementById('f-depto').addEventListener('change', () =>
    llenarFiltros({ pais: valor('f-pais'), depto: valor('f-depto'), ciudad: TODOS, estado: valor('f-estado') }))

  document.getElementById('form-filtros').addEventListener('submit', (e) => {
    e.preventDefault()
    const ids = ['f-pais', 'f-depto', 'f-ciudad', 'f-estado']
    aplicados = {
      pais: valor('f-pais'), depto: valor('f-depto'), ciudad: valor('f-ciudad'), estado: valor('f-estado'),
      nombres: ids.map(nombreElegido).filter(n => n !== TODOS),
    }
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
    const evento = datos.eventos.find(ev => ev.codigo === boton.dataset.detalle)
    if (evento) abrirModal(CoberturaView.modalDetalle(evento), { clase: 'modal--lg' })
  })
}

// ── Carga de datos ──────────────────────────────────────────────────────────
async function cargar() {
  try {
    datos = await ReporteModel.cobertura(periodoActual())
    CoberturaView.mostrarPeriodos(datos.anios, datos.anio)
    CoberturaView.mostrar(datos)
    // Con cada carga los lugares pueden cambiar: los filtros vuelven a "Todos"
    aplicados = sinFiltros()
    pagina = 1
    llenarFiltros(aplicados)
    conectar()
    dibujarTabla()
  } catch (error) {
    datos = null
    CoberturaView.mostrarError(error.message)
  }
}

await iniciarAdmin('cobertura', { alActualizar: cargar, alCambiarPeriodo: cargar })
document.getElementById('boton-limpiar-todo').addEventListener('click', limpiar)
CoberturaView.mostrarCargando()
cargar()