// js/views/admin/ciudadView.js
// VISTA del CRUD de ciudades (pestaña "Ciudades" de Ubicación geográfica).
// El formulario y la tabla ya están en pages/admin/ubicacion.html;
// esta vista solo actualiza las partes que cambian.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export const CiudadView = {
  /** Dibuja las filas de la tabla de ciudades */
  ciudades(lista) {
    document.getElementById('tabla-ciudades').innerHTML = lista.length === 0
      ? '<tr><td colspan="4" class="tabla__vacia">Sin ciudades registradas.</td></tr>'
      : lista.map(c => `
        <tr>
          <td>${esc(c.nombre_ciudad)}</td>
          <td>${esc(c.nombre_departamento)}</td>
          <td>${esc(c.nombre_pais)}</td>
          <td class="crud__acciones">
            <button type="button" class="crud__editar" data-editar-ciu="${c.id_ciudad}">Editar</button>
            <button type="button" class="crud__eliminar" data-eliminar-ciu="${c.id_ciudad}">Eliminar</button>
          </td>
        </tr>`).join('')
  },

  /** Llena el <select> de departamentos, mostrando "Departamento (País)" */
  opcionesDepartamentos(departamentos) {
    const select = document.getElementById('departamento-ciudad')
    const actual = select.value
    select.innerHTML = '<option value="">Selecciona un departamento</option>' + departamentos
      .map(d => `<option value="${d.id_departamento}">${esc(d.nombre_departamento)} (${esc(d.nombre_pais)})</option>`)
      .join('')
    select.value = actual
  },

  /** Cambia el formulario entre "Agregar" y "Guardar" (edición) */
  modoFormulario(editando, nombre = '', idDepartamento = '') {
    document.getElementById('nombre-ciudad').value = nombre
    document.getElementById('departamento-ciudad').value = idDepartamento
    document.getElementById('boton-guardar-ciu').textContent = editando ? 'Guardar' : 'Agregar'
    document.getElementById('boton-cancelar-ciu').hidden = !editando
    if (editando) document.getElementById('nombre-ciudad').focus()
  },

  cargando(activo) {
    document.getElementById('boton-guardar-ciu').disabled = activo
  },

  error(mensaje) {
    const caja = document.getElementById('error-ciudad')
    caja.hidden = !mensaje
    caja.textContent = mensaje || ''
  },

  confirmarEliminar(nombre) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('papelera', 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Eliminar ciudad?</h3>
            <p class="confirmacion__texto">Se eliminará <strong>${esc(nombre)}</strong> de la base de datos. Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro boton--seminegrita" id="confirmar-eliminar-ciu">Eliminar</button>
        </div>
      </div>`
  },
}