// js/controllers/admin/comunAdminController.js
// CONTROLADOR compartido por las páginas del administrador:
// prepara el panel y conecta el selector de período y el botón "Actualizar".

import { iniciarPanel } from '../comun/panelController.js'

/**
 * @param {string} activo  ítem del menú que se marca
 * @param {object} opciones { alActualizar(periodo), alCambiarPeriodo(periodo) }
 */
export async function iniciarAdmin(activo, { alActualizar, alCambiarPeriodo } = {}) {
  // Mientras no exista el registro de administradores, el panel se puede ver sin sesión
  const usuario = await iniciarPanel({ rol: 'administrador', activo, requiereSesion: true })

  const periodo = document.getElementById('periodo')
  periodo?.addEventListener('change', () => alCambiarPeriodo?.(periodo.value))

  const boton = document.getElementById('boton-actualizar')
  boton?.addEventListener('click', async () => {
    const icono = boton.querySelector('.icono-girar')
    icono.classList.add('icono-girar--activo')
    boton.disabled = true
    await Promise.all([alActualizar?.(periodo?.value), new Promise(r => setTimeout(r, 900))])
    icono.classList.remove('icono-girar--activo')
    boton.disabled = false
  })

  return usuario
}

export const periodoActual = () => document.getElementById('periodo')?.value || '2026'
