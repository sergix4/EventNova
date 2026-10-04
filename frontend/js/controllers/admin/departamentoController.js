// js/controllers/admin/departamentoController.js
// CONTROLADOR del CRUD de departamentos: conecta la vista con DepartamentoModel
// (API /api/departamentos). Para llenar el <select> también usa PaisModel.
// ubicacionController.js lo llama una sola vez con iniciarDepartamentos().

import { DepartamentoModel } from '../../models/departamentoModel.js'
import { PaisModel } from '../../models/paisModel.js'
import { DepartamentoView } from '../../views/admin/departamentoView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

let departamentos = []
let editandoId = null

export async function cargarDepartamentos() {
  try {
    departamentos = await DepartamentoModel.listar()
    DepartamentoView.departamentos(departamentos)
  } catch (error) {
    DepartamentoView.departamentos([])
    DepartamentoView.error(error.message)
  }
}

/** Vuelve a pedir los países para el <select> (se llama cada vez que se abre la pestaña) */
export async function cargarPaisesSelect() {
  try {
    DepartamentoView.opcionesPaises(await PaisModel.listar())
  } catch (error) {
    DepartamentoView.error(error.message)
  }
}

function cancelarEdicion() {
  editandoId = null
  DepartamentoView.modoFormulario(false)
}

async function guardar(e) {
  e.preventDefault()
  DepartamentoView.error('')
  const nombre = document.getElementById('nombre-departamento').value.trim()
  const idPais = document.getElementById('pais-departamento').value
  if (!nombre) return DepartamentoView.error('El nombre del departamento es obligatorio.')
  if (!idPais) return DepartamentoView.error('Debes seleccionar un país.')

  DepartamentoView.cargando(true)
  try {
    if (editandoId) {
      await DepartamentoModel.actualizar(editandoId, nombre, Number(idPais))
      mostrarToast('Departamento actualizado correctamente.', { duracion: 2500 })
    } else {
      await DepartamentoModel.crear(nombre, Number(idPais))
      mostrarToast('Departamento agregado correctamente.', { duracion: 2500 })
    }
    cancelarEdicion()
    await cargarDepartamentos()
  } catch (error) {
    DepartamentoView.error(error.message) // p. ej. 409 "Ya existe un departamento con ese nombre en ese país."
  } finally {
    DepartamentoView.cargando(false)
  }
}

function editar(id) {
  const dep = departamentos.find(d => d.id_departamento === id)
  if (!dep) return
  DepartamentoView.error('')
  editandoId = id
  DepartamentoView.modoFormulario(true, dep.nombre_departamento, dep.id_pais)
}

function eliminar(id) {
  const dep = departamentos.find(d => d.id_departamento === id)
  if (!dep) return
  DepartamentoView.error('')
  const caja = abrirModal(DepartamentoView.confirmarEliminar(dep.nombre_departamento), { clase: 'modal--sm' })
  caja.querySelector('#confirmar-eliminar-dep').addEventListener('click', async () => {
    cerrarModal()
    try {
      await DepartamentoModel.eliminar(id)
      if (editandoId === id) cancelarEdicion()
      mostrarToast('Departamento eliminado correctamente.', { duracion: 2500 })
      await cargarDepartamentos()
    } catch (error) {
      DepartamentoView.error(error.message) // p. ej. tiene ciudades asociadas
    }
  })
}

export function iniciarDepartamentos() {
  document.getElementById('form-departamento').addEventListener('submit', guardar)
  document.getElementById('boton-cancelar-dep').addEventListener('click', cancelarEdicion)
  document.getElementById('tabla-departamentos').addEventListener('click', (e) => {
    const botonEditar = e.target.closest('[data-editar-dep]')
    if (botonEditar) return editar(Number(botonEditar.dataset.editarDep))
    const botonEliminar = e.target.closest('[data-eliminar-dep]')
        if (botonEliminar) eliminar(Number(botonEliminar.dataset.eliminarDep))
  })
}