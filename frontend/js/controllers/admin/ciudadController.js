// js/controllers/admin/ciudadController.js
// CONTROLADOR del CRUD de ciudades: conecta la vista con CiudadModel
// (API /api/ciudades). Para llenar el <select> también usa DepartamentoModel.
// ubicacionController.js lo llama una sola vez con iniciarCiudades().

import { CiudadModel } from '../../models/ciudadModel.js'
import { DepartamentoModel } from '../../models/departamentoModel.js'
import { PaisModel } from '../../models/paisModel.js'
import { CiudadView } from '../../views/admin/ciudadView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

let ciudades = []
let editandoId = null

export async function cargarCiudades() {
  // Solo se muestran las ciudades del departamento elegido en el selector
  const idDepartamento = document.getElementById('departamento-ciudad').value
  if (!idDepartamento) {
    ciudades = []
    return CiudadView.ciudades([], 'Selecciona un país y un departamento para ver sus ciudades.')
  }
  try {
    ciudades = await CiudadModel.listar(idDepartamento)
    CiudadView.ciudades(ciudades)
  } catch (error) {
    CiudadView.ciudades([])
    CiudadView.error(error.message)
  }
}

/** Llena los <select> encadenados País -> Departamento (se llama cada vez que se abre la pestaña) */
export async function cargarDepartamentosSelect() {
  try {
    CiudadView.opcionesPaises(await PaisModel.listar())
    await cargarDepartamentosDePais(document.getElementById('pais-ciudad').value)
  } catch (error) {
    CiudadView.error(error.message)
  }
}

/** Trae solo los departamentos del país elegido (GET /api/departamentos?id_pais=...) */
async function cargarDepartamentosDePais(idPais) {
  if (!idPais) return CiudadView.opcionesDepartamentos([], false)
  try {
    CiudadView.opcionesDepartamentos(await DepartamentoModel.listar(idPais))
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

async function editar(id) {
  const ciudad = ciudades.find(c => c.id_ciudad === id)
  if (!ciudad) return
  CiudadView.error('')
  editandoId = id
  // Primero se elige el país de la ciudad y se cargan sus departamentos,
  // y después se marca el departamento de la ciudad
  document.getElementById('pais-ciudad').value = ciudad.id_pais
  await cargarDepartamentosDePais(ciudad.id_pais)
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
  document.getElementById('pais-ciudad').addEventListener('change', async (e) => {
    await cargarDepartamentosDePais(e.target.value)
    cargarCiudades()
  })
  document.getElementById('departamento-ciudad').addEventListener('change', cargarCiudades)
  document.getElementById('boton-cancelar-ciu').addEventListener('click', cancelarEdicion)
  document.getElementById('tabla-ciudades').addEventListener('click', (e) => {
    const botonEditar = e.target.closest('[data-editar-ciu]')
    if (botonEditar) return editar(Number(botonEditar.dataset.editarCiu))
    const botonEliminar = e.target.closest('[data-eliminar-ciu]')
    if (botonEliminar) eliminar(Number(botonEliminar.dataset.eliminarCiu))
  })
}