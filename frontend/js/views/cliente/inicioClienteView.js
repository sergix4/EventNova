// js/views/cliente/inicioClienteView.js
// VISTA de la página de inicio del cliente.

import { tarjetaEstadistica, tarjetaEvento, sinEventos } from './comunClienteView.js'
import { primerNombre } from '../../utils/formato.js'

export const InicioClienteView = {
  mostrarSaludo(usuario) {
    document.getElementById('saludo').textContent = `Hola, ${primerNombre(usuario?.nombre, 'Cliente')} 👋`
  },

  mostrarEstadisticas(resumen) {
    document.getElementById('estadisticas').innerHTML = [
      tarjetaEstadistica({ etiqueta: 'Reservas activas', valor: resumen.activas, sub: 'Pagadas y confirmadas', icono: 'portapapeles' }),
      tarjetaEstadistica({ etiqueta: 'Reservas confirmadas', valor: resumen.confirmadas, sub: 'Histórico total', icono: 'check', color: '#10b981', fondo: '#10b98118' }),
      tarjetaEstadistica({ etiqueta: 'Próximo evento', valor: resumen.proximoEvento.fecha, sub: resumen.proximoEvento.detalle, icono: 'calendario', color: '#f4845f', fondo: '#f4845f18' }),
    ].join('')
  },

  mostrarEventos(eventos, hayFiltros) {
    document.getElementById('conteo').textContent = `${eventos.length} ${eventos.length === 1 ? 'resultado' : 'resultados'} encontrados`
    document.getElementById('filtros-activos').hidden = !hayFiltros
    document.getElementById('boton-filtros').querySelector('span').textContent = hayFiltros ? 'Limpiar' : 'Filtrar'
    document.getElementById('resultados').innerHTML = eventos.length
      ? `<div class="grid-eventos-cliente">${eventos.map(e => tarjetaEvento(e)).join('')}</div>`
      : sinEventos()
  },

  mostrarBotonLimpiarBusqueda(visible) {
    document.getElementById('limpiar-busqueda').hidden = !visible
  },
}

