// js/controllers/cliente/detalleEventoController.js
// CONTROLADOR del detalle del evento: cantidad de entradas, "me gusta",
// ventana de pago simulada y estado de la reserva.

import { iniciarPanel, iniciarNotificaciones } from '../comun/panelController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { DetalleEventoView } from '../../views/cliente/detalleEventoView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'

const estado = { cantidad: 1, estadoReserva: 'ninguna', meGusta: false }
let evento = null

function dibujar() {
  // Se conserva lo que el usuario escribió en "Observaciones" al redibujar
  const observaciones = document.getElementById('observaciones')?.value || ''
  DetalleEventoView.mostrar(evento, estado)
  const campo = document.getElementById('observaciones')
  if (campo) campo.value = observaciones
}

function abrirPago() {
  let metodo = 'PSE'
  let procesando = false
  const codigo = 'TXN-' + Math.floor(800000 + Math.random() * 99999)
  const caja = abrirModal(DetalleEventoView.pagoResumen(evento, estado.cantidad, metodo), {
    clase: 'modal--pago',
    cerrarAlHacerClicFuera: true,
  })

  caja.addEventListener('click', (e) => {
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
      setTimeout(() => {
        procesando = false
        caja.innerHTML = DetalleEventoView.pagoExitoso(evento, estado.cantidad, metodo, codigo)
      }, 2000)
      return
    }
    if (e.target.closest('[data-accion="ver-reserva"]')) {
      cerrarModal()
      estado.estadoReserva = 'confirmada'
      dibujar()
      setTimeout(() => { window.location.href = '/pages/cliente/mis-reservas.html' }, 600)
    }
  })
}

async function iniciar() {
  await iniciarPanel({ rol: 'cliente', activo: 'explorar' })
  iniciarNotificaciones()
  evento = await EventoModel.obtenerDetalle()
  dibujar()

  document.getElementById('detalle-evento').addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion
    if (!accion) return
    if (accion === 'menos') estado.cantidad = Math.max(1, estado.cantidad - 1)
    if (accion === 'mas') estado.cantidad = Math.min(10, estado.cantidad + 1)
    if (accion === 'me-gusta') estado.meGusta = !estado.meGusta
    if (accion === 'cancelar-reserva') estado.estadoReserva = 'cancelada'
    if (accion === 'volver-a-reservar') estado.estadoReserva = 'ninguna'
    if (accion === 'abrir-pago') return abrirPago()
    dibujar()
  })
}

iniciar()
