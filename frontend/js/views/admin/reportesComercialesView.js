// js/views/admin/reportesComercialesView.js
// VISTA de "Reportes comerciales" del administrador.
// Solo DIBUJA: recibe los datos REALES que el controlador trajo de
// GET /api/reportes/comerciales y los convierte en HTML y gráficas (Chart.js).
//   8.1 Promedio de ingresos por agente y por cliente
//   8.2 Ingresos totales por mes del año elegido
//   8.3 Número de reservas por evento y por mes
//   8.4 Eventos creados por agente y ciudad

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoLinea } from '../componentes/graficos.js'
import { esc, cop, num } from '../../utils/formato.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MESES_LARGOS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const TOP_CLIENTES = 10 // cuántos clientes se muestran en la gráfica

const sumar = (lista) => lista.reduce((a, b) => a + b, 0)
const corto = (nombre) => nombre.length > 22 ? nombre.slice(0, 22) + '…' : nombre
const promedio = (total, cantidad) => (cantidad > 0 ? total / cantidad : 0)

/** Valor corto para los ejes de las gráficas: 3500000 → "$3,5M", 450000 → "$450K" */
const compacto = (v) => v >= 1_000_000
  ? `$${(v / 1_000_000).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M`
  : v >= 1_000 ? `$${Math.round(v / 1_000)}K` : `$${v}`

/** Opciones de un <select>: acepta textos o { valor, texto } */
const opciones = (lista) => '<option value="Todos">Todos</option>' + lista
  .map(o => typeof o === 'string' ? { valor: o, texto: o } : o)
  .map(o => `<option value="${esc(o.valor)}">${esc(o.texto)}</option>`).join('')

const selectChico = (id, etiqueta, lista) =>
  `<div class="envoltura-select envoltura-select--chica"><select class="selector" id="${id}" aria-label="${etiqueta}">${opciones(lista)}</select></div>`

/** Quita repetidos de una lista de { valor, texto } y la ordena por texto */
const unicos = (lista) => [...new Map(lista.map(o => [o.valor, o])).values()]
  .sort((a, b) => a.texto.localeCompare(b.texto))

const chip = (valor, fondo, color) => `<span class="chip-numero" style="background:${fondo};color:${color}">${valor}</span>`
const sinResultados = (columnas, texto = 'Sin resultados.') => `<tr><td colspan="${columnas}" class="tabla__vacia">${esc(texto)}</td></tr>`
const sinDatos = (texto) => `<p class="mensaje-tarjeta-vacia">${esc(texto)}</p>`

/** Píldora de variación contra el año anterior: verde si sube, roja si baja */
function variacion(actual, anterior) {
  if (!anterior) return '<span class="kpi-admin__tendencia kpi-admin__tendencia--igual">Sin datos del año anterior</span>'
  const cambio = ((actual - anterior) / anterior) * 100
  const sube = cambio >= 0
  return `<span class="kpi-admin__tendencia kpi-admin__tendencia--${sube ? 'sube' : 'baja'}">${icono(sube ? 'tendenciaArriba' : 'tendenciaAbajo', 12)}${sube ? '+' : ''}${cambio.toFixed(1)}% vs. año anterior</span>`
}

function kpi({ etiqueta, sub, valor, icono: ic, color, fondo, tendencia = '' }) {
  return `
    <article class="kpi kpi--holgado" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono kpi__icono--grande">${icono(ic, 20)}</div>
        ${tendencia}
      </div>
      <div>
        <p class="kpi__valor kpi__valor--ajustado">${valor}</p>
        <p class="kpi__etiqueta kpi__etiqueta--fuerte">${etiqueta}</p>
        <p class="kpi__sub">${sub}</p>
      </div>
    </article>`
}

/** Mes con más ingresos: "Octubre · $ 3.540.000" (o "Sin ingresos") */
function mejorMes(ingresos) {
  const maximo = Math.max(...ingresos)
  if (maximo <= 0) return 'Sin ingresos'
  return `${MESES_LARGOS[ingresos.indexOf(maximo)]} · ${cop(maximo)}`
}

export const ReportesComercialesView = {
  /** Llena el selector de período con los años que tienen movimiento */
  mostrarPeriodos(anios, seleccionado) {
    const select = document.getElementById('periodo')
    if (!select) return
    select.innerHTML = anios
      .map(a => `<option value="${a}"${String(a) === String(seleccionado) ? ' selected' : ''}>${a}</option>`)
      .join('')
  },

  /** Mientras llegan los datos */
  mostrarCargando() {
    document.getElementById('contenido').innerHTML = sinDatos('Cargando reportes comerciales…')
  },

  /** Si la API responde con error (por ejemplo, se venció la sesión) */
  mostrarError(mensaje) {
    document.getElementById('barra-filtros').innerHTML = ''
    document.getElementById('contenido').innerHTML = `
      <div class="vacio">
        <p class="vacio__texto">${esc(mensaje)}</p>
      </div>`
  },

  /** Barra de filtros generales (debajo de la cabecera): filtra la tabla de agentes */
  filtros(agentes) {
    document.getElementById('barra-filtros').innerHTML = `
      <span class="etiqueta-filtros">${icono('filtro', 13)}Filtrar agentes:</span>
      ${selectChico('f-agente', 'Agente', agentes.map(a => ({ valor: a.id, texto: a.agente })))}
      ${selectChico('f-ciudad', 'Ciudad', unicos(agentes.map(a => ({ valor: a.ciudad, texto: a.ciudad }))))}
      <button type="button" class="boton-limpiar-mini" id="f-limpiar" hidden>${icono('cerrar', 12)}Limpiar filtros</button>`
  },

  mostrar(datos) {
    const { anio, resumen, comparacion, reservasPorEvento, porAgenteYCiudad: filas } = datos
    const ahora = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--4" aria-label="Indicadores comerciales">
        ${kpi({ etiqueta: `Ingresos totales ${anio}`, sub: 'Reservas no canceladas del año', valor: cop(resumen.ingresosTotales), icono: 'dolar', color: '#4f46e5', fondo: '#eef2ff', tendencia: variacion(resumen.ingresosTotales, comparacion.ingresosAnterior) })}
        ${kpi({ etiqueta: 'Promedio por agente', sub: `Ingresos ÷ ${num(resumen.totalAgentes)} agentes registrados`, valor: cop(resumen.promedioPorAgente), icono: 'maletin', color: '#f4845f', fondo: '#fff7f5' })}
        ${kpi({ etiqueta: 'Promedio por cliente', sub: `Ingresos ÷ ${num(resumen.totalClientes)} clientes registrados`, valor: cop(resumen.promedioPorCliente), icono: 'usuarios', color: '#059669', fondo: '#ecfdf5' })}
        ${kpi({ etiqueta: `Total de reservas ${anio}`, sub: 'Reservas registradas en el año', valor: num(resumen.totalReservas), icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff', tendencia: variacion(resumen.totalReservas, comparacion.reservasAnterior) })}
      </section>

      <!-- 8.2 Ingresos totales por mes -->
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Ingresos totales por mes en ${anio}</h2>
          <p class="tarjeta__subtitulo">Ingresos de todos los eventos (reservas no canceladas) · en pesos colombianos (COP)</p>
        </div></div>
        <div class="bloque-grafica bloque-grafica--sin-borde">
          <div class="grafica grafica--260"><canvas id="grafica-ingresos" aria-label="Ingresos por mes"></canvas></div>
        </div>
        <div class="resumen-ingresos">
          <div><small>Ingreso total del año ${anio}</small><strong>${cop(resumen.ingresosTotales)}</strong></div>
          <div class="texto-derecha"><small>Mejor mes</small><p class="mejor-mes">${mejorMes(datos.ingresosMes)}</p></div>
        </div>
      </section>

      <!-- 8.1 Promedio de ingresos por agente -->
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Promedio de ingresos por agente</h2>
          <p class="tarjeta__subtitulo">Ingresos de ${anio} por cada agente registrado · promedio general: <strong>${cop(resumen.promedioPorAgente)}</strong></p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Agente</th><th>Ciudad principal</th><th class="texto-centro">Eventos creados</th><th class="texto-centro">Reservas vendidas</th><th>Ingresos ${anio}</th><th>Promedio por reserva</th></tr></thead>
            <tbody id="tabla-agentes"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Ingresos por agente en ${anio}</p>
          <div class="grafica" id="caja-grafica-agentes"><canvas id="grafica-agentes" aria-label="Ingresos por agente"></canvas></div>
        </div>
      </section>

      <!-- 8.1 Promedio de ingresos por cliente -->
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Promedio de ingresos por cliente</h2>
          <p class="tarjeta__subtitulo">Lo que pagó cada cliente en ${anio} · ${num(resumen.clientesConCompras)} de ${num(resumen.totalClientes)} clientes compraron · promedio general: <strong>${cop(resumen.promedioPorCliente)}</strong></p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Cliente</th><th class="texto-centro">Reservas</th><th class="texto-centro">Entradas</th><th>Total pagado ${anio}</th><th>Promedio por reserva</th></tr></thead>
            <tbody id="tabla-clientes"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Los ${TOP_CLIENTES} clientes con más compras en ${anio}</p>
          <div class="grafica" id="caja-grafica-clientes"><canvas id="grafica-clientes" aria-label="Clientes con más compras"></canvas></div>
        </div>
      </section>

      <!-- 8.3 Reservas por evento y por mes -->
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera">
          <div>
            <h2 class="tarjeta__titulo">Reservas por evento y por mes en ${anio}</h2>
            <p class="tarjeta__subtitulo">Número de reservas registradas (incluidas las canceladas) para cada evento en cada mes</p>
          </div>
          <div class="filtros-cabecera">
            <span class="etiqueta-filtros">Evento:</span>
            ${selectChico('f-evento', 'Evento', reservasPorEvento.map(e => ({ valor: e.codigo, texto: `${e.codigo} · ${e.evento}` })))}
          </div>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla tabla-mensual">
            <thead><tr><th>Evento</th>${MESES.map(m => `<th>${m}</th>`).join('')}<th>Total</th></tr></thead>
            <tbody id="tabla-mensual"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Evolución de reservas durante ${anio}</p>
          <div class="grafica grafica--220"><canvas id="grafica-evolucion" aria-label="Evolución de reservas"></canvas></div>
        </div>
      </section>

      <!-- 8.4 Eventos creados por agente y ciudad -->
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera">
          <div>
            <h2 class="tarjeta__titulo">Eventos creados por agente y ciudad</h2>
            <p class="tarjeta__subtitulo">Histórico (todos los años) · activos = Programado, En Boletería o En Vivo</p>
          </div>
          <div class="filtros-cabecera">
            <span class="etiqueta-filtros">${icono('filtro', 13)}</span>
            ${selectChico('f5-agente', 'Agente', unicos(filas.map(r => ({ valor: r.id_agente, texto: r.agente }))))}
            ${selectChico('f5-ciudad', 'Ciudad', unicos(filas.map(r => ({ valor: r.ciudad, texto: r.ciudad }))))}
            ${selectChico('f5-depto', 'Departamento', unicos(filas.map(r => ({ valor: r.departamento, texto: r.departamento }))))}
          </div>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Agente</th><th>Ciudad</th><th>Departamento · País</th><th class="texto-centro">Eventos creados</th><th class="texto-centro">Activos</th><th class="texto-centro">Finalizados</th><th class="texto-centro">Cancelados</th></tr></thead>
            <tbody id="tabla-agente-ciudad"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Eventos creados por agente (todas sus ciudades)</p>
          <div class="grafica" id="caja-grafica-agente-ciudad"><canvas id="grafica-agente-ciudad" aria-label="Eventos por agente"></canvas></div>
        </div>
      </section>

      <section class="resumen-comercial">
        <div class="resumen-comercial__cabecera">
          <div><h2>Resumen comercial</h2><p>Consolidado del período · ${anio}</p></div>
          <span class="resumen-comercial__fecha">Última actualización: ${ahora}</span>
        </div>
        <div class="resumen-comercial__datos">
          <div><small>Ingresos totales</small><strong>${cop(resumen.ingresosTotales)}</strong></div>
          <div><small>Promedio por agente</small><strong>${cop(resumen.promedioPorAgente)}</strong></div>
          <div><small>Promedio por cliente</small><strong>${cop(resumen.promedioPorCliente)}</strong></div>
          <div><small>Total de reservas</small><strong>${num(resumen.totalReservas)}</strong></div>
        </div>
      </section>
      <div class="espacio-final"></div>`
  },

  /** 8.2 Gráfica de ingresos: los 12 meses o solo el mes elegido */
  graficaIngresos(ingresos, indiceMes) {
    const etiquetas = indiceMes >= 0 ? [MESES[indiceMes]] : MESES
    const valores = indiceMes >= 0 ? [ingresos[indiceMes]] : ingresos
    graficoBarras(document.getElementById('grafica-ingresos'), {
      etiquetas, radio: 5, separacion: 0.35,
      series: [{ nombre: 'Ingresos', datos: valores, color: '#4f46e5' }],
      formatoEje: compacto, formatoTooltip: (c) => ` Ingresos: ${cop(c.raw)}`,
    })
  },

  /** 8.1 Tabla y gráfica de ingresos por agente */
  agentes(lista, promedioGeneral) {
    document.getElementById('tabla-agentes').innerHTML = lista.length === 0 ? sinResultados(6, 'No hay agentes que coincidan con los filtros.') : lista.map(a => `
      <tr>
        <td><div class="celda-icono"><span class="inicial-cuadro" style="--color:#4f46e5">${esc(a.agente[0])}</span><div><strong>${esc(a.agente)}</strong><p class="texto-fecha">${esc(a.responsable)}</p></div></div></td>
        <td>${esc(a.ciudad)}</td>
        <td class="texto-centro texto-seminegrita">${num(a.eventos)}</td>
        <td class="texto-centro texto-seminegrita">${num(a.reservas)}</td>
        <td class="texto-negrita">${cop(a.ingresos)}</td>
        <td><span class="valor-indigo">${cop(promedio(a.ingresos, a.reservas))}</span></td>
      </tr>`).join('') + (lista.length > 0 ? `
      <tr class="fila-promedio">
        <td colspan="4">Promedio general por agente</td>
        <td colspan="2">${cop(promedioGeneral)}</td>
      </tr>` : '')

    document.getElementById('caja-grafica-agentes').style.height = Math.max(200, lista.length * 42) + 'px'
    graficoBarras(document.getElementById('grafica-agentes'), {
      etiquetas: lista.map(a => corto(a.agente)), horizontal: true, radio: 5, separacion: 0.8,
      series: [{ nombre: 'Ingresos', datos: lista.map(a => a.ingresos), color: '#4f46e5' }],
      formatoEje: compacto, formatoTooltip: (c) => ` Ingresos: ${cop(c.raw)}`,
    })
  },

  /** 8.1 Tabla y gráfica de ingresos por cliente */
  clientes(lista, promedioGeneral) {
    document.getElementById('tabla-clientes').innerHTML = lista.length === 0 ? sinResultados(5, 'No hay clientes registrados.') : lista.map(c => `
      <tr>
        <td><div class="celda-icono"><span class="inicial-cuadro" style="--color:#059669">${esc(c.cliente[0])}</span><div><strong>${esc(c.cliente)}</strong><p class="texto-fecha">${esc(c.correo)}</p></div></div></td>
        <td class="texto-centro texto-seminegrita">${num(c.reservas)}</td>
        <td class="texto-centro texto-seminegrita">${num(c.entradas)}</td>
        <td class="texto-negrita">${cop(c.ingresos)}</td>
        <td><span class="valor-indigo">${cop(promedio(c.ingresos, c.reservas))}</span></td>
      </tr>`).join('') + (lista.length > 0 ? `
      <tr class="fila-promedio">
        <td colspan="3">Promedio general por cliente</td>
        <td colspan="2">${cop(promedioGeneral)}</td>
      </tr>` : '')

    // En la gráfica solo los que compraron, máximo TOP_CLIENTES (ya vienen ordenados)
    const top = lista.filter(c => c.ingresos > 0).slice(0, TOP_CLIENTES)
    const caja = document.getElementById('caja-grafica-clientes')
    if (top.length === 0) {
      caja.innerHTML = sinDatos('Ningún cliente ha comprado en este período.')
      return
    }
    caja.style.height = Math.max(200, top.length * 40) + 'px'
    graficoBarras(document.getElementById('grafica-clientes'), {
      etiquetas: top.map(c => corto(c.cliente)), horizontal: true, radio: 5, separacion: 0.8,
      series: [{ nombre: 'Total pagado', datos: top.map(c => c.ingresos), color: '#059669' }],
      formatoEje: compacto, formatoTooltip: (c) => ` Total pagado: ${cop(c.raw)}`,
    })
  },

  /** 8.3 Tabla mensual de reservas por evento + gráfica de evolución */
  reservasPorEvento(lista) {
    const totalesMes = MESES.map((_, i) => sumar(lista.map(e => e.datos[i])))
    const filas = lista.map(e => `
      <tr>
        <td><strong>${esc(e.evento)}</strong><p class="texto-fecha">${esc(e.codigo)}</p></td>
        ${e.datos.map(v => `<td>${v > 0 ? chip(v, '#eef2ff', '#4f46e5') : '<span class="vacio-celda">—</span>'}</td>`).join('')}
        <td>${chip(e.total, '#f5f3ff', '#7c3aed')}</td>
      </tr>`).join('')

    document.getElementById('tabla-mensual').innerHTML = lista.length === 0
      ? sinResultados(14, 'No hay reservas registradas en este período.')
      : filas + `
      <tr class="fila-total">
        <td>Total de reservas por mes</td>
        ${totalesMes.map(t => `<td>${t > 0 ? t : '—'}</td>`).join('')}
        <td>${sumar(totalesMes)}</td>
      </tr>`

    graficoLinea(document.getElementById('grafica-evolucion'), {
      etiquetas: MESES, datos: totalesMes, nombre: 'Reservas', color: '#f4845f',
      formatoTooltip: (c) => ` Reservas: ${c.raw}`,
    })
  },

  /** 8.4 Tabla agente + ciudad y gráfica apilada por agente */
  agenteCiudad(lista) {
    document.getElementById('tabla-agente-ciudad').innerHTML = lista.length === 0 ? sinResultados(7, 'No hay eventos que coincidan con los filtros.') : lista.map(r => `
      <tr>
        <td><div class="celda-icono"><span class="inicial-cuadro" style="--color:#7c3aed">${esc(r.agente[0])}</span><strong class="sin-salto">${esc(r.agente)}</strong></div></td>
        <td>${esc(r.ciudad)}</td>
        <td class="texto-gris">${esc(r.departamento)} · ${esc(r.pais)}</td>
        <td class="texto-centro">${chip(r.creados, '#f5f3ff', '#7c3aed')}</td>
        <td class="texto-centro">${chip(r.activos, '#ecfdf5', '#059669')}</td>
        <td class="texto-centro">${chip(r.finalizados, '#eef2ff', '#4f46e5')}</td>
        <td class="texto-centro">${chip(r.cancelados, '#fef2f2', '#dc2626')}</td>
      </tr>`).join('')

    // La gráfica suma todas las ciudades de cada agente (una barra por agente)
    const porAgente = new Map()
    lista.forEach(r => {
      const a = porAgente.get(r.id_agente) || { agente: r.agente, activos: 0, finalizados: 0, cancelados: 0 }
      a.activos += r.activos; a.finalizados += r.finalizados; a.cancelados += r.cancelados
      porAgente.set(r.id_agente, a)
    })
    const agentes = [...porAgente.values()]

    document.getElementById('caja-grafica-agente-ciudad').style.height = Math.max(200, agentes.length * 40) + 40 + 'px'
    graficoBarras(document.getElementById('grafica-agente-ciudad'), {
      etiquetas: agentes.map(a => corto(a.agente)), horizontal: true, apilado: true, leyenda: true, radio: 0, separacion: 0.8,
      series: [
        { nombre: 'Activos', datos: agentes.map(a => a.activos), color: '#059669' },
        { nombre: 'Finalizados', datos: agentes.map(a => a.finalizados), color: '#4f46e5' },
        { nombre: 'Cancelados', datos: agentes.map(a => a.cancelados), color: '#dc2626' },
      ],
    })
  },
}