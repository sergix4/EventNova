// js/controllers/agente/misEventosController.js
// CONTROLADOR de "Mis eventos": filtros, paginación, ver detalle,
// editar (dentro de la misma página) y eliminar.

import { iniciarPanel } from '../comun/panelController.js'
import { montarFormulario } from './formularioEventoController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { MisEventosView } from '../../views/agente/misEventosView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { paginar } from '../../views/componentes/paginacion.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const POR_PAGINA = 6
const MESES = { ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06', jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12' }

const contenido = document.getElementById('contenido')
let htmlLista = ''
let eventos = []
let pagina = 1

/** "15 sep 2026" → "2026-09-15" (para el campo de fecha) */
function fechaParaInput(texto) {
  const [d, m, a] = texto.toLowerCase().split(/\s+/)
  return a ? `${a}-${MESES[m] || '01'}-${d.padStart(2, '0')}` : ''
}

function filtrar() {
  const q = document.getElementById('buscar').value.toLowerCase()
  const estado = document.getElementById('filtro-estado').value
  const ciudad = document.getElementById('filtro-ciudad').value
  const fecha = document.getElementById('filtro-fecha').value
  return eventos.filter(e =>
    (e.nombre.toLowerCase().includes(q) || e.ciudad.toLowerCase().includes(q)) &&
    (ciudad === 'Todas las ciudades' || e.ciudad === ciudad) &&
    (estado === 'Todos' || e.estado === estado) &&
    (!fecha || e.fecha.includes(fecha)))
}

function dibujar() {
  const lista = filtrar()
  MisEventosView.mostrarIndicadores(eventos)
  MisEventosView.mostrarTabla(paginar(lista, pagina, POR_PAGINA), lista.length, pagina, POR_PAGINA)
}

function conectarLista() {
  ;['buscar', 'filtro-fecha'].forEach(id => document.getElementById(id).addEventListener('input', () => { pagina = 1; dibujar() }))
  ;['filtro-estado', 'filtro-ciudad'].forEach(id => document.getElementById(id).addEventListener('change', () => { pagina = 1; dibujar() }))
}

async function verDetalle(evento) {
  const calificaciones = await EventoModel.obtenerCalificaciones(evento.idEjemplo)
  abrirModal(MisEventosView.modalDetalle(evento, calificaciones), { clase: 'modal--lg' })
}

function eliminar(evento) {
  const caja = abrirModal(MisEventosView.modalEliminar(evento.nombre), { cerrarAlHacerClicFuera: false })
  caja.querySelector('[data-accion="confirmar"]').addEventListener('click', () => {
    eventos = eventos.filter(e => e.id !== evento.id) // pendiente: DELETE /api/eventos/:id
    cerrarModal()
    dibujar()
  })
}

// ─── Edición dentro de la misma página (como en el prototipo) ───────────────
function editar(evento) {
  MisEventosView.cabecera(true)
  contenido.classList.remove('panel__contenido')
  document.getElementById('principal').scrollTop = 0
  montarFormulario(contenido, {
    modo: 'editar',
    datos: {
      nombre: evento.nombre, descripcion: evento.descripcion, categoria: evento.categoria,
      pais: evento.pais, departamento: evento.departamento, ciudad: evento.ciudad, direccion: evento.direccion,
      fecha: fechaParaInput(evento.fechaOriginal), hora: '', capacidad: evento.capacidad, precio: evento.precio, estado: evento.estado,
    },
    alCancelar: volverALista,
    alGuardar: (datos) => {
      mostrarToast('Evento actualizado correctamente.', { duracion: 1600 })
      setTimeout(() => {
        Object.assign(evento, {
          nombre: datos.nombre,
          ciudad: datos.ciudad,
          capacidad: Number(datos.capacidad) || evento.capacidad,
          precio: datos.precio,
          estado: datos.estado,
          fecha: datos.fecha ? new Date(datos.fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : evento.fecha,
        })
        volverALista()
        mostrarToast('Evento actualizado correctamente.', { duracion: 3000 })
      }, 1600)
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
  eventos = await EventoModel.obtenerDelAgente()
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
