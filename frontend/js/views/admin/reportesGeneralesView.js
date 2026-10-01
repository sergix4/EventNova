// js/views/admin/reportesGeneralesView.js
// VISTA de "Reportes generales" del administrador.

import { icono, estrellas } from '../componentes/iconos.js'
import { graficoBarras, graficoDona } from '../componentes/graficos.js'
import { esc, num, plural } from '../../utils/formato.js'
import { leyenda } from './comunAdminView.js'

export const TIPOS_REGISTRO = {
  cliente: { fondo: '#eef2ff', color: '#4f46e5', texto: 'Cliente' },
  agente:  { fondo: '#fffbeb', color: '#d97706', texto: 'Agente' },
  evento:  { fondo: '#ecfdf5', color: '#059669', texto: 'Evento' },
  reserva: { fondo: '#fff7f5', color: '#f4845f', texto: 'Reserva' },
  admin:   { fondo: '#f5f3ff', color: '#7c3aed', texto: 'Admin' },
}
const COLOR_ESTADO = {
  'Activo': ['#ecfdf5', '#047857'], 'Programado': ['#eff6ff', '#1d4ed8'], 'Confirmada': ['#ecfdf5', '#047857'],
  'Pendiente': ['#fffbeb', '#b45309'], 'Cancelada': ['#fef2f2', '#dc2626'],
}

/** Construye las 5 categorías (clientes, agentes, ...) a partir de los totales */
function categorias(t) {
  return [
    { tipo: 'Clientes', etiqueta: 'Clientes registrados', sub: 'Usuarios registrados como clientes', valor: t.clientes, icono: 'usuarios', color: '#4f46e5', fondo: '#eef2ff', tendencia: '+14%', sube: true },
    { tipo: 'Agentes', etiqueta: 'Agentes registrados', sub: 'Agentes registrados en EventNova', valor: t.agentes, icono: 'maletin', color: '#f4845f', fondo: '#fff7f5', tendencia: '+8%', sube: true },
    { tipo: 'Administradores', etiqueta: 'Administradores registrados', sub: 'Administradores del sistema', valor: t.administradores, icono: 'escudo', color: '#d97706', fondo: '#fffbeb', tendencia: '0%', sube: false },
    { tipo: 'Reservas', etiqueta: 'Reservas registradas', sub: 'Reservas realizadas en el sistema', valor: t.reservas, icono: 'ticket', color: '#059669', fondo: '#ecfdf5', tendencia: '+22%', sube: true },
    { tipo: 'Eventos', etiqueta: 'Eventos registrados', sub: 'Eventos creados en EventNova', valor: t.eventos, icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff', tendencia: '+18%', sube: true },
  ]
}

/** Píldora de variación: verde si sube, gris si se mantiene */
const variacion = (c, clase = 'kpi-admin__tendencia') =>
  `<span class="${clase} ${clase}--${c.sube ? 'sube' : 'igual'}">${c.sube ? icono('tendenciaArriba', 12) : ''}${c.tendencia}</span>`

function kpi(c, maximo) {
  return `
    <article class="kpi kpi--holgado" style="--color-icono:${c.color};--fondo-icono:${c.fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono kpi__icono--grande">${icono(c.icono, 20)}</div>
        ${variacion(c)}
      </div>
      <div>
        <p class="kpi__valor kpi__valor--grande">${num(c.valor)}</p>
        <p class="kpi__etiqueta kpi__etiqueta--fuerte">${c.etiqueta}</p>
        <p class="kpi__sub">${c.sub}</p>
      </div>
      <div class="kpi__mini-barra"><span style="width:${Math.min(100, Math.round(c.valor / maximo * 100))}%"></span></div>
    </article>`
}

function distribucion(cats) {
  const usuarios = cats.slice(0, 3)
  const total = usuarios.reduce((s, c) => s + c.valor, 0)
  return `
    <section class="tarjeta tarjeta--recortada col-2">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Distribución de usuarios</h2>
        <p class="tarjeta__subtitulo">Clientes · Agentes · Administradores</p>
      </div></div>
      <div class="tarjeta__cuerpo">
        <div class="grafica grafica--220"><canvas id="grafica-usuarios" aria-label="Distribución de usuarios"></canvas></div>
        <div class="lista-distribucion">${usuarios.map(c => `
          <div>
            <span class="lista-distribucion__nombre"><i class="punto-color punto-color--12" style="--color:${c.color}"></i>${c.tipo}</span>
            <span class="lista-distribucion__valores"><strong>${num(c.valor)}</strong><small>${(c.valor / total * 100).toFixed(1)}%</small></span>
          </div>`).join('')}
        </div>
      </div>
    </section>`
}

function resumen(cats) {
  const total = cats.reduce((s, c) => s + c.valor, 0)
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Resumen de registros</h2>
        <p class="tarjeta__subtitulo">Distribución porcentual del total del sistema</p>
      </div></div>
      <div class="tabla-contenedor">
        <table class="tabla tabla--amplia">
          <thead><tr><th>Tipo de registro</th><th>Cantidad</th><th>Porcentaje del total</th><th>Variación</th></tr></thead>
          <tbody>${cats.map(c => {
            const pct = (c.valor / total * 100).toFixed(1)
            return `
            <tr>
              <td><div class="celda-icono"><span class="icono-tipo" style="--fondo-icono:${c.fondo};--color-icono:${c.color}">${icono(c.icono, 20)}</span><strong>${c.tipo}</strong></div></td>
              <td class="texto-negrita">${num(c.valor)}</td>
              <td><div class="porcentaje"><div class="barra barra--gruesa"><div class="barra__relleno" style="width:${pct}%;background:${c.color}"></div></div><span>${pct}%</span></div></td>
              <td>${variacion(c, 'tendencia')}</td>
            </tr>`
          }).join('')}
          </tbody>
        </table>
      </div>
    </section>`
}

function calificaciones(calificacionesLista, eventos) {
  const total = calificacionesLista.length
  const promedio = total ? calificacionesLista.reduce((s, r) => s + r.estrellas, 0) / total : 0
  const porEvento = eventos.map(ev => {
    const lista = calificacionesLista.filter(r => r.eventoId === ev.id)
    return { nombre: ev.nombre, ciudad: ev.ciudad, cantidad: lista.length, promedio: lista.length ? lista.reduce((s, r) => s + r.estrellas, 0) / lista.length : 0 }
  }).filter(e => e.cantidad > 0).sort((a, b) => b.promedio - a.promedio)

  return `
    <section class="tarjeta tarjeta--relleno">
      <div class="calificaciones-admin__cabecera">
        <div class="calificaciones-admin__icono">${icono('estrella', 18, { relleno: '#f59e0b' })}</div>
        <div>
          <h3 class="seccion-titulo seccion-titulo--sm">Calificaciones de eventos</h3>
          <p class="seccion-subtitulo">Percepción de los clientes sobre los eventos de la plataforma</p>
        </div>
      </div>
      <div class="grid-3">
        <div class="cuadro-cifra" style="background:#fffbeb"><strong>${promedio.toFixed(1)}</strong>${estrellas(promedio, 14)}<small>Calificación promedio</small></div>
        <div class="cuadro-cifra" style="background:#f0fdf4"><strong>${total}</strong><small>Total de calificaciones</small></div>
        <div class="cuadro-cifra" style="background:#eef2ff"><strong>${porEvento.length}</strong><small>Eventos con calificaciones</small></div>
      </div>
      ${porEvento.length ? `
      <p class="ranking__titulo">Eventos mejor calificados</p>
      <div class="ranking">${porEvento.slice(0, 5).map((ev, i) => `
        <div>
          <span class="ranking__puesto${i === 0 ? ' ranking__puesto--primero' : ''}">${i + 1}</span>
          <div class="ranking__evento"><p>${esc(ev.nombre)}</p><small>${esc(ev.ciudad)}</small></div>
          <div class="ranking__puntaje">${estrellas(ev.promedio, 12)}<strong>${ev.promedio.toFixed(1)}</strong><small>(${ev.cantidad})</small></div>
        </div>`).join('')}
      </div>` : ''}
    </section>`
}

function ultimosRegistros() {
  const tipos = Object.values(TIPOS_REGISTRO).map(t => `<option>${t.texto}</option>`).join('')
  const estados = Object.keys(COLOR_ESTADO).map(e => `<option>${e}</option>`).join('')
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera tarjeta__cabecera--arriba">
        <div>
          <h2 class="tarjeta__titulo">Últimos registros</h2>
          <p class="tarjeta__subtitulo" id="conteo-registros"></p>
        </div>
        <div class="filtros-cabecera">
          <span class="etiqueta-filtros">${icono('filtro', 13)}Filtros:</span>
          <div class="envoltura-select envoltura-select--chica"><select class="selector" id="filtro-tipo" aria-label="Tipo"><option value="Todos">Todos los tipos</option>${tipos}</select></div>
          <div class="envoltura-select envoltura-select--chica"><select class="selector" id="filtro-estado" aria-label="Estado"><option value="Todos">Todos los estados</option>${estados}</select></div>
          <button type="button" class="boton-limpiar-mini" id="limpiar-filtros" hidden>${icono('cerrar', 12)}Limpiar filtros</button>
        </div>
      </div>
      <div class="tabla-contenedor">
        <table class="tabla tabla--amplia">
          <thead><tr><th>Tipo</th><th>Descripción</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody id="tabla-registros"></tbody>
        </table>
      </div>
      <div class="tarjeta__pie">
        <span id="pie-registros"></span>
        <a href="/pages/admin/reportes-generales.html" class="enlace-reporte">Ver historial completo →</a>
      </div>
    </section>`
}

export const ReportesGeneralesView = {
  mostrar(datos, periodo) {
    const cats = categorias(datos.totales)
    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--5" aria-label="Indicadores">${cats.map(c => kpi(c, datos.totales.reservas)).join('')}</section>

      <div class="grid-5">
        ${distribucion(cats)}
        <section class="tarjeta tarjeta--recortada col-3">
          <div class="tarjeta__cabecera">
            <div>
              <h2 class="tarjeta__titulo">Reservas y eventos</h2>
              <p class="tarjeta__subtitulo">Comparativa mensual ${periodo === 'todo' ? 'Todo el período' : periodo}</p>
            </div>
            ${leyenda([{ color: '#4f46e5', texto: 'Reservas' }, { color: '#f4845f', texto: 'Eventos' }])}
          </div>
          <div class="tarjeta__cuerpo">
            <div class="grafica grafica--260"><canvas id="grafica-reservas-eventos" aria-label="Reservas y eventos por mes"></canvas></div>
          </div>
        </section>
      </div>

      ${resumen(cats)}
      ${calificaciones(datos.calificaciones, datos.eventos)}
      ${ultimosRegistros()}
      <div class="espacio-final"></div>`

    const usuarios = cats.slice(0, 3)
    const totalUsuarios = usuarios.reduce((s, c) => s + c.valor, 0)
    graficoDona(document.getElementById('grafica-usuarios'), {
      etiquetas: usuarios.map(c => c.tipo), datos: usuarios.map(c => c.valor), colores: usuarios.map(c => c.color),
      formatoTooltip: (c) => ` ${c.label}: ${num(c.raw)} (${(c.raw / totalUsuarios * 100).toFixed(1)}%)`,
    })
    graficoBarras(document.getElementById('grafica-reservas-eventos'), {
      etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], separacion: 0.6,
      series: [
        { nombre: 'Reservas', datos: datos.reservasEventosMes.reservas, color: '#4f46e5', anchoBarra: 0.8 },
        { nombre: 'Eventos', datos: datos.reservasEventosMes.eventos, color: '#f4845f', anchoBarra: 0.8 },
      ],
    })
  },

  /** Dibuja las filas de "Últimos registros" según los filtros */
  registros(lista, total, hayFiltros) {
    document.getElementById('conteo-registros').textContent = `${lista.length} ${plural(lista.length, 'registro')} ${plural(lista.length, 'encontrado')}`
    document.getElementById('pie-registros').textContent = `Mostrando ${lista.length} de ${total} registros`
    document.getElementById('limpiar-filtros').hidden = !hayFiltros
    document.getElementById('tabla-registros').innerHTML = lista.length === 0
      ? '<tr><td colspan="4" class="tabla__vacia">No se encontraron registros con los filtros seleccionados.</td></tr>'
      : lista.map(r => {
          const t = TIPOS_REGISTRO[r.type]
          const [fondo, color] = COLOR_ESTADO[r.estado] || ['#f3f4f6', '#6b7280']
          return `
          <tr>
            <td><span class="insignia insignia--tono" style="--fondo-icono:${t.fondo};--color-icono:${t.color}"><span class="insignia__punto"></span>${t.texto}</span></td>
            <td class="texto-medio">${esc(r.descripcion)}</td>
            <td class="texto-fecha">${esc(r.fecha)}</td>
            <td><span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(r.estado)}</span></td>
          </tr>`
        }).join('')
  },
}
