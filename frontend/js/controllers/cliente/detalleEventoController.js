// js/controllers/cliente/detalleEventoController.js
// CONTROLADOR del detalle del evento: cantidad de entradas, "me gusta",
// ventana de pago (simulada) y la reserva REAL contra /api/reservas (Tarea 6).
// Ajustes finales: cada compra es una RESERVA NUEVA y ya confirmada. Si el
// cliente ya tiene reservas de este evento se muestra la más reciente y el
// total; "Agregar más entradas" crea otra reserva (tope: 10 por cliente y evento).

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { ReservaModel } from '../../models/reservaModel.js'
import { DetalleEventoView } from '../../views/cliente/detalleEventoView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'
import { MisReservasView } from '../../views/cliente/misReservasView.js'
import { conectarSelectorEntradas } from '../comun/selectorEntradasController.js'

// reserva = la reserva activa MÁS RECIENTE del cliente en este evento (null si no tiene)
// totalEntradas / numReservas = suma de todas sus reservas activas de este evento
// agregando = true mientras elige cuántas entradas más comprar
const estado = { cantidad: 1, estadoReserva: 'ninguna', reserva: null, agregando: false, totalEntradas: 0, numReservas: 0 }
const MAX_ENTRADAS = 10
let evento = null

const esperar = (ms) => new Promise(r => setTimeout(r, ms))

// Auditoría 4: solo hay dos avisos posibles (la reserva se confirma al pagar)
const estadoVista = (reserva) => (reserva.estado === 'Cancelada' ? 'cancelada' : 'confirmada')

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
        // Detrás de la ventana, la página ya muestra la reserva, el total y los cupos al día
        Promise.all([recargarEvento(), cargarReservas()]).then(dibujar).catch(() => dibujar())
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
      window.location.href = `mis-reservas.html?reserva=${estado.reserva.id}`
    }
  })
}

// Misma ventana de "Mis reservas": elige cuántas entradas cancelar y el motivo
// "Compartir": copia el enlace del evento para pegarlo en WhatsApp, correo, etc.
async function compartir() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    mostrarToast('Enlace del evento copiado.', { duracion: 2500 })
  } catch {
    mostrarToast('No se pudo copiar el enlace.', { detalle: window.location.href, error: true, duracion: 5000 })
  }
}

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
      await Promise.all([recargarEvento(), cargarReservas()])
      dibujar()
      mostrarToast(cantidad < r.entradas ? `Se cancelaron ${cantidad} entradas.` : 'Reserva cancelada.', { detalle: r.codigo })
    } catch (error) {
      MisReservasView.mostrarErrorCancelacion(error.message)
      confirmar.disabled = false
      confirmar.textContent = 'Confirmar cancelación'
    }
  })
}

// Reservas ACTIVAS (no canceladas) del cliente en este evento. La API las
// devuelve de la más reciente a la más antigua: se muestra la primera.
async function cargarReservas() {
  let activas = []
  try {
    const mias = await ReservaModel.delCliente()
    activas = mias.filter(r => String(r.id_evento) === String(evento.id) && r.estado !== 'Cancelada')
  } catch {
    // si falla, la página funciona igual (el backend igual revisa el tope de 10)
  }
  estado.totalEntradas = activas.reduce((suma, r) => suma + r.entradas, 0)
  estado.numReservas = activas.length
  if (activas.length > 0) {
    estado.reserva = activas[0]
    estado.estadoReserva = estadoVista(activas[0])
  }
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()
  // Ajustes finales: si el evento no existe o fue eliminado, se muestra un
  // mensaje en vez de dejar la página en blanco
  try {
    evento = await EventoModel.obtenerDetalle()
  } catch (error) {
    return DetalleEventoView.noEncontrado(
      error.status === 404 ? 'Este evento no existe o fue eliminado' : 'No se pudo cargar el evento',
    )
  }
  if (!evento) return DetalleEventoView.noEncontrado('Este evento no existe o fue eliminado')
  await cargarReservas()
  dibujar()

  document.getElementById('detalle-evento').addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion
    if (!accion) return
    const disponibles = evento.capacidad - evento.vendidas
    // El tope es lo que le falta al cliente para llegar a 10 en este evento
    const yaTiene = estado.totalEntradas
    if (accion === 'menos') estado.cantidad = Math.max(1, estado.cantidad - 1)
    if (accion === 'mas') estado.cantidad = Math.min(MAX_ENTRADAS - yaTiene, disponibles, estado.cantidad + 1)
    if (accion === 'agregar-entradas') { estado.agregando = true; estado.cantidad = 1 }
    if (accion === 'cancelar-agregar') estado.agregando = false
    if (accion === 'compartir') return compartir()
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