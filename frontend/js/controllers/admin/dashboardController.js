// js/controllers/admin/dashboardController.js
// CONTROLADOR del dashboard del administrador.

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { DashboardView } from '../../views/admin/dashboardView.js'

async function cargar() {
  const datos = await ReporteModel.dashboard()
  DashboardView.mostrar(datos, periodoActual())
}

await iniciarAdmin('dashboard', { alActualizar: cargar, alCambiarPeriodo: cargar })
cargar()
