// js/controllers/admin/perfilController.js
// CONTROLADOR del perfil del administrador. La edición se simula en el
// navegador hasta que exista el CRUD de administradores en el backend.

import { iniciarAdmin } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { PerfilAdminView } from '../../views/admin/perfilAdminView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const usuario = await iniciarAdmin('perfil')
const { perfil, actividad } = await ReporteModel.perfilAdmin()
// Si hay un administrador con sesión, se muestran sus datos reales
if (usuario) Object.assign(perfil, { nombre: usuario.nombre, correo: usuario.correo })
const preferencias = { sistema: true, reportes: true, actividad: false }
const aviso = (mensaje) => mostrarToast(mensaje, { duracion: 3500 })

PerfilAdminView.mostrar({ perfil, actividad, preferencias })

function guardarPerfil() {
  document.querySelectorAll('#form-perfil [data-editable]').forEach(control => {
    perfil[control.id.replace('p-', '')] = control.value.trim()
  })
  PerfilAdminView.modoEdicion(false, perfil)
  PerfilAdminView.actualizarCabecera(perfil)
  aviso('Perfil actualizado correctamente.')
}

function cambiarClave() {
  const caja = abrirModal(PerfilAdminView.modalClave(), { clase: 'modal--sm' })
  caja.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver-clave]')
    if (ver) PerfilAdminView.alternarClave(ver)
  })
  caja.querySelector('#form-clave').addEventListener('submit', (e) => {
    e.preventDefault()
    const actual = caja.querySelector('#clave-actual').value
    const nueva = caja.querySelector('#clave-nueva').value
    const confirmar = caja.querySelector('#clave-confirmar').value
    if (!actual) return PerfilAdminView.errorClave('Ingresa tu contraseña actual.')
    if (nueva.length < 8) return PerfilAdminView.errorClave('La nueva contraseña debe tener al menos 8 caracteres.')
    if (nueva !== confirmar) return PerfilAdminView.errorClave('Las contraseñas no coinciden.')
    cerrarModal()
    aviso('Contraseña actualizada correctamente.')
  })
}

const ACCIONES = {
  'editar-perfil': () => PerfilAdminView.modoEdicion(true),
  'cancelar-edicion': () => PerfilAdminView.modoEdicion(false, perfil),
  'guardar-perfil': guardarPerfil,
  'cambiar-clave': cambiarClave,
  'cambiar-correo': () => aviso('Para cambiar el correo contacta al soporte técnico.'),
  'cerrar-sesiones': () => aviso('Sesiones activas cerradas correctamente.'),
}

document.getElementById('contenido').addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]')
  if (boton && ACCIONES[boton.dataset.accion]) return ACCIONES[boton.dataset.accion]()

  const interruptor = e.target.closest('[data-preferencia]')
  if (interruptor) {
    preferencias[interruptor.dataset.preferencia] = !preferencias[interruptor.dataset.preferencia]
    PerfilAdminView.marcarPreferencias(preferencias)
  }
})
