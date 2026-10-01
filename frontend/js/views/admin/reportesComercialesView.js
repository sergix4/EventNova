// js/views/admin/reportesComercialesView.js
// VISTA de "Reportes comerciales" del administrador.

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoLinea } from '../componentes/graficos.js'
import { esc, cop, num } from '../../utils/formato.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const corto = (nombre) => nombre.length > 18 ? nombre.slice(0, 18) + '…' : nombre
const opciones = (lista) => '<option>Todos</option>' + lista.map(o => `<option>${esc(o)}</option>`).join('')
const selectChico = (id, etiqueta, lista) =>
  `<div class="envoltura-select envoltura-select--chica"><select class="selector" id="${id}" aria-label="${etiqueta}">${opciones(lista)}</select></div>`
const chip = (valor, fondo, color) => `<span class="chip-numero" style="background:${fondo};color:${color}">${valor}</span>`
const sinResultados = (columnas) => `<tr><td colspan="${columnas}" class="tabla__vacia">Sin resultados.</td></tr>`

function kpi({ etiqueta, sub, valor, icono: ic, color, fondo, tendencia }) {
  return `
    <article class="kpi kpi--holgado" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono kpi__icono--grande">${icono(ic, 20)}</div>
        <span class="kpi-admin__tendencia">${icono('tendenciaArriba', 12)}${tendencia}</span>
      </div>
      <div>
        <p class="kpi__valor kpi__valor--ajustado">${valor}</p>
        <p class="kpi__etiqueta kpi__etiqueta--fuerte">${etiqueta}</p>
        <p class="kpi__sub">${sub}</p>
      </div>
    </article>`
}

export const ReportesComercialesView = {
  /** Barra de filtros generales (debajo de la cabecera) */
  filtros(agentes) {
    document.getElementById('barra-filtros').innerHTML = `
      <span class="etiqueta-filtros">${icono('filtro', 13)}Filtros:</span>
      ${selectChico('f-agente', 'Agente', agentes.map(a => a.nombre))}
      ${selectChico('f-ciudad', 'Ciudad', [...new Set(agentes.map(a => a.ciudad))])}
      ${selectChico('f-estado', 'Estado', ['Activo', 'Finalizado', 'Cancelado'])}
      <button type="button" class="boton-limpiar-mini" id="f-limpiar" hidden>${icono('cerrar', 12)}Limpiar filtros</button>`
  },

  mostrar(datos, periodo) {
    const totalIngresos = datos.ingresosMes.reduce((a, b) => a + b, 0)
    const promedioAgente = datos.agentes.reduce((s, a) => s + a.ingresos, 0) / datos.agentes.length
    const totalReservas = datos.reservasPorEvento.reduce((s, e) => s + e.datos.reduce((a, b) => a + b, 0), 0)
    const totalEventos = datos.porAgenteYCiudad.reduce((s, r) => s + r.creados, 0)
    const ahora = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const filas = datos.porAgenteYCiudad

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--3" aria-label="Indicadores comerciales">
        ${kpi({ etiqueta: 'Ingresos totales 2026', sub: 'Suma de todos los eventos', valor: cop(totalIngresos), icono: 'dolar', color: '#4f46e5', fondo: '#eef2ff', tendencia: '+19%' })}
        ${kpi({ etiqueta: 'Promedio por agente', sub: 'Ingreso promedio por agente activo', valor: cop(promedioAgente), icono: 'maletin', color: '#f4845f', fondo: '#fff7f5', tendencia: '+11%' })}
        ${kpi({ etiqueta: 'Total de reservas 2026', sub: 'Reservas registradas en el año', valor: num(totalReservas), icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff', tendencia: '+22%' })}
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Ingresos totales por mes en ${periodo}</h2>
          <p class="tarjeta__subtitulo">Ingresos de todos los eventos · en pesos colombianos (COP)</p>
        </div></div>
        <div class="bloque-grafica bloque-grafica--sin-borde">
          <div class="grafica grafica--260"><canvas id="grafica-ingresos" aria-label="Ingresos por mes"></canvas></div>
        </div>
        <div class="resumen-ingresos">
          <div><small>Ingreso total del año ${periodo}</small><strong>${cop(totalIngresos)}</strong></div>
          <div class="texto-derecha"><small>Mejor mes</small><p class="mejor-mes">Diciembre · ${cop(datos.ingresosMes[11])}</p></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Promedio de ingresos por agente</h2>
          <p class="tarjeta__subtitulo">Ingresos, reservas y eventos por cada agente registrado</p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Agente</th><th>Ciudad principal</th><th>Eventos creados</th><th>Reservas</th><th>Ingresos totales</th><th>Promedio de ingresos</th></tr></thead>
            <tbody id="tabla-agentes"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Comparación de promedio de ingresos por agente</p>
          <div class="grafica" id="caja-grafica-promedios"><canvas id="grafica-promedios" aria-label="Promedio de ingresos por agente"></canvas></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera">
          <div>
            <h2 class="tarjeta__titulo">Reservas por evento y por mes en ${periodo}</h2>
            <p class="tarjeta__subtitulo">Número de reservas realizadas para cada evento en cada mes</p>
          </div>
          <div class="filtros-cabecera">
            <span class="etiqueta-filtros">Evento:</span>
            ${selectChico('f-evento', 'Evento', datos.reservasPorEvento.map(e => e.evento))}
          </div>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla tabla-mensual">
            <thead><tr><th>Evento</th>${MESES.map(m => `<th>${m}</th>`).join('')}<th>Total</th></tr></thead>
            <tbody id="tabla-mensual"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Evolución de reservas durante ${periodo}</p>
          <div class="grafica grafica--220"><canvas id="grafica-evolucion" aria-label="Evolución de reservas"></canvas></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera">
          <div>
            <h2 class="tarjeta__titulo">Eventos creados por agente y ciudad</h2>
            <p class="tarjeta__subtitulo">Desglose de eventos activos, finalizados y cancelados por agente</p>
          </div>
          <div class="filtros-cabecera">
            <span class="etiqueta-filtros">${icono('filtro', 13)}</span>
            ${selectChico('f5-agente', 'Agente', filas.map(r => r.agente))}
            ${selectChico('f5-ciudad', 'Ciudad', [...new Set(filas.map(r => r.ciudad))])}
            ${selectChico('f5-depto', 'Departamento', [...new Set(filas.map(r => r.departamento))])}
          </div>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Agente</th><th>Ciudad</th><th>Departamento</th><th>Eventos creados</th><th>Eventos activos</th><th>Eventos finalizados</th><th>Eventos cancelados</th></tr></thead>
            <tbody id="tabla-agente-ciudad"></tbody>
          </table>
        </div>
        <div class="bloque-grafica">
          <p class="subtitulo-grafica">Comparación de eventos creados por agente</p>
          <div class="grafica" id="caja-grafica-agente-ciudad"><canvas id="grafica-agente-ciudad" aria-label="Eventos por agente"></canvas></div>
        </div>
      </section>

      <section class="resumen-comercial">
        <div class="resumen-comercial__cabecera">
          <div><h2>Resumen comercial</h2><p>Consolidado del período · ${periodo}</p></div>
          <span class="resumen-comercial__fecha">Última actualización: ${ahora}</span>
        </div>
        <div class="resumen-comercial__datos">
          <div><small>Ingresos totales</small><strong>${cop(totalIngresos)}</strong></div>
          <div><small>Promedio por agente</small><strong>${cop(promedioAgente)}</strong></div>
          <div><small>Total de reservas</small><strong>${num(totalReservas)}</strong></div>
          <div><small>Total de eventos</small><strong>${num(totalEventos)}</strong></div>
        </div>
      </section>
      <div class="espacio-final"></div>`
  },

  graficaIngresos(ingresos, indiceMes) {
    const etiquetas = indiceMes >= 0 ? [MESES[indiceMes]] : MESES
    const valores = indiceMes >= 0 ? [ingresos[indiceMes]] : ingresos
    graficoBarras(document.getElementById('grafica-ingresos'), {
      etiquetas, radio: 5, separacion: 0.35,
      series: [{ nombre: 'Ingresos', datos: valores, color: '#4f46e5' }],
      formatoEje: (v) => `$${(v / 1_000_000).toFixed(0)}M`, formatoTooltip: (c) => ` Ingresos: ${cop(c.raw)}`,
    })
  },

  agentes(lista) {
    document.getElementById('tabla-agentes').innerHTML = lista.length === 0 ? sinResultados(6) : lista.map(a => `
      <tr>
        <td><div class="celda-icono"><span class="inicial-cuadro" style="--color:#4f46e5">${esc(a.nombre[0])}</span><strong>${esc(a.nombre)}</strong></div></td>
        <td>${esc(a.ciudad)}</td>
        <td class="texto-centro texto-seminegrita">${a.eventos}</td>
        <td class="texto-centro texto-seminegrita">${num(a.reservas)}</td>
        <td class="texto-negrita">${cop(a.ingresos)}</td>
        <td><span class="valor-indigo">${cop(a.ingresos / a.eventos)}</span></td>
      </tr>`).join('')

    document.getElementById('caja-grafica-promedios').style.height = Math.max(220, lista.length * 42) + 'px'
    graficoBarras(document.getElementById('grafica-promedios'), {
      etiquetas: lista.map(a => corto(a.nombre)), horizontal: true, radio: 5, separacion: 0.8,
      series: [{ nombre: 'Promedio', datos: lista.map(a => Math.round(a.ingresos / a.eventos)), color: '#4f46e5' }],
      formatoEje: (v) => `$${(v / 1_000_000).toFixed(1)}M`, formatoTooltip: (c) => ` Promedio: ${cop(c.raw)}`,
    })
  },

  reservasPorEvento(lista) {
    const totalesMes = MESES.map((_, i) => lista.reduce((s, e) => s + e.datos[i], 0))
    const filas = lista.map(e => `
      <tr>
        <td>${esc(e.evento)}</td>
        ${e.datos.map(v => `<td>${v > 0 ? chip(v, '#eef2ff', '#4f46e5') : '<span class="vacio-celda">—</span>'}</td>`).join('')}
        <td>${chip(e.datos.reduce((a, b) => a + b, 0), '#f5f3ff', '#7c3aed')}</td>
      </tr>`).join('')
    document.getElementById('tabla-mensual').innerHTML = filas + `
      <tr class="fila-total">
        <td>Total de reservas por mes</td>
        ${totalesMes.map(t => `<td>${t > 0 ? t : '—'}</td>`).join('')}
        <td>${totalesMes.reduce((a, b) => a + b, 0)}</td>
      </tr>` + (lista.length === 0 ? sinResultados(14) : '')

    graficoLinea(document.getElementById('grafica-evolucion'), {
      etiquetas: MESES, datos: totalesMes, nombre: 'Reservas', color: '#f4845f',
      formatoTooltip: (c) => ` Reservas: ${c.raw}`,
    })
  },

  agenteCiudad(lista) {
    document.getElementById('tabla-agente-ciudad').innerHTML = lista.length === 0 ? sinResultados(7) : lista.map(r => `
      <tr>
        <td><div class="celda-icono"><span class="inicial-cuadro" style="--color:#7c3aed">${esc(r.agente[0])}</span><strong class="sin-salto">${esc(r.agente)}</strong></div></td>
        <td>${esc(r.ciudad)}</td>
        <td class="texto-gris">${esc(r.departamento)}</td>
        <td class="texto-centro">${chip(r.creados, '#f5f3ff', '#7c3aed')}</td>
        <td class="texto-centro">${chip(r.activos, '#ecfdf5', '#059669')}</td>
        <td class="texto-centro">${chip(r.finalizados, '#eef2ff', '#4f46e5')}</td>
        <td class="texto-centro">${chip(r.cancelados, '#fef2f2', '#dc2626')}</td>
      </tr>`).join('')

    document.getElementById('caja-grafica-agente-ciudad').style.height = Math.max(200, lista.length * 40) + 40 + 'px'
    graficoBarras(document.getElementById('grafica-agente-ciudad'), {
      etiquetas: lista.map(r => corto(r.agente)), horizontal: true, apilado: true, leyenda: true, radio: 3, separacion: 0.8,
      series: [
        { nombre: 'Creados', datos: lista.map(r => r.creados), color: '#7c3aed', grupo: 'a' },
        { nombre: 'Activos', datos: lista.map(r => r.activos), color: '#059669', grupo: 'b', radio: 0 },
        { nombre: 'Finalizados', datos: lista.map(r => r.finalizados), color: '#4f46e5', grupo: 'b', radio: 0 },
        { nombre: 'Cancelados', datos: lista.map(r => r.cancelados), color: '#dc2626', grupo: 'b' },
      ],
    })
  },
}
