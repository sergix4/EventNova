// js/views/registroView.js
// VISTA del registro: selects en cascada, tarjetas de planes, resumen,
// barra de fuerza de contraseña y cambio entre formulario cliente / agente.

import { icono } from './componentes/iconos.js'
import { esc } from '../utils/formato.js'

const COLORES_FUERZA = ['#ef4444', '#f59e0b', '#10b981', '#10b981']
const TEXTOS_FUERZA = ['', 'Contraseña débil', 'Contraseña regular', 'Contraseña fuerte', 'Contraseña muy fuerte']

export const RegistroView = {
  /** Llena un <select> con opciones y lo habilita/deshabilita */
  llenarSelect(select, opciones, textoVacio, deshabilitado = false) {
    select.innerHTML = `<option value="" disabled selected>${esc(textoVacio)}</option>` +
      opciones.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')
    select.disabled = deshabilitado
    select.closest('.campo-icono').classList.toggle('campo-icono--deshabilitado', deshabilitado)
    this.colorSelect(select)
  },

  /** El texto del select se ve gris mientras no haya una opción elegida */
  colorSelect(select) {
    select.classList.toggle('sin-valor', !select.value)
  },

  /** Muestra solo las secciones del rol elegido */
  mostrarRol(rol) {
    document.querySelectorAll('.opcion-rol').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.rol === rol)))
    document.querySelectorAll('[data-solo]').forEach(s => { s.hidden = s.dataset.solo !== rol })
    document.getElementById('boton-registro').textContent = rol === 'agente' ? 'Crear cuenta de Agente' : 'Crear cuenta'
  },

  pintarPlanes(contenedor, planes, seleccionado) {
    contenedor.innerHTML = planes.map(p => {
      const activo = p.clave === seleccionado
      return `
        <div class="plan${activo ? ' plan--seleccionado' : ''}" data-plan="${p.clave}" role="radio" aria-checked="${activo}" tabindex="0">
          ${p.recomendado ? `<span class="plan__recomendado">${icono('estrella', 12, { relleno: 'currentColor', grosor: 0 })}Recomendado</span>` : ''}
          <div class="plan__cabecera">
            <p class="plan__nombre">${esc(p.nombre)}</p>
            <span class="plan__radio">${icono('check', 10, { grosor: 3 })}</span>
          </div>
          <p class="plan__precio">${esc(p.precioCorto)}</p>
          <p class="plan__periodo">COP por mes</p>
          <ul class="plan__lista">
            ${p.beneficios.map(b => `<li><span class="plan__check">${icono('check', 8, { grosor: 3 })}</span>${esc(b)}</li>`).join('')}
          </ul>
          <button type="button" class="plan__boton">${activo ? '✓ Seleccionado' : 'Elegir plan'}</button>
        </div>`
    }).join('')
  },

  pintarResumen(nombre, plan) {
    const seccion = document.getElementById('resumen-registro')
    const visible = !!(plan && nombre)
    seccion.classList.toggle('oculto', !visible)
    if (!visible) return
    const filas = [
      ['Tipo de cuenta', 'Agente'],
      ['Nombre', nombre],
      ['Plan seleccionado', plan.nombre],
      ['Precio', plan.precio + ' / mes'],
    ]
    document.getElementById('resumen-datos').innerHTML =
      filas.map(([e, v]) => `<div><dt>${e}</dt><dd>${esc(v)}</dd></div>`).join('')
  },

  pintarFuerza(clave) {
    const caja = document.getElementById('fuerza-clave')
    caja.hidden = !clave
    if (!clave) return
    const puntos = [clave.length >= 8, /[A-Z]/.test(clave), /[0-9]/.test(clave), /[^a-zA-Z0-9]/.test(clave)].filter(Boolean).length
    caja.querySelectorAll('.fuerza__barras span').forEach((barra, i) => {
      barra.style.background = i < puntos ? COLORES_FUERZA[puntos - 1] : ''
    })
    caja.querySelector('.fuerza__texto').textContent = TEXTOS_FUERZA[puntos]
  },

  errorPlan(visible) {
    document.getElementById('error-plan').hidden = !visible
  },
}
