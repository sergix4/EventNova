// js/views/componentes/paginacion.js
// VISTA compartida: paginador numérico (‹ 1 2 3 ›).
// El controlador escucha los clics en [data-pagina].

import { icono } from './iconos.js'

/**
 * @param {number} pagina      página actual (empieza en 1)
 * @param {number} total       total de elementos
 * @param {number} porPagina   elementos por página
 * @param {string} nombre      "eventos", "reservas"… para el texto
 * @param {object} opciones    { siempre: mostrar aunque haya 1 página, texto: fn }
 */
export function paginacion(pagina, total, porPagina, nombre = '', opciones = {}) {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  if (paginas <= 1 && !opciones.siempre) return ''
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  const hasta = Math.min(pagina * porPagina, total)
  const texto = opciones.texto ? opciones.texto({ desde, hasta, total }) : `Mostrando ${desde}–${hasta} de ${total}${nombre ? ' ' + nombre : ''}`

  let numeros = ''
  for (let n = 1; n <= paginas; n++) {
    numeros += `<button type="button" class="paginacion__boton${n === pagina ? ' paginacion__boton--activo' : ''}" data-pagina="${n}">${n}</button>`
  }
  return `
    <div class="paginacion">
      <p class="paginacion__texto">${texto}</p>
      <div class="paginacion__botones">
        <button type="button" class="paginacion__boton paginacion__boton--flecha" data-pagina="${pagina - 1}" ${pagina === 1 ? 'disabled' : ''} aria-label="Anterior">${icono('izquierda', 16)}</button>
        ${numeros}
        <button type="button" class="paginacion__boton paginacion__boton--flecha" data-pagina="${pagina + 1}" ${pagina === paginas ? 'disabled' : ''} aria-label="Siguiente">${icono('derecha', 16)}</button>
      </div>
    </div>`
}

/** Corta un arreglo para mostrar solo la página pedida. */
export function paginar(lista, pagina, porPagina) {
  return lista.slice((pagina - 1) * porPagina, pagina * porPagina)
}
