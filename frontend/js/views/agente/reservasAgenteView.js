// js/views/agente/reservasAgenteView.js
// VISTA de "Reservas" del agente (Sprint 2 · Tarea 8): indicadores, tabla de
// las reservas de SUS eventos y ventanas de detalle / actualización de estado.

import { icono } from '../componentes/iconos.js'
import { paginacion } from '../componentes/paginacion.js'
import { insigniaReserva, kpiFila, filaVacia } from './comunAgenteView.js'
import { esc } from '../../utils/formato.js'

const ini = (nombre) => (nombre || '?').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
const COLORES_ESTADO = { Reservada: ['#fffbeb', '#d97706'], Confirmada: ['#ecfdf5', '#059669'], Cancelada: ['#fef2f2', '#dc2626'] }
const MAX_CAUSA = 300
const plural = (n, palabra) => `${n} ${palabra}${n !== 1 ? 's' : ''}`

function persona(nombre, correo) {
  return `<div class="persona"><span class="avatar">${esc(ini(nombre))}</span><div><p class="persona__nombre">${esc(nombre)}</p><p class="persona__correo">${esc(correo)}</p></div></div>`
}

export const ReservasAgenteView = {
  /** Llena el select de eventos. eventos = [{ id, nombre }] */
  opcionesEventos(eventos) {
    document.getElementById('filtro-evento').innerHTML =
      '<option value="">Todos los eventos</option>' +
      eventos.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join('')
  },

  mostrarIndicadores(reservas) {
    const cuenta = (estado) => reservas.filter(r => r.estado === estado).length
    document.getElementById('estadisticas').innerHTML = [
      kpiFila({ etiqueta: 'Reservas totales', valor: reservas.length, icono: 'ticket', color: '#4f46e5', fondo: '#eef2ff' }),
      kpiFila({ etiqueta: 'Por confirmar', valor: cuenta('Reservada'), icono: 'reloj', color: '#d97706', fondo: '#fffbeb' }),
      kpiFila({ etiqueta: 'Reservas confirmadas', valor: cuenta('Confirmada'), icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5' }),
      kpiFila({ etiqueta: 'Reservas canceladas', valor: cuenta('Cancelada'), icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2' }),
    ].join('')
  },

  mostrarReservas(reservas, total, pagina, porPagina, hayReservas) {
    document.getElementById('conteo').textContent = `${total} reserva${total !== 1 ? 's' : ''} encontrada${total !== 1 ? 's' : ''}`
    const vacio = hayReservas
      ? 'No se encontraron reservas con los filtros seleccionados.'
      : 'Todavía no hay reservas en tus eventos. Cuando un cliente reserve, aparecerá aquí.'
    document.getElementById('tabla-reservas').innerHTML = reservas.length === 0
      ? filaVacia(8, vacio)
      : reservas.map(r => `
        <tr>
          <td>${persona(r.cliente, r.correo)}</td>
          <td><span class="texto-evento" title="${esc(r.evento)}">${esc(r.evento)}</span><span class="persona__correo nowrap" style="display:block">${esc(r.codigo)}</span></td>
          <td class="nowrap">${esc(r.fechaEvento)}<br><span class="persona__correo">${esc(r.horaEvento)}</span></td>
          <td><span class="entradas-celda">${r.entradas}<small>entrada${r.entradas !== 1 ? 's' : ''}</small></span></td>
          <td class="texto-coral-fuerte">${esc(r.valorTexto)}</td>
          <td class="nowrap" style="color:var(--gris-500)">${esc(r.fechaReserva)}</td>
          <td class="nowrap">${insigniaReserva(r.estado)}</td>
          <td>
            <div class="acciones-iconos" style="gap:6px">
              <button type="button" class="boton-accion" data-ver="${r.id}">${icono('ojo', 15)}Ver detalle</button>
              <button type="button" class="boton-accion boton-accion--ambar" data-actualizar="${r.id}"
                ${r.siguientesEstados.length === 0 ? 'disabled title="Una reserva cancelada ya no se puede cambiar"' : ''}>${icono('actualizar', 15)}Actualizar estado</button>
            </div>
          </td>
        </tr>`).join('')
    document.getElementById('paginacion-reservas').innerHTML = paginacion(pagina, total, porPagina, 'reservas')
  },

  /** No se pudieron cargar las reservas (servidor apagado, sesión vencida...) */
  mostrarError(mensaje) {
    document.getElementById('conteo').textContent = ''
    document.getElementById('paginacion-reservas').innerHTML = ''
    document.getElementById('tabla-reservas').innerHTML = `
      <tr><td colspan="8" class="tabla__vacia">
        <p style="margin-bottom:12px">No se pudieron cargar las reservas: ${esc(mensaje)}</p>
        <button type="button" class="boton boton--primario" data-accion="reintentar">Reintentar</button>
      </td></tr>`
  },

  // ─── Ventanas ─────────────────────────────────────────────────────────────
  modalDetalle(r) {
    const fila = (ic, etiqueta, valor) => `<div class="fila-detalle"><span class="fila-detalle__etiqueta">${icono(ic, 16)}${etiqueta}</span><span class="fila-detalle__valor">${esc(valor)}</span></div>`
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Detalle de reserva</h3><p class="modal__subtitulo">${esc(r.codigo)}</p></div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <div class="caja-gris">
          <p class="rotulo-seccion">Cliente</p>
          <div class="persona"><span class="avatar" style="width:36px;height:36px">${esc(ini(r.cliente))}</span>
            <div><p class="persona__nombre">${esc(r.cliente)}</p><p class="persona__correo con-icono" style="color:var(--gris-500)">${icono('correo', 16)}${esc(r.correo)}</p></div></div>
        </div>
        <div class="pila-16" style="gap:12px">
          <p class="rotulo-seccion">Evento</p>
          ${fila('ticket', 'Nombre', r.evento)}
          ${fila('calendario', 'Fecha', r.fechaEvento)}
          ${fila('reloj', 'Hora', r.horaEvento)}
          ${fila('ubicacion', 'Lugar', [r.teatro, r.ciudad].filter(Boolean).join(' · '))}
          ${fila('info', 'Estado del evento', r.estadoEvento)}
        </div>
        <div class="linea" style="height:1px;background:var(--gris-100)"></div>
        <div class="pila-16" style="gap:12px">
          <p class="rotulo-seccion">Reserva</p>
          <div class="cifras">
            <div class="cifra cifra--indigo"><strong>${r.entradas}</strong><span>Entrada${r.entradas !== 1 ? 's' : ''}</span></div>
            <div class="cifra cifra--coral"><strong>${esc(r.valorTexto)}</strong><span>Valor total</span></div>
          </div>
          ${fila('dolar', 'Precio por entrada', '$ ' + r.precioBase.toLocaleString('es-CO'))}
          ${fila('calendario', 'Fecha de reserva', r.fechaReserva)}
          ${r.observaciones ? fila('documento', 'Observaciones', r.observaciones) : ''}
        </div>
        <div class="linea" style="height:1px;background:var(--gris-100)"></div>
        <div class="fila-detalle"><p class="rotulo-seccion">Estado actual</p>${insigniaReserva(r.estado)}</div>
        ${r.estado === 'Cancelada' && r.causaCancelacion ? `<div class="alerta alerta--roja" style="display:block;padding:14px"><p class="alerta__titulo" style="color:#ef4444">Causa de cancelación</p><p style="font-size:14px;color:#b91c1c">${esc(r.causaCancelacion)}</p></div>` : ''}
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--neutro boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },

  /** Ventana para confirmar / cancelar. Solo muestra los estados permitidos
   *  (r.siguientesEstados, calculado en el Modelo). */
  modalActualizar(r) {
    const opciones = r.siguientesEstados
    const avisoEvento = ['Finalizado', 'Cancelado'].includes(r.estadoEvento) && r.estado === 'Reservada'
      ? `<div class="alerta alerta--roja" style="display:block;padding:12px 14px"><p style="font-size:13px">El evento está <strong>${esc(r.estadoEvento)}</strong>: esta reserva ya no se puede confirmar, solo cancelar.</p></div>`
      : ''
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Actualizar estado de reserva</h3><p class="modal__subtitulo">${esc(r.codigo)} · ${esc(r.cliente)} · ${esc(r.evento)}</p></div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <div class="fila-detalle caja-gris" style="flex-direction:row;padding:12px 16px"><span class="fila-detalle__etiqueta">Estado actual</span>${insigniaReserva(r.estado)}</div>
        <p style="font-size:13px;color:var(--gris-500)">${plural(r.entradas, 'entrada')} · ${esc(r.valorTexto)}</p>
        ${avisoEvento}
        <div>
          <p class="campo__etiqueta" style="margin-bottom:10px">Nuevo estado</p>
          <div class="pila" style="gap:8px" id="opciones-estado">
            ${opciones.map(s => `<button type="button" class="opcion-estado" data-estado="${s}" aria-pressed="false" style="--chip-fondo:${COLORES_ESTADO[s][0]};--chip-color:${COLORES_ESTADO[s][1]}"><span class="opcion-estado__radio"></span>${s}</button>`).join('')}
          </div>
        </div>
        <div class="campo" id="campo-causa" hidden>
          <label class="campo__etiqueta" for="causa">Causa de cancelación <span class="campo__requerido--rojo">*</span></label>
          <textarea id="causa" class="area-texto" rows="3" maxlength="${MAX_CAUSA}" placeholder="Describe el motivo de la cancelación (el cliente la verá en Mis reservas)…"></textarea>
          <span class="campo__error" id="error-causa"></span>
        </div>
        <span class="campo__error" id="error-estado" role="alert"></span>
      </div>
      <div class="modal__pie">
        <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
        <button type="button" class="boton boton--coral boton--seminegrita" id="guardar-estado" disabled>Guardar cambio</button>
      </div>`
  },

  /** Marca la opción elegida, muestra/oculta la causa y habilita "Guardar" */
  marcarEstado(estado) {
    document.querySelectorAll('#opciones-estado [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === estado)))
    document.getElementById('campo-causa').hidden = estado !== 'Cancelada'
    document.getElementById('guardar-estado').disabled = !estado
  },

  errorCausa(visible) {
    document.getElementById('error-causa').innerHTML = visible ? `${icono('alerta', 14)}Este campo es obligatorio cuando el estado es Cancelada.` : ''
    document.getElementById('causa').classList.toggle('area-texto--error', visible)
  },

  /** Error que devolvió el backend (409, 403...) dentro de la ventana */
  errorEstado(mensaje) {
    document.getElementById('error-estado').innerHTML = mensaje ? `${icono('alerta', 14)}${esc(mensaje)}` : ''
  },

  /** Estado del botón "Guardar cambio" mientras se envía la petición */
  guardando(activo) {
    const boton = document.getElementById('guardar-estado')
    boton.disabled = activo
    boton.textContent = activo ? 'Guardando…' : 'Guardar cambio'
  },
}