// js/views/admin/dashboardView.js
// VISTA del dashboard del administrador.
// Solo DIBUJA: recibe los datos REALES que el controlador trajo de
// GET /api/reportes/dashboard y los convierte en HTML y gráficas.

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoLinea } from '../componentes/graficos.js'
import { esc, num, cop } from '../../utils/formato.js'
import { kpiAdmin, cabeceraGrafica, leyenda } from './comunAdminView.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const ESTILO_ACTIVIDAD = {
  cliente:   ['#eef2ff', '#6366f1'],
  agente:    ['#fffbeb', '#f59e0b'],
  evento:    ['#ecfdf5', '#10b981'],
  reserva:   ['#fff7f5', '#fb923c'],
  cancelada: ['#fef2f2', '#ef4444'],
}

const sumar = (lista) => lista.reduce((a, b) => a + b, 0)

/** Pesos abreviados: 1.250.000 → "$1,3M" · 85.000 → "$85k" */
function pesosCortos(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M`
  if (v >= 1000) return `$${Math.round(v / 1000)}k`
  return `$${v}`
}

/** "↑ 31% vs. año anterior" en verde, "↓ 12%…" en rojo, o nada si no hay con qué comparar */
function comparacion(actual, anterior) {
  if (!anterior) {
    return actual > 0 ? '<span class="texto-verde">Sin datos del año anterior</span>' : ''
  }
  const porcentaje = Math.round(((actual - anterior) / anterior) * 100)
  const clase = porcentaje >= 0 ? 'texto-verde' : 'texto-rojo'
  const flecha = porcentaje >= 0 ? '↑' : '↓'
  return `<span class="${clase}">${flecha} ${Math.abs(porcentaje)}% vs. año anterior</span>`
}

/** Fecha de la actividad: "Hoy, 10:42 a. m." · "Ayer, 9:14 p. m." · "20 oct, 9:00 a. m." */
function horaActividad(fechaISO) {
  const fecha = new Date(fechaISO)
  const hora = fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
  const hoy = new Date()
  const ayer = new Date(); ayer.setDate(hoy.getDate() - 1)
  const mismoDia = (a, b) => a.toDateString() === b.toDateString()
  if (mismoDia(fecha, hoy)) return `Hoy, ${hora}`
  if (mismoDia(fecha, ayer)) return `Ayer, ${hora}`
  const dia = fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '')
  return `${dia}, ${hora}`
}

/** Mensaje cuando una tarjeta no tiene datos todavía */
const sinDatos = (texto) => `<p class="mensaje-tarjeta-vacia">${esc(texto)}</p>`

function tarjetaCobertura(cobertura) {
  // Cuántos países / departamentos / ciudades distintos hay (n = 1, 2 o 3 niveles)
  const unicos = (n) => new Set(cobertura.map(c => [c.pais, c.departamento, c.ciudad].slice(0, n).join('|'))).size
  const maximo = Math.max(1, ...cobertura.map(c => c.eventos))
  const total = sumar(cobertura.map(c => c.eventos))
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Cobertura de eventos</h2>
        <p class="tarjeta__subtitulo">Distribución geográfica del sistema</p>
      </div></div>
      <div class="mini-kpis">
        <div><strong>${unicos(1)}</strong><span>Países</span></div>
        <div><strong>${unicos(2)}</strong><span>Departamentos</span></div>
        <div><strong>${unicos(3)}</strong><span>Ciudades</span></div>
      </div>
      ${cobertura.length === 0 ? sinDatos('Todavía no hay eventos registrados.') : `
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
      </div>`}
      <div class="tarjeta__pie tarjeta__pie--entre">
        <span class="kpi__sub">Total registrado</span>
        <span class="total-pie">${num(total)} ${total === 1 ? 'evento' : 'eventos'}</span>
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
      ${actividad.length === 0 ? sinDatos('Aún no hay actividad registrada.') : `
      <div class="actividad">${actividad.map(a => {
        const [fondo, color] = ESTILO_ACTIVIDAD[a.tipo] || ESTILO_ACTIVIDAD.evento
        return `
        <div>
          <div class="actividad__icono" style="--fondo-icono:${fondo};--color-icono:${color}"><span></span></div>
          <div class="actividad__texto">
            <p class="actividad__titulo">${esc(a.titulo)}</p>
            <p class="actividad__detalle" title="${esc(a.detalle)}">${esc(a.detalle)}</p>
          </div>
          <span class="actividad__hora">${esc(horaActividad(a.fecha))}</span>
        </div>`
      }).join('')}
      </div>`}
      <div class="tarjeta__pie">
        <a href="/pages/admin/reportes-generales.html" class="enlace-reporte">Ver reporte completo →</a>
      </div>
    </section>`
}

function resumenPagos(resumen, anio) {
  const tarjetas = [
    { etiqueta: 'Total ingresos', valor: cop(resumen.valor_confirmado), sub: 'COP de reservas confirmadas', icono: 'dolar', color: '#4f46e5', fondo: '#eef2ff' },
    { etiqueta: 'Reservas confirmadas', valor: num(resumen.confirmadas), sub: 'Pagos completados', icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5' },
    { etiqueta: 'Reservas pendientes', valor: num(resumen.pendientes), sub: `${cop(resumen.valor_pendiente)} por confirmar`, icono: 'reloj', color: '#d97706', fondo: '#fffbeb' },
    { etiqueta: 'Canceladas', valor: num(resumen.canceladas), sub: 'Por el cliente, el agente o el evento', icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2' },
  ]
  return `
    <section class="seccion">
      <div>
        <h2 class="seccion-titulo">Pagos de reservas — Plataforma</h2>
        <p class="seccion-subtitulo">Resumen de las reservas hechas por los clientes en ${anio} · ${num(resumen.entradas)} entradas vendidas.</p>
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
        ${cabeceraGrafica(`Ingresos confirmados por mes — ${anio}`, 'Reservas confirmadas en pesos COP')
          .replace('<h2 class="seccion-titulo">', '<h3 class="seccion-titulo seccion-titulo--sm">').replace('</h2>', '</h3>')}
        <div class="grafica grafica--200"><canvas id="grafica-pagos" aria-label="Ingresos confirmados por mes"></canvas></div>
      </div>
    </section>`
}

export const DashboardView = {
  /** Llena el selector de período con los años que tienen datos */
  mostrarPeriodos(anios, seleccionado) {
    const select = document.getElementById('periodo')
    if (!select) return
    select.innerHTML = anios
      .map(a => `<option value="${a}"${String(a) === String(seleccionado) ? ' selected' : ''}>${a}</option>`)
      .join('')
  },

  /** Mientras llegan los datos */
  mostrarCargando() {
    document.getElementById('contenido').innerHTML = sinDatos('Cargando estadísticas…')
  },

  /** Si la API responde con error */
  mostrarError(mensaje) {
    document.getElementById('contenido').innerHTML = `
      <div class="vacio">
        <p class="vacio__texto">${esc(mensaje)}</p>
      </div>`
  },

  mostrar(datos) {
    const { anio, totales, ingresosMes, eventosMes, comparacion: anterior } = datos
    const totalIngresos = sumar(ingresosMes)
    const totalEventos = sumar(eventosMes)

    // La "tendencia" de cada KPI = cuántos se registraron este mes
    const nuevos = (n) => ({ tendencia: `${num(n)} este mes`, sube: n > 0 })
    const kpis = [
      { etiqueta: 'Clientes registrados', valor: num(totales.clientes), icono: 'usuarios', color: '#4f46e5', fondo: '#eef2ff', ...nuevos(totales.clientes_mes) },
      { etiqueta: 'Agentes registrados', valor: num(totales.agentes), icono: 'maletin', color: '#f4845f', fondo: '#fff7f5', ...nuevos(totales.agentes_mes) },
      { etiqueta: 'Administradores registrados', valor: num(totales.administradores), icono: 'escudo', color: '#d97706', fondo: '#fffbeb', ...nuevos(totales.administradores_mes) },
      { etiqueta: 'Reservas registradas', valor: num(totales.reservas), icono: 'ticket', color: '#059669', fondo: '#ecfdf5', ...nuevos(totales.reservas_mes) },
      { etiqueta: 'Eventos registrados', valor: num(totales.eventos), icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff', ...nuevos(totales.eventos_mes) },
    ]

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--5" aria-label="Indicadores principales">${kpis.map(kpiAdmin).join('')}</section>

      <div class="grid-2">
        <section class="tarjeta-grafica">
          ${cabeceraGrafica(`Ingresos totales en ${anio}`, 'Reservas no canceladas, en pesos COP',
            `<div class="tarjeta-grafica__total"><strong>${pesosCortos(totalIngresos)}</strong>${comparacion(totalIngresos, anterior.ingresosAnterior)}</div>`)}
          <div class="grafica grafica--220"><canvas id="grafica-ingresos" aria-label="Ingresos por mes"></canvas></div>
        </section>
        <section class="tarjeta-grafica">
          ${cabeceraGrafica(`Reservas por mes en ${anio}`, 'Confirmadas · Pendientes · Canceladas',
            leyenda([{ color: '#4f46e5', texto: 'Confirmadas' }, { color: '#f4845f', texto: 'Pendientes' }, { color: '#fca5a5', texto: 'Canceladas' }]))}
          <div class="grafica grafica--220"><canvas id="grafica-reservas" aria-label="Reservas por mes"></canvas></div>
        </section>
      </div>

      <section class="tarjeta-grafica">
        ${cabeceraGrafica(`Eventos creados en ${anio}`, 'Total por mes',
          `<div class="tarjeta-grafica__total"><strong>${num(totalEventos)} ${totalEventos === 1 ? 'evento' : 'eventos'}</strong>${comparacion(totalEventos, anterior.eventosAnterior)}</div>`)}
        <div class="grafica grafica--180"><canvas id="grafica-eventos" aria-label="Eventos creados por mes"></canvas></div>
      </section>

      <div class="grid-2">
        ${tarjetaCobertura(datos.cobertura)}
        ${tarjetaActividad(datos.actividad)}
      </div>

      ${resumenPagos(datos.resumen, anio)}
      <div class="espacio-final"></div>`

    this.graficas(datos)
  },

  graficas({ ingresosMes, reservasMes, eventosMes, ingresosConfirmadosMes }) {
    graficoLinea(document.getElementById('grafica-ingresos'), {
      etiquetas: MESES, datos: ingresosMes, nombre: 'Ingresos', color: '#4f46e5', area: true, puntos: false,
      formatoEje: pesosCortos, formatoTooltip: (c) => ` ${cop(c.raw)} COP`,
    })
    graficoBarras(document.getElementById('grafica-reservas'), {
      etiquetas: MESES, radio: 3, separacion: 0.6,
      series: [
        { nombre: 'Confirmadas', datos: reservasMes.confirmadas, color: '#4f46e5', anchoBarra: 0.8 },
        { nombre: 'Pendientes', datos: reservasMes.pendientes, color: '#f4845f', anchoBarra: 0.8 },
        { nombre: 'Canceladas', datos: reservasMes.canceladas, color: '#fca5a5', anchoBarra: 0.8 },
      ],
    })
    graficoBarras(document.getElementById('grafica-eventos'), {
      // La barra gris de fondo solo se dibuja si hay al menos un evento (con todo en 0 falla)
      etiquetas: MESES, separacion: 0.4, fondoBarra: Math.max(...eventosMes) > 0 ? '#f9fafb' : undefined,
      series: [{ nombre: 'Creados', datos: eventosMes, color: '#7c3aed' }],
      formatoTooltip: (c) => ` ${c.raw} ${c.raw === 1 ? 'evento' : 'eventos'}`,
    })
    graficoBarras(document.getElementById('grafica-pagos'), {
      etiquetas: MESES, radio: 6, separacion: 0.4,
      series: [{ nombre: 'Ingresos', datos: ingresosConfirmadosMes, color: '#4f46e5' }],
      formatoEje: pesosCortos, formatoTooltip: (c) => ` Ingresos: ${cop(c.raw)}`,
    })
  },
}