// js/views/agente/reservasAgenteView.js
// VISTA de "Reservas" del agente: indicadores, tabla de reservas, pagos
// recibidos y ventanas de detalle / actualización de estado.

import { icono } from '../componentes/iconos.js'
import { paginacion } from '../componentes/paginacion.js'
import { insigniaReserva, insigniaPago, kpiFila, filaVacia } from './comunAgenteView.js'
import { esc, cop } from '../../utils/formato.js'

const ini = (nombre) => nombre.split(' ').map(n => n[0]).join('').slice(0, 2)
const COLORES_ESTADO = { Pendiente: ['#fffbeb', '#d97706'], Confirmada: ['#ecfdf5', '#059669'], Cancelada: ['#fef2f2', '#dc2626'] }

function persona(nombre, correo) {
  return `<div class="persona"><span class="avatar">${esc(ini(nombre))}</span><div><p class="persona__nombre">${esc(nombre)}</p><p class="persona__correo">${esc(correo)}</p></div></div>`
}

export const ReservasAgenteView = {
  opcionesEventos(nombres) {
    document.getElementById('filtro-evento').innerHTML = ['Todos los eventos', ...nombres].map(n => `<option>${esc(n)}</option>`).join('')
  },

  mostrarIndicadores(reservas) {
    const cuenta = (estado) => reservas.filter(r => r.estado === estado).length
    document.getElementById('estadisticas').innerHTML = [
      kpiFila({ etiqueta: 'Reservas totales', valor: reservas.length, icono: 'ticket', color: '#4f46e5', fondo: '#eef2ff' }),
      kpiFila({ etiqueta: 'Reservas pendientes', valor: cuenta('Pendiente'), icono: 'reloj', color: '#d97706', fondo: '#fffbeb' }),
      kpiFila({ etiqueta: 'Reservas confirmadas', valor: cuenta('Confirmada'), icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5' }),
      kpiFila({ etiqueta: 'Reservas canceladas', valor: cuenta('Cancelada'), icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2' }),
    ].join('')
  },

  mostrarReservas(reservas, total, pagina, porPagina) {
    document.getElementById('conteo').textContent = `${total} reserva${total !== 1 ? 's' : ''} encontrada${total !== 1 ? 's' : ''}`
    document.getElementById('tabla-reservas').innerHTML = reservas.length === 0
      ? filaVacia(8, 'No se encontraron reservas con los filtros seleccionados.')
      : reservas.map(r => `
        <tr>
          <td>${persona(r.cliente, r.correo)}</td>
          <td><span class="texto-evento">${esc(r.evento)}</span></td>
          <td class="nowrap">${esc(r.fechaEvento)}</td>
          <td><span class="entradas-celda">${r.entradas}<small>entrada${r.entradas !== 1 ? 's' : ''}</small></span></td>
          <td class="texto-coral-fuerte">${esc(r.valorTexto)}</td>
          <td class="nowrap" style="color:var(--gris-500)">${esc(r.fechaReserva)}</td>
          <td class="nowrap">${insigniaReserva(r.estado)}</td>
          <td>
            <div class="acciones-iconos" style="gap:6px">
              <button type="button" class="boton-accion" data-ver="${r.id}">${icono('ojo', 15)}Ver detalle</button>
              <button type="button" class="boton-accion boton-accion--ambar" data-actualizar="${r.id}">${icono('actualizar', 15)}Actualizar estado</button>
            </div>
          </td>
        </tr>`).join('')
    document.getElementById('paginacion-reservas').innerHTML = paginacion(pagina, total, porPagina, 'reservas')
  },

  mostrarIndicadoresPagos(pagos) {
    const total = pagos.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.valor, 0)
    const cuenta = (...estados) => pagos.filter(p => estados.includes(p.estado)).length
    document.getElementById('estadisticas-pagos').innerHTML = [
      kpiFila({ etiqueta: 'Total recibido', valor: cop(total), icono: 'dolar', color: '#4f46e5', fondo: '#eef2ff', medio: true, grande: false }),
      kpiFila({ etiqueta: 'Pagos recibidos', valor: String(cuenta('Pagado')), icono: 'checkCirculo', color: '#059669', fondo: '#ecfdf5', medio: true, grande: false }),
      kpiFila({ etiqueta: 'Pagos pendientes', valor: String(cuenta('Pendiente')), icono: 'reloj', color: '#d97706', fondo: '#fffbeb', medio: true, grande: false }),
      kpiFila({ etiqueta: 'Cancelados/Reimb.', valor: String(cuenta('Cancelado', 'Reembolsado')), icono: 'equisCirculo', color: '#dc2626', fondo: '#fef2f2', medio: true, grande: false }),
    ].join('')
  },

  mostrarPagos(pagos, total, pagina, porPagina) {
    document.getElementById('tabla-pagos').innerHTML = pagos.length === 0
      ? filaVacia(9, 'Sin resultados.')
      : pagos.map(p => `
        <tr>
          <td>${persona(p.clienteNombre, p.clienteCorreo)}</td>
          <td><span class="texto-evento texto-evento--estrecho">${esc(p.eventoNombre)}</span></td>
          <td class="nowrap">${esc(p.fechaPago)}</td>
          <td class="celda-centro" style="font-weight:700;color:var(--gris-700)">${p.entradas}</td>
          <td class="nowrap">${esc(p.metodoPago)}</td>
          <td class="texto-coral-fuerte">${esc(p.valorStr)}</td>
          <td class="nowrap">${insigniaPago(p.estado)}</td>
          <td class="nowrap mono" style="font-size:12px;font-weight:600;color:var(--gris-500)">${esc(p.codigoTransaccion)}</td>
          <td><button type="button" class="boton-accion" data-pago="${p.id}">${icono('ojo', 13)}Ver detalle</button></td>
        </tr>`).join('')
    document.getElementById('paginacion-pagos').innerHTML = paginacion(pagina, total, porPagina, 'pagos')
  },

  // ─── Ventanas ─────────────────────────────────────────────────────────────
  modalDetalle(r) {
    const fila = (ic, etiqueta, valor) => `<div class="fila-detalle"><span class="fila-detalle__etiqueta">${icono(ic, 16)}${etiqueta}</span><span class="fila-detalle__valor">${esc(valor)}</span></div>`
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Detalle de reserva</h3><p class="modal__subtitulo">ID #${String(r.id).padStart(5, '0')}</p></div>
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
        </div>
        <div class="linea" style="height:1px;background:var(--gris-100)"></div>
        <div class="pila-16" style="gap:12px">
          <p class="rotulo-seccion">Reserva</p>
          <div class="cifras">
            <div class="cifra cifra--indigo"><strong>${r.entradas}</strong><span>Entrada${r.entradas !== 1 ? 's' : ''}</span></div>
            <div class="cifra cifra--coral"><strong>${esc(r.valorTexto)}</strong><span>Valor total</span></div>
          </div>
          ${fila('calendario', 'Fecha de reserva', r.fechaReserva)}
        </div>
        <div class="linea" style="height:1px;background:var(--gris-100)"></div>
        <div class="fila-detalle"><p class="rotulo-seccion">Estado actual</p>${insigniaReserva(r.estado)}</div>
        ${r.estado === 'Cancelada' && r.causaCancelacion ? `<div class="alerta alerta--roja" style="display:block;padding:14px"><p class="alerta__titulo" style="color:#ef4444">Causa de cancelación</p><p style="font-size:14px;color:#b91c1c">${esc(r.causaCancelacion)}</p></div>` : ''}
      </div>
      <div class="modal__pie"><button type="button" class="boton boton--neutro boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },

  modalActualizar(r) {
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Actualizar estado de reserva</h3><p class="modal__subtitulo">${esc(r.cliente)} · ${esc(r.evento)}</p></div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <div class="fila-detalle caja-gris" style="flex-direction:row;padding:12px 16px"><span class="fila-detalle__etiqueta">Estado actual</span>${insigniaReserva(r.estado)}</div>
        <div>
          <p class="campo__etiqueta" style="margin-bottom:10px">Nuevo estado</p>
          <div class="pila" style="gap:8px" id="opciones-estado">
            ${['Pendiente', 'Confirmada', 'Cancelada'].map(s => `<button type="button" class="opcion-estado" data-estado="${s}" aria-pressed="${s === r.estado}" style="--chip-fondo:${COLORES_ESTADO[s][0]};--chip-color:${COLORES_ESTADO[s][1]}"><span class="opcion-estado__radio"></span>${s}</button>`).join('')}
          </div>
        </div>
        <div class="campo" id="campo-causa"${r.estado === 'Cancelada' ? '' : ' hidden'}>
          <label class="campo__etiqueta" for="causa">Causa de cancelación <span class="campo__requerido--rojo">*</span></label>
          <textarea id="causa" class="area-texto" rows="3" placeholder="Describe el motivo de la cancelación…">${esc(r.causaCancelacion || '')}</textarea>
          <span class="campo__error" id="error-causa"></span>
        </div>
        <div class="mensaje-exito" id="exito" hidden>${icono('check', 20, { grosor: 2.5 })}Estado de reserva actualizado correctamente.</div>
      </div>
      <div class="modal__pie">
        <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
        <button type="button" class="boton boton--coral boton--seminegrita" id="guardar-estado">Guardar cambio</button>
      </div>`
  },

  marcarEstado(estado) {
    document.querySelectorAll('#opciones-estado [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === estado)))
    document.getElementById('campo-causa').hidden = estado !== 'Cancelada'
  },

  errorCausa(visible) {
    document.getElementById('error-causa').innerHTML = visible ? `${icono('alerta', 14)}Este campo es obligatorio cuando el estado es Cancelada.` : ''
    document.getElementById('causa').classList.toggle('area-texto--error', visible)
  },

  modalPago(p) {
    const filas = [
      ['Cliente', p.clienteNombre], ['Correo', p.clienteCorreo], ['Evento', p.eventoNombre],
      ['Cantidad de entradas', `${p.entradas} entrada${p.entradas !== 1 ? 's' : ''}`], ['Valor pagado', p.valorStr],
      ['Método de pago', p.metodoPago], ['Fecha y hora', `${p.fechaPago}, ${p.horaPago}`], ['Código de transacción', p.codigoTransaccion],
    ]
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Detalle del pago</h3><p class="modal__subtitulo mono">${esc(p.codigoTransaccion)}</p></div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 16)}</button>
      </div>
      <dl class="modal__cuerpo lista-datos" style="gap:0">
        ${filas.map(([e, v]) => `<div><dt>${e}</dt><dd class="mono">${esc(v)}</dd></div>`).join('')}
        <div style="align-items:center"><dt>Estado del pago</dt><dd>${insigniaPago(p.estado)}</dd></div>
      </dl>
      <div class="modal__pie"><button type="button" class="boton boton--primario boton--bloque" data-cerrar-modal>Cerrar</button></div>`
  },
}
