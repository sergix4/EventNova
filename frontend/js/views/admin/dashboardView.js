// js/views/admin/dashboardView.js
// VISTA del dashboard del administrador.

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoLinea } from '../componentes/graficos.js'
import { esc, num } from '../../utils/formato.js'
import { kpiAdmin, cabeceraGrafica, leyenda } from './comunAdminView.js'

const ESTILO_ACTIVIDAD = {
  cliente:   ['#eef2ff', '#6366f1'],
  agente:    ['#fffbeb', '#f59e0b'],
  evento:    ['#ecfdf5', '#10b981'],
  reserva:   ['#fff7f5', '#fb923c'],
  cancelada: ['#fef2f2', '#ef4444'],
}

const millones = (v, decimales = 0) => `$${(v / 1_000_000).toFixed(decimales)}M`
const formatoPesosEje = (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`

function tarjetaCobertura(cobertura) {
  const unicos = (campo) => new Set(cobertura.map(c => c[campo])).size
  const maximo = Math.max(...cobertura.map(c => c.eventos))
  const total = cobertura.reduce((s, c) => s + c.eventos, 0)
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Cobertura de eventos</h2>
        <p class="tarjeta__subtitulo">Distribución geográfica del sistema</p>
      </div></div>
      <div class="mini-kpis">
        <div><strong>${unicos('pais')}</strong><span>Países</span></div>
        <div><strong>${unicos('departamento')}</strong><span>Departamentos</span></div>
        <div><strong>${unicos('ciudad')}</strong><span>Ciudades</span></div>
      </div>
      <div class="tabla-scroll">
        <table class="tabla tabla--mini">
          <thead><tr><th>País</th><th>Departamento</th><th>Ciudad</th><th>Eventos</th></tr></thead>
          <tbody>${cobertura.map(c => `
            <tr>
              <td class="texto-fuerte">${esc(c.pais)}</td><td>${esc(c.departamento)}</td><td>${esc(c.ciudad)}</td>
              <td><div class="barra-con-valor barra-con-valor--mini">
                <div class="barra"><div class="barra__relleno" style="width:${Math.round(c.eventos / maximo * 100)}%"></div></div>
                <strong>${c.eventos}</strong>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="tarjeta__pie tarjeta__pie--entre">
        <span class="kpi__sub">Total registrado</span>
        <span class="total-pie">${total} eventos</span>
      </div>
    </section>`
}

function tarjetaActividad(actividad) {
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Actividad reciente</h2>
        <p class="tarjeta__subtitulo">Últimas acciones en el sistema</p>
      </div></div>
      <div class="actividad">${actividad.map(a => {
        const [fondo, color] = ESTILO_ACTIVIDAD[a.tipo]
        return `
        <div>
          <div class="actividad__icono" style="--fondo-icono:${fondo};--color-icono:${color}"><span></span></div>
          <div class="actividad__texto">
            <p class="actividad__titulo">${esc(a.titulo)}</p>
            <p class="actividad__detalle">${esc(a.detalle)}</p>
          </div>
          <span class="actividad__hora">${esc(a.hora)}</span>
        </div>`
      }).join('')}
      </div>
      <div class="tarjeta__pie">
        <a href="/pages/admin/reportes-generales.html" class="enlace-reporte">Ver reporte completo →</a>
      </div>
    </section>`
}

function resumenPagos(pagos) {
  const pagados = pagos.filter(p => p.estado === 'Pagado')
  const total = pagados.reduce((s, p) => s + p.valor, 0)
  const tarjetas = [
    { etiqueta: 'Total ingresos', valor: `$ ${(total / 1_000_000).toFixed(1)}M`, sub: 'COP pagado confirmado', icono: 'dolar', color: '#4f46e5', fondo: '#eef2ff' },
    { etiqueta: 'Pagos realizados', valor: pagados.length, sub: 'Transacciones completadas', icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5' },
    { etiqueta: 'Pagos pendientes', valor: pagos.filter(p => p.estado === 'Pendiente').length, sub: 'Esperando confirmación', icono: 'reloj', color: '#d97706', fondo: '#fffbeb' },
    { etiqueta: 'Cancelados', valor: pagos.filter(p => p.estado === 'Cancelado' || p.estado === 'Reembolsado').length, sub: 'Cancelados o reembolsados', icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2' },
  ]
  return `
    <section class="seccion">
      <div>
        <h2 class="seccion-titulo">Pagos de reservas — Plataforma</h2>
        <p class="seccion-subtitulo">Resumen consolidado de pagos realizados por clientes en 2026.</p>
      </div>
      <div class="grid-kpi grid-kpi--4">${tarjetas.map(t => `
        <article class="kpi kpi--fila" style="--color-icono:${t.color};--fondo-icono:${t.fondo}">
          <div class="kpi__icono">${icono(t.icono, 20)}</div>
          <div>
            <p class="kpi__valor kpi__valor--medio">${t.valor}</p>
            <p class="kpi__etiqueta">${t.etiqueta}</p>
            <p class="kpi__sub kpi__sub--claro">${t.sub}</p>
          </div>
        </article>`).join('')}
      </div>
      <div class="tarjeta-grafica">
        ${cabeceraGrafica('Ingresos por mes — 2026', 'Pagos confirmados en pesos COP', '<span class="pildora-verde">↑ En curso</span>').replace('<h2 class="seccion-titulo">', '<h3 class="seccion-titulo seccion-titulo--sm">').replace('</h2>', '</h3>')}
        <div class="grafica grafica--200"><canvas id="grafica-pagos" aria-label="Ingresos por mes"></canvas></div>
      </div>
    </section>`
}

export const DashboardView = {
  mostrar(datos, periodo) {
    const { totales, ingresosMes, eventosMes } = datos
    const totalIngresos = ingresosMes.reduce((a, b) => a + b, 0)
    const totalEventos = eventosMes.reduce((a, b) => a + b, 0)
    const kpis = [
      { etiqueta: 'Clientes registrados', valor: num(totales.clientes), icono: 'usuarios', color: '#4f46e5', fondo: '#eef2ff', tendencia: '+14%' },
      { etiqueta: 'Agentes registrados', valor: num(totales.agentes), icono: 'maletin', color: '#f4845f', fondo: '#fff7f5', tendencia: '+8%' },
      { etiqueta: 'Administradores registrados', valor: num(totales.administradores), icono: 'escudo', color: '#d97706', fondo: '#fffbeb', tendencia: '0%', sube: false },
      { etiqueta: 'Reservas registradas', valor: num(totales.reservas), icono: 'ticket', color: '#059669', fondo: '#ecfdf5', tendencia: '+22%' },
      { etiqueta: 'Eventos registrados', valor: num(totales.eventos), icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff', tendencia: '+18%' },
    ]

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--5" aria-label="Indicadores principales">${kpis.map(kpiAdmin).join('')}</section>

      <div class="grid-2">
        <section class="tarjeta-grafica">
          ${cabeceraGrafica(`Ingresos totales en ${periodo}`, 'En millones de pesos COP',
            `<div class="tarjeta-grafica__total"><strong>$ ${(totalIngresos / 1_000_000).toFixed(0)}M</strong><span class="texto-verde">↑ 31% vs. año anterior</span></div>`)}
          <div class="grafica grafica--220"><canvas id="grafica-ingresos" aria-label="Ingresos por mes"></canvas></div>
        </section>
        <section class="tarjeta-grafica">
          ${cabeceraGrafica(`Reservas por mes en ${periodo}`, 'Confirmadas · Pendientes · Canceladas',
            leyenda([{ color: '#4f46e5', texto: 'Confirmadas' }, { color: '#f4845f', texto: 'Pendientes' }, { color: '#dc2626', texto: 'Canceladas' }]))}
          <div class="grafica grafica--220"><canvas id="grafica-reservas" aria-label="Reservas por mes"></canvas></div>
        </section>
      </div>

      <section class="tarjeta-grafica">
        ${cabeceraGrafica(`Eventos creados en ${periodo}`, 'Total por mes',
          `<div class="tarjeta-grafica__total"><strong>${totalEventos} eventos</strong><span class="texto-verde">↑ 18% vs. año anterior</span></div>`)}
        <div class="grafica grafica--180"><canvas id="grafica-eventos" aria-label="Eventos creados por mes"></canvas></div>
      </section>

      <div class="grid-2">
        ${tarjetaCobertura(datos.cobertura)}
        ${tarjetaActividad(datos.actividad)}
      </div>

      ${resumenPagos(datos.pagos)}
      <div class="espacio-final"></div>`

    this.graficas(datos)
  },

  graficas({ ingresosMes, reservasMes, eventosMes, ingresosPagos }, meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']) {
    graficoLinea(document.getElementById('grafica-ingresos'), {
      etiquetas: meses, datos: ingresosMes, nombre: 'Ingresos', color: '#4f46e5', area: true, puntos: false,
      formatoEje: (v) => millones(v), formatoTooltip: (c) => ` $ ${(c.raw / 1_000_000).toFixed(1)}M COP`,
    })
    graficoBarras(document.getElementById('grafica-reservas'), {
      etiquetas: meses, radio: 3, separacion: 0.6,
      series: [
        { nombre: 'Confirmadas', datos: reservasMes.confirmadas, color: '#4f46e5', anchoBarra: 0.8 },
        { nombre: 'Pendientes', datos: reservasMes.pendientes, color: '#f4845f', anchoBarra: 0.8 },
        { nombre: 'Canceladas', datos: reservasMes.canceladas, color: '#fca5a5', anchoBarra: 0.8 },
      ],
    })
    graficoBarras(document.getElementById('grafica-eventos'), {
      etiquetas: meses, separacion: 0.4, fondoBarra: '#f9fafb',
      series: [{ nombre: 'Creados', datos: eventosMes, color: '#7c3aed' }],
      formatoTooltip: (c) => ` ${c.raw} eventos`,
    })
    graficoBarras(document.getElementById('grafica-pagos'), {
      etiquetas: meses.slice(0, ingresosPagos.length), radio: 6, separacion: 0.4,
      series: [{ nombre: 'Ingresos', datos: ingresosPagos, color: '#4f46e5' }],
      formatoEje: formatoPesosEje, formatoTooltip: (c) => ` Ingresos: $ ${num(c.raw)}`,
    })
  },
}
