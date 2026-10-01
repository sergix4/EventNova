// js/views/cliente/explorarView.js
// VISTA de "Explorar eventos".

import { tarjetaEvento, sinEventos } from './comunClienteView.js'

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

  marcarCategoria(categoria) {
    document.querySelectorAll('[data-categoria]').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.categoria === categoria)))
  },

  /** Cambia las opciones de ciudad según el departamento elegido */
  opcionesCiudad(ciudades) {
    const select = document.getElementById('filtro-ciudad')
    select.innerHTML = '<option value="">Ciudad</option>' + ciudades.map(c => `<option value="${c}">${c}</option>`).join('')
  },
}
