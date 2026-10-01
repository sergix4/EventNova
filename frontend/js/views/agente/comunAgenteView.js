// js/views/agente/comunAgenteView.js
// Piezas de VISTA compartidas por las pantallas del agente.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

const CLASE_EVENTO = {
  'Programado': 'ev-programado', 'En boletería': 'ev-boleteria', 'En vivo': 'ev-vivo',
  'Finalizado': 'ev-finalizado', 'Cancelado': 'ev-cancelado',
}
const CLASE_RESERVA = { 'Pendiente': 'res-pendiente', 'Confirmada': 'res-confirmada', 'Cancelada': 'res-cancelada' }

export function insigniaEvento(estado) {
  return `<span class="insignia ${CLASE_EVENTO[estado] || 'ev-programado'}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}
export function insigniaReserva(estado) {
  return `<span class="insignia ${CLASE_RESERVA[estado]}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}
export function insigniaPago(estado) {
  return `<span class="insignia pago--${estado.toLowerCase()}"><span class="insignia__punto"></span>${esc(estado)}</span>`
}

/** Tarjeta KPI con ícono arriba e indicador de tendencia (Mis eventos) */
export function kpiTendencia({ etiqueta, valor, icono: ic, color, fondo, tendencia, sube }) {
  return `
    <article class="kpi" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono">${icono(ic, 20)}</div>
        <span class="kpi__tendencia">${sube ? '↑' : '·'} ${esc(tendencia)}</span>
      </div>
      <div>
        <p class="kpi__valor">${esc(valor)}</p>
        <p class="kpi__etiqueta kpi__etiqueta--sm">${esc(etiqueta)}</p>
      </div>
    </article>`
}

/** Tarjeta KPI horizontal (ícono a la izquierda) */
export function kpiFila({ etiqueta, valor, icono: ic, color, fondo, medio = false, grande = true }) {
  return `
    <article class="kpi kpi--fila" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__icono${grande ? ' kpi__icono--grande' : ''}">${icono(ic, 20)}</div>
      <div>
        <p class="kpi__valor${medio ? ' kpi__valor--medio' : ''}">${esc(valor)}</p>
        <p class="kpi__etiqueta">${esc(etiqueta)}</p>
      </div>
    </article>`
}

/** Fila vacía de una tabla */
export function filaVacia(columnas, texto) {
  return `<tr><td colspan="${columnas}" class="tabla__vacia">${texto}</td></tr>`
}
