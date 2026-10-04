// js/models/departamentoModel.js
// MODELO de departamentos: CRUD contra la tabla DEPARTAMENTO (vía /api/departamentos).

import { peticion } from './api.js'

export const DepartamentoModel = {
  listar() {
    return peticion('/departamentos')
  },
  obtener(id) {
    return peticion(`/departamentos/${id}`)
  },
  crear(nombre_departamento, id_pais) {
    return peticion('/departamentos', { metodo: 'POST', datos: { nombre_departamento, id_pais } })
  },
  actualizar(id, nombre_departamento, id_pais) {
    return peticion(`/departamentos/${id}`, { metodo: 'PUT', datos: { nombre_departamento, id_pais } })
  },
  eliminar(id) {
    return peticion(`/departamentos/${id}`, { metodo: 'DELETE' })
  },
}