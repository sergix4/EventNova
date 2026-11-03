// js/controllers/admin/reportesComercialesController.js
// CONTROLADOR de "Reportes comerciales": pide al Modelo los reportes REALES
// del año elegido (GET /api/reportes/comerciales), se los pasa a la Vista y
// maneja los filtros: mes (gráfica de ingresos), agente/ciudad (tabla de
// agentes), evento (tabla mensual) y agente/ciudad/departamento (tabla 8.4).
// Se vuelve a cargar al cambiar el período o al pulsar "Actualizar datos".

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { ReportesComercialesView } from '../../views/admin/reportesComercialesView.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const MESES_LARGOS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
let datos = null

const valor = (id) => document.getElementById(id).value
const coincide = (filtro, dato) => filtro === 'Todos' || filtro === String(dato)

// ─── Filtros ────────────────────────────────────────────────────────────────
function filtrarMes() {
  ReportesComercialesView.graficaIngresos(datos.ingresosMes, MESES_LARGOS.indexOf(valor('mes')))
}

function filtrarAgentes() {
  const agente = valor('f-agente'), ciudad = valor('f-ciudad')
  document.getElementById('f-limpiar').hidden = agente === 'Todos' && ciudad === 'Todos'
  ReportesComercialesView.agentes(
    datos.agentes.filter(a => coincide(agente, a.id) && coincide(ciudad, a.ciudad)),
    datos.resumen.promedioPorAgente,
  )
}

function filtrarEventos() {
  ReportesComercialesView.reservasPorEvento(datos.reservasPorEvento.filter(e => coincide(valor('f-evento'), e.codigo)))
}

function filtrarAgenteCiudad() {
  const agente = valor('f5-agente'), ciudad = valor('f5-ciudad'), depto = valor('f5-depto')
  ReportesComercialesView.agenteCiudad(datos.porAgenteYCiudad.filter(r =>
    coincide(agente, r.id_agente) && coincide(ciudad, r.ciudad) && coincide(depto, r.departamento)))
}

function conectarFiltros() {
  ;['f-agente', 'f-ciudad'].forEach(id => document.getElementById(id).addEventListener('change', filtrarAgentes))
  document.getElementById('f-limpiar').addEventListener('click', () => {
    document.getElementById('f-agente').value = 'Todos'
    document.getElementById('f-ciudad').value = 'Todos'
    filtrarAgentes()
  })
  document.getElementById('f-evento').addEventListener('change', filtrarEventos)
  ;['f5-agente', 'f5-ciudad', 'f5-depto'].forEach(id => document.getElementById(id).addEventListener('change', filtrarAgenteCiudad))
}

// ─── Carga de datos ─────────────────────────────────────────────────────────
async function cargar() {
  const anio = periodoActual()
  try {
    datos = await ReporteModel.comerciales(anio)
    ReportesComercialesView.mostrarPeriodos(datos.anios, datos.anio)
    // Los filtros se dibujan de nuevo con cada carga (los agentes y eventos cambian con el año)
    ReportesComercialesView.filtros(datos.agentes)
    ReportesComercialesView.mostrar(datos)
    conectarFiltros()
    filtrarMes()
    filtrarAgentes()
    ReportesComercialesView.clientes(datos.clientes, datos.resumen.promedioPorCliente)
    filtrarEventos()
    filtrarAgenteCiudad()
  } catch (error) {
    datos = null
    ReportesComercialesView.mostrarError(error.message)
  }
}

await iniciarAdmin('reportes-comerciales', { alActualizar: cargar, alCambiarPeriodo: cargar })
document.getElementById('mes').addEventListener('change', () => { if (datos) filtrarMes() })
document.getElementById('boton-exportar').addEventListener('click', () =>
  mostrarToast('La exportación de reportes estará disponible en un próximo sprint.', { duracion: 2500 }))
ReportesComercialesView.mostrarCargando()
cargar()