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

// GET /api/reportes/generales?anio=2026
// Reporte general: totales del sistema, reparto por estado, reservas y
// eventos por mes del año elegido y los últimos registros.
async function generales(req, res) {
  const { anio, error } = leerAnio(req.query);
  if (error) return res.status(400).json({ error });

  try {
    const [
      totales, eventosPorEstado, reservasPorEstado,
      reservasMes, eventosMes, ultimosRegistros, anios,
    ] = await Promise.all([
      ReporteModel.totales(),
      ReporteModel.eventosPorEstado(),
      ReporteModel.reservasPorEstado(),
      ReporteModel.reservasPorMes(anio),
      ReporteModel.eventosPorMes(anio),
      ReporteModel.ultimosRegistros(50),
      ReporteModel.aniosDisponibles(),
    ]);

    // Reservas del mes = confirmadas + pendientes + canceladas
    const reservasTotalesMes = reservasMes.confirmadas.map(
      (valor, i) => valor + reservasMes.pendientes[i] + reservasMes.canceladas[i],
    );

    res.json({
      anio,
      anios,
      totales,
      eventosPorEstado,
      reservasPorEstado,
      reservasEventosMes: { reservas: reservasTotalesMes, eventos: eventosMes },
      ultimosRegistros,
    });
  } catch (err) {
    console.error('Error al generar el reporte general:', err.message);
    res.status(500).json({ error: 'No se pudo cargar el reporte general.' });
  }
}

// GET /api/reportes/comerciales?anio=2026
// Reportes comerciales del año elegido:
//   8.1 ingresos por agente y por cliente (con el promedio general)
//   8.2 ingresos totales por mes
//   8.3 reservas por evento y por mes
//   8.4 eventos creados por agente y ciudad (histórico)
async function comerciales(req, res) {
  const { anio, error } = leerAnio(req.query);
  if (error) return res.status(400).json({ error });

  try {
    const [
      agentes, clientes, ingresosMes, ingresosAnterior,
      reservasPorEvento, reservasAnterior, porAgenteYCiudad, anios,
    ] = await Promise.all([
      ReporteModel.ingresosPorAgente(anio),
      ReporteModel.ingresosPorCliente(anio),
      ReporteModel.ingresosPorMes(anio),
      ReporteModel.ingresosPorMes(anio - 1),
      ReporteModel.reservasPorEventoMes(anio),
      ReporteModel.reservasPorMes(anio - 1),
      ReporteModel.eventosPorAgenteCiudad(),
      ReporteModel.aniosDisponibles(),
    ]);

    const sumar = (lista) => lista.reduce((a, b) => a + b, 0);
    const ingresosTotales = sumar(ingresosMes);

    // Promedio GENERAL = ingresos del año / número de agentes (o clientes) registrados
    const promedio = (total, cantidad) => (cantidad > 0 ? Math.round(total / cantidad) : 0);

    res.json({
      anio,
      anios,
      resumen: {
        ingresosTotales,
        promedioPorAgente: promedio(ingresosTotales, agentes.length),
        promedioPorCliente: promedio(ingresosTotales, clientes.length),
        totalReservas: sumar(reservasPorEvento.map((e) => e.total)),
        totalEventos: sumar(porAgenteYCiudad.map((f) => f.creados)),
        totalAgentes: agentes.length,
        totalClientes: clientes.length,
        clientesConCompras: clientes.filter((c) => c.reservas > 0).length,
      },
      // Totales del año anterior, para el "↑ X% vs. año anterior"
      comparacion: {
        ingresosAnterior: sumar(ingresosAnterior),
        reservasAnterior: sumar(reservasAnterior.confirmadas)
          + sumar(reservasAnterior.pendientes) + sumar(reservasAnterior.canceladas),
      },
      ingresosMes,
      agentes,
      clientes,
      reservasPorEvento,
      porAgenteYCiudad,
    });
  } catch (err) {
    console.error('Error al generar los reportes comerciales:', err.message);
    res.status(500).json({ error: 'No se pudieron cargar los reportes comerciales.' });
  }
}

module.exports = { dashboard, generales, comerciales };


