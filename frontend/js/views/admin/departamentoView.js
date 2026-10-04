// js/views/admin/departamentoView.js
// VISTA del CRUD de departamentos (pestaña "Departamentos" de Ubicación geográfica).

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export const DepartamentoView = {
  /** Dibuja las filas de la tabla de departamentos */
  departamentos(lista) {
    document.getElementById('tabla-departamentos').innerHTML = lista.length === 0
      ? '<tr><td colspan="3" class="tabla__vacia">Sin departamentos registrados.</td></tr>'
      : lista.map(d => `
        <tr>
          <td>${esc(d.nombre_departamento)}</td>
          <td>${esc(d.nombre_pais)}</td>
          <td class="crud__acciones">
            <button type="button" class="crud__editar" data-editar-dep="${d.id_departamento}">Editar</button>
            <button type="button" class="crud__eliminar" data-eliminar-dep="${d.id_departamento}">Eliminar</button>
          </td>
        </tr>`).join('')
  },

  /** Llena el <select> de países (el seleccionado se conserva si existe) */
  opcionesPaises(paises) {
    const select = document.getElementById('pais-departamento')
    const actual = select.value
    select.innerHTML = '<option value="">Selecciona un país</option>' + paises
      .map(p => `<option value="${p.id_pais}">${esc(p.nombre_pais)}</option>`)
      .join('')
    select.value = actual
  },

  /** Cambia el formulario entre "Agregar" y "Guardar" (edición) */
  modoFormulario(editando, nombre = '', idPais = '') {
    document.getElementById('nombre-departamento').value = nombre
    document.getElementById('pais-departamento').value = idPais
    document.getElementById('boton-guardar-dep').textContent = editando ? 'Guardar' : 'Agregar'
    document.getElementById('boton-cancelar-dep').hidden = !editando
    if (editando) document.getElementById('nombre-departamento').focus()
  },

  cargando(activo) {
    document.getElementById('boton-guardar-dep').disabled = activo
  },

  error(mensaje) {
    const caja = document.getElementById('error-departamento')
    caja.hidden = !mensaje
    caja.textContent = mensaje || ''
  },

  confirmarEliminar(nombre) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('papelera', 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Eliminar departamento?</h3>
            <p class="confirmacion__texto">Se eliminará <strong>${esc(nombre)}</strong> de la base de datos. Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro boton--seminegrita" id="confirmar-eliminar-dep">Eliminar</button>
        </div>
      </div>`
  },
}