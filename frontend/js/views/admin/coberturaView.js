// js/views/admin/coberturaView.js
// VISTA de "Cobertura y eventos" del administrador.
// Solo DIBUJA: recibe los datos REALES que el controlador trajo de
// GET /api/reportes/cobertura y los convierte en HTML y gráficas (Chart.js).
//   - KPIs: países, departamentos y ciudades con eventos, total de eventos
//   - Filtros encadenados país → departamento → ciudad (+ estado) con conteo
//   - Listado de eventos (código, nombre, ubicación, fecha, estado) paginado
//   - Gráficas por país y por departamento, ranking de ciudades y resumen

import { icono } from '../componentes/iconos.js'
import { graficoBarras } from '../componentes/graficos.js'
import { paginacion } from '../componentes/paginacion.js'
import { esc, num, cop } from '../../utils/formato.js'

// Los nombres son IGUALES a los de la tabla ESTADO (seed_estados.sql)
const COLORES_ESTADO = {
  'Programado': ['#eef2ff', '#4f46e5'], 'En Boletería': ['#fffbeb', '#d97706'], 'En Vivo': ['#ecfdf5', '#059669'],
  'Finalizado': ['#f3f4f6', '#6b7280'], 'Cancelado': ['#fef2f2', '#dc2626'],
}
export const ESTADOS = Object.keys(COLORES_ESTADO)
export const ESTADOS_ACTIVOS = ['Programado', 'En Boletería', 'En Vivo']
const COLORES_GRAFICA = ['#4f46e5', '#f4845f', '#059669', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#84cc16']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const chip = (valor, fondo, color) => `<span class="chip-numero" style="background:${fondo};color:${color}">${valor}</span>`
const sinDatos = (texto) => `<p class="mensaje-tarjeta-vacia">${esc(texto)}</p>`
const corto = (texto, max = 16) => texto.length > max ? texto.slice(0, max) + '…' : texto
const eventosTexto = (n) => `${num(n)} ${n === 1 ? 'evento' : 'eventos'}`

/** "2026-11-20" → "20 nov 2026" (sin pasar por Date para no correr el día por la zona horaria) */
export function fechaCorta(iso) {
  const [anio, mes, dia] = iso.split('-')
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${anio}`
}

/** "20:00" → "8:00 PM" */
export function hora12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export function insigniaEstado(estado) {
  const [fondo, color] = COLORES_ESTADO[estado] || ['#f3f4f6', '#6b7280']
  return `<span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

function selectFiltro(id, etiqueta, ancho = true) {
  return `
    <div class="campo">
      <label class="campo__etiqueta" for="${id}" id="etiqueta-${id}">${etiqueta}</label>
      <div class="envoltura-select"><select class="selector selector--filtro${ancho ? ' selector--ancho' : ''}" id="${id}"></select></div>
    </div>`
}

/** Totales por ciudad (reservas, activos, cancelados) a partir del listado de eventos */
function estadisticasPorCiudad(eventos) {
  const mapa = new Map()
  eventos.forEach(e => {
    const fila = mapa.get(e.id_ciudad) || { reservas: 0, activos: 0, cancelados: 0 }
    fila.reservas += e.reservas
    if (ESTADOS_ACTIVOS.includes(e.estado)) fila.activos++
    if (e.estado === 'Cancelado') fila.cancelados++
    mapa.set(e.id_ciudad, fila)
  })
  return mapa
}

export const CoberturaView = {
  /** Llena el selector de período: "Todo el período" + los años con eventos */
  mostrarPeriodos(anios, seleccionado) {
    const select = document.getElementById('periodo')
    if (!select) return
    const lista = [{ valor: 'todos', texto: 'Todo el período' }, ...anios.map(a => ({ valor: String(a), texto: String(a) }))]
    select.innerHTML = lista
      .map(o => `<option value="${o.valor}"${o.valor === String(seleccionado) ? ' selected' : ''}>${o.texto}</option>`)
      .join('')
  },

  /** Mientras llegan los datos */
  mostrarCargando() {
    document.getElementById('contenido').innerHTML = sinDatos('Cargando reporte de cobertura…')
  },

  /** Si la API responde con error (por ejemplo, se venció la sesión) */
  mostrarError(mensaje) {
    document.getElementById('contenido').innerHTML = `
      <div class="vacio">
        <p class="vacio__texto">${esc(mensaje)}</p>
      </div>`
  },

  mostrar({ anio, resumen, geografia, eventos }) {
    const periodo = anio === 'todos' ? 'todos los años' : anio
    const hay = eventos.length > 0
    const kpis = [
      { etiqueta: 'Países con eventos', sub: 'Países donde se realizan eventos', valor: resumen.paises, icono: 'globo', color: '#4f46e5', fondo: '#eef2ff' },
      { etiqueta: 'Departamentos con eventos', sub: 'Departamentos o estados con actividad', valor: resumen.departamentos, icono: 'mapa', color: '#d97706', fondo: '#fffbeb' },
      { etiqueta: 'Ciudades con eventos', sub: 'Ciudades cubiertas por la plataforma', valor: resumen.ciudades, icono: 'ubicacion', color: '#059669', fondo: '#ecfdf5' },
      { etiqueta: 'Total de eventos', sub: `${num(resumen.activos)} activos · ${num(resumen.finalizados)} finalizados · ${num(resumen.cancelados)} cancelados`, valor: resumen.totalEventos, icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff' },
    ]

    // Departamentos y ciudades de todos los países, de mayor a menor
    const departamentos = geografia
      .flatMap(p => p.departamentos.map(d => ({ ...d, pais: p.nombre })))
      .sort((a, b) => b.eventos - a.eventos)
    const ciudades = geografia
      .flatMap(p => p.departamentos.flatMap(d => d.ciudades.map(c => ({ ...c, departamento: d.nombre, pais: p.nombre }))))
      .sort((a, b) => b.eventos - a.eventos || a.nombre.localeCompare(b.nombre))

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--4" aria-label="Indicadores de cobertura">${kpis.map(k => `
        <article class="kpi kpi--holgado" style="--color-icono:${k.color};--fondo-icono:${k.fondo}">
          <div class="kpi__icono kpi__icono--grande">${icono(k.icono, 20)}</div>
          <div>
            <p class="kpi__valor kpi__valor--grande">${num(k.valor)}</p>
            <p class="kpi__etiqueta kpi__etiqueta--fuerte">${k.etiqueta}</p>
            <p class="kpi__sub">${k.sub}</p>
          </div>
        </article>`).join('')}
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Eventos por ubicación</h2>
          <p class="tarjeta__subtitulo">Elige país, luego departamento y luego ciudad. Entre paréntesis, el número de eventos (${esc(periodo)}).</p>
        </div></div>
        <form class="filtros-cobertura" id="form-filtros">
          ${selectFiltro('f-pais', 'País')}
          ${selectFiltro('f-depto', 'Departamento')}
          ${selectFiltro('f-ciudad', 'Ciudad')}
          ${selectFiltro('f-estado', 'Estado del evento', false)}
          <div class="filtros-cobertura__botones">
            <button type="submit" class="boton boton--primario boton--seminegrita">Aplicar filtros</button>
            <button type="button" class="boton boton--neutro boton-limpiar" id="limpiar-filtros">Limpiar</button>
          </div>
        </form>
        <div class="filtros-activos" id="filtros-activos" hidden></div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Listado de eventos por ubicación</h2>
          <p class="tarjeta__subtitulo" id="conteo-eventos"></p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta">
            <thead><tr><th>Evento</th><th>País</th><th>Departamento</th><th>Ciudad</th><th>Fecha</th><th>Agente</th><th>Estado</th><th class="texto-centro">Reservas</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
            <tbody id="tabla-eventos"></tbody>
          </table>
        </div>
        <div id="paginacion"></div>
      </section>

      <div class="grid-2">
        <section class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><div>
            <h2 class="tarjeta__titulo">Distribución de eventos por país</h2>
            <p class="tarjeta__subtitulo">Eventos que se realizan en cada país · ${esc(periodo)}</p>
          </div></div>
          <div class="tarjeta__cuerpo">
            ${hay ? `
            <div class="grafica grafica--220"><canvas id="grafica-paises" aria-label="Eventos por país"></canvas></div>
            <div class="leyenda-paises">${geografia.map((p, i) => `<span><i class="punto-color" style="--color:${COLORES_GRAFICA[i % 8]}"></i>${esc(p.nombre)} <small>(${p.eventos})</small></span>`).join('')}</div>`
            : sinDatos('No hay eventos en este período.')}
          </div>
        </section>
        <section class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><div>
            <h2 class="tarjeta__titulo">Eventos por departamento</h2>
            <p class="tarjeta__subtitulo">Los 8 departamentos con más eventos</p>
          </div></div>
          <div class="tarjeta__cuerpo">
            ${hay ? '<div class="grafica grafica--240"><canvas id="grafica-deptos" aria-label="Eventos por departamento"></canvas></div>' : sinDatos('No hay eventos en este período.')}
          </div>
        </section>
      </div>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Eventos por ciudad</h2>
          <p class="tarjeta__subtitulo">Ordenado de mayor a menor número de eventos</p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta tabla--media">
            <thead><tr><th>#</th><th>Ciudad</th><th>Departamento</th><th>País</th><th>Nº de eventos</th><th>Porcentaje del total</th></tr></thead>
            <tbody>${!hay ? '<tr><td colspan="6" class="tabla__vacia">No hay eventos en este período.</td></tr>' : ciudades.map((c, i) => {
              const pct = (c.eventos / resumen.totalEventos * 100).toFixed(1)
              return `
              <tr>
                <td class="texto-puesto">${i + 1}</td>
                <td><div class="celda-icono"><span class="ciudad-icono">${icono('ubicacion', 13, { grosor: 2.5 })}</span><strong>${esc(c.nombre)}</strong></div></td>
                <td>${esc(c.departamento)}</td>
                <td>${esc(c.pais)}</td>
                <td>${chip(c.eventos, '#f5f3ff', '#7c3aed')}</td>
                <td><div class="porcentaje"><div class="barra barra--gruesa"><div class="barra__relleno" style="width:${pct}%"></div></div><span>${pct}%</span></div></td>
              </tr>`
            }).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Resumen de cobertura</h2>
          <p class="tarjeta__subtitulo">Conteo de eventos por país, departamento y ciudad · reservas = reservas no canceladas</p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta tabla--media">
            <thead><tr><th>País</th><th>Departamento</th><th>Ciudad</th><th>Eventos</th><th>Reservas</th><th>Eventos activos</th><th>Eventos cancelados</th></tr></thead>
            <tbody>${hay ? this.resumen(geografia, eventos) : '<tr><td colspan="7" class="tabla__vacia">No hay eventos en este período.</td></tr>'}</tbody>
          </table>
        </div>
      </section>
      <div class="espacio-final"></div>`

    if (!hay) return
    graficoBarras(document.getElementById('grafica-paises'), {
      etiquetas: geografia.map(p => p.nombre), radio: 5, separacion: 0.65,
      series: [{ nombre: 'Eventos', datos: geografia.map(p => p.eventos), color: geografia.map((_, i) => COLORES_GRAFICA[i % 8]) }],
      formatoTooltip: (c) => ` ${eventosTexto(c.raw)}`,
    })
    const top = departamentos.slice(0, 8)
    graficoBarras(document.getElementById('grafica-deptos'), {
      etiquetas: top.map(d => corto(d.nombre)), horizontal: true, radio: 5, separacion: 0.8,
      series: [{ nombre: 'Eventos', datos: top.map(d => d.eventos), color: '#4f46e5' }],
      formatoTooltip: (c) => ` ${eventosTexto(c.raw)} · ${top[c.dataIndex].pais}`,
    })
  },

  /** Filas del resumen jerárquico país → departamento → ciudad, con el conteo de cada nivel */
  resumen(geografia, eventos) {
    const porCiudad = estadisticasPorCiudad(eventos)
    return geografia.flatMap(p => p.departamentos.flatMap((d, iDepto) => d.ciudades.map((c, iCiudad) => {
      const nuevoPais = iDepto === 0 && iCiudad === 0
      const nuevoDepto = iCiudad === 0
      const st = porCiudad.get(c.id)
      return `
        <tr>
          <td>${nuevoPais ? `<span class="pildora-indigo pildora-indigo--negrita">${icono('globo', 13)}${esc(p.nombre)} · ${eventosTexto(p.eventos)}</span>` : '<span class="guion">—</span>'}</td>
          <td>${nuevoDepto ? `<span class="texto-medio texto-seminegrita">${esc(d.nombre)}</span> <small class="texto-gris">(${d.eventos})</small>` : '<span class="guion">—</span>'}</td>
          <td><span class="punto-ciudad">${esc(c.nombre)}</span></td>
          <td>${chip(c.eventos, '#f5f3ff', '#7c3aed')}</td>
          <td class="texto-seminegrita">${num(st.reservas)}</td>
          <td>${chip(st.activos, '#ecfdf5', '#059669')}</td>
          <td>${st.cancelados > 0 ? chip(st.cancelados, '#fef2f2', '#dc2626') : '<span class="guion guion--sin-relleno">0</span>'}</td>
        </tr>`
    }))).join('')
  },

  /** Llena un select de filtro: lista de { valor, nombre, texto }, conservando el elegido */
  opciones(id, lista, valor = 'Todos') {
    const select = document.getElementById(id)
    select.innerHTML = '<option value="Todos" data-nombre="Todos">Todos</option>' + lista
      .map(o => `<option value="${esc(o.valor)}" data-nombre="${esc(o.nombre)}"${String(o.valor) === String(valor) ? ' selected' : ''}>${esc(o.texto)}</option>`)
      .join('')
  },

  /** Muestra "· Colombia" junto a la etiqueta del departamento / ciudad */
  etiquetaPadre(id, texto, padre) {
    document.getElementById('etiqueta-' + id).innerHTML = texto + (padre && padre !== 'Todos' ? ` <span>· ${esc(padre)}</span>` : '')
  },

  /** Píldoras con los filtros aplicados (recibe los nombres, no los id) */
  filtrosActivos(nombres) {
    const caja = document.getElementById('filtros-activos')
    caja.hidden = nombres.length === 0
    caja.innerHTML = 'Filtros activos:' + nombres.map(v => `<span class="pildora-indigo">${esc(v)}</span>`).join('')
  },

  tabla(pagina, total) {
    document.getElementById('conteo-eventos').textContent = `${num(total)} ${total === 1 ? 'evento encontrado' : 'eventos encontrados'}`
    document.getElementById('tabla-eventos').innerHTML = pagina.length === 0
      ? '<tr><td colspan="9" class="tabla__vacia">No se encontraron eventos con los filtros seleccionados.</td></tr>'
      : pagina.map(e => `
        <tr>
          <td class="celda-nombre-evento"><strong>${esc(e.nombre)}</strong><p class="texto-fecha">${esc(e.codigo)}</p></td>
          <td class="sin-salto">${esc(e.pais)}</td>
          <td class="sin-salto">${esc(e.departamento)}</td>
          <td class="sin-salto">${esc(e.ciudad)}</td>
          <td class="sin-salto texto-gris">${fechaCorta(e.fecha)}</td>
          <td class="sin-salto">${esc(e.agente)}</td>
          <td>${insigniaEstado(e.estado)}</td>
          <td class="texto-centro texto-negrita">${num(e.reservas)}</td>
          <td><button type="button" class="boton-ver" data-detalle="${esc(e.codigo)}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
  },

  paginacion(paginaActual, total, porPagina) {
    document.getElementById('paginacion').innerHTML = paginacion(paginaActual, total, porPagina, 'eventos', { siempre: true })
  },

  modalDetalle(e) {
    const ocupacion = e.capacidad > 0 ? (e.entradas / e.capacidad * 100).toFixed(1) : '0.0'
    const datos = [['Código', e.codigo], ['País', e.pais], ['Departamento', e.departamento], ['Ciudad', e.ciudad],
      ['Teatro', e.teatro], ['Dirección', e.direccion || 'Sin dirección'], ['Fecha', fechaCorta(e.fecha)], ['Hora', hora12(e.hora)],
      ['Agente', e.agente], ['Precio base', cop(e.precio)]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">${esc(e.nombre)}</h3>${insigniaEstado(e.estado)}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <p class="texto-descripcion">${esc(e.descripcion || 'Sin descripción.')}</p>
        <div class="datos-grid">${datos.map(([etq, val]) => `<div class="dato"><p class="dato__etiqueta">${etq}</p><p class="dato__valor">${esc(val)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Capacidad</p><p class="dato-destacado__valor">${num(e.capacidad)}</p></div>
          <div class="dato-destacado" style="background:#fff7f5;color:#f4845f"><p class="dato-destacado__etiqueta">Entradas vendidas · ${num(e.reservas)} ${e.reservas === 1 ? 'reserva' : 'reservas'}</p><p class="dato-destacado__valor">${num(e.entradas)} <small>(${ocupacion}%)</small></p></div>
        </div>
        ${e.estado === 'Cancelado' ? `<div class="alerta alerta--roja"><div><p class="alerta__titulo">Causa de cancelación</p><p>${esc(e.causa_cancelacion || 'No se registró la causa.')}</p></div></div>` : ''}
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--seminegrita boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },
}