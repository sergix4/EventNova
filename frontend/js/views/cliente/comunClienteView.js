// js/views/cliente/comunClienteView.js
// Piezas de VISTA que se repiten en varias pantallas del cliente:
// insignias de estado, tarjetas de estadística y tarjetas de evento.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

const CLASE_ESTADO_EVENTO = {
  'Programado': 'estado--programado',
  'En Boletería': 'estado--boleteria',
  'En Vivo': 'estado--vivo',
  'Finalizado': 'estado--finalizado',
  'Cancelado': 'estado--cancelado',
}

export function insigniaEvento(estado, { borde = true, grande = false } = {}) {
  const clases = ['insignia', CLASE_ESTADO_EVENTO[estado] || 'estado--programado']
  if (!borde) clases.push('insignia--sin-borde')
  if (grande) clases.push('insignia--grande')
  return `<span class="${clases.join(' ')}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

export function insigniaReserva(estado) {
  return `<span class="insignia reserva--${estado.toLowerCase()}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

export function insigniaPago(estado) {
  return `<span class="insignia pago--${estado.toLowerCase()}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

/** Tarjeta de estadística (ícono a la izquierda, valor grande) */
export function tarjetaEstadistica({ etiqueta, valor, sub, icono: nombreIcono, color, fondo, grosor }) {
  const estilo = `${color ? `--color-icono:${color};` : ''}${fondo ? `--fondo-icono:${fondo};` : ''}`
  return `
    <article class="estadistica">
      <div class="estadistica__icono" style="${estilo}">${icono(nombreIcono, 20, { grosor: grosor || 2 })}</div>
      <div class="estadistica__texto">
        <p class="estadistica__etiqueta">${esc(etiqueta)}</p>
        <p class="estadistica__valor">${esc(valor)}</p>
        ${sub ? `<p class="estadistica__sub">${esc(sub)}</p>` : ''}
      </div>
    </article>`
}

/** Tarjeta de evento (inicio y explorar). En "explorar" incluye descripción y cupos. */
export function tarjetaEvento(e, { explorar = false } = {}) {
  const reservable = e.estado === 'Programado' || e.estado === 'En Boletería'
  const ubicacion = explorar ? `${e.ciudad}, ${e.departamento}, ${e.pais}` : `${e.ciudad}, ${e.departamento}`
  const tam = explorar ? 13 : 14
  const boton = reservable
    ? `<a href="/pages/cliente/detalle-evento.html?id=${e.id}" class="boton-detalles">Ver detalles ${icono('flechaDerecha', explorar ? 14 : 15)}</a>`
    : `<span class="boton-detalles boton-detalles--deshabilitado" aria-disabled="true">Ver detalles</span>`

  return `
    <article class="evento">
      <div class="evento__imagen">
        <img src="${esc(e.imagen)}" alt="${esc(e.nombre)}" loading="lazy">
        <span class="evento__categoria">${esc(e.categoria)}</span>
        <span class="evento__estado">${insigniaEvento(e.estado, { borde: explorar })}</span>
        ${e.estado === 'Finalizado' && e.calificacion > 0 ? `<span class="evento__puntaje">${icono('estrella', 12, { relleno: 'currentColor', grosor: 0 })}${e.calificacion}</span>` : ''}
      </div>
      <div class="evento__cuerpo">
        ${explorar
          ? `<div><h3 class="evento__nombre">${esc(e.nombre)}</h3><p class="evento__descripcion">${esc(e.descripcion)}</p></div>`
          : `<h3 class="evento__nombre">${esc(e.nombre)}</h3>`}
        <div class="evento__meta">
          <span class="meta">${icono('ubicacion', tam)}${esc(ubicacion)}</span>
          <div class="meta-fila">
            <span class="meta">${icono('calendario', explorar ? 13 : 15)}${esc(e.fecha)}</span>
            <span class="meta">${icono('reloj', tam)}${esc(e.hora)}</span>
          </div>
        </div>
        ${explorar ? barraCupos(e.cuposTotal, e.cuposVendidos) : ''}
        <div class="evento__pie">
          <div>
            <span class="evento__desde">Desde</span>
            <span class="evento__precio">${esc(e.precio)}</span>
          </div>
          ${boton}
        </div>
      </div>
    </article>`
}

function barraCupos(total, vendidos) {
  const porcentaje = Math.round((vendidos / total) * 100)
  const disponibles = total - vendidos
  const bajos = disponibles < total * 0.2
  return `
    <div class="cupos${bajos ? ' cupos--bajos' : ''}">
      <div class="cupos__fila">
        <span class="cupos__etiqueta">Cupos disponibles</span>
        <span class="cupos__valor">${disponibles.toLocaleString()} / ${total.toLocaleString()}</span>
      </div>
      <div class="barra"><div class="barra__relleno" style="width:${porcentaje}%"></div></div>
      ${bajos ? '<p class="cupos__aviso">⚠ Últimos cupos</p>' : ''}
    </div>`
}

/** Estado vacío "No se encontraron eventos" */
export function sinEventos(conTarjeta = false) {
  return `
    <div class="vacio${conTarjeta ? ' vacio--tarjeta' : ''}">
      <div class="vacio__icono">${icono('brujula', 18)}</div>
      <p class="vacio__titulo">No se encontraron eventos</p>
      <p class="vacio__texto">Intenta ajustar los filtros o el término de búsqueda.</p>
      <button type="button" class="boton boton--primario" data-accion="limpiar-filtros">Limpiar filtros</button>
    </div>`
}
