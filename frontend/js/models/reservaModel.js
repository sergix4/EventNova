// js/models/reservaModel.js
// MODELO de reservas y pagos.
// Datos de ejemplo hasta que exista el CRUD de RESERVA en el backend
// (pendiente Sprint 2: /api/reservas).

import { RESERVAS_AGENTE_DEMO, PAGOS_AGENTE_DEMO, EVENTOS } from './datosEjemplo.js'
import { capitalizarMes } from '../utils/formato.js'

const img = (id) => `https://images.unsplash.com/photo-${id}?w=120&h=80&fit=crop&auto=format`

// Reservas del cliente (pantalla "Mis reservas")
const RESERVAS_CLIENTE = [
  { id: 'R001', codigo: 'RES-2025-0912-001', evento: 'Festival de Música Urbana', categoria: 'Festival', imagen: img('1501386761578-eac5c94b800a'), fechaEvento: '12 Sep 2025', horaEvento: '6:00 PM', ciudad: 'Medellín', entradas: 2, reservadoEl: '3 Ago 2025', total: 190000, estado: 'Confirmada', eventoFinalizado: true, estadoPago: 'Pagado', metodoPago: 'PSE', fechaPago: '4 Ago 2025', codigoPago: 'TXN-712201' },
  { id: 'R002', codigo: 'RES-2025-0920-002', evento: 'Noche de Comedia Stand-Up', categoria: 'Comedia', imagen: img('1580188928585-0ef5c1a5c4dd'), fechaEvento: '20 Sep 2025', horaEvento: '8:30 PM', ciudad: 'Bogotá', entradas: 1, reservadoEl: '10 Ago 2025', total: 70000, estado: 'Reservada', estadoPago: 'Pendiente', metodoPago: 'Nequi', fechaPago: '10 Ago 2025', codigoPago: 'TXN-712202' },
  { id: 'R003', codigo: 'RES-2025-1005-003', evento: 'Teatro bajo las Estrellas', categoria: 'Teatro', imagen: img('1576724196706-3f23f51ea351'), fechaEvento: '5 Oct 2025', horaEvento: '7:00 PM', ciudad: 'Cali', entradas: 3, reservadoEl: '15 Ago 2025', total: 165000, estado: 'Confirmada', eventoFinalizado: true, estadoPago: 'Pagado', metodoPago: 'Tarjeta crédito', fechaPago: '15 Ago 2025', codigoPago: 'TXN-712203' },
  { id: 'R004', codigo: 'RES-2025-0801-004', evento: 'Maluma · World Tour 2025', categoria: 'Concierto', imagen: img('1470229722913-7c0e2dbbafd3'), fechaEvento: '15 Ago 2025', horaEvento: '8:00 PM', ciudad: 'Bogotá', entradas: 2, reservadoEl: '22 Jul 2025', total: 240000, estado: 'Cancelada', causaCancelacion: 'El cliente solicitó cancelación voluntaria antes de la fecha límite.', estadoPago: 'Reembolsado', metodoPago: 'Tarjeta débito', fechaPago: '23 Jul 2025', codigoPago: 'TXN-712204' },
  { id: 'R005', codigo: 'RES-2025-1018-005', evento: 'Concierto Sinfónico — Beethoven', categoria: 'Clásica', imagen: img('1519682718457-c82ce8296645'), fechaEvento: '18 Oct 2025', horaEvento: '5:00 PM', ciudad: 'Bogotá', entradas: 2, reservadoEl: '20 Ago 2025', total: 240000, estado: 'Reservada', eventoFinalizado: true, estadoPago: 'Pendiente', metodoPago: 'PSE', fechaPago: '20 Ago 2025', codigoPago: 'TXN-712205' },
  { id: 'R006', codigo: 'RES-2025-0710-006', evento: 'Rock en el Parque 2025', categoria: 'Festival', imagen: img('1506157786151-b8491531f063'), fechaEvento: '10 Jul 2025', horaEvento: '12:00 PM', ciudad: 'Bogotá', entradas: 4, reservadoEl: '1 Jun 2025', total: 0, estado: 'Cancelada', causaCancelacion: 'Evento cancelado por el organizador debido a condiciones climáticas adversas.', estadoPago: 'Cancelado', metodoPago: 'Nequi', fechaPago: '2 Jun 2025', codigoPago: 'TXN-712206' },
]

export const ReservaModel = {
  /** Resumen que se muestra en la página de inicio del cliente */
  async resumenInicioCliente() {
    return { activas: 3, confirmadas: 7, proximoEvento: { fecha: '12 Sep', detalle: 'Festival de Música Urbana · 6:00 PM' } }
  },

  /** Reservas del cliente con sesión iniciada */
  async delCliente() {
    return RESERVAS_CLIENTE
  },

  /** Reservas que recibió el agente en sus eventos */
  async delAgente() {
    return RESERVAS_AGENTE_DEMO.map((r, i) => {
      const evento = EVENTOS.find(e => e.id === r.eventoId)
      return {
        id: i + 1,
        cliente: r.clienteNombre,
        correo: r.clienteCorreo,
        evento: r.eventoNombre,
        fechaEvento: capitalizarMes(evento.fecha),
        horaEvento: evento.hora,
        entradas: r.entradas,
        valorTexto: r.valorTotalStr,
        valor: r.valorTotal,
        fechaReserva: r.fechaReserva,
        estado: r.estado,
        causaCancelacion: r.causaCancelacion,
      }
    })
  },

  /** Pagos recibidos por el agente */
  async pagosDelAgente() {
    return PAGOS_AGENTE_DEMO
  },

  /** Simula un cambio de estado (pendiente: PUT /api/reservas/:id) */
  async actualizarEstado(id, estado, causa) {
    return { id, estado, causaCancelacion: causa }
  },
}
