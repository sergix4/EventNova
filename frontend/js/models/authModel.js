// js/models/authModel.js
// MODELO de autenticación: inicio de sesión, registro y sesión actual.
// Habla con las rutas /api/auth/* del backend.

import { peticion } from './api.js'

export const AuthModel = {
  /** Inicia sesión. Devuelve { mensaje, usuario } */
  login(correo, contraseña) {
    return peticion('/auth/login', { metodo: 'POST', datos: { correo, contraseña } })
  },

  /** Registra un cliente: { identificacion, nombre, correo, password, direccion } */
  registrarCliente(datos) {
    return peticion('/auth/register', { metodo: 'POST', datos })
  },

  /** Registra un agente: datos del cliente + { empresa, descripcionNegocio, plan } */
  registrarAgente(datos) {
    return peticion('/auth/register-agente', { metodo: 'POST', datos })
  },

  /** Devuelve el usuario con sesión activa o null si no hay sesión. */
  async obtenerSesion() {
    try {
      const { usuario, aviso } = await peticion('/auth/sesion')
      // M2: la cuenta fue suspendida con la sesión abierta -> el login lo explica
      if (aviso) {
        try { sessionStorage.setItem('eventnova-aviso', aviso) } catch {}
      }
      return usuario
    } catch {
      return null
    }
  },

  /** Cierra la sesión en el servidor. */
  cerrarSesion() {
    return peticion('/auth/logout', { metodo: 'POST' }).catch(() => null)
  },
}
