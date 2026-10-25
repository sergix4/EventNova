// js/controllers/cliente/detalleEventoController.js
// CONTROLADOR del detalle del evento: cantidad de entradas, "me gusta",
// ventana de pago (simulada) y la reserva REAL contra /api/reservas (Tarea 6).

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { DetalleEventoView } from '../../views/cliente/detalleEventoView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

// reserva = la reserva que devolvió el backend (null mientras no se haya reservado)
const estado = { cantidad: 1, estadoReserva: 'ninguna', meGusta: false, reserva: null }
let evento = null

const esperar = (ms) => new Promise(r => setTimeout(r, ms))

// 'Reservada' -> 'reservada' (así se llaman los avisos de la vista)
const estadoVista = (reserva) => reserva.estado.toLowerCase()

function dibujar() {
  // Se conserva lo que el usuario escribió en "Observaciones" al redibujar
  const observaciones = document.getElementById('observaciones')?.value || ''
  DetalleEventoView.mostrar(evento, estado)
  const campo = document.getElementById('observaciones')
  if (campo) campo.value = observaciones
}

// Vuelve a pedir el evento para que "Capacidad disponible" quede al día
async function recargarEvento() {
  evento = await EventoModel.obtenerDetalle(evento.id)
}

function abrirPago() {
  let metodo = 'PSE'
  let procesando = false
  // Las observaciones se leen AHORA, antes de que se abra la ventana
  const observaciones = document.getElementById('observaciones')?.value.trim() || ''
  const caja = abrirModal(DetalleEventoView.pagoResumen(evento, estado.cantidad, metodo), {
    clase: 'modal--pago',
    cerrarAlHacerClicFuera: true,
  })

  caja.addEventListener('click', async (e) => {
    if (procesando) return
    const botonMetodo = e.target.closest('[data-metodo]')
    if (botonMetodo) {
      metodo = botonMetodo.dataset.metodo
      caja.innerHTML = DetalleEventoView.pagoResumen(evento, estado.cantidad, metodo)
      return
    }
    if (e.target.closest('[data-accion="pagar"]')) {
      procesando = true
      caja.innerHTML = DetalleEventoView.pagoProcesando()
      try {
        // POST /api/reservas. El backend valida cupos y calcula el valor total.
        // (esperar 1.5 s es solo para que se alcance a ver "Procesando pago…")
        const [reserva] = await Promise.all([
          ReservaModel.crear({ id_evento: evento.id, numero_entradas: estado.cantidad, observaciones }),
          esperar(1500),
        ])
        estado.reserva = reserva
        caja.innerHTML = DetalleEventoView.pagoExitoso(evento, reserva, metodo)
      } catch (error) {
        // p. ej. 409 "Solo quedan 2 entradas disponibles para este evento."
        caja.innerHTML = DetalleEventoView.pagoError(error.message)
      } finally {
        procesando = false
      }
      return
    }
    if (e.target.closest('[data-accion="ver-reserva"]')) {
      // Tarea 7: lleva a "Mis reservas" y abre el detalle de la reserva recién creada
      window.location.href = `/pages/cliente/mis-reservas.html?reserva=${estado.reserva.id}`
    }
  })
}

async function cancelarReserva() {
  if (!estado.reserva) return
  try {
    // PATCH /api/reservas/:id/estado -> Cancelada
    estado.reserva = await ReservaModel.cancelar(estado.reserva.id)
    estado.estadoReserva = estadoVista(estado.reserva)
    await recargarEvento()
    dibujar()
    mostrarToast('Reserva cancelada.', { detalle: estado.reserva.codigo })
  } catch (error) {
    abrirModal(DetalleEventoView.pagoError(error.message), { clase: 'modal--pago' })
  }
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()
  evento = await EventoModel.obtenerDetalle()
  dibujar()

  document.getElementById('detalle-evento').addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion
    if (!accion) return
    const disponibles = evento.capacidad - evento.vendidas
    if (accion === 'menos') estado.cantidad = Math.max(1, estado.cantidad - 1)
    if (accion === 'mas') estado.cantidad = Math.min(10, disponibles, estado.cantidad + 1)
    if (accion === 'me-gusta') estado.meGusta = !estado.meGusta
    if (accion === 'cancelar-reserva') return cancelarReserva()
    if (accion === 'volver-a-reservar') {
      estado.estadoReserva = 'ninguna'
      estado.reserva = null
      estado.cantidad = 1
    }
    if (accion === 'abrir-pago') return abrirPago()
    dibujar()
  })
}

iniciar()