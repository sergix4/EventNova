// js/views/componentes/modal.js
// VISTA compartida: ventanas modales.
// abrirModal(html, opciones) crea el fondo oscuro + la caja y devuelve la caja
// para que el controlador conecte sus botones. Cualquier elemento con
// data-cerrar-modal dentro del modal lo cierra.

let modalActual = null

export function abrirModal(html, { clase = '', cerrarAlHacerClicFuera = true, alCerrar } = {}) {
  cerrarModal()
  const fondo = document.createElement('div')
  fondo.className = 'modal-fondo'
  fondo.innerHTML = `<div class="modal ${clase}" role="dialog" aria-modal="true">${html}</div>`
  document.body.appendChild(fondo)

  const caja = fondo.firstElementChild
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo && cerrarAlHacerClicFuera) cerrarModal()
    if (e.target.closest('[data-cerrar-modal]')) cerrarModal()
  })
  modalActual = { fondo, alCerrar }
  document.addEventListener('keydown', cerrarConEscape)
  return caja
}

export function cerrarModal() {
  if (!modalActual) return
  const { fondo, alCerrar } = modalActual
  modalActual = null
  fondo.remove()
  document.removeEventListener('keydown', cerrarConEscape)
  if (alCerrar) alCerrar()
}

function cerrarConEscape(e) {
  if (e.key === 'Escape') cerrarModal()
}
