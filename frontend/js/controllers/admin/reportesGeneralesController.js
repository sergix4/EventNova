// js/controllers/admin/reportesGeneralesController.js
// CONTROLADOR de "Reportes generales": pide al Modelo el reporte REAL del año
// elegido (GET /api/reportes/generales), se lo pasa a la Vista y maneja los
// filtros de la tabla "Últimos registros".
// Se vuelve a cargar al cambiar el período o al pulsar "Actualizar datos".

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { ReportesGeneralesView, TIPOS_REGISTRO } from '../../views/admin/reportesGeneralesView.js'

let registros = []

function filtrar() {
  const tipo = document.getElementById('filtro-tipo').value
  const estado = document.getElementById('filtro-estado').value
  const lista = registros.filter(r =>
    (tipo === 'Todos' || TIPOS_REGISTRO[r.tipo]?.texto === tipo) &&
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
  const anio = periodoActual()
  try {
    const datos = await ReporteModel.generales(anio)
    registros = datos.ultimosRegistros
    ReportesGeneralesView.mostrarPeriodos(datos.anios, datos.anio)
    ReportesGeneralesView.mostrar(datos)
    conectarFiltros()
    filtrar()
  } catch (error) {
    ReportesGeneralesView.mostrarError(error.message)
  }
}

await iniciarAdmin('reportes-generales', { alActualizar: cargar, alCambiarPeriodo: cargar })
ReportesGeneralesView.mostrarCargando()
cargar()