// js/controllers/comun/panelController.js
// CONTROLADOR compartido por todas las páginas con barra lateral.
//   - Verifica la sesión (y el rol) con el backend.
//   - Dibuja la barra lateral correcta.
//   - Conecta "Cerrar sesión", el menú en celulares y la campana del cliente.

import { AuthModel } from '../../models/authModel.js'
import { barraCliente, barraAgente, barraAdmin, panelNotificaciones } from '../../views/componentes/panel.js'
import { iniciales } from '../../utils/formato.js'

const BARRAS = { cliente: barraCliente, agente: barraAgente, administrador: barraAdmin }

const PAGINA_INICIO_POR_ROL = {
  cliente: '/pages/cliente/inicio.html',
  agente: '/pages/agente/mis-eventos.html',
  administrador: '/pages/admin/dashboard.html',
}

export function paginaInicioDe(rol) {
  return PAGINA_INICIO_POR_ROL[rol] || '/'
}

/**
 * Prepara el panel y devuelve el usuario con sesión (o null).
 * @param {object} config
 *   rol             'cliente' | 'agente' | 'administrador'
 *   activo          clave del ítem del menú que se marca como activo
 *   requiereSesion  si es true y no hay sesión del rol indicado, redirige al login
 */
export async function iniciarPanel({ rol, activo, requiereSesion = true }) {
  const usuario = await AuthModel.obtenerSesion()

  if (requiereSesion && (!usuario || usuario.rol !== rol)) {
    // Sin sesión (o con otro rol): se manda al login
    window.location.replace('/pages/login.html')
    return new Promise(() => {}) // detiene la ejecución del controlador de la página
  }

  const usuarioDelRol = usuario && usuario.rol === rol ? usuario : null
  const barra = document.getElementById('barra-lateral')
  barra.innerHTML = BARRAS[rol](activo, usuarioDelRol)

  conectarCerrarSesion()
  conectarMenuMovil()

  const avatar = document.getElementById('avatar-cabecera')
  if (avatar) avatar.textContent = iniciales(usuarioDelRol?.nombre, 'Cliente')

  return usuarioDelRol
}

/** Todos los botones con data-accion="cerrar-sesion" cierran la sesión. */
export function conectarCerrarSesion() {
  document.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-accion="cerrar-sesion"]')) return
    await AuthModel.cerrarSesion()
    window.location.href = '/'
  })
}

function conectarMenuMovil() {
  document.querySelectorAll('[data-accion="abrir-menu"]').forEach(boton =>
    boton.addEventListener('click', () => document.body.classList.add('panel--menu-abierto')))
  document.querySelector('.panel__velo')?.addEventListener('click', () =>
    document.body.classList.remove('panel--menu-abierto'))
}

// ─── Campana de notificaciones del cliente ──────────────────────────────────
const NOTIFICACIONES = [
  { emoji: '✅', texto: 'Tu reserva para Festival de Música Urbana fue confirmada.', tiempo: 'Hace 2 horas' },
  { emoji: '⏳', texto: 'Tu reserva para Noche de Comedia Stand-Up está pendiente.', tiempo: 'Hace 5 horas' },
  { emoji: '📢', texto: 'Un evento que reservaste tiene una actualización.', tiempo: 'Ayer' },
]

export function iniciarNotificaciones() {
  const contenedor = document.querySelector('.notificaciones')
  if (!contenedor) return
  const boton = contenedor.querySelector('[data-accion="notificaciones"]')
  const punto = contenedor.querySelector('.notificaciones__punto')
  const panel = contenedor.querySelector('.notificaciones__panel')
  if (!panel) return
  let leidas = false

  const dibujar = () => { panel.innerHTML = panelNotificaciones(NOTIFICACIONES, leidas) }
  dibujar()

  boton.addEventListener('click', (e) => {
    e.stopPropagation()
    panel.hidden = !panel.hidden
  })
  panel.addEventListener('click', (e) => {
    e.stopPropagation()
    if (e.target.closest('[data-accion="marcar-leidas"]')) {
      leidas = true
      punto?.remove()
      dibujar()
      panel.hidden = true
    }
  })
  document.addEventListener('click', () => { panel.hidden = true })
}
