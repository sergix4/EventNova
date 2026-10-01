// js/controllers/cliente/perfilController.js
// CONTROLADOR del perfil del cliente.
// Muestra los datos reales de la sesión (tabla USUARIO). La edición del
// perfil queda simulada hasta que exista el CRUD de personas.

import { iniciarPanel } from '../comun/panelController.js'
import { PerfilClienteView } from '../../views/cliente/perfilClienteView.js'

const estado = { editando: false, preferencias: { publicidad: true, correo: true, reservas: true } }
let usuario = null

function dibujar() {
  PerfilClienteView.mostrar(usuario, estado)
}

async function iniciar() {
  usuario = await iniciarPanel({ rol: 'cliente', activo: 'perfil' })
  dibujar()

  document.getElementById('perfil').addEventListener('click', (e) => {
    const preferencia = e.target.closest('[data-preferencia]')
    if (preferencia) {
      const clave = preferencia.dataset.preferencia
      estado.preferencias[clave] = !estado.preferencias[clave]
      preferencia.setAttribute('aria-checked', String(estado.preferencias[clave]))
      return
    }
    if (e.target.closest('[data-accion="editar"]')) {
      const guardar = estado.editando
      estado.editando = !estado.editando
      dibujar()
      if (guardar) {
        PerfilClienteView.mostrarGuardado(true)
        setTimeout(() => PerfilClienteView.mostrarGuardado(false), 2500)
      }
    }
  })
}

iniciar()
