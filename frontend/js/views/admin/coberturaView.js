// js/views/admin/coberturaView.js
// VISTA de "Cobertura y eventos" del administrador.

import { icono } from '../componentes/iconos.js'
import { graficoBarras } from '../componentes/graficos.js'
import { paginacion } from '../componentes/paginacion.js'
import { esc, num } from '../../utils/formato.js'

const COLORES_ESTADO = {
  'Programado': ['#eef2ff', '#4f46e5'], 'En boletería': ['#fffbeb', '#d97706'], 'En vivo': ['#ecfdf5', '#059669'],
  'Finalizado': ['#f3f4f6', '#6b7280'], 'Cancelado': ['#fef2f2', '#dc2626'],
}
export const ESTADOS = Object.keys(COLORES_ESTADO)
const COLORES_GRAFICA = ['#4f46e5', '#f4845f', '#059669', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#84cc16']
const chip = (valor, fondo, color) => `<span class="chip-numero" style="background:${fondo};color:${color}">${valor}</span>`

export function insigniaEstado(estado) {
  const [fondo, color] = COLORES_ESTADO[estado]
  return `<span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

/** Cuenta eventos agrupando por un campo y ordena de mayor a menor */
function contarPor(eventos, campo) {
  const mapa = {}
  eventos.forEach(e => { mapa[e[campo]] = (mapa[e[campo]] || 0) + 1 })
  return Object.entries(mapa).sort((a, b) => b[1] - a[1])
}

function selectFiltro(id, etiqueta, ancho = true) {
  return `
    <div class="campo">
      <label class="campo__etiqueta" for="${id}" id="etiqueta-${id}">${etiqueta}</label>
      <div class="envoltura-select"><select class="selector selector--filtro${ancho ? ' selector--ancho' : ''}" id="${id}"></select></div>
    </div>`
}

export const CoberturaView = {
  mostrar(eventos) {
    const unicos = (campo) => new Set(eventos.map(e => e[campo])).size
    const kpis = [
      { etiqueta: 'Países con eventos', sub: 'Países donde EventNova opera', valor: unicos('pais'), icono: 'globo', color: '#4f46e5', fondo: '#eef2ff' },
      { etiqueta: 'Departamentos con eventos', sub: 'Departamentos registrados con actividad', valor: unicos('departamento'), icono: 'mapa', color: '#d97706', fondo: '#fffbeb' },
      { etiqueta: 'Ciudades con eventos', sub: 'Ciudades cubiertas por la plataforma', valor: unicos('ciudad'), icono: 'ubicacion', color: '#059669', fondo: '#ecfdf5' },
      { etiqueta: 'Total de eventos', sub: 'Eventos registrados en EventNova', valor: eventos.length, icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff' },
    ]
    const porPais = contarPor(eventos, 'pais')
    const porDepto = contarPor(eventos, 'departamento')
    const porCiudad = contarPor(eventos, 'ciudad')

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--4" aria-label="Indicadores de cobertura">${kpis.map(k => `
        <article class="kpi kpi--holgado" style="--color-icono:${k.color};--fondo-icono:${k.fondo}">
          <div class="kpi__icono kpi__icono--grande">${icono(k.icono, 20)}</div>
          <div>
            <p class="kpi__valor kpi__valor--grande">${k.valor}</p>
            <p class="kpi__etiqueta kpi__etiqueta--fuerte">${k.etiqueta}</p>
            <p class="kpi__sub">${k.sub}</p>
          </div>
        </article>`).join('')}
      </section>

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera"><div>
          <h2 class="tarjeta__titulo">Eventos por ubicación</h2>
          <p class="tarjeta__subtitulo">Selecciona los filtros para consultar eventos por área geográfica.</p>
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
            <thead><tr><th>Evento</th><th>País</th><th>Departamento</th><th>Ciudad</th><th>Fecha</th><th>Agente</th><th>Estado</th><th>Reservas</th><th><span class="solo-lector">Acciones</span></th></tr></thead>
            <tbody id="tabla-eventos"></tbody>
          </table>
        </div>
        <div id="paginacion"></div>
      </section>

      <div class="grid-2">
        <section class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><div>
            <h2 class="tarjeta__titulo">Distribución de eventos por país</h2>
            <p class="tarjeta__subtitulo">Total de eventos registrados por país</p>
          </div></div>
          <div class="tarjeta__cuerpo">
            <div class="grafica grafica--220"><canvas id="grafica-paises" aria-label="Eventos por país"></canvas></div>
            <div class="leyenda-paises">${porPais.map(([pais, n], i) => `<span><i class="punto-color" style="--color:${COLORES_GRAFICA[i % 8]}"></i>${esc(pais)} <small>(${n})</small></span>`).join('')}</div>
          </div>
        </section>
        <section class="tarjeta tarjeta--recortada">
          <div class="tarjeta__cabecera"><div>
            <h2 class="tarjeta__titulo">Eventos por departamento</h2>
            <p class="tarjeta__subtitulo">Departamentos con mayor concentración de eventos</p>
          </div></div>
          <div class="tarjeta__cuerpo">
            <div class="grafica grafica--240"><canvas id="grafica-deptos" aria-label="Eventos por departamento"></canvas></div>
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
            <tbody>${porCiudad.map(([ciudad, n], i) => {
              const ev = eventos.find(e => e.ciudad === ciudad)
              const pct = (n / eventos.length * 100).toFixed(1)
              return `
              <tr>
                <td class="texto-puesto">${i + 1}</td>
                <td><div class="celda-icono"><span class="ciudad-icono">${icono('ubicacion', 13, { grosor: 2.5 })}</span><strong>${esc(ciudad)}</strong></div></td>
                <td>${esc(ev.departamento)}</td>
                <td>${esc(ev.pais)}</td>
                <td>${chip(n, '#f5f3ff', '#7c3aed')}</td>
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
          <p class="tarjeta__subtitulo">Distribución completa de eventos por país, departamento y ciudad</p>
        </div></div>
        <div class="tabla-contenedor">
          <table class="tabla tabla--compacta tabla--media">
            <thead><tr><th>País</th><th>Departamento</th><th>Ciudad</th><th>Eventos</th><th>Reservas</th><th>Eventos activos</th><th>Eventos cancelados</th></tr></thead>
            <tbody>${this.resumen(eventos)}</tbody>
          </table>
        </div>
      </section>
      <div class="espacio-final"></div>`

    graficoBarras(document.getElementById('grafica-paises'), {
      etiquetas: porPais.map(p => p[0]), radio: 5, separacion: 0.65,
      series: [{ nombre: 'Eventos', datos: porPais.map(p => p[1]), color: porPais.map((_, i) => COLORES_GRAFICA[i % 8]) }],
      formatoTooltip: (c) => ` ${c.raw} ${c.raw === 1 ? 'evento' : 'eventos'}`,
    })
    const deptos = porDepto.slice(0, 8)
    graficoBarras(document.getElementById('grafica-deptos'), {
      etiquetas: deptos.map(d => d[0].length > 16 ? d[0].slice(0, 16) + '…' : d[0]), horizontal: true, radio: 5, separacion: 0.8,
      series: [{ nombre: 'Eventos', datos: deptos.map(d => d[1]), color: '#4f46e5' }],
      formatoTooltip: (c) => ` ${c.raw} ${c.raw === 1 ? 'evento' : 'eventos'}`,
    })
  },

  /** Filas del resumen jerárquico país → departamento → ciudad */
  resumen(eventos) {
    const mapa = {}
    eventos.forEach(e => {
      const clave = `${e.pais}|${e.departamento}|${e.ciudad}`
      mapa[clave] ??= { pais: e.pais, departamento: e.departamento, ciudad: e.ciudad, eventos: 0, reservas: 0, activos: 0, cancelados: 0 }
      const fila = mapa[clave]
      fila.eventos++
      fila.reservas += e.reservas
      if (e.estado === 'Cancelado') fila.cancelados++
      else if (e.estado !== 'Finalizado') fila.activos++
    })
    const filas = Object.values(mapa).sort((a, b) => b.eventos - a.eventos)
    return filas.map((r, i) => {
      const anterior = filas[i - 1]
      const nuevoPais = !anterior || anterior.pais !== r.pais
      const nuevoDepto = nuevoPais || anterior.departamento !== r.departamento
      return `
        <tr>
          <td>${nuevoPais ? `<span class="pildora-indigo pildora-indigo--negrita">${icono('globo', 13)}${esc(r.pais)}</span>` : '<span class="guion">—</span>'}</td>
          <td>${nuevoDepto ? `<span class="texto-medio texto-seminegrita">${esc(r.departamento)}</span>` : '<span class="guion">—</span>'}</td>
          <td><span class="punto-ciudad">${esc(r.ciudad)}</span></td>
          <td>${chip(r.eventos, '#f5f3ff', '#7c3aed')}</td>
          <td class="texto-seminegrita">${num(r.reservas)}</td>
          <td>${chip(r.activos, '#ecfdf5', '#059669')}</td>
          <td>${r.cancelados > 0 ? chip(r.cancelados, '#fef2f2', '#dc2626') : '<span class="guion guion--sin-relleno">0</span>'}</td>
        </tr>`
    }).join('')
  },

  /** Llena un select de filtro conservando el valor elegido */
  opciones(id, lista, valor = 'Todos') {
    const select = document.getElementById(id)
    select.innerHTML = ['Todos', ...lista].map(o => `<option${o === valor ? ' selected' : ''}>${esc(o)}</option>`).join('')
  },

  /** Muestra "· Colombia" junto a la etiqueta del departamento / ciudad */
  etiquetaPadre(id, texto, padre) {
    document.getElementById('etiqueta-' + id).innerHTML = texto + (padre !== 'Todos' ? ` <span>· ${esc(padre)}</span>` : '')
  },

  filtrosActivos(valores) {
    const activos = valores.filter(v => v !== 'Todos')
    const caja = document.getElementById('filtros-activos')
    caja.hidden = activos.length === 0
    caja.innerHTML = 'Filtros activos:' + activos.map(v => `<span class="pildora-indigo">${esc(v)}</span>`).join('')
  },

  tabla(pagina, porPagina, total) {
    document.getElementById('conteo-eventos').textContent = `${total} ${total === 1 ? 'evento encontrado' : 'eventos encontrados'}`
    document.getElementById('tabla-eventos').innerHTML = pagina.length === 0
      ? '<tr><td colspan="9" class="tabla__vacia">No se encontraron eventos con los filtros seleccionados.</td></tr>'
      : pagina.map(e => `
        <tr>
          <td class="celda-nombre-evento">${esc(e.nombre)}</td>
          <td class="sin-salto">${esc(e.pais)}</td>
          <td class="sin-salto">${esc(e.departamento)}</td>
          <td class="sin-salto">${esc(e.ciudad)}</td>
          <td class="sin-salto texto-gris">${esc(e.fecha)}</td>
          <td class="sin-salto">${esc(e.agente)}</td>
          <td>${insigniaEstado(e.estado)}</td>
          <td class="texto-centro texto-negrita">${num(e.reservas)}</td>
          <td><button type="button" class="boton-ver" data-detalle="${esc(e.nombre)}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
  },

  paginacion(paginaActual, total, porPagina) {
    document.getElementById('paginacion').innerHTML = paginacion(paginaActual, total, porPagina, '', { siempre: true })
  },

  modalDetalle(e) {
    const datos = [['País', e.pais], ['Departamento', e.departamento], ['Ciudad', e.ciudad], ['Dirección', e.direccion],
      ['Fecha', e.fecha], ['Hora', e.hora], ['Agente', e.agente], ['Precio', e.precio]]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">${esc(e.nombre)}</h3>${insigniaEstado(e.estado)}</div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <p class="texto-descripcion">${esc(e.descripcion)}</p>
        <div class="datos-grid">${datos.map(([etq, val]) => `<div class="dato"><p class="dato__etiqueta">${etq}</p><p class="dato__valor">${esc(val)}</p></div>`).join('')}</div>
        <div class="datos-grid">
          <div class="dato-destacado" style="background:#eef2ff;color:#4f46e5"><p class="dato-destacado__etiqueta">Capacidad</p><p class="dato-destacado__valor">${num(e.capacidad)}</p></div>
          <div class="dato-destacado" style="background:#fff7f5;color:#f4845f"><p class="dato-destacado__etiqueta">Reservas</p><p class="dato-destacado__valor">${num(e.reservas)}</p></div>
        </div>
        ${e.estado === 'Cancelado' && e.causaCancelacion ? `<div class="alerta alerta--roja"><div><p class="alerta__titulo">Causa de cancelación</p><p>${esc(e.causaCancelacion)}</p></div></div>` : ''}
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--seminegrita boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },
}
