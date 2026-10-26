// js/controllers/comun/selectorEntradasController.js
// CONTROLADOR compartido del selector "¿Cuántas entradas quieres cancelar?".
// Conecta los botones − / + / "Cancelar todas" dentro de una ventana (caja)
// y devuelve una función que dice cuántas entradas eligió el usuario.
//
// Uso:
//   const cantidadElegida = conectarSelectorEntradas(caja, r.entradas, r.precioBase)
//   ...
//   ReservaModel.cancelar(r.id, causa, cantidadElegida())

import { pintarSelectorEntradas } from '../../views/componentes/selectorEntradas.js'

export function conectarSelectorEntradas(caja, total, precio) {
  let cantidad = total // por defecto: todas
  const selector = caja.querySelector('#selector-entradas')
  if (!selector) return () => total // reserva de 1 sola entrada

  pintarSelectorEntradas(caja, cantidad, total, precio)
  selector.addEventListener('click', (e) => {
    const accion = e.target.closest('[data-entradas]')?.dataset.entradas
    if (accion === 'menos') cantidad = Math.max(1, cantidad - 1)
    if (accion === 'mas') cantidad = Math.min(total, cantidad + 1)
    if (accion === 'todas') cantidad = total
    pintarSelectorEntradas(caja, cantidad, total, precio)
  })
  return () => cantidad
}