// js/models/personaModel.js
// MODELO de usuarios (personas) para la vista del administrador.
// Habla con la API /api/usuarios (Sprint 3 · Tarea 4), que a su vez trabaja
// con las tablas USUARIO, TELEFONOS, CLIENTE, AGENTE y ADMINISTRADOR.

import { peticion } from './api.js'

export const PersonaModel = {
  /** Lista por rol ('cliente' | 'agente' | 'administrador') con búsqueda opcional */
  listar(rol, buscar = '') {
    const parametros = new URLSearchParams()
    if (rol) parametros.set('rol', rol)
    if (buscar) parametros.set('buscar', buscar)
    const consulta = parametros.toString()
    return peticion(`/usuarios${consulta ? '?' + consulta : ''}`)
  },
  obtener(numeroId) {
    return peticion(`/usuarios/${encodeURIComponent(numeroId)}`)
  },
  /** Registra una persona nueva del rol indicado ('cliente' | 'agente' | 'administrador')
   *  (Tarea 6: administradores · auditoría final: también clientes y agentes) */
  crear(rol, datos) {
    const ruta = { cliente: 'clientes', agente: 'agentes', administrador: 'administradores' }[rol]
    return peticion(`/usuarios/${ruta}`, { metodo: 'POST', datos })
  },
  /** datos: solo los campos que se quieren cambiar (lo demás se conserva) */
  actualizar(numeroId, datos) {
    return peticion(`/usuarios/${encodeURIComponent(numeroId)}`, { metodo: 'PUT', datos })
  },
  eliminar(numeroId) {
    return peticion(`/usuarios/${encodeURIComponent(numeroId)}`, { metodo: 'DELETE' })
  },
}