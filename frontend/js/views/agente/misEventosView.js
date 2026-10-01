// js/views/agente/misEventosView.js
// VISTA de "Mis eventos" del agente: indicadores, tabla, paginación y
// ventanas de detalle (con calificaciones) y de eliminación.

import { icono, estrellas } from '../componentes/iconos.js'
import { paginacion } from '../componentes/paginacion.js'
import { insigniaEvento, kpiTendencia, filaVacia } from './comunAgenteView.js'
import { esc, num } from '../../utils/formato.js'

export const MisEventosView = {
  mostrarIndicadores(eventos) {
    const activos = eventos.filter(e => ['Programado', 'En boletería', 'En vivo'].includes(e.estado)).length
    const reservas = eventos.reduce((s, e) => s + e.reservas, 0)
    const pendientes = eventos.filter(e => e.estado === 'Programado').reduce((s, e) => s + e.reservas, 0)
    document.getElementById('estadisticas').innerHTML = [
      kpiTendencia({ etiqueta: 'Eventos registrados', valor: eventos.length, icono: 'calendarioDias', color: '#4f46e5', fondo: '#eef2ff', tendencia: '+2 este mes', sube: true }),
      kpiTendencia({ etiqueta: 'Eventos activos', valor: activos, icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5', tendencia: 'En progreso', sube: true }),
      kpiTendencia({ etiqueta: 'Reservas recibidas', valor: num(reservas), icono: 'usuarios', color: '#f4845f', fondo: '#fff7f5', tendencia: '+18% vs. mes anterior', sube: true }),
      kpiTendencia({ etiqueta: 'Reservas pendientes', valor: num(pendientes), icono: 'reloj', color: '#d97706', fondo: '#fffbeb', tendencia: 'Por confirmar', sube: false }),
    ].join('')
  },

  mostrarTabla(eventos, total, pagina, porPagina) {
    document.getElementById('conteo').textContent = `${total} evento${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
    document.getElementById('tabla-eventos').innerHTML = eventos.length === 0
      ? filaVacia(8, 'No se encontraron eventos con los filtros seleccionados.')
      : eventos.map(e => `
        <tr>
          <td><div class="persona"><span class="inicial">${esc(e.nombre.charAt(0))}</span><span class="nombre-evento">${esc(e.nombre)}</span></div></td>
          <td><span class="con-icono">${icono('ubicacion', 14)}${esc(e.ciudad)}</span></td>
          <td class="nowrap">${esc(e.fecha)}</td>
          <td>${num(e.capacidad)}</td>
          <td class="nowrap" style="font-weight:600;color:var(--gris-700)">${esc(e.precio)}</td>
          <td>
            <div class="barra-con-valor" style="gap:8px">
              <div class="barra barra--mini"><div class="barra__relleno" style="width:${Math.min(100, Math.round((e.reservas / e.capacidad) * 100))}%;${e.reservas >= e.capacidad ? 'background:#10b981' : ''}"></div></div>
              <span style="font-weight:600;color:var(--gris-700)">${num(e.reservas)}</span>
            </div>
          </td>
          <td class="nowrap">${insigniaEvento(e.estado)}</td>
          <td>
            <div class="acciones-iconos">
              <button type="button" class="accion-icono accion-icono--ver" title="Ver" data-ver="${e.id}" aria-label="Ver ${esc(e.nombre)}">${icono('ojo', 15)}</button>
              <button type="button" class="accion-icono accion-icono--editar" title="Editar" data-editar="${e.id}" aria-label="Editar ${esc(e.nombre)}">${icono('editar', 15)}</button>
              <button type="button" class="accion-icono accion-icono--eliminar" title="Eliminar" data-eliminar="${e.id}" aria-label="Eliminar ${esc(e.nombre)}">${icono('papelera', 15)}</button>
            </div>
          </td>
        </tr>`).join('')
    document.getElementById('paginacion').innerHTML = paginacion(pagina, total, porPagina, 'eventos')
  },

  modalEliminar(nombre) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('advertencia', 22)}</div>
          <div>
            <h3 class="modal__titulo">Eliminar evento</h3>
            <p class="confirmacion__texto">¿Estás seguro de que deseas eliminar <strong style="color:var(--gris-700)">"${esc(nombre)}"</strong>? Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro" data-accion="confirmar">Eliminar</button>
        </div>
      </div>`
  },

  modalDetalle(evento, calificaciones) {
    const total = calificaciones.length
    const promedio = total ? calificaciones.reduce((s, c) => s + c.estrellas, 0) / total : 0
    const conComentario = calificaciones.filter(c => c.comentario)
    const datos = [
      ['Ciudad', evento.ciudad], ['Fecha', evento.fecha], ['Capacidad', num(evento.capacidad)],
      ['Precio', evento.precio], ['Reservas', num(evento.reservas)], ['Estado', evento.estado],
    ]
    const estrellaLlena = (t) => icono('estrella', t, { relleno: '#f59e0b' }).replace('stroke="currentColor"', 'stroke="#f59e0b"')

    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Detalle del evento</h3><p class="modal__subtitulo">${esc(evento.nombre)}</p></div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 16)}</button>
      </div>
      <dl class="resumen-evento">${datos.map(([e, v]) => `<div><dt>${e}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <div class="calificaciones">
        <h4 class="calificaciones__titulo">${estrellaLlena(16)}Calificaciones de clientes</h4>
        ${total === 0 ? `
          <div class="calificaciones__vacio">
            <span style="color:#d1d5db">${icono('estrella', 32, { grosor: 1.5, clase: 'centrar' })}</span>
            <p>Este evento aún no tiene calificaciones</p>
            <small>Las calificaciones aparecerán una vez finalice el evento.</small>
          </div>` : `
          <div class="promedio">
            <div class="promedio__numero"><strong>${promedio.toFixed(1)}</strong>${estrellas(promedio, 16)}<small>${total} calificacion${total !== 1 ? 'es' : ''}</small></div>
            <div class="distribucion">
              ${[5, 4, 3, 2, 1].map(n => {
                const cantidad = calificaciones.filter(c => c.estrellas === n).length
                return `<div class="distribucion__fila"><span>${n}</span>${estrellaLlena(10)}<div class="barra"><div class="barra__relleno" style="width:${(cantidad / total) * 100}%"></div></div><span>${cantidad}</span></div>`
              }).join('')}
            </div>
          </div>
          ${conComentario.length ? `
            <p class="comentarios__titulo">Comentarios</p>
            <div class="comentarios">
              ${conComentario.map(c => `
                <div class="comentario">
                  <div class="comentario__fila"><span class="comentario__autor"><span>${esc(c.clienteNombre.charAt(0))}</span>${esc(c.clienteNombre)}</span>${estrellas(c.estrellas, 11)}</div>
                  <p>${esc(c.comentario)}</p>
                </div>`).join('')}
            </div>` : ''}`}
      </div>`
  },

  /** Cambia la cabecera entre "Panel del agente" y "Editar evento" */
  cabecera(editando) {
    document.getElementById('titulo-pagina').textContent = editando ? 'Editar evento' : 'Panel del agente'
    document.getElementById('subtitulo-pagina').textContent = editando ? 'Modifica la información del evento seleccionado.' : 'Administra tus eventos y reservas.'
    document.getElementById('boton-crear').hidden = editando
  },
}
