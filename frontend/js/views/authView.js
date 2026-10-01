// js/views/authView.js
// VISTA compartida por inicio de sesión y registro: estados visuales de los
// campos, botón "cargando", mostrar/ocultar contraseña y mensajes de error.

import { icono } from './componentes/iconos.js'

export const AuthView = {
  /** Botones de "ojo" para mostrar u ocultar contraseñas */
  prepararMostrarClave(raiz = document) {
    raiz.querySelectorAll('[data-mostrar]').forEach(boton => {
      const input = document.getElementById(boton.dataset.mostrar)
      const pintar = () => {
        const visible = input.type === 'text'
        boton.innerHTML = icono(visible ? 'ojoTachado' : 'ojo', 18)
        boton.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña')
      }
      pintar()
      boton.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password'
        pintar()
      })
    })
  },

  /** Pinta un campo como 'valido', 'invalido' o normal ('') */
  estadoCampo(campo, estado) {
    const caja = campo.querySelector('.campo-icono')
    caja.classList.toggle('campo-icono--valido', estado === 'valido')
    caja.classList.toggle('campo-icono--invalido', estado === 'invalido')
    campo.classList.toggle('campo--invalido', estado === 'invalido')
  },

  /** Muestra un mensaje de error debajo de un campo (login) */
  errorCampo(idError, mensaje) {
    const el = document.getElementById(idError)
    el.innerHTML = mensaje
    el.closest('.campo').querySelector('.campo-icono').classList.toggle('campo-icono--invalido', !!mensaje)
  },

  errorServidor(mensaje) {
    const el = document.getElementById('error-servidor')
    el.textContent = mensaje || ''
    el.hidden = !mensaje
  },

  /** Cambia el botón a estado "cargando" y lo restaura después */
  cargando(boton, activo, texto) {
    if (activo) {
      boton.dataset.textoOriginal = boton.innerHTML
      boton.disabled = true
      boton.innerHTML = `${icono('cargando', 16, { grosor: 2.5, clase: 'girando' })}${texto}`
    } else {
      boton.disabled = false
      if (boton.dataset.textoOriginal) boton.innerHTML = boton.dataset.textoOriginal
    }
  },
}
