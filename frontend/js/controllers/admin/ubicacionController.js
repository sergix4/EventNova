// js/controllers/admin/ubicacionController.js
// CONTROLADOR del CRUD de países: conecta la vista con PaisModel,
// que a su vez llama a la API /api/paises (tabla PAIS en PostgreSQL).

import { iniciarAdmin } from './comunAdminController.js'
import { PaisModel } from '../../models/paisModel.js'
import { UbicacionView } from '../../views/admin/ubicacionView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'
import { iniciarDepartamentos, cargarDepartamentos, cargarPaisesSelect } from './departamentoController.js'
import { iniciarCiudades, cargarCiudades, cargarDepartamentosSelect } from './ciudadController.js'

let paises = []
let editandoId = null

async function cargarPaises() {
  try {
    paises = await PaisModel.listar()
    UbicacionView.paises(paises)
  } catch (error) {
    UbicacionView.paises([])
    UbicacionView.error(error.message)
  }
}

function cancelarEdicion() {
  editandoId = null
  UbicacionView.modoFormulario(false)
}

async function guardar(e) {
  e.preventDefault()
  UbicacionView.error('')
  const nombre = document.getElementById('nombre-pais').value.trim()
  if (!nombre) return UbicacionView.error('El nombre del país es obligatorio.')

  UbicacionView.cargando(true)
  try {
    if (editandoId) {
      await PaisModel.actualizar(editandoId, nombre)
      mostrarToast('País actualizado correctamente.', { duracion: 2500 })
    } else {
      await PaisModel.crear(nombre)
      mostrarToast('País agregado correctamente.', { duracion: 2500 })
    }
    cancelarEdicion()
    await cargarPaises()
  } catch (error) {
    UbicacionView.error(error.message) // p. ej. 409 "Ya existe un país con ese nombre."
  } finally {
    UbicacionView.cargando(false)
  }
}

function editar(id) {
  const pais = paises.find(p => p.id_pais === id)
  if (!pais) return
  UbicacionView.error('')
  editandoId = id
  UbicacionView.modoFormulario(true, pais.nombre_pais)
}

function eliminar(id) {
  const pais = paises.find(p => p.id_pais === id)
  if (!pais) return
  UbicacionView.error('')
  const caja = abrirModal(UbicacionView.confirmarEliminar(pais.nombre_pais), { clase: 'modal--sm' })
  caja.querySelector('#confirmar-eliminar').addEventListener('click', async () => {
    cerrarModal()
    try {
      await PaisModel.eliminar(id)
      if (editandoId === id) cancelarEdicion()
      mostrarToast('País eliminado correctamente.', { duracion: 2500 })
      await cargarPaises()
    } catch (error) {
      UbicacionView.error(error.message) // p. ej. tiene departamentos asociados
    }
  })
}

// ─── Pestañas: Países / Departamentos ───────────────────────────────────────
function mostrarPestana(nombre) {
  document.querySelectorAll('[data-pestana]').forEach(boton => {
    const activa = boton.dataset.pestana === nombre
    boton.setAttribute('aria-selected', String(activa))
    document.getElementById(boton.getAttribute('aria-controls')).hidden = !activa
  })
  if (nombre === 'paises') cargarPaises()
  if (nombre === 'departamentos') {
    cargarPaisesSelect()   // el <select> siempre refleja los países actuales
    cargarDepartamentos()
  }
  if (nombre === 'ciudades') {
    cargarDepartamentosSelect()   // el <select> siempre refleja los departamentos actuales
    cargarCiudades()
  }
}

await iniciarAdmin('ubicacion')
document.querySelectorAll('[data-pestana]').forEach(boton =>
  boton.addEventListener('click', () => mostrarPestana(boton.dataset.pestana)))
iniciarDepartamentos()
iniciarCiudades()
document.getElementById('form-pais').addEventListener('submit', guardar)
document.getElementById('boton-cancelar').addEventListener('click', cancelarEdicion)
document.getElementById('tabla-paises').addEventListener('click', (e) => {
  const botonEditar = e.target.closest('[data-editar]')
  if (botonEditar) return editar(Number(botonEditar.dataset.editar))
  const botonEliminar = e.target.closest('[data-eliminar]')
  if (botonEliminar) eliminar(Number(botonEliminar.dataset.eliminar))
})
cargarPaises()
