// js/views/admin/ubicacionView.js
// VISTA del CRUD de países (Ubicación geográfica).
// El formulario y la tabla ya están en pages/admin/ubicacion.html;
// esta vista solo actualiza las partes que cambian.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export const UbicacionView = {
  /** Dibuja las filas de la tabla de países */
  paises(lista) {
    document.getElementById('tabla-paises').innerHTML = lista.length === 0
      ? '<tr><td colspan="2" class="tabla__vacia">Sin países registrados.</td></tr>'
      : lista.map(p => `
        <tr>
          <td>${esc(p.nombre_pais)}</td>
          <td class="crud__acciones">
            <button type="button" class="crud__editar" data-editar="${p.id_pais}">Editar</button>
            <button type="button" class="crud__eliminar" data-eliminar="${p.id_pais}">Eliminar</button>
          </td>
        </tr>`).join('')
  },

  /** Cambia el formulario entre "Agregar" y "Guardar" (edición) */
  modoFormulario(editando, nombre = '') {
    const input = document.getElementById('nombre-pais')
    input.value = nombre
    document.getElementById('boton-guardar').textContent = editando ? 'Guardar' : 'Agregar'
    document.getElementById('boton-cancelar').hidden = !editando
    if (editando) input.focus()
  },

  cargando(activo) {
    document.getElementById('boton-guardar').disabled = activo
  },

  error(mensaje) {
    const caja = document.getElementById('error-pais')
    caja.hidden = !mensaje
    caja.textContent = mensaje || ''
  },

  confirmarEliminar(nombre) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('papelera', 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Eliminar país?</h3>
            <p class="confirmacion__texto">Se eliminará <strong>${esc(nombre)}</strong> de la base de datos. Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro boton--seminegrita" id="confirmar-eliminar">Eliminar</button>
        </div>
      </div>`
  },
}
