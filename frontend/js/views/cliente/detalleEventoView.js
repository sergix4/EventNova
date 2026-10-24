// js/views/cliente/detalleEventoView.js
// VISTA del detalle de un evento: portada, información, tarjeta de reserva
// y la ventana de pago (resumen → procesando → pago exitoso).

import { icono } from '../componentes/iconos.js'
import { insigniaEvento } from './comunClienteView.js'
import { esc } from '../../utils/formato.js'

const pesos = (v) => '$ ' + v.toLocaleString('es-CO')

const AVISOS = {
  reservada: { icono: 'reloj', color: '#d97706', titulo: 'Reserva pendiente de confirmación', texto: 'Tu reserva fue registrada exitosamente. Está pendiente de confirmación por parte del agente.', pildora: ['#fef3c7', '#92400e', 'Reservada'] },
  confirmada: { icono: 'check', color: '#16a34a', titulo: '¡Reserva confirmada!', texto: 'Tu reserva está confirmada. Recibirás tus entradas digitales en el correo registrado.', pildora: ['#dcfce7', '#15803d', 'Confirmada'] },
  cancelada: { icono: 'advertencia', color: '#dc2626', titulo: 'Reserva cancelada', texto: 'Esta reserva fue cancelada. Si tienes dudas, contacta al agente responsable del evento.', pildora: ['#fee2e2', '#991b1b', 'Cancelada'] },
}

export const METODOS_PAGO = [
  { id: 'Tarjeta débito', icono: 'tarjetaCredito', desc: 'Pago inmediato con tu tarjeta' },
  { id: 'Tarjeta crédito', icono: 'tarjetaCredito2', desc: 'Hasta 36 cuotas sin intereses' },
  { id: 'PSE', icono: 'casa', desc: 'Débito automático desde tu banco' },
  { id: 'Nequi', icono: 'celular', desc: 'Paga con tu cuenta Nequi' },
]

function filaInfo(nombreIcono, etiqueta, valor) {
  return `
    <div class="fila-info">
      ${icono(nombreIcono, 16)}
      <div><p class="fila-info__etiqueta">${etiqueta}</p><p class="fila-info__valor">${esc(valor)}</p></div>
    </div>`
}

export const DetalleEventoView = {
  /** Dibuja toda la página (se llama de nuevo cuando cambia el estado) */
  mostrar(evento, { cantidad, estadoReserva, meGusta, reserva }) {
    const disponibles = evento.capacidad - evento.vendidas
    const porcentaje = Math.round((evento.vendidas / evento.capacidad) * 100)
    const total = evento.precio * cantidad

    document.getElementById('detalle-evento').innerHTML = `
      <section class="portada-evento">
        <img src="${esc(evento.imagen)}" alt="${esc(evento.nombre)}">
        <a href="/pages/cliente/explorar.html" class="portada-evento__volver">${icono('flechaIzquierda', 16)}Volver</a>
        <div class="portada-evento__acciones">
          <button type="button" class="portada-evento__accion" aria-label="Compartir">${icono('compartir', 16)}</button>
          <button type="button" class="portada-evento__accion" data-accion="me-gusta" aria-pressed="${meGusta}" aria-label="Me gusta">${icono('corazon', 16)}</button>
        </div>
        <div class="portada-evento__info">
          <div class="portada-evento__etiquetas">
            <span class="etiqueta-vidrio">${esc(evento.categoria)}</span>
            ${insigniaEvento(evento.estado, { borde: false, grande: true })}
          </div>
          <h1 class="portada-evento__titulo">${esc(evento.nombre)}</h1>
          <div class="portada-evento__datos">
            <span>${icono('ubicacion', 16)}${esc(evento.ciudad)}, ${esc(evento.departamento)}</span>
            <span>${icono('edificio', 16)}${esc(evento.recinto)}</span>
            <span>${icono('calendario', 16)}${esc(evento.fechaCorta)}</span>
            <span>${icono('reloj', 16)}${esc(evento.horaInicio)} – ${esc(evento.horaFin)}</span>
          </div>
        </div>
      </section>

      <div class="detalle">
        <div class="detalle__principal">
          ${estadoReserva !== 'ninguna' ? this.aviso(estadoReserva) : ''}

          <section class="tarjeta tarjeta--relleno">
            <h2 class="titulo-acento">Sobre el evento</h2>
            <div class="detalle__texto">${evento.parrafos.map(p => `<p>${p}</p>`).join('')}</div>
          </section>

          <section class="tarjeta tarjeta--relleno">
            <h2 class="titulo-acento titulo-acento--coral">Información del evento</h2>
            <p class="detalle__nota">Todos los datos oficiales del evento.</p>
            ${filaInfo('numeral', 'Código del evento', evento.codigo)}
            ${filaInfo('edificio', 'Lugar / Recinto', evento.recinto)}
            ${filaInfo('ubicacion', 'Ciudad', `${evento.ciudad}, ${evento.departamento}, ${evento.pais}`)}
            ${filaInfo('calendario', 'Fecha', evento.fechaLarga)}
            ${filaInfo('reloj', 'Hora de inicio', evento.horaInicio)}
            ${filaInfo('reloj', 'Hora estimada de fin', evento.horaFin)}
            ${filaInfo('usuarios', 'Capacidad disponible', `${disponibles} de ${evento.capacidad} lugares disponibles`)}
            <div class="ocupacion${disponibles < 50 ? ' ocupacion--critica' : ''}">
              <div class="ocupacion__fila"><span>Ocupación actual</span><strong>${porcentaje}% vendido</strong></div>
              <div class="barra barra--gruesa"><div class="barra__relleno" style="width:${(evento.vendidas / evento.capacidad) * 100}%"></div></div>
              ${disponibles < 80 ? `<p class="ocupacion__aviso">⚠ Quedan solo ${disponibles} entradas disponibles</p>` : ''}
            </div>
          </section>
        </div>

        <aside class="detalle__lateral">
          <section class="tarjeta-reserva" aria-label="Reservar entradas">
            <div class="tarjeta-reserva__precio">
              <div>
                <p class="tarjeta-reserva__etiqueta">Precio por entrada</p>
                <p class="tarjeta-reserva__valor">${pesos(evento.precio)}</p>
                <p class="tarjeta-reserva__nota">COP — impuestos incluidos</p>
              </div>
              ${insigniaEvento(evento.estado, { borde: false, grande: true })}
            </div>
            <div class="linea"></div>
            ${estadoReserva !== 'ninguna' ? this.reservaHecha(estadoReserva, reserva) : this.formularioReserva(evento, cantidad, total, disponibles)}          </section>
          <div class="ayuda">
            <p>¿Necesitas ayuda?</p>
            <p>Contacta al agente responsable del evento si tienes preguntas sobre disponibilidad, ubicaciones o precios especiales.</p>
          </div>
        </aside>
      </div>
      <div class="espacio-final"></div>`
  },

  aviso(estado) {
    const a = AVISOS[estado]
    return `
      <div class="aviso-reserva aviso-reserva--${estado}" role="status">
        <div class="aviso-reserva__icono" style="color:${a.color}">${icono(a.icono, 20, { grosor: estado === 'confirmada' ? 2.5 : 2 })}</div>
        <div class="aviso-reserva__cuerpo">
          <p class="aviso-reserva__titulo">${a.titulo}<span class="aviso-reserva__pildora" style="background:${a.pildora[0]};color:${a.pildora[1]}">${a.pildora[2]}</span></p>
          <p class="aviso-reserva__texto">${a.texto}</p>
        </div>
        ${estado !== 'cancelada' ? '<button type="button" class="aviso-reserva__cancelar" data-accion="cancelar-reserva">Cancelar</button>' : ''}
      </div>`
  },

  formularioReserva(evento, cantidad, total, disponibles) {
    if (disponibles <= 0) {
      return `<button type="button" class="boton boton--neutro boton--bloque" disabled>Sin cupos disponibles</button>`
    }
    const tope = Math.min(10, disponibles)
    return `
      <div class="campo campo--holgado">
        <span class="campo__etiqueta">Número de entradas</span>
        <div class="cantidad">
          <button type="button" data-accion="menos" ${cantidad <= 1 ? 'disabled' : ''} aria-label="Quitar una entrada">−</button>
          <div class="cantidad__valor"><strong>${cantidad}</strong><span>${cantidad === 1 ? 'entrada' : 'entradas'}</span></div>
          <button type="button" data-accion="mas" ${cantidad >= tope ? 'disabled' : ''} aria-label="Agregar una entrada">+</button>        </div>
      </div>
      <div class="campo">
        <label class="campo__etiqueta" for="observaciones">Observaciones <span class="campo__opcional">(opcional)</span></label>
        <textarea id="observaciones" class="observaciones" rows="3" placeholder="Alguna indicación especial para tu reserva…"></textarea>
      </div>
      <div class="desglose">
        <div class="desglose__fila"><span>${cantidad} × ${pesos(evento.precio)}</span><strong>${pesos(total)}</strong></div>
        <div class="desglose__fila desglose__fila--claro"><span>Cargo por servicio</span><span>$ 0</span></div>
        <div class="desglose__total"><span>Total</span><strong>${pesos(total)}</strong></div>
      </div>
      <button type="button" class="boton boton--coral boton--bloque" data-accion="abrir-pago">${icono('ticket', 18)}Reservar y pagar</button>
      <p class="tarjeta-reserva__seguridad">Pago 100% seguro · Múltiples métodos disponibles</p>`
  },

  reservaHecha(estado, reserva) {
    const pildora = AVISOS[estado].pildora
    return `
      <div class="pila-16">
        <div class="estado-reserva estado-reserva--${estado}">
          <div class="estado-reserva__fila"><span>Código de reserva</span><strong>${esc(reserva.codigo)}</strong></div>
          <div class="estado-reserva__fila"><span>Entradas reservadas</span><strong>${reserva.entradas}</strong></div>
          <div class="estado-reserva__fila"><span>Valor total</span><strong>${pesos(reserva.valorTotal)}</strong></div>
          <div class="linea linea--gris"></div>
          <div class="estado-reserva__fila"><span>Estado</span><span class="insignia" style="background:${pildora[0]};color:${pildora[1]};font-weight:700">${pildora[2]}</span></div>
        </div>
        ${estado === 'cancelada' ? '<button type="button" class="boton boton--contorno boton--bloque" data-accion="volver-a-reservar">Volver a reservar</button>' : ''}
      </div>`
  },

  // ─── Ventana de pago ──────────────────────────────────────────────────────
  pagoResumen(evento, cantidad, metodo) {
    const total = evento.precio * cantidad
    const filas = [
      ['Evento', evento.nombre], ['Fecha', evento.fechaLarga], ['Ciudad', `${evento.ciudad}, ${evento.departamento}`],      ['Entradas', `${cantidad} entrada${cantidad > 1 ? 's' : ''}`], ['Precio c/u', pesos(evento.precio)],
    ]
    const conTarjeta = metodo === 'Tarjeta débito' || metodo === 'Tarjeta crédito'
    return `
      <div class="pago__cabecera">
        <div class="pago__icono">${icono('ticket', 20)}</div>
        <div><h2 class="pago__titulo">Reservar y pagar</h2><p class="modal__subtitulo">Revisa tu pedido y elige el método de pago</p></div>
      </div>
      <div class="pago__seccion">
        <p class="pago__rotulo">Resumen de la reserva</p>
        ${filas.map(([e, v]) => `<div class="pago__fila"><span>${e}</span><strong>${esc(v)}</strong></div>`).join('')}
        <div class="pago__total"><span>Total a pagar</span><strong>${pesos(total)}</strong></div>
      </div>
      <div class="pago__seccion">
        <p class="pago__rotulo">Método de pago</p>
        <div class="metodos">
          ${METODOS_PAGO.map(m => `
            <button type="button" class="metodo" data-metodo="${m.id}" aria-pressed="${m.id === metodo}">
              <span class="metodo__fila">${icono(m.icono, 20)}<span class="metodo__check">${icono('check', 9, { grosor: 3 })}</span></span>
              <strong>${m.id}</strong>
              <small>${m.desc}</small>
            </button>`).join('')}
        </div>
        ${conTarjeta ? `
          <div class="tarjeta-simulada">
            <div class="tarjeta-simulada__campos"><span>•••• •••• •••• 4287</span><span style="width:64px">08/27</span><span style="width:56px">•••</span></div>
            <p>Campos simulados — no ingresar datos reales</p>
          </div>` : ''}
      </div>
      <div class="pago__acciones">
        <button type="button" class="boton boton--coral boton--bloque boton--grande" data-accion="pagar" style="box-shadow:var(--sombra-md)">${icono('escudo', 16, { grosor: 2.5 })}Pagar ${pesos(total)}</button>
        <button type="button" class="boton boton--neutro boton--bloque" data-cerrar-modal>Cancelar</button>
        <p class="pago__nota">🔒 Pago simulado · No se realizará ningún cobro real</p>
      </div>`
  },

  pagoProcesando() {
    return `
      <div class="pago__procesando">
        <div class="pago__procesando-icono">${icono('cargando', 32, { grosor: 2.5, clase: 'girando' })}</div>
        <p><strong>Procesando pago…</strong><span>Por favor espera unos segundos</span></p>
        <div class="pago__progreso"><span></span></div>
      </div>`
  },

    /** Reserva guardada en PostgreSQL: muestra el código y el valor que calculó el backend */
  pagoExitoso(evento, reserva, metodo) {
    const filas = [
      ['Código de reserva', reserva.codigo], ['Evento', evento.nombre],
      ['N.° de entradas', `${reserva.entradas} entrada${reserva.entradas > 1 ? 's' : ''}`],
      ['Valor total', pesos(reserva.valorTotal)], ['Método de pago', metodo], ['Fecha de la reserva', reserva.fechaReserva],
    ]
    return `
      <div class="pago__exito">
        <div class="pago__exito-icono">${icono('check', 28, { grosor: 2.5 })}</div>
        <strong>¡Reserva registrada!</strong>
        <p>Queda pendiente de confirmación por parte del agente</p>
      </div>
      <div class="pago__seccion" style="border-bottom:0;padding-top:20px">
        ${filas.map(([e, v]) => `<div class="pago__fila" style="padding:10px 0"><span>${e}</span><strong>${esc(v)}</strong></div>`).join('')}
        <div class="pago__fila" style="padding:10px 0"><span>Estado</span><span class="insignia" style="background:#fef3c7;color:#92400e;font-weight:700">${esc(reserva.estado)}</span></div>
      </div>
      <div class="pago__acciones" style="padding-top:0">
        <button type="button" class="boton boton--primario boton--bloque boton--grande" data-accion="ver-reserva">Ver mi reserva</button>
      </div>`
  },

  /** El backend rechazó la operación (sin cupos, evento cancelado, sin sesión...) */
  pagoError(mensaje) {
    return `
      <div class="pago__exito" style="background:#fef2f2">
        <div class="pago__exito-icono" style="background:#fee2e2;color:#dc2626">${icono('advertencia', 28, { grosor: 2.5 })}</div>
        <strong>No se pudo completar la operación</strong>
        <p>${esc(mensaje)}</p>
      </div>
      <div class="pago__acciones">
        <button type="button" class="boton boton--neutro boton--bloque" data-cerrar-modal>Volver</button>
      </div>`
  },
}
