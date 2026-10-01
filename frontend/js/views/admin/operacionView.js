// js/views/admin/operacionView.js
// VISTA de "Reservas y operación" del administrador.

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoDona } from '../componentes/graficos.js'
import { paginacion } from '../componentes/paginacion.js'
import { esc, cop, num } from '../../utils/formato.js'

const COLORES_CAUSA = ['#4f46e5', '#f4845f', '#d97706', '#dc2626', '#6b7280']
const COLORES_RESERVA = { Pendiente: ['#fffbeb', '#d97706'], Confirmada: ['#ecfdf5', '#059669'], Cancelada: ['#fef2f2', '#dc2626'] }
const TIPOS_ACTIVIDAD = {
  'reserva-nueva':      ['#eef2ff', '#4f46e5', 'Nueva reserva'],
  'reserva-confirmada': ['#ecfdf5', '#059669', 'Confirmación'],
  'reserva-cancelada':  ['#fef2f2', '#dc2626', 'Reserva cancelada'],
  'evento-cancelado':   ['#fff7f5', '#f4845f', 'Evento cancelado'],
  'evento-nuevo':       ['#f5f3ff', '#7c3aed', 'Nuevo evento'],
}
const ESTADOS_ACTIVIDAD = {
  Confirmada: ['#ecfdf5', '#047857'], Pendiente: ['#fffbeb', '#b45309'], Cancelada: ['#fef2f2', '#dc2626'],
  Cancelado: ['#fef2f2', '#dc2626'], Programado: ['#eef2ff', '#4338ca'],
}

const insignia = (fondo, color, texto) =>
  `<span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(texto)}</span>`
export const insigniaReserva = (estado) => insignia(...COLORES_RESERVA[estado], estado)
const chipRojo = (v) => `<span class="chip-numero" style="background:#fef2f2;color:#dc2626">${v}</span>`

/** Primera parte de la causa: "Problemas de pago — tarjeta rechazada" → "Problemas de pago" */
export const causaCorta = (causa) => causa?.split(' —')[0] ?? 'Otro'

/** Cuenta cuántas veces aparece cada causa, de mayor a menor */
export function contarCausas(lista, obtenerCausa) {
  const mapa = {}
  lista.forEach(x => { const c = obtenerCausa(x); mapa[c] = (mapa[c] || 0) + 1 })
  return Object.entries(mapa).sort((a, b) => b[1] - a[1])
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

export const OperacionView = {
  filtros({ eventos, agentes, paises, ciudades }) {
    const campo = (id, etiqueta, lista) => `
      <div class="filtro-columna">
        <label for="${id}">${etiqueta}</label>
        <div class="envoltura-select envoltura-select--chica"><select class="selector" id="${id}"><option>Todos</option>${lista.map(o => `<option>${esc(o)}</option>`).join('')}</select></div>
      </div>`
    document.getElementById('barra-filtros').innerHTML =
      campo('f-evento', 'Evento', eventos) + campo('f-agente', 'Agente', agentes) +
      campo('f-estado', 'Estado reserva', ['Pendiente', 'Confirmada', 'Cancelada']) +
      campo('f-pais', 'País', paises) + campo('f-ciudad', 'Ciudad', ciudades) + `
      <div class="filtros-botones">
        <button type="submit" class="boton boton--primario boton--mini">Aplicar</button>
        <button type="button" class="boton boton--mini boton-limpiar-mini" id="f-limpiar" hidden>Limpiar</button>
      </div>`
  },

  mostrar(d, periodo) {
    const canceladas = d.reservas.filter(r => r.estado === 'Cancelada')
    const confirmadas = d.reservas.filter(r => r.estado === 'Confirmada').length
    const pendientes = d.reservas.filter(r => r.estado === 'Pendiente').length
    const causasReservas = contarCausas(canceladas, r => causaCorta(r.causaCancelacion))
    const causasEventos = contarCausas(d.eventosCancelados, e => e.causa)
    const afectadas = d.eventosCancelados.reduce((s, e) => s + e.reservasAfectadas, 0)

    const resumen = [
      ['Total reservas', d.reservas.length, '#4f46e5', '#eef2ff'], ['Reservas confirmadas', confirmadas, '#059669', '#ecfdf5'],
      ['Reservas pendientes', pendientes, '#d97706', '#fffbeb'], ['Reservas canceladas', canceladas.length, '#dc2626', '#fef2f2'],
      ['Total eventos', d.totalEventos, '#7c3aed', '#f5f3ff'], ['Eventos activos', d.eventosActivos, '#4f46e5', '#eef2ff'],
      ['Eventos finalizados', d.eventosFinalizados, '#6b7280', '#f3f4f6'], ['Eventos cancelados', d.eventosCancelados.length, '#dc2626', '#fef2f2'],
    ]

    document.getElementById('contenido').innerHTML = `
      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Reservas canceladas</h2><p class="seccion-subtitulo">Análisis de reservas con estado cancelado y sus causas</p></div>
        <div class="grid-kpi grid-kpi--4">
          ${kpi({ icono: 'prohibido', etiqueta: 'Reservas canceladas', valor: String(canceladas.length), color: '#dc2626', fondo: '#fef2f2', alerta: true })}
          ${kpi({ icono: 'actividad', etiqueta: 'Porcentaje canceladas', valor: (canceladas.length / d.reservas.length * 100).toFixed(1) + '%', color: '#d97706', fondo: '#fffbeb' })}
          <div id="kpi-valor-cancelado" class="contenido-kpi"></div>
          ${kpi({ icono: 'calendario', etiqueta: 'Causa más frecuente', valor: causasReservas[0]?.[0] ?? '—', sub: 'Reservas canceladas', color: '#7c3aed', fondo: '#f5f3ff' })}
        </div>
        <div class="tarjeta tarjeta--recortada">
          ${encabezado('Listado de reservas canceladas', '', 'conteo-canceladas')}
          <div class="tabla-contenedor">
            <table class="tabla tabla--compacta">
              <thead><tr><th>Cliente</th><th>Evento</th><th>Fecha reserva</th><th>Entradas</th><th>Valor total</th><th>Fecha cancelación</th><th>Causa</th><th>Agente</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
              <tbody id="tabla-canceladas"></tbody>
            </table>
          </div>
          <div id="paginacion"></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Causas de reservas canceladas', 'Distribución de cancelaciones de reservas por causa')}
        <div class="tarjeta__cuerpo causas">
          <div class="grafica grafica--240"><canvas id="grafica-causas-reservas" aria-label="Causas de reservas canceladas"></canvas></div>
          <div class="causas__lista">${causasReservas.map(([causa, n], i) => `
            <div>
              <span class="causas__nombre"><i class="punto-color punto-color--12" style="--color:${COLORES_CAUSA[i % 5]}"></i><span>${esc(causa)}</span></span>
              <span class="causas__valor"><span class="barra barra--gruesa"><span class="barra__relleno" style="display:block;width:${n / canceladas.length * 100}%;background:${COLORES_CAUSA[i % 5]}"></span></span><strong>${n}</strong></span>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Eventos cancelados</h2><p class="seccion-subtitulo">Análisis de eventos cancelados y su impacto en reservas</p></div>
        <div class="grid-kpi grid-kpi--4">
          ${kpi({ icono: 'prohibido', etiqueta: 'Eventos cancelados', valor: String(d.eventosCancelados.length), color: '#dc2626', fondo: '#fef2f2', alerta: true })}
          ${kpi({ icono: 'actividad', etiqueta: '% eventos cancelados', valor: (d.eventosCancelados.length / d.totalEventos * 100).toFixed(1) + '%', color: '#d97706', fondo: '#fffbeb' })}
          ${kpi({ icono: 'ticket', etiqueta: 'Reservas afectadas', valor: num(afectadas), color: '#4f46e5', fondo: '#eef2ff' })}
          ${kpi({ icono: 'calendario', etiqueta: 'Causa más frecuente', valor: causasEventos[0]?.[0] ?? '—', sub: 'Eventos cancelados', color: '#7c3aed', fondo: '#f5f3ff' })}
        </div>
        <div class="tarjeta tarjeta--recortada">
          ${encabezado('Listado de eventos cancelados', `${d.eventosCancelados.length} eventos cancelados`)}
          <div class="tabla-contenedor">
            <table class="tabla tabla--compacta">
              <thead><tr><th>Evento</th><th>Agente</th><th>País</th><th>Ciudad</th><th>Fecha evento</th><th>Reservas afect.</th><th>Fecha cancelación</th><th>Causa</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
              <tbody id="tabla-eventos-cancelados">${d.eventosCancelados.map((e, i) => `
                <tr>
                  <td class="sin-salto texto-seminegrita">${esc(e.nombre)}</td>
                  <td class="sin-salto">${esc(e.agente)}</td>
                  <td>${esc(e.pais)}</td>
                  <td>${esc(e.ciudad)}</td>
                  <td class="texto-fecha">${esc(e.fechaEvento)}</td>
                  <td class="texto-centro">${chipRojo(e.reservasAfectadas)}</td>
                  <td class="texto-fecha">${esc(e.fechaCancelacion)}</td>
                  <td><span class="pildora-roja pildora-roja--libre">${esc(e.causa)}</span></td>
                  <td><button type="button" class="boton-ver boton-ver--rojo" data-evento="${i}">${icono('ojo', 13)}Ver detalle</button></td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="tarjeta__pie">${d.eventosCancelados.length} eventos cancelados</div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Causas de eventos cancelados', 'Distribución de cancelaciones de eventos por causa')}
        <div class="tarjeta__cuerpo"><div class="grafica grafica--220"><canvas id="grafica-causas-eventos" aria-label="Causas de eventos cancelados"></canvas></div></div>
      </section>

      <section class="seccion seccion--estrecha">
        <div><h2 class="seccion-titulo">Resumen operativo</h2><p class="seccion-subtitulo">Indicadores generales de reservas y eventos en ${periodo}</p></div>
        <div class="resumen-operativo">${resumen.map(([etq, val, color, fondo]) => `
          <div style="--color-icono:${color};--fondo-icono:${fondo}">
            <div class="resumen-operativo__icono"><span></span></div>
            <div><strong>${val}</strong><small>${etq}</small></div>
          </div>`).join('')}
        </div>
        <div class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><h3 class="seccion-titulo seccion-titulo--sm">Comparativa de reservas por estado</h3></div>
          <div class="tarjeta__cuerpo"><div class="grafica grafica--180"><canvas id="grafica-estados" aria-label="Reservas por estado"></canvas></div></div>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        ${encabezado('Actividad reciente', 'Últimas operaciones relacionadas con reservas y eventos')}
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Tipo</th><th>Descripción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>${d.actividad.map(a => {
              const [fondo, color, texto] = TIPOS_ACTIVIDAD[a.tipo]
              const [f2, c2] = ESTADOS_ACTIVIDAD[a.estado] || ['#f3f4f6', '#6b7280']
              return `
              <tr>
                <td>${insignia(fondo, color, texto)}</td>
                <td class="celda-descripcion">${esc(a.descripcion)}</td>
                <td class="sin-salto texto-medio">${esc(a.usuario)}</td>
                <td class="texto-fecha">${esc(a.fecha)}</td>
                <td>${insignia(f2, c2, a.estado)}</td>
              </tr>`
            }).join('')}
            </tbody>
          </table>
        </div>
        <div class="tarjeta__pie">${d.actividad.length} operaciones recientes</div>
      </section>
      <div class="espacio-final"></div>`

    graficoDona(document.getElementById('grafica-causas-reservas'), {
      etiquetas: causasReservas.map(c => c[0]), datos: causasReservas.map(c => c[1]), colores: COLORES_CAUSA, minimoEtiqueta: 0.06,
      formatoTooltip: (c) => ` ${c.raw} ${c.raw === 1 ? 'cancelación' : 'cancelaciones'}`,
    })
    graficoBarras(document.getElementById('grafica-causas-eventos'), {
      etiquetas: causasEventos.map(c => c[0]), radio: 5, separacion: 0.45,
      series: [{ nombre: 'Eventos', datos: causasEventos.map(c => c[1]), color: causasEventos.map((_, i) => COLORES_CAUSA[i % 5]) }],
    })
    graficoBarras(document.getElementById('grafica-estados'), {
      etiquetas: ['Confirmadas', 'Pendientes', 'Canceladas'], radio: 5, separacion: 0.45,
      series: [{ nombre: 'Reservas', datos: [confirmadas, pendientes, canceladas.length], color: ['#059669', '#d97706', '#dc2626'] }],
    })
  },

  /** Lista de reservas canceladas (según los filtros) y KPI de su valor */
  canceladas(lista, pagina, porPagina) {
    const total = lista.reduce((s, r) => s + r.valor, 0)
    document.getElementById('kpi-valor-cancelado').outerHTML =
      `<div id="kpi-valor-cancelado" class="contenido-kpi">${kpi({ icono: 'dolar', etiqueta: 'Valor cancelaciones', valor: cop(total), color: '#4f46e5', fondo: '#eef2ff' })}</div>`
    document.getElementById('conteo-canceladas').textContent = `${lista.length} ${lista.length === 1 ? 'reserva cancelada' : 'reservas canceladas'}`
    const desde = (pagina - 1) * porPagina
    document.getElementById('tabla-canceladas').innerHTML = lista.length === 0
      ? '<tr><td colspan="9" class="tabla__vacia">Sin reservas canceladas.</td></tr>'
      : lista.slice(desde, desde + porPagina).map((r, i) => `
        <tr>
          <td class="sin-salto texto-seminegrita">${esc(r.cliente)}</td>
          <td class="celda-recortada">${esc(r.evento)}</td>
          <td class="texto-fecha">${esc(r.fechaReserva)}</td>
          <td class="texto-centro texto-negrita">${r.entradas}</td>
          <td class="sin-salto texto-negrita">${cop(r.valor)}</td>
          <td class="texto-fecha">${esc(r.fechaCancelacion || '')}</td>
          <td><span class="pildora-roja" title="${esc(causaCorta(r.causaCancelacion))}">${esc(causaCorta(r.causaCancelacion))}</span></td>
          <td class="sin-salto">${esc(r.agente)}</td>
          <td><button type="button" class="boton-ver boton-ver--rojo" data-reserva="${desde + i}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
    document.getElementById('paginacion').innerHTML = paginacion(pagina, lista.length, porPagina, '', {
      siempre: true, texto: ({ total: t }) => `${t} ${t === 1 ? 'registro' : 'registros'}`,
    })
  },

  modalReserva(r) {
    const datos = [['Cliente', r.cliente], ['Correo', r.correo], ['Evento', r.evento], ['Agente', r.agente],
      ['Fecha de reserva', r.fechaReserva], ['Fecha del evento', r.fechaEvento], ['Hora del evento', r.hora], ['Ciudad', r.ciudad]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Detalle de reserva</h3>${insigniaReserva(r.estado)}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo modal__cuerpo--junto">
        <div class="datos-grid">${datos.map(([e, v]) => `<div class="dato"><p class="dato__etiqueta">${e}</p><p class="dato__valor">${esc(v)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Entradas</p><p class="dato-destacado__valor dato-destacado__valor--medio">${r.entradas}</p></div>
          <div class="dato-destacado" style="background:#ecfdf5;color:#059669"><p class="dato-destacado__etiqueta">Valor total</p><p class="dato-destacado__valor dato-destacado__valor--medio">${cop(r.valor)}</p></div>
        </div>
        ${r.estado === 'Cancelada' ? `<div class="alerta alerta--roja"><div><p class="alerta__titulo">Causa de cancelación</p><p class="alerta__texto">${esc(r.causaCancelacion)}</p>${r.fechaCancelacion ? `<p>Cancelada el ${esc(r.fechaCancelacion)}</p>` : ''}</div></div>` : ''}
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--seminegrita boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },

  modalEvento(e) {
    const datos = [['Agente', e.agente], ['País', e.pais], ['Departamento', e.departamento], ['Ciudad', e.ciudad],
      ['Fecha del evento', e.fechaEvento], ['Hora', e.hora], ['Fecha cancelación', e.fechaCancelacion]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Evento cancelado</h3>${insignia('#fef2f2', '#dc2626', 'Cancelado')}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo modal__cuerpo--junto">
        <div class="caja-nombre"><small>Nombre del evento</small><p>${esc(e.nombre)}</p></div>
        <div class="datos-grid">${datos.map(([etq, v]) => `<div class="dato"><p class="dato__etiqueta">${etq}</p><p class="dato__valor">${esc(v)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Capacidad</p><p class="dato-destacado__valor">${num(e.capacidad)}</p></div>
          <div class="dato-destacado" style="background:#fef2f2;color:#dc2626"><p class="dato-destacado__etiqueta">Reservas afectadas</p><p class="dato-destacado__valor">${num(e.reservasAfectadas)}</p></div>
        </div>
        <div class="alerta alerta--roja"><div><p class="alerta__titulo">Causa de cancelación</p><p class="alerta__texto">${esc(e.causa)}</p></div></div>
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--seminegrita boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },
}
