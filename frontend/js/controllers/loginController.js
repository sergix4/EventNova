// js/controllers/loginController.js
// CONTROLADOR de inicio de sesión.
// 1) Valida el formulario  2) llama al Modelo (POST /api/auth/login)
// 3) según el rol del usuario redirige a su panel.

import { AuthModel } from '../models/authModel.js'
import { AuthView } from '../views/authView.js'
import { paginaInicioDe } from './comun/panelController.js'

const formulario = document.getElementById('form-login')
const correo = document.getElementById('correo')
const clave = document.getElementById('clave')
const boton = document.getElementById('boton-login')

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

AuthView.prepararMostrarClave()

// Si ya hay una sesión abierta, se envía directo al panel
AuthModel.obtenerSesion().then(usuario => {
  if (usuario) window.location.replace(paginaInicioDe(usuario.rol))
})

formulario.addEventListener('submit', async (e) => {
  e.preventDefault()
  AuthView.errorServidor('')

  let valido = true
  if (!correo.value.trim()) {
    AuthView.errorCampo('error-correo', 'El correo electrónico es obligatorio.'); valido = false
  } else if (!CORREO_VALIDO.test(correo.value)) {
    AuthView.errorCampo('error-correo', 'Ingresa un correo electrónico válido.'); valido = false
  } else {
    AuthView.errorCampo('error-correo', '')
  }
  if (!clave.value.trim()) {
    AuthView.errorCampo('error-clave', 'La contraseña es obligatoria.'); valido = false
  } else {
    AuthView.errorCampo('error-clave', '')
  }
  if (!valido) return

  AuthView.cargando(boton, true, 'Iniciando sesión…')
  try {
    const { usuario } = await AuthModel.login(correo.value.trim(), clave.value)
    window.location.href = paginaInicioDe(usuario.rol)
  } catch (error) {
    AuthView.errorServidor(error.message)
    AuthView.cargando(boton, false)
  }
})
