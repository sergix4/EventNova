// js/views/admin/comunAdminView.js
// Piezas de VISTA compartidas por las pantallas del administrador.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export { insigniaEvento, insigniaReserva, insigniaPago, kpiFila, filaVacia } from '../agente/comunAgenteView.js'

/** Tarjeta KPI con ícono, tendencia (verde o gris) y valor */
export function kpiAdmin({ etiqueta, valor, icono: ic, color, fondo, tendencia, sube = true }) {
  return `
    <article class="kpi" style="--color-icono:${color};--fondo-icono:${fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono">${icono(ic, 20)}</div>
        ${tendencia ? `<span class="kpi-admin__tendencia${sube ? '' : ' kpi-admin__tendencia--igual'}">${sube ? '↑' : '→'} ${esc(tendencia)}</span>` : ''}
      </div>
      <div>
        <p class="kpi__valor">${esc(valor)}</p>
        <p class="kpi__etiqueta">${esc(etiqueta)}</p>
      </div>
    </article>`
}

/** Cabecera de una tarjeta de gráfica (título + subtítulo + lado derecho) */
export function cabeceraGrafica(titulo, subtitulo, derecha = '') {
  return `
    <div class="tarjeta-grafica__cabecera">
      <div>
        <h2 class="seccion-titulo">${titulo}</h2>
        <p class="seccion-subtitulo">${subtitulo}</p>
      </div>
      ${derecha}
    </div>`
}

/** Leyenda de colores: [{ color, texto }] */
export function leyenda(items) {
  return `<div class="leyenda">${items.map(i => `<span><i style="--color:${i.color}"></i>${esc(i.texto)}</span>`).join('')}</div>`
}
