// js/views/cliente/explorarView.js
// VISTA de "Explorar eventos" (catálogo del cliente - Sprint 2, Tarea 4).
// Solo dibuja: no consulta la API ni decide qué filtrar (eso es del Controlador).

import { tarjetaEvento, sinEventos } from './comunClienteView.js'
import { esc } from '../../utils/formato.js'

export const ExplorarView = {
  mostrarEventos(eventos, hayFiltros) {
    const n = eventos.length
    document.getElementById('contador').textContent = `${n} ${n === 1 ? 'evento' : 'eventos'}`
    document.getElementById('conteo').textContent = `${n} ${n === 1 ? 'resultado' : 'resultados'}`
    document.getElementById('titulo-resultados').textContent = hayFiltros ? 'Resultados de búsqueda' : 'Todos los eventos disponibles'
    document.getElementById('filtros-activos').hidden = !hayFiltros
    document.getElementById('limpiar-filtros').hidden = !hayFiltros
    document.getElementById('resultados').innerHTML = n
      ? `<div class="grid-eventos-cliente grid-eventos-cliente--explorar">${eventos.map(e => tarjetaEvento(e, { explorar: true })).join('')}</div>`
      : sinEventos(true)
  },

  /** Mensaje mientras llega la respuesta del servidor */
  mostrarCargando() {
    document.getElementById('resultados').innerHTML =
      '<p class="catalogo-mensaje" role="status">Cargando eventos…</p>'
  },

  /** Mensaje si la API falla */
  mostrarError(mensaje) {
    document.getElementById('contador').textContent = ''
    document.getElementById('conteo').textContent = ''
    document.getElementById('resultados').innerHTML =
      `<p class="catalogo-mensaje catalogo-mensaje--error" role="alert">${esc(mensaje)}</p>`
  },

  /**
   * Llena un <select> con opciones { valor, texto } y conserva la primera opción vacía.
   * Si no hay opciones (por ejemplo, aún no se eligió país) el select queda deshabilitado.
   */
  llenarSelect(id, etiqueta, opciones, { deshabilitar = false } = {}) {
    const select = document.getElementById(id)
    select.innerHTML = `<option value="">${esc(etiqueta)}</option>` +
      opciones.map(o => `<option value="${esc(o.valor)}">${esc(o.texto)}</option>`).join('')
    select.disabled = deshabilitar
  },

  /** Muestra u oculta el aviso de rango de fechas inválido */
  mostrarErrorFechas(mensaje) {
    const aviso = document.getElementById('error-fechas')
    aviso.textContent = mensaje || ''
    aviso.hidden = !mensaje
  },
}