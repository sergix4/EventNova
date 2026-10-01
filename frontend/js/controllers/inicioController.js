// js/controllers/inicioController.js
// CONTROLADOR de la página principal (index.html).
// Pide los eventos destacados al Modelo y se los entrega a la Vista.
// También maneja el menú hamburguesa en celulares.

import { EventoModel } from '../models/eventoModel.js'
import { InicioView } from '../views/inicioView.js'

async function iniciar() {
  InicioView.mostrarEstrellas(document.getElementById('estrellas-hero'))

  const eventos = await EventoModel.obtenerDestacados()
  InicioView.mostrarEventos(document.getElementById('grid-eventos'), eventos)

  // Menú en celulares
  const boton = document.getElementById('boton-menu-movil')
  const menu = document.getElementById('menu-movil')
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true'
    boton.setAttribute('aria-expanded', String(!abierto))
    menu.hidden = abierto
  })
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) { boton.setAttribute('aria-expanded', 'false'); menu.hidden = true }
  })
}

iniciar()
