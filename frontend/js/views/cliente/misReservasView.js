// js/views/cliente/misReservasView.js
// VISTA de "Mis reservas": tarjetas de resumen, tabla (escritorio),
// tarjetas (celular), panel lateral de detalle y ventana para calificar.

import { icono, estrellas } from '../componentes/iconos.js'
import { paginacion } from '../componentes/paginacion.js'
import { tarjetaEstadistica, insigniaReserva, insigniaPago } from './comunClienteView.js'
import { esc } from '../../utils/formato.js'

const valor = (total) => total === 0 ? 'Gratis' : '$ ' + total.toLocaleString('es-CO')
const ESTRELLA_LLENA = (t) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
const TEXTO_ESTRELLAS = ['Selecciona una calificación', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']

function accionCalificar(r, calificacion, movil = false) {
  if (!r.eventoFinalizado || r.estado === 'Cancelada') return ''
  if (calificacion) {
    return movil
      ? `<div class="pila"><span class="calificado calificado--simple">${estrellas(calificacion.estrellas, 14, '#d1d5db')}Evento calificado</span></div>`
      : `<span class="calificado">${estrellas(calificacion.estrellas, 12, '#d1d5db')}Calificado</span>`
  }
  return movil
    ? `<button type="button" class="boton-calificar-grande boton-calificar-grande--movil" data-calificar="${r.id}">${ESTRELLA_LLENA(14)}Calificar evento</button>`
    : `<button type="button" class="boton-calificar" data-calificar="${r.id}">${ESTRELLA_LLENA(12)}Calificar</button>`
}

export const MisReservasView = {
  mostrarEstadisticas(reservas) {
    document.getElementById('estadisticas').innerHTML = [
      tarjetaEstadistica({ etiqueta: 'Total de reservas', valor: reservas.length, sub: 'Historial completo', icono: 'ticket' }),
      tarjetaEstadistica({ etiqueta: 'Confirmadas', valor: reservas.filter(r => r.estado === 'Confirmada').length, sub: 'Reservas aprobadas', icono: 'check', color: '#16a34a', fondo: '#f0fdf4', grosor: 2.5 }),
      tarjetaEstadistica({ etiqueta: 'Canceladas', valor: reservas.filter(r => r.estado === 'Cancelada').length, sub: 'No se realizará cobro', icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2' }),
    ].join('')
  },

  mostrarBarraFiltros(cantidad, hayFiltros, hayBusqueda) {
    document.getElementById('conteo').textContent = `${cantidad} ${cantidad === 1 ? 'resultado' : 'resultados'}`
    document.getElementById('limpiar-filtros').hidden = !hayFiltros
    document.getElementById('limpiar-busqueda').hidden = !hayBusqueda
  },

  mostrarLista(reservas, total, pagina, porPagina, calificaciones, hayFiltros) {
    const contenedor = document.getElementById('resultados')
    if (total === 0) {
      contenedor.innerHTML = `<div class="tarjeta">${hayFiltros ? `
        <div class="vacio">
          <div class="vacio__icono vacio__icono--gris">${icono('buscar', 16)}</div>
          <p class="vacio__titulo">Sin resultados</p>
          <p class="vacio__texto">Ninguna reserva coincide con los filtros aplicados.</p>
          <button type="button" class="boton boton--primario" data-accion="limpiar-filtros">Limpiar filtros</button>
        </div>` : `
        <div class="vacio vacio--amplio">
          <div class="vacio__icono vacio__icono--grande">${icono('ticket', 36)}</div>
          <p class="vacio__titulo vacio__titulo--grande">Todavía no tienes reservas</p>
          <p class="vacio__texto vacio__texto--estrecho">Explora los eventos disponibles y realiza tu primera reserva. ¡Es rápido y sencillo!</p>
          <a href="/pages/cliente/explorar.html" class="boton boton--primario boton--grande">Explorar eventos ${icono('flechaDerecha', 14)}</a>
        </div>`}</div>`
      return
    }

    const filas = reservas.map(r => `
      <tr>
        <td>
          <div class="evento-mini">
            <div class="evento-mini__imagen"><img src="${esc(r.imagen)}" alt="${esc(r.evento)}"></div>
            <div class="sin-desborde"><p class="evento-mini__nombre">${esc(r.evento)}</p><span class="etiqueta-gris">${esc(r.categoria)}</span></div>
          </div>
        </td>
        <td class="nowrap celda-fecha"><strong>${esc(r.fechaEvento)}</strong><span>${esc(r.horaEvento)}</span></td>
        <td><span class="celda-ciudad">${icono('ubicacion', 13)}${esc(r.ciudad)}</span></td>
        <td class="celda-centro ocultar-lg"><span class="cuadro-numero">${r.entradas}</span></td>
        <td class="ocultar-xl">${esc(r.reservadoEl)}</td>
        <td class="nowrap"><p class="celda-fuerte">${valor(r.total)}</p>${r.estado === 'Cancelada' && r.total > 0 ? `<p class="tachado">${valor(r.total)}</p>` : ''}</td>
        <td>
          <div class="pila">
            ${insigniaReserva(r.estado)}
            ${r.estadoPago ? insigniaPago(r.estadoPago) : ''}
            ${r.metodoPago ? `<small>${esc(r.metodoPago)}</small>` : ''}
            ${r.estado === 'Cancelada' && r.causaCancelacion ? `<span class="motivo-corto" title="${esc(r.causaCancelacion)}">${icono('alerta', 14)}<span>${esc(r.causaCancelacion)}</span></span>` : ''}
          </div>
        </td>
        <td>
          <div class="pila">
            <button type="button" class="boton-tabla" data-ver="${r.id}">${icono('ojo', 15)}Ver detalle</button>
            ${accionCalificar(r, calificaciones[r.id])}
          </div>
        </td>
      </tr>`).join('')

    const tarjetas = reservas.map(r => `
      <article class="reserva-movil">
        <div class="reserva-movil__fila">
          <div class="evento-mini__imagen evento-mini__imagen--56"><img src="${esc(r.imagen)}" alt=""></div>
          <div class="crecer sin-desborde">
            <div class="reserva-movil__fila reserva-movil__fila--entre"><p class="celda-fuerte">${esc(r.evento)}</p>${insigniaReserva(r.estado)}</div>
            <p class="reserva-movil__datos">${icono('calendario', 15)}${esc(r.fechaEvento)} ${icono('ubicacion', 13)}${esc(r.ciudad)}</p>
          </div>
        </div>
        ${r.estado === 'Cancelada' && r.causaCancelacion ? `<div class="alerta alerta--roja">${icono('alerta', 14)}<p>${esc(r.causaCancelacion)}</p></div>` : ''}
        <div class="reserva-movil__pie">
          <div class="pila pila--4">
            <small class="texto-tenue">${r.entradas} entrada${r.entradas > 1 ? 's' : ''} · ${esc(r.reservadoEl)}</small>
            <p class="celda-fuerte">${valor(r.total)}</p>
            ${r.estadoPago ? insigniaPago(r.estadoPago) : ''}
          </div>
          <button type="button" class="boton-tabla" data-ver="${r.id}">${icono('ojo', 15)}Ver detalle</button>
        </div>
        ${r.eventoFinalizado && r.estado !== 'Cancelada' ? `<div class="reserva-movil__calificar">${accionCalificar(r, calificaciones[r.id], true)}</div>` : ''}
      </article>`).join('')

    contenedor.innerHTML = `
      <div class="tarjeta tarjeta--recortada tabla-escritorio">
        <div class="tabla-contenedor">
          <table class="tabla tabla-reservas">
            <thead><tr>
              <th>Evento</th><th>Fecha</th><th>Ciudad</th><th class="celda-centro ocultar-lg">Entradas</th>
              <th class="ocultar-xl">Reservado el</th><th>Total</th><th>Estado</th><th>Acción</th>
            </tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
        ${paginacion(pagina, total, porPagina, '', { texto: ({ desde, hasta, total }) => `<span class="texto-12">Mostrando ${desde}–${hasta} de ${total}</span>` })}
      </div>
      <div class="tarjetas-movil">${tarjetas}${paginacion(pagina, total, porPagina)}</div>`
  },

  // ─── Panel lateral con el detalle de una reserva ───────────────────────────
  cajonDetalle(r, calificacion) {
    const filas = [
      ['Evento', r.evento], ['Fecha del evento', `${r.fechaEvento} · ${r.horaEvento}`], ['Ciudad', r.ciudad],
      ['N.° de entradas', `${r.entradas} entrada${r.entradas > 1 ? 's' : ''}`], ['Fecha de reserva', r.reservadoEl],
      ['Valor total', r.total === 0 ? 'Gratis' : `${valor(r.total)} COP`], ['Código', r.codigo],
    ]
    let aviso = ''
    if (r.estado === 'Cancelada' && r.causaCancelacion) aviso = `<div class="alerta alerta--roja">${icono('alerta', 14)}<div><p class="alerta__titulo alerta__titulo--rojo">Causa de cancelación</p><p>${esc(r.causaCancelacion)}</p></div></div>`
    if (r.estado === 'Confirmada') aviso = `<div class="alerta alerta--verde">${icono('check', 14, { grosor: 2.5 })}<p>Tu reserva fue confirmada. Tus entradas digitales están disponibles en el correo registrado.</p></div>`
    if (r.estado === 'Reservada') aviso = `<div class="alerta alerta--ambar">${icono('reloj', 14)}<p>Pendiente de confirmación por el agente. Te notificaremos cuando sea aprobada.</p></div>`

    let bloqueCalificacion = ''
    if (r.eventoFinalizado && r.estado !== 'Cancelada') {
      bloqueCalificacion = `
        <div class="cajon__bloque">
          <p class="cajon__rotulo">Calificación del evento</p>
          ${calificacion
            ? `<div class="pila pila--8"><span class="calificado calificado--simple calificado--grande">${estrellas(calificacion.estrellas, 22, '#d1d5db')}Evento calificado</span>${calificacion.comentario ? `<p class="aviso-reserva__texto aviso-reserva__texto--cita">"${esc(calificacion.comentario)}"</p>` : ''}</div>`
            : `<button type="button" class="boton-calificar-grande" data-calificar="${r.id}">${ESTRELLA_LLENA(16)}Calificar evento</button>`}
        </div>`
    }

    return `
      <aside class="cajon" role="dialog" aria-modal="true" aria-label="Detalle de reserva">
        <div class="cajon__cabecera">
          <div><h2 class="modal__titulo">Detalle de reserva</h2><p class="modal__subtitulo">${esc(r.codigo)}</p></div>
          <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar aria-label="Cerrar">${icono('cerrar', 15)}</button>
        </div>
        <div class="cajon__imagen">
          <img src="${esc(r.imagen.replace('w=120&h=80', 'w=600&h=300'))}" alt="${esc(r.evento)}">
          <div><small>${esc(r.categoria)}</small><strong>${esc(r.evento)}</strong></div>
        </div>
        <div class="cajon__estado">
          <div class="cajon__estado-fila"><span>Estado de la reserva</span>${insigniaReserva(r.estado)}</div>
          ${aviso}
        </div>
        <dl class="cajon__datos lista-datos">
          ${filas.map(([e, v]) => `<div><dt>${e}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        ${r.estadoPago ? `
          <div class="cajon__bloque">
            <p class="cajon__rotulo">Información del pago</p>
            <div class="tabla-pago">
              <div><span>Estado del pago</span>${insigniaPago(r.estadoPago)}</div>
              <div><span>Método de pago</span><strong>${esc(r.metodoPago)}</strong></div>
              <div><span>Total pagado</span><strong class="negrita">${r.total === 0 ? 'Gratis' : `${valor(r.total)} COP`}</strong></div>
              <div><span>Fecha de pago</span><strong class="texto-suave">${esc(r.fechaPago || '—')}</strong></div>
              <div><span>Código TXN</span><strong class="mono">${esc(r.codigoPago || '—')}</strong></div>
            </div>
          </div>` : ''}
        ${bloqueCalificacion}
        <div class="cajon__acciones">
          <a href="/pages/cliente/detalle-evento.html" class="boton boton--coral boton--bloque">${icono('ticket', 16)}Ver evento</a>
          ${r.estado === 'Reservada' ? '<button type="button" class="boton-cancelar-reserva">Cancelar reserva</button>' : ''}
        </div>
      </aside>`
  },

  // ─── Ventana para calificar un evento ──────────────────────────────────────
  modalCalificar(r) {
    return `
      <div class="calificar">
        <div class="calificar__cabecera">
          <div><h3 class="modal__titulo">Calificar evento</h3><p>${esc(r.evento)}</p></div>
          <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 16)}</button>
        </div>
        <div class="calificar__estrellas">
          <div class="calificar__fila" id="fila-estrellas">
            ${[1, 2, 3, 4, 5].map(i => `<button type="button" data-estrella="${i}" aria-label="${i} estrellas">${icono('estrella', 36)}</button>`).join('')}
          </div>
          <p class="calificar__texto" id="texto-estrellas">${TEXTO_ESTRELLAS[0]}</p>
        </div>
        <div class="campo">
          <label class="campo__etiqueta campo__etiqueta--chica" for="comentario">Comentario <span class="campo__opcional campo__opcional--claro">(opcional)</span></label>
          <textarea id="comentario" class="area-texto" rows="3" placeholder="Cuéntanos tu experiencia…"></textarea>
        </div>
        <div class="calificar__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--coral" id="enviar-calificacion" disabled>Enviar calificación</button>
        </div>
      </div>`
  },

  pintarEstrellas(valor) {
    document.querySelectorAll('#fila-estrellas [data-estrella]').forEach(b =>
      b.classList.toggle('activa', Number(b.dataset.estrella) <= valor))
    document.getElementById('texto-estrellas').textContent = TEXTO_ESTRELLAS[valor]
  },
}
