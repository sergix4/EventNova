// js/controllers/agente/perfilController.js
// CONTROLADOR del perfil del agente.
// Los datos personales y de agente vienen de la sesión (tablas USUARIO,
// AGENTE y TIPO_PLAN). La edición queda simulada hasta tener el CRUD.

import { iniciarPanel } from '../comun/panelController.js'
import { PLANES } from '../../models/catalogoModel.js'
import { PerfilAgenteView } from '../../views/agente/perfilAgenteView.js'
import { abrirModal, cerrarModal } from '../../views/componentes/modal.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const estado = { personal: {}, agente: {}, planes: PLANES, planActual: 'basico' }
const dibujar = () => PerfilAgenteView.mostrar(estado)
const aviso = (mensaje) => mostrarToast(mensaje, { duracion: 2500 })
const valor = (caja, id) => caja.querySelector('#' + id).value

function editarPersonal() {
  const caja = abrirModal(PerfilAgenteView.modalPersonal(estado.personal), { clase: 'modal--lg', cerrarAlHacerClicFuera: false })
  caja.querySelector('#guardar').addEventListener('click', () => {
    Object.assign(estado.personal, {
      nombre: valor(caja, 'm-nombre'), correo: valor(caja, 'm-correo'), identificacion: valor(caja, 'm-identificacion'),
      telefono: valor(caja, 'm-telefono'), direccion: valor(caja, 'm-direccion'), pais: valor(caja, 'm-pais'),
      departamento: valor(caja, 'm-departamento'), ciudad: valor(caja, 'm-ciudad'),
    })
    cerrarModal(); dibujar(); aviso('Perfil actualizado correctamente.')
  })
}

function editarAgente() {
  const caja = abrirModal(PerfilAgenteView.modalAgente(estado.agente), { clase: 'modal--lg', cerrarAlHacerClicFuera: false })
  caja.querySelector('#guardar').addEventListener('click', () => {
    Object.assign(estado.agente, {
      nombre: valor(caja, 'm-agente'), empresa: valor(caja, 'm-empresa'),
      descripcion: valor(caja, 'm-descripcion'), ciudad: valor(caja, 'm-ciudad-op'),
    })
    cerrarModal(); dibujar(); aviso('Información de agente actualizada correctamente.')
  })
}

function cambiarPlan(clave) {
  const plan = PLANES.find(p => p.clave === clave)
  const caja = abrirModal(PerfilAgenteView.modalPlan(plan), { cerrarAlHacerClicFuera: false })
  caja.querySelector('#confirmar').addEventListener('click', () => {
    estado.planActual = clave
    cerrarModal(); dibujar(); aviso('Plan actualizado correctamente.')
  })
}

function cancelarSuscripcion() {
  const caja = abrirModal(PerfilAgenteView.modalCancelarSuscripcion(), { cerrarAlHacerClicFuera: false })
  caja.querySelector('#confirmar').addEventListener('click', () => {
    cerrarModal(); aviso('Tu suscripción será cancelada al final del período.')
  })
}

function cambiarClave() {
  const caja = abrirModal(PerfilAgenteView.modalClave(), { cerrarAlHacerClicFuera: false })
  const error = caja.querySelector('#error-clave')
  const mostrarError = (texto) => {
    error.textContent = texto
    error.hidden = !texto
    caja.querySelectorAll('input').forEach(i => i.classList.toggle('entrada--error', !!texto))
  }
  caja.addEventListener('input', () => mostrarError(''))
  caja.querySelector('#guardar').addEventListener('click', (e) => {
    const [actual, nueva, confirmar] = ['clave-actual', 'clave-nueva', 'clave-confirmar'].map(id => valor(caja, id))
    if (!actual || !nueva || !confirmar) return mostrarError('Todos los campos son obligatorios.')
    if (nueva !== confirmar) return mostrarError('Las contraseñas nuevas no coinciden.')
    if (nueva.length < 8) return mostrarError('La nueva contraseña debe tener al menos 8 caracteres.')
    e.currentTarget.disabled = true
    caja.querySelector('#exito-clave').hidden = false
    setTimeout(cerrarModal, 1200)
  })
}

async function iniciar() {
  const usuario = await iniciarPanel({ rol: 'agente', activo: 'perfil' })
  estado.personal = {
    nombre: usuario?.nombre || '', correo: usuario?.correo || '', identificacion: usuario?.numero_id || '',
    telefono: usuario?.telefono || '', direccion: usuario?.direccion || '',
    pais: usuario?.pais || '', departamento: usuario?.departamento || '', ciudad: usuario?.ciudad || '',
  }
  estado.agente = {
    nombre: usuario?.nombre || '', empresa: usuario?.agente?.nombre_empresa || '',
    descripcion: usuario?.agente?.descripcion_agente || '', ciudad: '',
  }
  estado.planActual = PLANES.find(p => p.nombre === usuario?.agente?.plan)?.clave || 'basico'
  dibujar()

  document.getElementById('contenido').addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion
    const planElegido = e.target.closest('[data-elegir-plan]')?.dataset.elegirPlan
    if (planElegido) return cambiarPlan(planElegido)
    if (accion === 'editar-personal') editarPersonal()
    if (accion === 'editar-agente') editarAgente()
    if (accion === 'cambiar-plan') cambiarPlan(PLANES.find(p => p.clave !== estado.planActual).clave)
    if (accion === 'cancelar-suscripcion') cancelarSuscripcion()
    if (accion === 'cambiar-clave') cambiarClave()
  })
}

iniciar()
