// js/controllers/agente/misEventosController.js
// CONTROLADOR de "Mis eventos": filtros por estado y ciudad, paginación,
// ver detalle, editar (PUT + PATCH de estado) y eliminar (DELETE) contra PostgreSQL.

import { iniciarPanel } from '../comun/panelController.js'
import { montarFormulario } from './formularioEventoController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { MisEventosView } from '../../views/agente/misEventosView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'
import { mostrarToast } from '../../views/componentes/toast.js'
import { esc } from '../../utils/formato.js'

const POR_PAGINA = 6

const contenido = document.getElementById('contenido')
let htmlLista = ''
let eventos = []
let pagina = 1

// Llena el filtro de ciudades con las ciudades reales presentes en los eventos del agente
function poblarFiltrosDinamicos() {
  const selectCiudad = document.getElementById('filtro-ciudad')
  if (selectCiudad) {
    const actual = selectCiudad.value
    const ciudadesUnicas = [...new Set(eventos.map(e => e.ciudad).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
    selectCiudad.innerHTML = `<option value="Todas las ciudades">Todas las ciudades</option>` +
      ciudadesUnicas.map(c => `<option value="${esc(c)}"${c === actual ? ' selected' : ''}>${esc(c)}</option>`).join('')
  }
}

function filtrar() {
  const q = document.getElementById('buscar').value.toLowerCase().trim()
  const estado = document.getElementById('filtro-estado').value
  const ciudad = document.getElementById('filtro-ciudad').value
  const fecha = document.getElementById('filtro-fecha').value.toLowerCase().trim()

  return eventos.filter(e =>
    (e.nombre.toLowerCase().includes(q) || e.ciudad.toLowerCase().includes(q) || (e.codigo || '').toLowerCase().includes(q)) &&
    (ciudad === 'Todas las ciudades' || e.ciudad === ciudad) &&
    (estado === 'Todos' || e.estado.toLowerCase() === estado.toLowerCase()) &&
    (!fecha || e.fecha.toLowerCase().includes(fecha) || (e.fecha_inicio_input || '').includes(fecha))
  )
}

function dibujar() {
  const lista = filtrar()
  MisEventosView.mostrarIndicadores(eventos)
  MisEventosView.mostrarTabla(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA)
}

function conectarLista() {
  poblarFiltrosDinamicos()
  ;['buscar', 'filtro-fecha'].forEach(id => document.getElementById(id).addEventListener('input', () => { pagina = 1; dibujar() }))
  ;['filtro-estado', 'filtro-ciudad'].forEach(id => document.getElementById(id).addEventListener('change', () => { pagina = 1; dibujar() }))
}

async function verDetalle(evento) {
  if (!evento) return
  const calificaciones = await EventoModel.obtenerCalificaciones(evento.id)
  abrirModal(MisEventosView.modalDetalle(evento, calificaciones), { clase: 'modal--lg' })
}

function eliminar(evento) {
  if (!evento) return
  const caja = abrirModal(MisEventosView.modalEliminar(evento.nombre), { cerrarAlHacerClicFuera: false })
  caja.querySelector('[data-accion="confirmar"]').addEventListener('click', async () => {
    try {
      await EventoModel.eliminar(evento.id)
      eventos = eventos.filter(e => e.id !== evento.id)
      cerrarModal()
      poblarFiltrosDinamicos()
      dibujar()
      mostrarToast('Evento eliminado correctamente.', { duracion: 2200 })
    } catch (err) {
      cerrarModal()
      mostrarToast(err.message || 'No se pudo eliminar el evento.', { tipo: 'error', duracion: 3500 })
    }
  })
}

// ─── Edición dentro de la misma página ──────────────────────────────────────
function editar(evento) {
  if (!evento) return
  MisEventosView.cabecera(true)
  contenido.classList.remove('panel__contenido')
  document.getElementById('principal').scrollTop = 0

  montarFormulario(contenido, {
    modo: 'editar',
    datos: evento,
    alCancelar: volverALista,
    alGuardar: async (payload) => {
      let actualizado = await EventoModel.actualizar(evento.id, payload)

      // Si el usuario también cambió el estado del evento, aplicamos PATCH /api/eventos/:id/estado
      if (payload.id_estado && payload.estado !== evento.estado) {
        actualizado = await EventoModel.cambiarEstado(
          evento.id,
          payload.id_estado,
          payload.causa_cancelacion,
        )
      }

      const idx = eventos.findIndex(x => x.id === evento.id)
      if (idx !== -1) eventos[idx] = actualizado

      volverALista()
      mostrarToast('Evento actualizado correctamente.', { duracion: 2500 })
    },
  })
}

function volverALista() {
  MisEventosView.cabecera(false)
  contenido.classList.add('panel__contenido')
  contenido.innerHTML = htmlLista
  conectarLista()
  dibujar()
}

async function iniciar() {
  await iniciarPanel({ rol: 'agente', activo: 'mis-eventos' })
  htmlLista = contenido.innerHTML
  try {
    eventos = await EventoModel.obtenerDelAgente()
  } catch (err) {
    mostrarToast(err.message || 'Error al cargar tus eventos.', { tipo: 'error' })
    eventos = []
  }
  conectarLista()
  dibujar()

  contenido.addEventListener('click', (e) => {
    const id = (attr) => Number(e.target.closest(`[${attr}]`)?.getAttribute(attr))
    const irA = e.target.closest('[data-pagina]')
    if (id('data-ver')) verDetalle(eventos.find(x => x.id === id('data-ver')))
    else if (id('data-editar')) editar(eventos.find(x => x.id === id('data-editar')))
    else if (id('data-eliminar')) eliminar(eventos.find(x => x.id === id('data-eliminar')))
    else if (irA && !irA.disabled) { pagina = Number(irA.dataset.pagina); dibujar() }
  })
}

iniciar()