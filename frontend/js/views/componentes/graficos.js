// js/views/componentes/graficos.js
// VISTA compartida: gráficas del panel de administrador con Chart.js.
// Chart.js se carga en cada página de reportes con:
//   <script src="/vendor/chart.js/chart.umd.js"></script>
// y queda disponible como la variable global "Chart".

const COLOR_TEXTO_EJE = '#9ca3af'
const COLOR_REJILLA = '#f3f4f6'
const graficasCreadas = new Map()

function opcionesBase({ horizontal = false, formatoEje, formatoTooltip, leyenda = false, apilado = false } = {}) {
  const ejeValores = {
    beginAtZero: true,
    border: { display: false },
    grid: { color: COLOR_REJILLA, drawTicks: false, tickBorderDash: [3, 3] },
    ticks: { color: COLOR_TEXTO_EJE, font: { size: 11 }, padding: 8, callback: formatoEje, maxTicksLimit: 6, precision: 0 },
    stacked: apilado,
  }
  const ejeCategorias = {
    border: { display: false },
    grid: { display: false },
    ticks: { color: horizontal ? '#374151' : COLOR_TEXTO_EJE, font: { size: horizontal ? 12 : 11 } },
    stacked: apilado,
  }
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    animation: { duration: 500 },
    plugins: {
      legend: {
        display: leyenda,
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, boxHeight: 8, color: '#6b7280', font: { size: 12, weight: 500 } },
      },
      tooltip: {
        backgroundColor: '#ffffff', titleColor: '#374151', bodyColor: '#111827',
        borderColor: '#f3f4f6', borderWidth: 1, padding: 12, cornerRadius: 12,
        titleFont: { weight: 600 }, bodyFont: { weight: 700 },
        usePointStyle: true, boxPadding: 4,
        callbacks: formatoTooltip ? { label: formatoTooltip } : {},
      },
    },
    scales: horizontal ? { x: ejeValores, y: ejeCategorias } : { x: ejeCategorias, y: ejeValores },
  }
}

/** Redondea el máximo del eje a un valor "bonito" divisible en 4 partes (ej. 51 → 60) */
function maximoRedondo(valor) {
  const paso = valor / 4
  const potencia = 10 ** Math.floor(Math.log10(paso))
  const bonito = [1, 1.5, 2, 2.5, 5, 10].map(f => f * potencia).find(f => f >= paso)
  return bonito * 4
}

function crear(canvas, config) {
  if (typeof Chart === 'undefined') {
    canvas.parentElement.innerHTML = '<p class="campo__ayuda">No se pudo cargar Chart.js (ejecuta npm install en /backend).</p>'
    return null
  }
  graficasCreadas.get(canvas)?.destroy()
  const grafica = new Chart(canvas, config)
  graficasCreadas.set(canvas, grafica)
  return grafica
}

/** Barras verticales u horizontales (una o varias series). */
export function graficoBarras(canvas, { etiquetas, series, horizontal = false, formatoEje, formatoTooltip, leyenda = false, apilado = false, radio = 4, separacion = 0.7, fondoBarra }) {
  const datasets = series.map(s => ({
    label: s.nombre,
    data: s.datos,
    backgroundColor: s.color,
    borderRadius: s.radio ?? radio,
    borderSkipped: 'start',
    categoryPercentage: separacion,
    barPercentage: s.anchoBarra ?? 0.9,
    stack: s.grupo,
  }))
  const opciones = opcionesBase({ horizontal, formatoEje, formatoTooltip, leyenda, apilado })
  if (fondoBarra) {
    // Dibuja una barra gris clara detrás de cada barra (como en el prototipo)
    const maximo = maximoRedondo(Math.max(...series[0].datos) * 1.1)
    datasets.push({ data: series[0].datos.map(() => maximo), backgroundColor: fondoBarra, borderRadius: radio, categoryPercentage: separacion, barPercentage: 0.9, grouped: false, order: 2 })
    datasets[0].order = 1
    opciones.plugins.tooltip.filter = (item) => item.datasetIndex === 0
    opciones.scales.y.max = maximo
  }
  return crear(canvas, { type: 'bar', data: { labels: etiquetas, datasets }, options: opciones })
}

/** Línea (relleno opcional para gráfico de área). */
export function graficoLinea(canvas, { etiquetas, datos, nombre, color, area = false, puntos = true, formatoEje, formatoTooltip }) {
  const datasets = [{
    label: nombre,
    data: datos,
    borderColor: color,
    borderWidth: 2.5,
    tension: 0.4,
    fill: area,
    backgroundColor: area
      ? (ctx) => {
          const { chart } = ctx
          if (!chart.chartArea) return 'transparent'
          const degradado = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom)
          degradado.addColorStop(0, color + '2e')
          degradado.addColorStop(1, color + '00')
          return degradado
        }
      : color,
    pointRadius: puntos ? 4 : 0,
    pointBackgroundColor: color,
    pointHoverRadius: 6,
  }]
  return crear(canvas, { type: 'line', data: { labels: etiquetas, datasets }, options: opcionesBase({ formatoEje, formatoTooltip }) })
}

/** Dona con el porcentaje escrito dentro de cada porción. */
export function graficoDona(canvas, { etiquetas, datos, colores, formatoTooltip, minimoEtiqueta = 0.03 }) {
  const porcentajes = {
    id: 'porcentajes',
    afterDatasetsDraw(chart) {
      const { ctx } = chart
      const total = datos.reduce((a, b) => a + b, 0)
      chart.getDatasetMeta(0).data.forEach((arco, i) => {
        const fraccion = datos[i] / total
        if (fraccion < minimoEtiqueta) return
        const { x, y } = arco.tooltipPosition()
        ctx.save()
        ctx.fillStyle = '#fff'
        ctx.font = '700 12px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(Math.round(fraccion * 100) + '%', x, y)
        ctx.restore()
      })
    },
  }
  return crear(canvas, {
    type: 'doughnut',
    data: { labels: etiquetas, datasets: [{ data: datos, backgroundColor: colores, borderWidth: 3, borderColor: '#fff', hoverOffset: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '58%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 9, boxHeight: 9, color: '#6b7280', font: { size: 12, weight: 500 } } },
        tooltip: { backgroundColor: '#fff', titleColor: '#111827', bodyColor: '#6b7280', borderColor: '#f3f4f6', borderWidth: 1, padding: 12, cornerRadius: 12, callbacks: formatoTooltip ? { label: formatoTooltip } : {} },
      },
    },
    plugins: [porcentajes],
  })
}
