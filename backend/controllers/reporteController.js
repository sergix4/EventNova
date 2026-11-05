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

// Árbol país → departamentos → ciudades con el NÚMERO DE EVENTOS de cada
// nivel. El frontend lo usa para los filtros encadenados y las gráficas.
function arbolGeografico(eventos) {
  const paises = new Map();
  eventos.forEach((e) => {
    if (!paises.has(e.id_pais)) {
      paises.set(e.id_pais, { id: e.id_pais, nombre: e.pais, eventos: 0, departamentos: new Map() });
    }
    const pais = paises.get(e.id_pais);
    pais.eventos++;

    if (!pais.departamentos.has(e.id_departamento)) {
      pais.departamentos.set(e.id_departamento, { id: e.id_departamento, nombre: e.departamento, eventos: 0, ciudades: new Map() });
    }
    const depto = pais.departamentos.get(e.id_departamento);
    depto.eventos++;

    if (!depto.ciudades.has(e.id_ciudad)) {
      depto.ciudades.set(e.id_ciudad, { id: e.id_ciudad, nombre: e.ciudad, eventos: 0 });
    }
    depto.ciudades.get(e.id_ciudad).eventos++;
  });

  // De mayor a menor número de eventos (y por nombre si empatan)
  const ordenar = (lista) => lista.sort((a, b) => b.eventos - a.eventos || a.nombre.localeCompare(b.nombre));
  return ordenar([...paises.values()].map((p) => ({
    ...p,
    departamentos: ordenar([...p.departamentos.values()].map((d) => ({
      ...d,
      ciudades: ordenar([...d.ciudades.values()]),
    }))),
  })));
}

// GET /api/reportes/cobertura?anio=2026   (o ?anio=todos)
// Listado de eventos (código, nombre, estado, fecha...) con su país,
// departamento y ciudad, el árbol geográfico con el conteo por nivel y
// un resumen. El año es el de REALIZACIÓN del evento (fecha_inicio).
async function cobertura(req, res) {
  let anio = null; // null = todos los años
  if (req.query.anio !== 'todos') {
    const lectura = leerAnio(req.query);
    if (lectura.error) return res.status(400).json({ error: lectura.error });
    anio = lectura.anio;
  }

  try {
    const [eventos, anios] = await Promise.all([
      ReporteModel.eventosCobertura(anio),
      ReporteModel.aniosEventos(),
    ]);

    const geografia = arbolGeografico(eventos);
    const contar = (estados) => eventos.filter((e) => estados.includes(e.estado)).length;

    res.json({
      anio: anio ?? 'todos',
      anios,
      resumen: {
        paises: geografia.length,
        departamentos: geografia.reduce((t, p) => t + p.departamentos.length, 0),
        ciudades: geografia.reduce((t, p) => t + p.departamentos.reduce((s, d) => s + d.ciudades.length, 0), 0),
        totalEventos: eventos.length,
        activos: contar(['Programado', 'En Boletería', 'En Vivo']),
        finalizados: contar(['Finalizado']),
        cancelados: contar(['Cancelado']),
        reservas: eventos.reduce((t, e) => t + e.reservas, 0),
      },
      geografia,
      eventos,
    });
  } catch (err) {
    console.error('Error al generar el reporte de cobertura:', err.message);
    res.status(500).json({ error: 'No se pudo cargar el reporte de cobertura.' });
  }
}

// Arma la "Actividad reciente" del reporte de operación con las últimas
// reservas nuevas, reservas canceladas, entradas canceladas y eventos cancelados.
// Las fechas vienen como 'YYYY-MM-DD HH24:MI', así que se ordenan como texto.
function actividadOperacion({ reservas, parciales, eventosCancelados }, limite = 12) {
  const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? '' : 's'}`;
  const lista = [
    ...reservas.map((r) => ({
      tipo: 'reserva-nueva', fecha: r.fecha_reserva, usuario: r.cliente, estado: r.estado,
      descripcion: `${r.cliente} reservó ${plural(r.entradas + r.entradas_canceladas, 'entrada')} para ${r.evento} (${r.codigo})`,
    })),
    ...reservas.filter((r) => r.fecha_cancelacion).map((r) => ({
      tipo: 'reserva-cancelada', fecha: r.fecha_cancelacion, usuario: r.cancelada_por || 'Sin registro', estado: 'Cancelada',
      descripcion: `Se canceló la reserva ${r.codigo} de ${r.cliente} para ${r.evento}`,
    })),
    ...parciales.map((p) => ({
      tipo: 'entradas-canceladas', fecha: p.fecha_cancelacion, usuario: p.cancelada_por, estado: 'Parcial',
      descripcion: `Se ${p.entradas_canceladas === 1 ? 'canceló' : 'cancelaron'} ${p.entradas_canceladas} de ${p.entradas_antes} entradas de la reserva ${p.codigo} (${p.cliente})`,
    })),
    ...eventosCancelados.filter((e) => e.fecha_cancelacion).map((e) => ({
      tipo: 'evento-cancelado', fecha: e.fecha_cancelacion, usuario: e.agente, estado: 'Cancelado',
      descripcion: `${e.nombre} (${e.codigo}) fue cancelado · ${plural(e.reservas_afectadas, 'reserva')} afectada${e.reservas_afectadas === 1 ? '' : 's'}`,
    })),
  ];
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, limite);
}

// GET /api/reportes/operacion?anio=2026   (o ?anio=todos)
// Reporte de reservas y operación:
//   10.1 historial de reservas por cliente (todas las reservas del período)
//   10.2 reservas canceladas con causa, fecha y quién canceló + cancelaciones parciales
//   10.3 eventos cancelados con su causa y las reservas afectadas
// Período: reservas por el año en que se HICIERON; eventos por el año en que se REALIZAN.
async function operacion(req, res) {
  let anio = null; // null = todos los años
  if (req.query.anio !== 'todos') {
    const lectura = leerAnio(req.query);
    if (lectura.error) return res.status(400).json({ error: lectura.error });
    anio = lectura.anio;
  }

  try {
    const [reservas, parciales, eventosCancelados, eventos, aniosReservas, aniosEventos] = await Promise.all([
      ReporteModel.reservasOperacion(anio),
      ReporteModel.cancelacionesParciales(anio),
      ReporteModel.eventosCancelados(anio),
      ReporteModel.resumenEventos(anio),
      ReporteModel.aniosDisponibles(),
      ReporteModel.aniosEventos(),
    ]);

    const contar = (estado) => reservas.filter((r) => r.estado === estado).length;
    const canceladas = reservas.filter((r) => r.estado === 'Cancelada');

    res.json({
      anio: anio ?? 'todos',
      // Años de reservas + años de eventos, sin repetir y de mayor a menor
      anios: [...new Set([...aniosReservas, ...aniosEventos])].sort((a, b) => b - a),
      resumen: {
        reservas: {
          total: reservas.length,
          reservadas: contar('Reservada'),
          confirmadas: contar('Confirmada'),
          canceladas: canceladas.length,
          valorCancelado: canceladas.reduce((t, r) => t + r.valor, 0),
          parciales: parciales.length,
          entradasParciales: parciales.reduce((t, p) => t + p.entradas_canceladas, 0),
          valorParcial: parciales.reduce((t, p) => t + p.valor, 0),
        },
        eventos,
      },
      reservas,
      parciales,
      eventosCancelados,
      actividad: actividadOperacion({ reservas, parciales, eventosCancelados }),
    });
  } catch (err) {
    console.error('Error al generar el reporte de operación:', err.message);
    res.status(500).json({ error: 'No se pudo cargar el reporte de reservas y operación.' });
  }
}

module.exports = { dashboard, generales, comerciales, cobertura, operacion };


