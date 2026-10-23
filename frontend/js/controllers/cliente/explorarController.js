// js/controllers/cliente/explorarController.js
// CONTROLADOR de "Explorar eventos" (catálogo del cliente - Sprint 2, Tarea 4).
//
// ¿Quién filtra qué?
//   - Ubicación (país, departamento, ciudad) y rango de fechas -> los filtra
//     PostgreSQL: se vuelve a pedir GET /api/eventos/catalogo con esos filtros.
//   - Búsqueda por texto y estado -> se filtran aquí en el navegador sobre la
//     lista que ya llegó, para que respondan al instante mientras se escribe.

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ExplorarView } from '../../views/cliente/explorarView.js'

const filtros = {
  buscar: document.getElementById('buscar'),
  pais: document.getElementById('filtro-pais'),
  departamento: document.getElementById('filtro-departamento'),
  ciudad: document.getElementById('filtro-ciudad'),
  desde: document.getElementById('filtro-desde'),
  hasta: document.getElementById('filtro-hasta'),
  estado: document.getElementById('filtro-estado'),
}

let eventos = []          // lo último que respondió el servidor
let ciudades = []         // ciudades que tienen eventos disponibles
let ultimaPeticion = 0    // evita que una respuesta vieja pise a una más nueva

function hayFiltros() {
  return Object.values(filtros).some(f => f.value)
}

// ─── Selects encadenados País -> Departamento -> Ciudad ─────────────────────
// Se arman con la lista de /api/eventos/catalogo/ciudades (sin repetir valores).
function unicos(lista, clave, texto) {
  const vistos = new Map()
  lista.forEach(c => { if (!vistos.has(c[clave])) vistos.set(c[clave], { valor: c[clave], texto: c[texto] }) })
  return [...vistos.values()]
}

function llenarPaises() {
  ExplorarView.llenarSelect('filtro-pais', 'País', unicos(ciudades, 'id_pais', 'nombre_pais'))
}

function llenarDepartamentos() {
  const idPais = filtros.pais.value
  const lista = idPais ? ciudades.filter(c => String(c.id_pais) === idPais) : []
  ExplorarView.llenarSelect('filtro-departamento', 'Departamento',
    unicos(lista, 'id_departamento', 'nombre_departamento'), { deshabilitar: !idPais })
}

function llenarCiudades() {
  const idDepto = filtros.departamento.value
  const lista = idDepto ? ciudades.filter(c => String(c.id_departamento) === idDepto) : []
  ExplorarView.llenarSelect('filtro-ciudad', 'Ciudad',
    unicos(lista, 'id_ciudad', 'nombre_ciudad'), { deshabilitar: !idDepto })
}

// ─── Filtros que van al servidor ────────────────────────────────────────────
function fechasValidas() {
  // El campo "Hasta" no deja elegir días antes de "Desde"
  filtros.hasta.min = filtros.desde.value || ''
  if (filtros.desde.value && filtros.hasta.value && filtros.desde.value > filtros.hasta.value) {
    ExplorarView.mostrarErrorFechas('La fecha "Desde" no puede ser posterior a la fecha "Hasta".')
    return false
  }
  ExplorarView.mostrarErrorFechas('')
  return true
}

async function consultarCatalogo() {
  if (!fechasValidas()) return

  const numero = ++ultimaPeticion
  ExplorarView.mostrarCargando()
  try {
    const resultado = await EventoModel.obtenerCatalogo({
      id_pais: filtros.pais.value,
      id_departamento: filtros.departamento.value,
      id_ciudad: filtros.ciudad.value,
      fecha_desde: filtros.desde.value,
      fecha_hasta: filtros.hasta.value,
    })
    if (numero !== ultimaPeticion) return // llegó tarde: ya hay una consulta más nueva
    eventos = resultado
    aplicarFiltrosLocales()
  } catch (error) {
    if (numero !== ultimaPeticion) return
    ExplorarView.mostrarError(error.message || 'No se pudo cargar el catálogo de eventos.')
  }
}

// ─── Filtros que se aplican en el navegador ─────────────────────────────────
function aplicarFiltrosLocales() {
  const q = filtros.buscar.value.trim().toLowerCase()
  const resultado = eventos.filter(e =>
    (!q || [e.nombre, e.descripcion, e.teatro, e.ciudad].some(t => (t || '').toLowerCase().includes(q))) &&
    (!filtros.estado.value || e.estado === filtros.estado.value)
  )
  ExplorarView.mostrarEventos(resultado, hayFiltros())
  document.getElementById('limpiar-busqueda').hidden = !filtros.buscar.value
}

function limpiarFiltros() {
  Object.values(filtros).forEach(f => { f.value = '' })
  llenarDepartamentos()
  llenarCiudades()
  consultarCatalogo()
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()

  try {
    ciudades = await EventoModel.obtenerCiudadesCatalogo()
  } catch {
    ciudades = [] // si falla, el catálogo igual se muestra sin filtros de ubicación
  }
  llenarPaises()
  await consultarCatalogo()

  // Ubicación: al cambiar un nivel se reinician los niveles de abajo
  filtros.pais.addEventListener('change', () => {
    filtros.departamento.value = ''
    filtros.ciudad.value = ''
    llenarDepartamentos()
    llenarCiudades()
    consultarCatalogo()
  })
  filtros.departamento.addEventListener('change', () => {
    filtros.ciudad.value = ''
    llenarCiudades()
    consultarCatalogo()
  })
  filtros.ciudad.addEventListener('change', consultarCatalogo)

  // Rango de fechas
  filtros.desde.addEventListener('change', consultarCatalogo)
  filtros.hasta.addEventListener('change', consultarCatalogo)

  // Búsqueda y estado (instantáneos)
  filtros.buscar.addEventListener('input', aplicarFiltrosLocales)
  filtros.estado.addEventListener('change', aplicarFiltrosLocales)

  document.getElementById('limpiar-busqueda').addEventListener('click', () => { filtros.buscar.value = ''; aplicarFiltrosLocales() })
  document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros)
  document.getElementById('resultados').addEventListener('click', (e) => {
    if (e.target.closest('[data-accion="limpiar-filtros"]')) limpiarFiltros()
  })
}

iniciar()