// controllers/reporteController.js
// CONTROLADOR de reportes (Sprint 3): recibe la petición del administrador,
// pide los datos al Modelo y responde en JSON listo para graficar.
const ReporteModel = require('../models/reporteModel');

// Lee ?anio=2026 de la URL. Si no viene o no es válido, usa el año actual.
function leerAnio(query) {
  const actual = new Date().getFullYear();
  const anio = Number(query.anio ?? actual);
  if (!Number.isInteger(anio) || anio < 2000 || anio > actual + 5) {
    return { error: 'El año del período no es válido.' };
  }
  return { anio };
}

// GET /api/reportes/dashboard?anio=2026
// Todo lo que necesita el dashboard del administrador en UNA sola petición.
async function dashboard(req, res) {
  const { anio, error } = leerAnio(req.query);
  if (error) return res.status(400).json({ error });

  try {
    // Las consultas no dependen unas de otras: se lanzan todas a la vez
    const [
      totales, ingresosMes, ingresosAnterior, ingresosConfirmadosMes,
      reservasMes, eventosMes, eventosAnterior, resumen,
      cobertura, actividad, anios,
    ] = await Promise.all([
      ReporteModel.totales(),
      ReporteModel.ingresosPorMes(anio),
      ReporteModel.ingresosPorMes(anio - 1),
      ReporteModel.ingresosConfirmadosPorMes(anio),
      ReporteModel.reservasPorMes(anio),
      ReporteModel.eventosPorMes(anio),
      ReporteModel.eventosPorMes(anio - 1),
      ReporteModel.resumenReservas(anio),
      ReporteModel.cobertura(),
      ReporteModel.actividadReciente(8),
      ReporteModel.aniosDisponibles(),
    ]);

    const sumar = (lista) => lista.reduce((a, b) => a + b, 0);

    res.json({
      anio,
      anios,
      totales,
      ingresosMes,
      ingresosConfirmadosMes,
      reservasMes,
      eventosMes,
      // Totales del año anterior, para el "↑ X% vs. año anterior"
      comparacion: {
        ingresosAnterior: sumar(ingresosAnterior),
        eventosAnterior: sumar(eventosAnterior),
      },
      resumen,
      cobertura,
      actividad,
    });
  } catch (err) {
    console.error('Error al generar el dashboard:', err.message);
    res.status(500).json({ error: 'No se pudieron cargar las estadísticas del dashboard.' });
  }
}

module.exports = { dashboard };