// js/views/inicioView.js
// VISTA de la página principal: arma el HTML de las tarjetas de eventos.

import { icono } from './componentes/iconos.js'
import { esc } from '../utils/formato.js'

export const InicioView = {
  /** Dibuja las tarjetas de eventos destacados */
  mostrarEventos(contenedor, eventos) {
    contenedor.innerHTML = eventos.map(e => `
      <article class="tarjeta-evento">
        <div class="tarjeta-evento__imagen">
          <img src="${esc(e.imagen)}" alt="${esc(e.nombre)}" loading="lazy">
          <span class="tarjeta-evento__categoria">${esc(e.categoria)}</span>
          <span class="tarjeta-evento__estado">
            <span class="insignia estado-portada estado-portada--${e.estadoColor}"><span class="insignia__punto"></span>${esc(e.estadoTexto)}</span>
          </span>
        </div>
        <div class="tarjeta-evento__cuerpo">
          <h3 class="tarjeta-evento__nombre">${esc(e.nombre)}</h3>
          <div class="tarjeta-evento__meta">
            <span class="meta">${icono('ubicacion', 16)}${esc(e.ciudad)}</span>
            <div class="meta-fila">
              <span class="meta">${icono('calendario', 16)}${esc(e.fecha)}</span>
              <span class="meta">${icono('reloj', 16)}${esc(e.hora)}</span>
            </div>
          </div>
          <div class="tarjeta-evento__pie">
            <div>
              <span class="precio__desde">Desde</span>
              <span class="precio__valor">${esc(e.precio)}</span>
            </div>
            <a href="/pages/login.html" class="boton-ver">Ver evento ${icono('flechaDerecha', 18)}</a>
          </div>
        </div>
      </article>`).join('')
  },

  /** Estrellas de la prueba social */
  mostrarEstrellas(contenedor) {
    contenedor.innerHTML = icono('estrella', 16).repeat(5)
  },
}
