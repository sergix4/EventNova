// js/controllers/admin/ciudadController.js
// CONTROLADOR del CRUD de ciudades: conecta la vista con CiudadModel
// (API /api/ciudades). Para llenar el <select> también usa DepartamentoModel.
// ubicacionController.js lo llama una sola vez con iniciarCiudades().

import { CiudadModel } from '../../models/ciudadModel.js'
import { DepartamentoModel } from '../../models/departamentoModel.js'
import { CiudadView } from '../../views/admin/ciudadView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

let ciudades = []
let editandoId = null

export async function cargarCiudades() {
  try {
    ciudades = await CiudadModel.listar()
    CiudadView.ciudades(ciudades)
  } catch (error) {
    CiudadView.ciudades([])
    CiudadView.error(error.message)
  }
}

/** Vuelve a pedir los departamentos para el <select> (se llama cada vez que se abre la pestaña) */
export async function cargarDepartamentosSelect() {
  try {
    CiudadView.opcionesDepartamentos(await DepartamentoModel.listar())
  } catch (error) {
    CiudadView.error(error.message)
  }
}

function cancelarEdicion() {
  editandoId = null
  CiudadView.modoFormulario(false)
}

async function guardar(e) {
  e.preventDefault()
  CiudadView.error('')
  const nombre = document.getElementById('nombre-ciudad').value.trim()
  const idDepartamento = document.getElementById('departamento-ciudad').value
  if (!nombre) return CiudadView.error('El nombre de la ciudad es obligatorio.')
  if (!idDepartamento) return CiudadView.error('Debes seleccionar un departamento.')

  CiudadView.cargando(true)
  try {
    if (editandoId) {
      await CiudadModel.actualizar(editandoId, nombre, Number(idDepartamento))
      mostrarToast('Ciudad actualizada correctamente.', { duracion: 2500 })
    } else {
      await CiudadModel.crear(nombre, Number(idDepartamento))
      mostrarToast('Ciudad agregada correctamente.', { duracion: 2500 })
    }
    cancelarEdicion()
    await cargarCiudades()
  } catch (error) {
    CiudadView.error(error.message) // p. ej. 409 "Ya existe una ciudad con ese nombre en ese departamento."
  } finally {
    CiudadView.cargando(false)
  }
}

function editar(id) {
  const ciudad = ciudades.find(c => c.id_ciudad === id)
  if (!ciudad) return
  CiudadView.error('')
  editandoId = id
  CiudadView.modoFormulario(true, ciudad.nombre_ciudad, ciudad.id_departamento)
}

function eliminar(id) {
  const ciudad = ciudades.find(c => c.id_ciudad === id)
  if (!ciudad) return
  CiudadView.error('')
  const caja = abrirModal(CiudadView.confirmarEliminar(ciudad.nombre_ciudad), { clase: 'modal--sm' })
  caja.querySelector('#confirmar-eliminar-ciu').addEventListener('click', async () => {
    cerrarModal()
    try {
      await CiudadModel.eliminar(id)
      if (editandoId === id) cancelarEdicion()
      mostrarToast('Ciudad eliminada correctamente.', { duracion: 2500 })
      await cargarCiudades()
    } catch (error) {
      CiudadView.error(error.message) // p. ej. tiene usuarios asociados
    }
  })
}

export function iniciarCiudades() {
  document.getElementById('form-ciudad').addEventListener('submit', guardar)
  document.getElementById('boton-cancelar-ciu').addEventListener('click', cancelarEdicion)
  document.getElementById('tabla-ciudades').addEventListener('click', (e) => {
    const botonEditar = e.target.closest('[data-editar-ciu]')
    if (botonEditar) return editar(Number(botonEditar.dataset.editarCiu))
    const botonEliminar = e.target.closest('[data-eliminar-ciu]')
    if (botonEliminar) eliminar(Number(botonEliminar.dataset.eliminarCiu))
  })
}