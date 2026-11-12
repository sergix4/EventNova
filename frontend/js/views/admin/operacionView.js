// js/views/admin/operacionView.js
// VISTA de "Reservas y operación" del administrador.
// Solo DIBUJA: recibe los datos REALES que el controlador trajo de
// GET /api/reportes/operacion y los convierte en HTML y gráficas (Chart.js).
//   10.1 Historial de reservas por cliente (selector de cliente + buscador)
//   10.2 Reservas canceladas con causa, fecha y quién canceló
//        + cancelaciones PARCIALES de entradas (tabla CANCELACION_ENTRADAS)
//   10.3 Eventos cancelados con su causa y las reservas afectadas
//   Resumen operativo y actividad reciente

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoDona } from '../componentes/graficos.js'
import { paginacion } from '../componentes/paginacion.js'
import { esc, cop, num } from '../../utils/formato.js'
import { fechaCorta, hora12, insigniaEstado } from './coberturaView.js'

// Los nombres son IGUALES a los de la tabla ESTADO_RESERVA (seed_estados.sql)
const COLORES_RESERVA = { Reservada: ['#fffbeb', '#d97706'], Confirmada: ['#ecfdf5', '#059669'], Cancelada: ['#fef2f2', '#dc2626'] }
export const ESTADOS_RESERVA = Object.keys(COLORES_RESERVA)
// Quién canceló (RESERVA.cancelada_por / CANCELACION_ENTRADAS.cancelada_por)
const COLORES_QUIEN = { Cliente: ['#eef2ff', '#4f46e5'], Agente: ['#fff7f5', '#f4845f'], Administrador: ['#f5f3ff', '#7c3aed'], Sistema: ['#ecfeff', '#0891b2'], 'Sin registro': ['#f3f4f6', '#6b7280'] }
export const QUIENES = Object.keys(COLORES_QUIEN)
const COLORES_CAUSA = ['#4f46e5', '#f4845f', '#d97706', '#dc2626', '#059669', '#6b7280']
const TIPOS_ACTIVIDAD = {
  'reserva-nueva':       ['#eef2ff', '#4f46e5', 'Nueva reserva'],
  'reserva-cancelada':   ['#fef2f2', '#dc2626', 'Reserva cancelada'],
  'entradas-canceladas': ['#fffbeb', '#d97706', 'Entradas canceladas'],
  'evento-cancelado':    ['#fff7f5', '#f4845f', 'Evento cancelado'],
}
const ESTADOS_ACTIVIDAD = { ...COLORES_RESERVA, Cancelado: ['#fef2f2', '#dc2626'], Parcial: ['#fffbeb', '#b45309'] }

const insignia = (fondo, color, texto) =>
  `<span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(texto)}</span>`
export const insigniaReserva = (estado) => insignia(...(COLORES_RESERVA[estado] || ['#f3f4f6', '#6b7280']), estado)
const insigniaQuien = (quien) => insignia(...COLORES_QUIEN[quien || 'Sin registro'], quien || 'Sin registro')
const chip = (valor, fondo, color) => `<span class="chip-numero" style="background:${fondo};color:${color}">${valor}</span>`
const sinDatos = (texto) => `<p class="mensaje-tarjeta-vacia">${esc(texto)}</p>`
const corto = (texto, max = 28) => texto.length > max ? texto.slice(0, max) + '…' : texto
const plural = (n, palabra, pl = palabra + 's') => `${num(n)} ${n === 1 ? palabra : pl}`
const porcentaje = (parte, total) => total > 0 ? (parte / total * 100).toFixed(1) + '%' : '0.0%'

/** "2026-11-05 13:32" → "5 nov 2026" y debajo "1:32 PM" (para celdas angostas) */
function celdaFechaHora(texto) {
  if (!texto) return '—'
  const [fecha, hora] = texto.split(' ')
  return `${fechaCorta(fecha)}<p class="texto-fecha">${hora12(hora)}</p>`
}

/** "2026-11-05 13:32" → "5 nov 2026, 1:32 PM" */
export function fechaHora(texto) {
  if (!texto) return '—'
  const [fecha, hora] = texto.split(' ')
  return `${fechaCorta(fecha)}, ${hora12(hora)}`
}

/**
 * Agrupa la causa para las gráficas (en las tablas se ve la causa completa):
 *   "Evento cancelado por el organizador: ..." → "Evento cancelado"
 *   "Cancelada por el cliente." (el cliente no escribió causa) → "El cliente no indicó causa"
 */
export function grupoCausa(causa) {
  const texto = (causa || '').trim()
  if (!texto) return 'Sin causa registrada'
  if (texto.startsWith('Evento cancelado por el organizador')) return 'Evento cancelado'
  if (texto === 'Cancelada por el cliente.') return 'El cliente no indicó causa'
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Cuenta cuántas veces aparece cada valor, de mayor a menor: [['Agente', 5], ...] */
export function contar(lista, obtener) {
  const mapa = new Map()
  lista.forEach(x => { const c = obtener(x); mapa.set(c, (mapa.get(c) || 0) + 1) })
  return [...mapa.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

/** Las 5 más frecuentes y el resto sumado en "Otras causas" */
function topCausas(conteo, max = 5) {
  if (conteo.length <= max + 1) return conteo
  const resto = conteo.slice(max).reduce((t, [, n]) => t + n, 0)
  return [...conteo.slice(0, max), ['Otras causas', resto]]
}

function kpi({ icono: ic, etiqueta, valor, sub, color, fondo, alerta }) {
  return `
    <article class="kpi" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__icono kpi__icono--grande">${icono(ic, 20)}</div>
      <div>
        <p class="kpi__valor kpi__valor--ajustado">${esc(valor)}</p>
        <p class="kpi__etiqueta kpi__etiqueta--fuerte">${etiqueta}</p>
        ${sub ? `<p class="kpi__sub">${sub}</p>` : ''}
        ${alerta ? `<span class="kpi__alerta">${icono('tendenciaAbajo', 12)}Requiere atención</span>` : ''}
      </div>
    </article>`
}

function encabezado(titulo, subtitulo, id = '') {
  return `<div class="tarjeta__cabecera"><div><h2 class="tarjeta__titulo">${titulo}</h2><p class="tarjeta__subtitulo"${id ? ` id="${id}"` : ''}>${subtitulo}</p></div></div>`
}

function selectFiltro(id, etiqueta, ancho = true) {
  return `
    <div class="campo">
      <label class="campo__etiqueta" for="${id}">${etiqueta}</label>
      <div class="envoltura-select"><select class="selector selector--filtro${ancho ? ' selector--ancho' : ''}" id="${id}"></select></div>
    </div>`
}

/** Celda de entradas: "2" y debajo "−1 cancelada" si hubo cancelación parcial */
function celdaEntradas(r) {
  return `<strong>${num(r.entradas)}</strong>${r.entradas_canceladas > 0
    ? `<p class="texto-fecha texto-rojo">−${plural(r.entradas_canceladas, 'cancelada')}</p>` : ''}`
}

export const OperacionView = {
  /** Llena el selector de período: "Todo el período" + los años con movimiento */
  mostrarPeriodos(anios, seleccionado) {
    const select = document.getElementById('periodo')
    if (!select) return
    const lista = [{ valor: 'todos', texto: 'Todo el período' }, ...anios.map(a => ({ valor: String(a), texto: String(a) }))]
    select.innerHTML = lista
      .map(o => `<option value="${o.valor}"${o.valor === String(seleccionado) ? ' selected' : ''}>${o.texto}</option>`)
      .join('')
  },

  mostrarCargando() {
    document.getElementById('contenido').innerHTML = sinDatos('Cargando reporte de reservas y operación…')
  },

  mostrarError(mensaje) {
    document.getElementById('contenido').innerHTML = `<div class="vacio"><p class="vacio__texto">${esc(mensaje)}</p></div>`
  },

  mostrar(d) {
    const periodo = d.anio === 'todos' ? 'todos los años' : d.anio
    const { reservas: rs, eventos: ev } = d.resumen
    const canceladas = d.reservas.filter(r => r.estado === 'Cancelada')
    const causasReservas = contar(canceladas, r => grupoCausa(r.causa))
    const quienes = contar(canceladas, r => r.cancelada_por || 'Sin registro')
    const causasEventos = contar(d.eventosCancelados, e => grupoCausa(e.causa))
    const afectadas = d.eventosCancelados.reduce((t, e) => t + e.reservas_afectadas, 0)

    const resumen = [
      ['Total reservas', rs.total, '#4f46e5', '#eef2ff'], ['Reservas confirmadas', rs.confirmadas, '#059669', '#ecfdf5'],
      ['Reservas pendientes (Reservada)', rs.reservadas, '#d97706', '#fffbeb'], ['Reservas canceladas', rs.canceladas, '#dc2626', '#fef2f2'],
      ['Total eventos', ev.total, '#7c3aed', '#f5f3ff'], ['Eventos activos', ev.activos, '#4f46e5', '#eef2ff'],
      ['Eventos finalizados', ev.finalizados, '#6b7280', '#f3f4f6'], ['Eventos cancelados', ev.cancelados, '#dc2626', '#fef2f2'],
    ]

    document.getElementById('contenido').innerHTML = `
      <!-- ═══ 10.1 Historial de reservas por cliente ═══ -->
      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Historial de reservas por cliente</h2><p class="seccion-subtitulo">Elige un cliente o búscalo por nombre, correo, evento o código de reserva · reservas hechas en ${esc(periodo)}</p></div>
        <div class="tarjeta tarjeta--recortada">
          <form class="filtros-cobertura" id="form-historial">
            ${selectFiltro('h-cliente', 'Cliente')}
            ${selectFiltro('h-estado', 'Estado de la reserva', false)}
            <div class="campo">
              <label class="campo__etiqueta" for="h-buscar">Buscar</label>
              <div class="buscador buscador--operacion"><span class="buscador__icono">${icono('buscar', 15)}</span><input class="entrada" id="h-buscar" type="search" placeholder="Nombre, correo, evento o RES-00012" autocomplete="off"></div>
            </div>
            <div class="filtros-cobertura__botones">
              <button type="button" class="boton boton--neutro boton-limpiar" id="h-limpiar">Limpiar</button>
            </div>
          </form>
          <div id="ficha-cliente"></div>
        </div>
        <div class="tarjeta tarjeta--recortada">
          ${encabezado('Reservas del cliente', '', 'conteo-historial')}
          <div class="tabla-contenedor">
            <table class="tabla tabla--compacta">
              <thead><tr><th>Reserva</th><th>Cliente</th><th>Evento</th><th class="texto-centro">Entradas</th><th>Valor</th><th>Estado</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
              <tbody id="tabla-historial"></tbody>
            </table>
          </div>
          <div id="paginacion-historial"></div>
        </div>
      </section>

      <!-- ═══ 10.2 Reservas canceladas ═══ -->
      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Reservas canceladas</h2><p class="seccion-subtitulo">Reservas canceladas completas, con su causa, fecha y quién las canceló</p></div>
        <div class="grid-kpi grid-kpi--4">
          ${kpi({ icono: 'prohibido', etiqueta: 'Reservas canceladas', valor: num(rs.canceladas), sub: `de ${plural(rs.total, 'reserva')}`, color: '#dc2626', fondo: '#fef2f2', alerta: rs.canceladas > 0 })}
          ${kpi({ icono: 'actividad', etiqueta: 'Porcentaje canceladas', valor: porcentaje(rs.canceladas, rs.total), color: '#d97706', fondo: '#fffbeb' })}
          ${kpi({ icono: 'dolar', etiqueta: 'Valor cancelado', valor: cop(rs.valorCancelado), sub: 'Suma del valor de las reservas canceladas', color: '#4f46e5', fondo: '#eef2ff' })}
          ${kpi({ icono: 'usuario', etiqueta: 'Quién cancela más', valor: quienes[0]?.[0] ?? '—', sub: quienes[0] ? plural(quienes[0][1], 'cancelación', 'cancelaciones') : 'Sin cancelaciones', color: '#7c3aed', fondo: '#f5f3ff' })}
        </div>
        <div class="tarjeta tarjeta--recortada">
          ${encabezado('Listado de reservas canceladas', '', 'conteo-canceladas')}
          <form class="filtros-cobertura" id="form-canceladas">
            ${selectFiltro('c-quien', 'Cancelada por', false)}
            ${selectFiltro('c-agente', 'Agente')}
            ${selectFiltro('c-evento', 'Evento')}
            <div class="filtros-cobertura__botones">
              <button type="button" class="boton boton--neutro boton-limpiar" id="c-limpiar">Limpiar</button>
            </div>
          </form>
          <div class="tabla-contenedor">
            <table class="tabla tabla--compacta">
              <thead><tr><th>Reserva</th><th>Evento</th><th class="texto-centro">Entradas</th><th>Valor</th><th>Cancelada el</th><th>Causa</th><th>Canceló</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
              <tbody id="tabla-canceladas"></tbody>
            </table>
          </div>
          <div id="paginacion-canceladas"></div>
        </div>
      </section>

      <div class="grid-2">
        <section class="tarjeta tarjeta--recortada">
          ${encabezado('¿Quién canceló?', 'Reservas canceladas según quién hizo la cancelación')}
          <div class="tarjeta__cuerpo">
            ${canceladas.length ? `
            <div class="grafica grafica--240"><canvas id="grafica-quien" aria-label="Reservas canceladas por quién canceló"></canvas></div>`
            : sinDatos('No hay reservas canceladas en este período.')}
          </div>
        </section>
        <section class="tarjeta tarjeta--recortada">
          ${encabezado('Causas de reservas canceladas', 'Las causas más frecuentes')}
          <div class="tarjeta__cuerpo">
            ${canceladas.length ? '<div class="grafica grafica--240"><canvas id="grafica-causas-reservas" aria-label="Causas de reservas canceladas"></canvas></div>' : sinDatos('No hay reservas canceladas en este período.')}
          </div>
        </section>
      </div>

      <!-- ═══ Cancelaciones parciales ═══ -->
      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Cancelaciones parciales de entradas', 'Se cancelaron solo algunas entradas: la reserva NO cambia de estado y sigue activa con las que quedan')}
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Reserva</th><th>Evento</th><th class="texto-centro">Entradas canceladas</th><th>Valor</th><th>Fecha</th><th>Causa</th><th>Canceló</th></tr></thead>
            <tbody>${d.parciales.length === 0 ? '<tr><td colspan="7" class="tabla__vacia">No hay cancelaciones parciales en este período.</td></tr>' : d.parciales.map(p => `
              <tr>
                <td class="sin-salto"><strong>${esc(p.codigo)}</strong><p class="texto-fecha">${esc(p.cliente)}</p></td>
                <td class="celda-recortada celda-recortada--corta" title="${esc(p.evento)}">${esc(p.evento)}</td>
                <td class="texto-centro">${chip(`${p.entradas_canceladas} de ${p.entradas_antes}`, '#fffbeb', '#d97706')}<p class="texto-fecha">Quedan ${p.entradas_actuales} · ${esc(p.estado_reserva)}</p></td>
                <td class="sin-salto texto-negrita">${cop(p.valor)}</td>
                <td class="texto-fecha sin-salto">${fechaCorta(p.fecha_cancelacion.split(' ')[0])}</td>
                <td><span class="pildora-roja" title="${esc(p.causa)}">${esc(corto(p.causa, 24))}</span></td>
                <td>${insigniaQuien(p.cancelada_por)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="tarjeta__pie">${plural(rs.parciales, 'cancelación parcial', 'cancelaciones parciales')} · ${plural(rs.entradasParciales, 'entrada cancelada', 'entradas canceladas')} · ${cop(rs.valorParcial)}</div>
      </section>

      <!-- ═══ 10.3 Eventos cancelados ═══ -->
      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Eventos cancelados</h2><p class="seccion-subtitulo">Eventos cancelados y su impacto en reservas · eventos que se realizan en ${esc(periodo)}</p></div>
        <div class="grid-kpi grid-kpi--4">
          ${kpi({ icono: 'prohibido', etiqueta: 'Eventos cancelados', valor: num(d.eventosCancelados.length), sub: `de ${plural(ev.total, 'evento')}`, color: '#dc2626', fondo: '#fef2f2', alerta: d.eventosCancelados.length > 0 })}
          ${kpi({ icono: 'actividad', etiqueta: '% eventos cancelados', valor: porcentaje(d.eventosCancelados.length, ev.total), color: '#d97706', fondo: '#fffbeb' })}
          ${kpi({ icono: 'ticket', etiqueta: 'Reservas afectadas', valor: num(afectadas), sub: 'Canceladas porque se canceló el evento', color: '#4f46e5', fondo: '#eef2ff' })}
          ${kpi({ icono: 'calendario', etiqueta: 'Causa más frecuente', valor: causasEventos[0] ? corto(causasEventos[0][0], 22) : '—', sub: causasEventos[0] ? `${plural(causasEventos[0][1], 'evento')} · ${esc(causasEventos[0][0])}` : 'Eventos cancelados', color: '#7c3aed', fondo: '#f5f3ff' })}
        </div>
        <div class="tarjeta tarjeta--recortada">
          ${encabezado('Listado de eventos cancelados', plural(d.eventosCancelados.length, 'evento cancelado', 'eventos cancelados'))}
          <div class="tabla-contenedor">
            <table class="tabla tabla--compacta">
              <thead><tr><th>Evento</th><th>Agente</th><th>Ciudad</th><th>Fecha evento</th><th>Fecha cancelación</th><th class="texto-centro">Reservas afect.</th><th>Causa</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
              <tbody>${d.eventosCancelados.length === 0 ? '<tr><td colspan="8" class="tabla__vacia">No hay eventos cancelados en este período.</td></tr>' : d.eventosCancelados.map(e => `
                <tr>
                  <td class="celda-nombre-evento"><strong>${esc(e.nombre)}</strong><p class="texto-fecha">${esc(e.codigo)}</p></td>
                  <td class="sin-salto">${esc(e.agente)}</td>
                  <td class="sin-salto">${esc(e.ciudad)} <small class="texto-gris">· ${esc(e.pais)}</small></td>
                  <td class="texto-fecha sin-salto">${fechaCorta(e.fecha_evento)}</td>
                  <td class="texto-fecha sin-salto">${celdaFechaHora(e.fecha_cancelacion)}</td>
                  <td class="texto-centro">${chip(e.reservas_afectadas, '#fef2f2', '#dc2626')}</td>
                  <td><span class="pildora-roja" title="${esc(e.causa || '')}">${esc(corto(e.causa || 'Sin causa registrada', 24))}</span></td>
                  <td><button type="button" class="boton-ver boton-ver--rojo" data-evento="${esc(e.codigo)}">${icono('ojo', 13)}Ver detalle</button></td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Reservas afectadas por evento cancelado', 'Cuántas reservas se cancelaron por cada evento cancelado')}
        <div class="tarjeta__cuerpo">
          ${d.eventosCancelados.length ? '<div class="grafica grafica--220"><canvas id="grafica-eventos" aria-label="Reservas afectadas por evento cancelado"></canvas></div>' : sinDatos('No hay eventos cancelados en este período.')}
        </div>
      </section>

      <!-- ═══ Resumen operativo ═══ -->
      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Resumen operativo</h2><p class="seccion-subtitulo">Indicadores generales de reservas y eventos · ${esc(periodo)}</p></div>
        <div class="resumen-operativo">${resumen.map(([etq, val, color, fondo]) => `
          <div style="--color-icono:${color};--fondo-icono:${fondo}">
            <div class="resumen-operativo__icono"><span></span></div>
            <div><strong>${num(val)}</strong><small>${etq}</small></div>
          </div>`).join('')}
        </div>
        <div class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><h3 class="seccion-titulo seccion-titulo--sm">Comparativa de reservas por estado</h3></div>
          <div class="tarjeta__cuerpo"><div class="grafica grafica--180"><canvas id="grafica-estados" aria-label="Reservas por estado"></canvas></div></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Actividad reciente', 'Últimas reservas, cancelaciones y eventos cancelados')}
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Tipo</th><th>Descripción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>${d.actividad.length === 0 ? '<tr><td colspan="5" class="tabla__vacia">Sin actividad en este período.</td></tr>' : d.actividad.map(a => {
              const [fondo, color, texto] = TIPOS_ACTIVIDAD[a.tipo]
              const [f2, c2] = ESTADOS_ACTIVIDAD[a.estado] || ['#f3f4f6', '#6b7280']
              return `
              <tr>
                <td class="sin-salto">${insignia(fondo, color, texto)}</td>
                <td class="celda-descripcion">${esc(a.descripcion)}</td>
                <td class="sin-salto texto-medio">${esc(a.usuario)}</td>
                <td class="texto-fecha sin-salto">${fechaHora(a.fecha)}</td>
                <td>${insignia(f2, c2, a.estado)}</td>
              </tr>`
            }).join('')}
            </tbody>
          </table>
        </div>
        <div class="tarjeta__pie">${plural(d.actividad.length, 'operación reciente', 'operaciones recientes')}</div>
      </section>
      <div class="espacio-final"></div>`

    // ── Gráficas ──
    if (canceladas.length) {
      graficoDona(document.getElementById('grafica-quien'), {
        etiquetas: quienes.map(q => q[0]), datos: quienes.map(q => q[1]), colores: quienes.map(q => COLORES_QUIEN[q[0]][1]),
        formatoTooltip: (c) => ` ${plural(c.raw, 'reserva')}`,
      })
      const top = topCausas(causasReservas)
      graficoBarras(document.getElementById('grafica-causas-reservas'), {
        etiquetas: top.map(c => corto(c[0])), horizontal: true, radio: 5, separacion: 0.7,
        series: [{ nombre: 'Reservas', datos: top.map(c => c[1]), color: top.map((_, i) => COLORES_CAUSA[i % COLORES_CAUSA.length]) }],
        formatoTooltip: (c) => ` ${plural(c.raw, 'reserva')} · ${top[c.dataIndex][0]}`,
      })
    }
    if (d.eventosCancelados.length) {
      const lista = d.eventosCancelados.slice(0, 8)
      graficoBarras(document.getElementById('grafica-eventos'), {
        etiquetas: lista.map(e => corto(e.nombre, 22)), radio: 5, separacion: 0.5,
        series: [{ nombre: 'Reservas afectadas', datos: lista.map(e => e.reservas_afectadas), color: '#dc2626' }],
        formatoTooltip: (c) => ` ${plural(c.raw, 'reserva')} · ${lista[c.dataIndex].causa || ''}`,
      })
    }
    graficoBarras(document.getElementById('grafica-estados'), {
      etiquetas: ['Confirmadas', 'Pendientes (Reservada)', 'Canceladas'], radio: 5, separacion: 0.45,
      series: [{ nombre: 'Reservas', datos: [rs.confirmadas, rs.reservadas, rs.canceladas], color: ['#059669', '#d97706', '#dc2626'] }],
    })
  },

  /** Llena un select: lista de { valor, texto }, conservando el elegido */
  opciones(id, lista, valor = 'Todos', textoTodos = 'Todos') {
    document.getElementById(id).innerHTML = `<option value="Todos">${esc(textoTodos)}</option>` + lista
      .map(o => `<option value="${esc(o.valor)}"${String(o.valor) === String(valor) ? ' selected' : ''}>${esc(o.texto)}</option>`)
      .join('')
  },

  /** Ficha del cliente elegido (oculta si se ven todos los clientes) */
  fichaCliente(cliente, reservas) {
    const caja = document.getElementById('ficha-cliente')
    if (!cliente) { caja.innerHTML = ''; return }
    const activas = reservas.filter(r => r.estado !== 'Cancelada')
    const parciales = reservas.reduce((t, r) => t + r.entradas_canceladas, 0)
    caja.innerHTML = `
      <div class="tarjeta__cuerpo ficha-cliente">
        <p class="ficha-cliente__nombre"><strong>${esc(cliente.nombre)}</strong> <span class="texto-gris">· ${esc(cliente.correo)}</span></p>
        <div class="grid-kpi grid-kpi--4">
          ${kpi({ icono: 'ticket', etiqueta: 'Reservas', valor: num(reservas.length), sub: `${num(activas.length)} activas`, color: '#4f46e5', fondo: '#eef2ff' })}
          ${kpi({ icono: 'usuarios', etiqueta: 'Entradas vigentes', valor: num(activas.reduce((t, r) => t + r.entradas, 0)), sub: parciales ? `${plural(parciales, 'entrada cancelada', 'entradas canceladas')} parcialmente` : 'Sin cancelaciones parciales', color: '#059669', fondo: '#ecfdf5' })}
          ${kpi({ icono: 'dolar', etiqueta: 'Valor de sus reservas', valor: cop(activas.reduce((t, r) => t + r.valor, 0)), sub: 'Sin contar las canceladas', color: '#d97706', fondo: '#fffbeb' })}
          ${kpi({ icono: 'prohibido', etiqueta: 'Reservas canceladas', valor: num(reservas.length - activas.length), color: '#dc2626', fondo: '#fef2f2' })}
        </div>
      </div>`
  },

  historial(pagina, total, paginaActual, porPagina) {
    document.getElementById('conteo-historial').textContent = plural(total, 'reserva encontrada', 'reservas encontradas')
    document.getElementById('tabla-historial').innerHTML = pagina.length === 0
      ? '<tr><td colspan="7" class="tabla__vacia">No se encontraron reservas con esos filtros.</td></tr>'
      : pagina.map(r => `
        <tr>
          <td class="sin-salto texto-seminegrita">${esc(r.codigo)}</td>
          <td class="sin-salto">${esc(r.cliente)}<p class="texto-fecha">Reservó: ${fechaHora(r.fecha_reserva)}</p></td>
          <td class="celda-recortada"><span title="${esc(r.evento)}">${esc(r.evento)}</span><p class="texto-fecha">Evento: ${fechaCorta(r.fecha_evento)}</p></td>
          <td class="texto-centro">${celdaEntradas(r)}</td>
          <td class="sin-salto texto-negrita">${cop(r.valor)}</td>
          <td>${insigniaReserva(r.estado)}</td>
          <td><button type="button" class="boton-ver" data-reserva="${r.id_reserva}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
    document.getElementById('paginacion-historial').innerHTML = paginacion(paginaActual, total, porPagina, 'reservas', { siempre: true })
  },

  canceladas(pagina, total, paginaActual, porPagina) {
    document.getElementById('conteo-canceladas').textContent = plural(total, 'reserva cancelada', 'reservas canceladas')
    document.getElementById('tabla-canceladas').innerHTML = pagina.length === 0
      ? '<tr><td colspan="8" class="tabla__vacia">Sin reservas canceladas con esos filtros.</td></tr>'
      : pagina.map(r => `
        <tr>
          <td class="sin-salto"><strong>${esc(r.codigo)}</strong><p class="texto-fecha">${esc(r.cliente)}</p></td>
          <td class="celda-recortada celda-recortada--corta" title="${esc(r.evento)}">${esc(r.evento)}</td>
          <td class="texto-centro texto-negrita">${num(r.entradas)}</td>
          <td class="sin-salto texto-negrita">${cop(r.valor)}</td>
          <td class="texto-fecha sin-salto">${celdaFechaHora(r.fecha_cancelacion)}</td>
          <td><span class="pildora-roja" title="${esc(r.causa || '')}">${esc(corto(grupoCausa(r.causa), 22))}</span></td>
          <td>${insigniaQuien(r.cancelada_por)}</td>
          <td><button type="button" class="boton-ver boton-ver--rojo" data-reserva="${r.id_reserva}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
    document.getElementById('paginacion-canceladas').innerHTML = paginacion(paginaActual, total, porPagina, '', {
      siempre: true, texto: ({ total: t }) => plural(t, 'registro'),
    })
  },

  /** Detalle de una reserva (con sus cancelaciones parciales, si tiene) */
  modalReserva(r, parciales) {
    const datos = [['Cliente', r.cliente], ['Correo', r.correo], ['Evento', `${r.evento} (${r.codigo_evento})`], ['Agente', r.agente],
      ['Fecha de reserva', fechaHora(r.fecha_reserva)], ['Fecha del evento', `${fechaCorta(r.fecha_evento)}, ${hora12(r.hora)}`],
      ['Ciudad', `${r.ciudad} · ${r.pais}`], ['Estado del evento', r.estado_evento]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Reserva ${esc(r.codigo)}</h3>${insigniaReserva(r.estado)}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo modal__cuerpo--junto">
        <div class="datos-grid">${datos.map(([e, v]) => `<div class="dato"><p class="dato__etiqueta">${e}</p><p class="dato__valor">${esc(v)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Entradas${r.entradas_canceladas ? ` · ${plural(r.entradas_canceladas, 'cancelada')}` : ''}</p><p class="dato-destacado__valor dato-destacado__valor--medio">${num(r.entradas)}</p></div>
          <div class="dato-destacado" style="background:#ecfdf5;color:#059669"><p class="dato-destacado__etiqueta">Valor total</p><p class="dato-destacado__valor dato-destacado__valor--medio">${cop(r.valor)}</p></div>
        </div>
        ${parciales.length ? `
        <div class="alerta alerta--ambar"><div>
          <p class="alerta__titulo">Cancelaciones parciales de entradas</p>
          ${parciales.map(p => `<p>${fechaCorta(p.fecha_cancelacion.split(' ')[0])} · ${p.cancelada_por} canceló ${p.entradas_canceladas} de ${p.entradas_antes} entradas (${cop(p.valor)}). Causa: ${esc(p.causa)}</p>`).join('')}
        </div></div>` : ''}
        ${r.estado === 'Cancelada' ? `
        <div class="alerta alerta--roja"><div>
          <p class="alerta__titulo">Reserva cancelada</p>
          <p class="alerta__texto">${esc(r.causa || 'Sin causa registrada')}</p>
          <p>Cancelada el ${fechaHora(r.fecha_cancelacion)} · por: <strong>${esc(r.cancelada_por || 'Sin registro')}</strong></p>
        </div></div>` : ''}
      </div>
      <div class="modal__pie">
        ${r.estado === 'Cancelada' ? `<button type="button" class="boton boton--rojo-contorno" data-eliminar-reserva>${icono('papelera', 15)}Eliminar reserva</button>` : ''}
        <button type="button" class="boton boton--primario boton--seminegrita" data-cerrar-modal>Cerrar</button>
      </div>`
  },

  /** Confirmación antes de ELIMINAR una reserva (CRUD de reservas · solo administrador) */
  confirmarEliminarReserva(r) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('papelera', 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Eliminar la reserva ${esc(r.codigo)}?</h3>
            <p class="confirmacion__texto">Se borrará de la base de datos la reserva de <strong>${esc(r.cliente)}</strong> para <strong>${esc(r.evento)}</strong> (${plural(r.entradas, 'entrada')}, ${cop(r.valor)}). Dejará de aparecer en todos los reportes. Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro boton--seminegrita" id="confirmar-eliminar">Eliminar</button>
        </div>
      </div>`
  },

  modalEvento(e) {
    const datos = [['Código', e.codigo], ['Agente', e.agente], ['País', e.pais], ['Departamento', e.departamento], ['Ciudad', e.ciudad],
      ['Teatro', e.teatro], ['Fecha del evento', `${fechaCorta(e.fecha_evento)}, ${hora12(e.hora)}`], ['Fecha de cancelación', fechaHora(e.fecha_cancelacion)]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">${esc(e.nombre)}</h3>${insigniaEstado('Cancelado')}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo modal__cuerpo--junto">
        <div class="datos-grid">${datos.map(([etq, v]) => `<div class="dato"><p class="dato__etiqueta">${etq}</p><p class="dato__valor">${esc(v)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Capacidad</p><p class="dato-destacado__valor">${num(e.capacidad)}</p></div>
          <div class="dato-destacado" style="background:#fef2f2;color:#dc2626"><p class="dato-destacado__etiqueta">Reservas afectadas · ${plural(e.entradas_afectadas, 'entrada')} · ${cop(e.valor_afectado)}</p><p class="dato-destacado__valor">${num(e.reservas_afectadas)}</p></div>
        </div>
        <div class="alerta alerta--roja"><div><p class="alerta__titulo">Causa de cancelación</p><p class="alerta__texto">${esc(e.causa || 'Sin causa registrada')}</p></div></div>
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--seminegrita boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },
}