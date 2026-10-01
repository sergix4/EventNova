// js/models/paisModel.js
// MODELO de países: CRUD contra la tabla PAIS de PostgreSQL (vía /api/paises).

import { peticion } from './api.js'

export const PaisModel = {
  listar() {
    return peticion('/paises')
  },
  obtener(id) {
    return peticion(`/paises/${id}`)
  },
  crear(nombre_pais) {
    return peticion('/paises', { metodo: 'POST', datos: { nombre_pais } })
  },
  actualizar(id, nombre_pais) {
    return peticion(`/paises/${id}`, { metodo: 'PUT', datos: { nombre_pais } })
  },
  eliminar(id) {
    return peticion(`/paises/${id}`, { metodo: 'DELETE' })
  },
}
