// js/views/componentes/selectorEntradas.js
// VISTA compartida: selector "¿Cuántas entradas quieres cancelar?"  ( − 2 + ).
// Lo usan la ventana de cancelar del cliente (Mis reservas y detalle del evento)
// y la de "Actualizar estado" del agente. El controlador que lo maneja está en
// js/controllers/comun/selectorEntradasController.js

const pesos = (n) => '$ ' + n.toLocaleString('es-CO')
const entradas = (n) => `${n} entrada${n !== 1 ? 's' : ''}`

/** HTML del selector. Si la reserva tiene 1 sola entrada no hace falta elegir: devuelve '' */
export function selectorEntradas(total, etiqueta = '¿Cuántas entradas quieres cancelar?') {
  if (total <= 1) return ''
  return `
    <div class="selector-entradas" id="selector-entradas">
      <span class="campo__etiqueta">${etiqueta}</span>
      <div class="selector-entradas__control">
        <button type="button" class="selector-entradas__boton" data-entradas="menos" aria-label="Cancelar una entrada menos">−</button>
        <output class="selector-entradas__valor" id="entradas-cancelar" aria-live="polite">${total}<small>de ${total}</small></output>
        <button type="button" class="selector-entradas__boton" data-entradas="mas" aria-label="Cancelar una entrada más" disabled>+</button>
        <button type="button" class="selector-entradas__todas" data-entradas="todas">Cancelar todas</button>
      </div>
      <p class="selector-entradas__resumen" id="resumen-entradas"></p>
    </div>`
}

/** Actualiza el número, los botones y el texto de resumen */
export function pintarSelectorEntradas(caja, cantidad, total, precio) {
  const valor = caja.querySelector('#entradas-cancelar')
  if (!valor) return
  valor.innerHTML = `${cantidad}<small>de ${total}</small>`
  caja.querySelector('[data-entradas="menos"]').disabled = cantidad <= 1
  caja.querySelector('[data-entradas="mas"]').disabled = cantidad >= total
  caja.querySelector('[data-entradas="todas"]').hidden = cantidad >= total
  caja.querySelector('#resumen-entradas').innerHTML = cantidad >= total
    ? `Se cancelará la reserva <strong>completa</strong> (${entradas(total)} · ${pesos(total * precio)}).`
    : `Se cancelarán <strong>${entradas(cantidad)}</strong> (${pesos(cantidad * precio)}). La reserva seguirá activa con ${entradas(total - cantidad)} (${pesos((total - cantidad) * precio)}).`
}