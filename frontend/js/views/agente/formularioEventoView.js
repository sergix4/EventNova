// js/views/agente/formularioEventoView.js
// VISTA del formulario de evento. Se usa en dos lugares:
//   - "Registrar evento"            (modo 'registrar')
//   - "Editar evento" en Mis eventos (modo 'editar')
// El HTML se dibuja una sola vez; luego el controlador solo actualiza las
// partes que cambian (opciones de los selects, errores, estado, imagen).

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export const COLORES_ESTADO = {
  'Programado':   ['#eef2ff', '#4f46e5'],
  'En boletería': ['#fffbeb', '#d97706'],
  'En vivo':      ['#ecfdf5', '#059669'],
  'Finalizado':   ['#f3f4f6', '#374151'],
  'Cancelado':    ['#fef2f2', '#dc2626'],
}

function seccion(numero, titulo, cuerpo, grid = false) {
  return `
    <section class="seccion-evento">
      <h2 class="seccion-evento__titulo"><span class="seccion-evento__numero">${numero}</span>${titulo}</h2>
      <div class="seccion-evento__cuerpo${grid ? ' seccion-evento__cuerpo--grid' : ''}">${cuerpo}</div>
    </section>`
}

function etiqueta(para, texto, requerido) {
  return `<label class="campo__etiqueta" for="${para}">${texto}${requerido ? '<span class="campo__requerido--rojo">*</span>' : ''}</label>`
}

function campoTexto({ id, texto, requerido, tipo = 'text', placeholder = '', valor = '', ayuda = '', extra = '' }) {
  return `
    <div class="campo" data-campo="${id}">
      ${etiqueta(id, texto, requerido)}
      <input type="${tipo}" id="${id}" name="${id}" class="entrada" placeholder="${esc(placeholder)}" value="${esc(valor)}" ${extra}>
      <span class="campo__error" data-error="${id}"></span>
      ${ayuda ? `<p class="campo__ayuda">${ayuda}</p>` : ''}
    </div>`
}

function campoArea({ id, texto, requerido, filas, placeholder, valor = '' }) {
  return `
    <div class="campo" data-campo="${id}">
      ${etiqueta(id, texto, requerido)}
      <textarea id="${id}" name="${id}" class="area-texto" rows="${filas}" placeholder="${esc(placeholder)}">${esc(valor)}</textarea>
      <span class="campo__error" data-error="${id}"></span>
    </div>`
}

function campoSelect({ id, texto, requerido, vacio, opciones = [], valor = '' }) {
  return `
    <div class="campo" data-campo="${id}">
      ${etiqueta(id, texto, requerido)}
      <div class="envoltura-select">
        <select id="${id}" name="${id}" class="selector">${opcionesSelect(vacio, opciones, valor)}</select>
      </div>
      <span class="campo__error" data-error="${id}"></span>
    </div>`
}

function opcionesSelect(vacio, opciones, valor) {
  return `<option value="">${esc(vacio)}</option>` +
    opciones.map(o => `<option${o === valor ? ' selected' : ''}>${esc(o)}</option>`).join('')
}

function chipsEstado(estados, actual) {
  return estados.map(s => {
    const [fondo, color] = COLORES_ESTADO[s]
    return `<button type="button" class="chip-estado" data-estado="${s}" aria-pressed="${s === actual}" style="--chip-fondo:${fondo};--chip-color:${color}"><span class="chip-estado__punto"></span>${s}</button>`
  }).join('')
}

export const FormularioEventoView = {
  /**
   * Devuelve el HTML completo del formulario.
   * @param {object} c { modo, datos, paises, categorias, estados }
   */
  html({ modo, datos = {}, paises, categorias, estados }) {
    const editar = modo === 'editar'

    const informacion = editar
      ? campoTexto({ id: 'nombre', texto: 'Nombre del evento', requerido: true, valor: datos.nombre }) +
        campoArea({ id: 'descripcion', texto: 'Descripción', filas: 4, placeholder: 'Describe el evento…', valor: datos.descripcion }) +
        campoSelect({ id: 'categoria', texto: 'Categoría', vacio: 'Seleccionar categoría', opciones: categorias, valor: datos.categoria }) +
        campoArea({ id: 'informacion', texto: 'Información adicional', filas: 2, placeholder: 'Indicaciones especiales, requisitos, restricciones…' })
      : campoTexto({ id: 'nombre', texto: 'Nombre del evento', requerido: true, placeholder: 'Ej. Festival de Música Urbana 2026' }) +
        campoArea({ id: 'descripcion', texto: 'Descripción', requerido: true, filas: 4, placeholder: 'Describe el evento: artistas, actividades, público objetivo, experiencia…' }) +
        `<div class="campo">
          <span class="campo__etiqueta">Imagen del evento</span>
          <div class="zona-imagen" id="zona-imagen" tabindex="0" role="button" aria-label="Seleccionar imagen del evento"></div>
          <input type="file" id="imagen" accept="image/*" hidden>
          <p class="nota-imagen" id="nota-imagen">${icono('imagen', 20)}Opcional. Si no cargas una imagen se usará una imagen por defecto.</p>
        </div>`

    const ubicacion =
      campoSelect({ id: 'pais', texto: 'País', requerido: true, vacio: 'Seleccionar país', opciones: paises, valor: datos.pais }) +
      campoSelect({ id: 'departamento', texto: 'Departamento / Estado', requerido: true, vacio: 'Seleccionar departamento' }) +
      campoSelect({ id: 'ciudad', texto: 'Ciudad', requerido: true, vacio: 'Seleccionar ciudad' }) +
      (editar
        ? campoTexto({ id: 'direccion', texto: 'Lugar / Dirección', placeholder: 'Ej. Parque Norte, Cl. 73 #52-36', valor: datos.direccion })
        : campoTexto({ id: 'direccion', texto: 'Dirección', requerido: true, placeholder: 'Ej. Cra 7 # 32-16, Parque de la 93' }))

    const hoy = new Date().toISOString().split('T')[0]
    const fecha =
      campoTexto({ id: 'fecha', texto: 'Fecha del evento', requerido: true, tipo: 'date', valor: datos.fecha, extra: editar ? '' : `min="${hoy}"` }) +
      campoTexto({ id: 'hora', texto: 'Hora del evento', requerido: !editar, tipo: 'time', valor: datos.hora })

    const capacidad =
      campoTexto({ id: 'capacidad', texto: 'Capacidad', requerido: true, tipo: 'number', placeholder: editar ? '' : 'Ej. 500', valor: datos.capacidad, ayuda: 'Número máximo de asistentes.', extra: 'min="1"' }) +
      campoTexto({ id: 'precio', texto: 'Precio por entrada', requerido: true, placeholder: editar ? '' : 'Ej. $ 85.000', valor: datos.precio, ayuda: 'En pesos colombianos (COP).' })

    const estado = `
      <div>
        <span class="campo__etiqueta">Estado</span>
        <div class="estados-evento" id="estados" role="group" aria-label="Estado del evento">${chipsEstado(estados, datos.estado || 'Programado')}</div>
        ${editar ? '' : '<p class="nota-estado">El estado inicial recomendado para un evento nuevo es <strong>Programado</strong>.</p>'}
      </div>`

    return `
      <form class="form-evento" id="form-evento" novalidate>
        ${seccion(1, 'Información del evento', informacion)}
        ${seccion(2, 'Ubicación', ubicacion, true)}
        ${seccion(3, 'Fecha y hora', fecha, true)}
        ${seccion(4, 'Capacidad y precio', capacidad, true)}
        ${seccion(5, 'Estado del evento', estado)}
        <div class="form-evento__acciones">
          <button type="button" class="boton boton--neutro" data-accion="cancelar">Cancelar</button>
          <button type="submit" class="boton boton--coral boton--seminegrita">${editar ? 'Guardar cambios' : 'Guardar evento'}</button>
        </div>
      </form>`
  },

  /** Cambia las opciones de un select (departamento o ciudad) */
  opciones(id, vacio, lista, valor = '') {
    const select = document.getElementById(id)
    select.innerHTML = opcionesSelect(vacio, lista, valor)
    select.disabled = lista.length === 0
  },

  marcarEstado(estado) {
    document.querySelectorAll('#estados [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === estado)))
  },

  /** Muestra (o limpia) los errores de validación */
  errores(errores) {
    document.querySelectorAll('[data-error]').forEach(span => {
      const mensaje = errores[span.dataset.error]
      span.innerHTML = mensaje ? `${icono('alerta', 14)}${mensaje}` : ''
      const control = document.getElementById(span.dataset.error)
      control?.classList.toggle(control.tagName === 'SELECT' ? 'selector--error' : control.tagName === 'TEXTAREA' ? 'area-texto--error' : 'entrada--error', !!mensaje)
    })
  },

  /** Zona para cargar la imagen (vacía o con vista previa) */
  imagen(vistaPrevia) {
    const zona = document.getElementById('zona-imagen')
    if (!zona) return
    zona.classList.toggle('zona-imagen--con-imagen', !!vistaPrevia)
    zona.innerHTML = vistaPrevia
      ? `<div class="zona-imagen__vista">
           <img src="${vistaPrevia}" alt="Vista previa de la imagen del evento">
           <div class="zona-imagen__cambiar">Cambiar imagen</div>
           <button type="button" class="zona-imagen__quitar" data-accion="quitar-imagen" aria-label="Quitar imagen">${icono('cerrar', 18)}</button>
         </div>`
      : `<div class="zona-imagen__vacia">
           <div class="zona-imagen__icono">${icono('subir', 28, { grosor: 1.5 })}</div>
           <div><p class="zona-imagen__titulo">Arrastra una imagen o haz clic para seleccionar</p><p class="zona-imagen__ayuda">PNG, JPG, WEBP · Máx. 5 MB</p></div>
           <span class="zona-imagen__boton">Seleccionar archivo</span>
         </div>`
    document.getElementById('nota-imagen').hidden = !!vistaPrevia
  },
}
