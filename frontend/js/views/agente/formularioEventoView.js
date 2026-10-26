// js/views/agente/formularioEventoView.js
// VISTA del formulario de evento. Se usa en dos lugares:
//   - "Registrar evento"            (modo 'registrar')
//   - "Editar evento" en Mis eventos (modo 'editar')

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

export const COLORES_ESTADO = {
  'Programado':   ['#eef2ff', '#4f46e5'],
  'En Boletería': ['#fffbeb', '#d97706'],
  'En boletería': ['#fffbeb', '#d97706'],
  'En Vivo':      ['#ecfdf5', '#059669'],
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
      <input type="${tipo}" id="${id}" name="${id}" class="entrada" placeholder="${esc(placeholder)}" value="${esc(valor ?? '')}" ${extra}>
      <span class="campo__error" data-error="${id}"></span>
      ${ayuda ? `<p class="campo__ayuda">${ayuda}</p>` : ''}
    </div>`
}

function campoArea({ id, texto, requerido, filas, placeholder, valor = '' }) {
  return `
    <div class="campo" data-campo="${id}">
      ${etiqueta(id, texto, requerido)}
      <textarea id="${id}" name="${id}" class="area-texto" rows="${filas}" placeholder="${esc(placeholder)}">${esc(valor ?? '')}</textarea>
      <span class="campo__error" data-error="${id}"></span>
    </div>`
}

// Soporta opciones como strings ("Colombia") o como objetos ({ valor: 1, texto: "Colombia" })
function opcionesSelect(vacio, opciones = [], valorSeleccionado = '') {
  return `<option value="">${esc(vacio)}</option>` +
    opciones.map(o => {
      const val = typeof o === 'object' ? o.valor : o
      const txt = typeof o === 'object' ? o.texto : o
      const sel = String(val) === String(valorSeleccionado) && String(valorSeleccionado) !== '' ? ' selected' : ''
      return `<option value="${esc(val)}"${sel}>${esc(txt)}</option>`
    }).join('')
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

function chipsEstado(estados, actual) {
  return estados.map(s => {
    const nombre = typeof s === 'object' ? s.nombre_estado : s
    const [fondo, color] = COLORES_ESTADO[nombre] || COLORES_ESTADO['Programado']
    return `<button type="button" class="chip-estado" data-estado="${esc(nombre)}" aria-pressed="${nombre === actual}" style="--chip-fondo:${fondo};--chip-color:${color}"><span class="chip-estado__punto"></span>${esc(nombre)}</button>`
  }).join('')
}

export const FormularioEventoView = {
  /**
   * Devuelve el HTML completo del formulario.
   * @param {object} c { modo, datos, paises, estados }
   */
  html({ modo, datos = {}, paises = [], estados = [] }) {
    const editar = modo === 'editar'

    const informacion =
      campoTexto({ id: 'nombre', texto: 'Nombre del evento', requerido: true, placeholder: 'Ej. Festival de Música Urbana 2026', valor: datos.nombre }) +
      campoArea({ id: 'descripcion', texto: 'Descripción', requerido: true, filas: 4, placeholder: 'Describe el evento: artistas, actividades, público objetivo, experiencia…', valor: datos.descripcion }) +
      campoArea({ id: 'informacion', texto: 'Observaciones / Información adicional', requerido: false, filas: 2, placeholder: 'Indicaciones especiales, edad mínima, restricciones…', valor: datos.observaciones }) +
      `<div class="campo">
        <span class="campo__etiqueta">Imagen del evento</span>
        <div class="zona-imagen" id="zona-imagen" tabindex="0" role="button" aria-label="Seleccionar imagen del evento"></div>
        <input type="file" id="imagen" accept="image/*" hidden>
        <p class="nota-imagen" id="nota-imagen">${icono('imagen', 20)}Opcional. Si no cargas una imagen se usará una imagen por defecto.</p>
      </div>`

    const ubicacion =
      campoSelect({ id: 'pais', texto: 'País', requerido: true, vacio: 'Seleccionar país', opciones: paises, valor: datos.id_pais }) +
      campoSelect({ id: 'departamento', texto: 'Departamento / Estado', requerido: true, vacio: 'Seleccionar departamento' }) +
      campoSelect({ id: 'ciudad', texto: 'Ciudad', requerido: true, vacio: 'Seleccionar ciudad' }) +
      campoTexto({ id: 'teatro', texto: 'Teatro o recinto', requerido: true, placeholder: 'Ej. Teatro Jorge Isaacs / Coliseo de Ferias', valor: datos.teatro }) +
      campoTexto({ id: 'direccion', texto: 'Dirección exacta', requerido: true, placeholder: 'Ej. Cra 3 # 12-28', valor: datos.direccion })

    // Con la regla de 24 h de anticipación, la primera fecha posible es MAÑANA
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const minFecha = `${manana.getFullYear()}-${String(manana.getMonth() + 1).padStart(2, '0')}-${String(manana.getDate()).padStart(2, '0')}`

    const fecha =
      campoTexto({ id: 'fecha', texto: 'Fecha de inicio', requerido: true, tipo: 'date', valor: datos.fecha_inicio_input, extra: editar ? '' : `min="${minFecha}"`, ayuda: 'Mínimo 24 horas de anticipación.' }) +
      campoTexto({ id: 'hora', texto: 'Hora de inicio', requerido: true, tipo: 'time', valor: datos.hora_inicio_input || '19:00' }) +
      campoTexto({ id: 'fecha_fin', texto: 'Fecha de finalización', requerido: true, tipo: 'date', valor: datos.fecha_fin_input || datos.fecha_inicio_input, extra: editar ? '' : `min="${minFecha}"` }) +
      campoTexto({ id: 'hora_fin', texto: 'Hora de finalización', requerido: true, tipo: 'time', valor: datos.hora_fin_input || '22:00', ayuda: 'Duración mínima: 1 hora.' })

    const capacidad =
      campoTexto({ id: 'capacidad', texto: 'Capacidad', requerido: true, tipo: 'number', placeholder: 'Ej. 500', valor: datos.capacidad, ayuda: 'Número máximo de asistentes (> 0).', extra: 'min="1"' }) +
      campoTexto({ id: 'precio', texto: 'Precio por entrada', requerido: true, placeholder: 'Ej. $ 85.000', valor: datos.precio, ayuda: 'En pesos colombianos (COP). Usa 0 si es gratis.' })

    const estadoActual = datos.estado || 'Programado'
    const mostrarCausa = editar && estadoActual === 'Cancelado'
    const estado = `
      <div>
        <span class="campo__etiqueta">Estado</span>
        <div class="estados-evento" id="estados" role="group" aria-label="Estado del evento">${chipsEstado(estados, estadoActual)}</div>
        ${editar
          ? `<p class="nota-estado">Los estados <strong>En Vivo</strong> y <strong>Finalizado</strong> cambian solos según la fecha y hora del evento.</p>
             <div id="bloque-causa" style="margin-top:12px" ${mostrarCausa ? '' : 'hidden'}>
               ${campoArea({ id: 'causa_cancelacion', texto: 'Causa de cancelación', requerido: true, filas: 2, placeholder: 'Explica el motivo por el cual se cancela el evento…', valor: datos.causa_cancelacion })}
               <div class="alerta alerta--roja">${icono('advertencia', 14)}<p>Al cancelar el evento se cancelarán automáticamente <strong>todas sus reservas</strong>.</p></div>
             </div>`
          : '<p class="nota-estado">Todo evento nuevo se registra inicialmente en estado <strong>Programado</strong>.</p>'}
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

  /** Cambia las opciones de un select (país, departamento o ciudad) */
  opciones(id, vacio, lista, valor = '') {
    const select = document.getElementById(id)
    if (!select) return
    select.innerHTML = opcionesSelect(vacio, lista, valor)
    select.disabled = lista.length === 0
  },

  marcarEstado(estado) {
    document.querySelectorAll('#estados [data-estado]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.estado === estado)))
    const bloqueCausa = document.getElementById('bloque-causa')
    if (bloqueCausa) bloqueCausa.hidden = estado !== 'Cancelado'
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
    const nota = document.getElementById('nota-imagen')
    if (nota) nota.hidden = !!vistaPrevia
  },
}