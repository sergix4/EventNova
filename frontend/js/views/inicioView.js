// js/views/inicioView.js
// VISTA de la página principal: arma el HTML de las tarjetas de eventos.

import { icono } from './componentes/iconos.js'
import { esc } from '../utils/formato.js'

export const InicioView = {
  /** Dibuja las tarjetas de eventos destacados */
  mostrarEventos(contenedor, eventos) {
    contenedor.innerHTML = eventos.map(e => `
      <article class="tarjeta-evento" aria-labelledby="evento-${e.id}">
        <div class="tarjeta-evento__imagen">
          <img src="${esc(e.imagen)}" alt="Imagen del evento ${esc(e.nombre)}" loading="lazy">
          <span class="tarjeta-evento__categoria">${esc(e.categoria)}</span>
          <span class="tarjeta-evento__estado">
            <span class="insignia estado-portada estado-portada--${e.estadoColor}"><span class="insignia__punto" aria-hidden="true"></span>${esc(e.estadoTexto)}</span>
          </span>
        </div>
        <div class="tarjeta-evento__cuerpo">
          <h3 class="tarjeta-evento__nombre" id="evento-${e.id}">${esc(e.nombre)}</h3>
          <div class="tarjeta-evento__meta">
            <span class="meta">${icono('ubicacion', 16)}<span class="solo-lector">Ciudad: </span>${esc(e.ciudad)}</span>
            <div class="meta-fila">
              <span class="meta">${icono('calendario', 16)}<span class="solo-lector">Fecha: </span>${esc(e.fecha)}</span>
              <span class="meta">${icono('reloj', 16)}<span class="solo-lector">Hora: </span>${esc(e.hora)}</span>
            </div>
          </div>
          <div class="tarjeta-evento__pie">
            <div>
              <span class="precio__desde">Desde</span>
              <span class="precio__valor">${esc(e.precio)}</span>
            </div>
            <a href="/pages/login.html" class="boton-ver" aria-label="Ver evento ${esc(e.nombre)}">Ver evento ${icono('flechaDerecha', 18)}</a>
          </div>
        </div>
      </article>`).join('')
    contenedor.setAttribute('aria-busy', 'false')
  },

  /** Mensaje si los eventos no cargan: icono + texto (no solo color) */
  mostrarError(contenedor) {
    contenedor.innerHTML = `<p class="mensaje-error" role="alert">${icono('alerta', 18)} No pudimos cargar los eventos. Intenta recargar la página.</p>`
    contenedor.setAttribute('aria-busy', 'false')
  },

  /** Estrellas de la prueba social */
  mostrarEstrellas(contenedor) {
    contenedor.innerHTML = icono('estrella', 16).repeat(5)
  },
}