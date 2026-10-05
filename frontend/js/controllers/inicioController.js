// js/controllers/inicioController.js
// CONTROLADOR de la página principal (index.html).
// Pide los eventos destacados al Modelo y se los entrega a la Vista.
// También maneja el menú hamburguesa en celulares (accesible con teclado).

import { EventoModel } from '../models/eventoModel.js'
import { InicioView } from '../views/inicioView.js'

async function cargarEventos() {
  const grid = document.getElementById('grid-eventos')
  try {
    const eventos = await EventoModel.obtenerDestacados()
    InicioView.mostrarEventos(grid, eventos)
  } catch (error) {
    console.error(error)
    InicioView.mostrarError(grid)
  }
}

function iniciarMenuMovil() {
  const boton = document.getElementById('boton-menu-movil')
  const menu = document.getElementById('menu-movil')

  function abrirOCerrar(abrir) {
    boton.setAttribute('aria-expanded', String(abrir))
    boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú')
    menu.hidden = !abrir
  }

  boton.addEventListener('click', () => {
    abrirOCerrar(boton.getAttribute('aria-expanded') !== 'true')
  })

  // Al elegir un enlace, el menú se cierra
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) abrirOCerrar(false)
  })

  // Tecla Escape: cierra el menú y devuelve el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      abrirOCerrar(false)
      boton.focus()
    }
  })
}

function iniciar() {
  InicioView.mostrarEstrellas(document.getElementById('estrellas-hero'))
  iniciarMenuMovil()
  cargarEventos()
}

iniciar()