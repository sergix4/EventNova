// js/models/ciudadModel.js
// MODELO de ciudades: CRUD contra la tabla CIUDAD (vía /api/ciudades).

import { peticion } from './api.js'

export const CiudadModel = {
  listar() {
    return peticion('/ciudades')
  },
  obtener(id) {
    return peticion(`/ciudades/${id}`)
  },
  crear(nombre_ciudad, id_departamento) {
    return peticion('/ciudades', { metodo: 'POST', datos: { nombre_ciudad, id_departamento } })
  },
  actualizar(id, nombre_ciudad, id_departamento) {
    return peticion(`/ciudades/${id}`, { metodo: 'PUT', datos: { nombre_ciudad, id_departamento } })
  },
  eliminar(id) {
    return peticion(`/ciudades/${id}`, { metodo: 'DELETE' })
  },
}