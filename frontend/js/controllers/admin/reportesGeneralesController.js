// js/controllers/admin/reportesGeneralesController.js
// CONTROLADOR de "Reportes generales": carga los datos y maneja los filtros
// de la tabla "Últimos registros".

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { ReportesGeneralesView, TIPOS_REGISTRO } from '../../views/admin/reportesGeneralesView.js'

let registros = []

function filtrar() {
  const tipo = document.getElementById('filtro-tipo').value
  const estado = document.getElementById('filtro-estado').value
  const lista = registros.filter(r =>
    (tipo === 'Todos' || TIPOS_REGISTRO[r.type].texto === tipo) &&
    (estado === 'Todos' || r.estado === estado))
  ReportesGeneralesView.registros(lista, registros.length, tipo !== 'Todos' || estado !== 'Todos')
}

function conectarFiltros() {
  document.getElementById('filtro-tipo').addEventListener('change', filtrar)
  document.getElementById('filtro-estado').addEventListener('change', filtrar)
  document.getElementById('limpiar-filtros').addEventListener('click', () => {
    document.getElementById('filtro-tipo').value = 'Todos'
    document.getElementById('filtro-estado').value = 'Todos'
    filtrar()
  })
}

async function cargar() {
  const datos = await ReporteModel.generales()
  registros = datos.ultimosRegistros
  ReportesGeneralesView.mostrar(datos, periodoActual())
  conectarFiltros()
  filtrar()
}

await iniciarAdmin('reportes-generales', { alActualizar: cargar, alCambiarPeriodo: cargar })
cargar()
