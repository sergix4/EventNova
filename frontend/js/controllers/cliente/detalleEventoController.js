// js/controllers/cliente/detalleEventoController.js
// CONTROLADOR del detalle del evento: cantidad de entradas, "me gusta",
// ventana de pago (simulada) y la reserva REAL contra /api/reservas (Tarea 6).
// Una sola reserva por cliente y evento: si ya tiene una activa, se muestra y
// las entradas nuevas se SUMAN a ella ("Agregar más entradas").

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { DetalleEventoView } from '../../views/cliente/detalleEventoView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'
import { MisReservasView } from '../../views/cliente/misReservasView.js'
import { conectarSelectorEntradas } from '../comun/selectorEntradasController.js'

// reserva = la reserva activa del cliente en este evento (null si no tiene)
// agregando = true mientras elige cuántas entradas SUMAR a esa reserva
const estado = { cantidad: 1, estadoReserva: 'ninguna', meGusta: false, reserva: null, agregando: false }
const MAX_ENTRADAS = 10
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
        estado.estadoReserva = estadoVista(reserva)
        estado.agregando = false
        estado.cantidad = 1
        caja.innerHTML = DetalleEventoView.pagoExitoso(evento, reserva, metodo)
        // Detrás de la ventana, la página ya muestra la reserva y los cupos al día
        recargarEvento().then(dibujar).catch(() => dibujar())
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

// Misma ventana de "Mis reservas": elige cuántas entradas cancelar y el motivo
function cancelarReserva() {
  const r = estado.reserva
  if (!r) return
  const caja = abrirModal(MisReservasView.modalCancelar(r))
  const cantidadElegida = conectarSelectorEntradas(caja, r.entradas, r.precioBase)
  const confirmar = caja.querySelector('#confirmar-cancelacion')

  confirmar.addEventListener('click', async () => {
    confirmar.disabled = true
    confirmar.textContent = 'Cancelando…'
    const causa = caja.querySelector('#causa-cancelacion').value.trim() || null
    const cantidad = cantidadElegida()
    try {
      // PATCH /api/reservas/:id/estado -> Cancelada (todas) o quita "cantidad" entradas
      estado.reserva = await ReservaModel.cancelar(r.id, causa, cantidad)
      estado.estadoReserva = estadoVista(estado.reserva)
      cerrarModal()
      await recargarEvento()
      dibujar()
      mostrarToast(cantidad < r.entradas ? `Se cancelaron ${cantidad} entradas.` : 'Reserva cancelada.', { detalle: estado.reserva.codigo })
    } catch (error) {
      MisReservasView.mostrarErrorCancelacion(error.message)
      confirmar.disabled = false
      confirmar.textContent = 'Confirmar cancelación'
    }
  })
}

// ¿El cliente ya tiene una reserva ACTIVA (no cancelada) de este evento?
async function buscarReservaActiva() {
  try {
    const mias = await ReservaModel.delCliente()
    return mias.find(r => String(r.id_evento) === String(evento.id) && r.estado !== 'Cancelada') || null
  } catch {
    return null // si falla, la página funciona igual (el backend también suma)
  }
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()
  evento = await EventoModel.obtenerDetalle()
  const activa = await buscarReservaActiva()
  if (activa) {
    estado.reserva = activa
    estado.estadoReserva = estadoVista(activa)
  }
  dibujar()

  document.getElementById('detalle-evento').addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion
    if (!accion) return
    const disponibles = evento.capacidad - evento.vendidas
    // Si está agregando entradas, el tope es lo que le falta para llegar a 10
    const yaTiene = estado.agregando && estado.reserva ? estado.reserva.entradas : 0
    if (accion === 'menos') estado.cantidad = Math.max(1, estado.cantidad - 1)
    if (accion === 'mas') estado.cantidad = Math.min(MAX_ENTRADAS - yaTiene, disponibles, estado.cantidad + 1)
    if (accion === 'agregar-entradas') { estado.agregando = true; estado.cantidad = 1 }
    if (accion === 'cancelar-agregar') estado.agregando = false
    if (accion === 'me-gusta') estado.meGusta = !estado.meGusta
    if (accion === 'cancelar-reserva') return cancelarReserva()
    if (accion === 'volver-a-reservar') {
      estado.estadoReserva = 'ninguna'
      estado.reserva = null
      estado.agregando = false
      estado.cantidad = 1
    }
    if (accion === 'abrir-pago') return abrirPago()
    dibujar()
  })
}

iniciar()