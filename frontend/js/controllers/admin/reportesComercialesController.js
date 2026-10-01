// js/controllers/admin/reportesComercialesController.js
// CONTROLADOR de "Reportes comerciales": filtros generales, filtro por mes,
// filtro por evento y filtros de la tabla de agentes por ciudad.

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { ReportesComercialesView } from '../../views/admin/reportesComercialesView.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const MESES_LARGOS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
let datos = null
const valor = (id) => document.getElementById(id).value
const coincide = (filtro, dato) => filtro === 'Todos' || filtro === dato

function filtrarAgentes() {
  const agente = valor('f-agente'), ciudad = valor('f-ciudad'), estado = valor('f-estado')
  document.getElementById('f-limpiar').hidden = agente === 'Todos' && ciudad === 'Todos' && estado === 'Todos'
  ReportesComercialesView.agentes(datos.agentes.filter(a => coincide(agente, a.nombre) && coincide(ciudad, a.ciudad)))
}

function filtrarEventos() {
  ReportesComercialesView.reservasPorEvento(datos.reservasPorEvento.filter(e => coincide(valor('f-evento'), e.evento)))
}

function filtrarAgenteCiudad() {
  const agente = valor('f5-agente'), ciudad = valor('f5-ciudad'), depto = valor('f5-depto')
  ReportesComercialesView.agenteCiudad(datos.porAgenteYCiudad.filter(r =>
    coincide(agente, r.agente) && coincide(ciudad, r.ciudad) && coincide(depto, r.departamento)))
}

function filtrarMes() {
  ReportesComercialesView.graficaIngresos(datos.ingresosMes, MESES_LARGOS.indexOf(valor('mes')))
}

async function cargar() {
  datos = await ReporteModel.comerciales()
  // Se conservan los filtros generales al actualizar
  if (!document.getElementById('f-agente')) {
    ReportesComercialesView.filtros(datos.agentes)
    ;['f-agente', 'f-ciudad', 'f-estado'].forEach(id => document.getElementById(id).addEventListener('change', filtrarAgentes))
    document.getElementById('f-limpiar').addEventListener('click', () => {
      ;['f-agente', 'f-ciudad', 'f-estado'].forEach(id => { document.getElementById(id).value = 'Todos' })
      filtrarAgentes()
    })
  }
  ReportesComercialesView.mostrar(datos, periodoActual())
  document.getElementById('f-evento').addEventListener('change', filtrarEventos)
  ;['f5-agente', 'f5-ciudad', 'f5-depto'].forEach(id => document.getElementById(id).addEventListener('change', filtrarAgenteCiudad))
  filtrarMes(); filtrarAgentes(); filtrarEventos(); filtrarAgenteCiudad()
}

await iniciarAdmin('reportes-comerciales', { alActualizar: cargar, alCambiarPeriodo: cargar })
document.getElementById('mes').addEventListener('change', filtrarMes)
document.getElementById('boton-exportar').addEventListener('click', () =>
  mostrarToast('La exportación de reportes estará disponible en un próximo sprint.', { duracion: 2500 }))
cargar()
