// js/views/componentes/toast.js
// VISTA compartida: aviso flotante verde ("Evento creado correctamente.").

import { icono } from './iconos.js'

let temporizador = null

export function mostrarToast(mensaje, { detalle = '', duracion = 2500, abajo = false, cerrable = false } = {}) {
  document.querySelector('.toast')?.remove()
  clearTimeout(temporizador)

  const toast = document.createElement('div')
  toast.className = 'toast' + (abajo ? ' toast--abajo' : '')
  toast.setAttribute('role', 'status')
  toast.innerHTML = `
    <span class="toast__icono">${icono('check', 14, { grosor: 2.5 })}</span>
    <span>${mensaje}${detalle ? `<span class="toast__detalle">${detalle}</span>` : ''}</span>
    ${cerrable ? `<button type="button" class="toast__cerrar" aria-label="Cerrar">${icono('cerrar', 18)}</button>` : ''}`
  document.body.appendChild(toast)
  toast.querySelector('.toast__cerrar')?.addEventListener('click', () => toast.remove())
  if (duracion) temporizador = setTimeout(() => toast.remove(), duracion)
  return toast
}
