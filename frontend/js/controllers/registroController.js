// js/controllers/registroController.js
// CONTROLADOR del registro de clientes y agentes.
// Valida los campos mientras el usuario escribe, arma los datos y llama al
// Modelo (POST /api/auth/register o /api/auth/register-agente).

import { AuthModel } from '../models/authModel.js'
import { UBICACION_REGISTRO, PLANES } from '../models/catalogoModel.js'
import { AuthView } from '../views/authView.js'
import { RegistroView } from '../views/registroView.js'
import { mostrarToast } from '../views/componentes/toast.js'
import { paginaInicioDe } from './comun/panelController.js'

const formulario = document.getElementById('form-registro')
const boton = document.getElementById('boton-registro')
const terminos = document.getElementById('terminos')
const publicidad = document.getElementById('publicidad')
const selPais = document.getElementById('pais')
const selDepto = document.getElementById('departamento')
const selCiudad = document.getElementById('ciudad')

let rol = 'cliente'
let planSeleccionado = null
let cargando = false
const tocados = new Set() // campos que el usuario ya escribió

const CAMPOS_CLIENTE = ['identificacion', 'nombre', 'correo', 'password', 'confirmar', 'direccion', 'pais', 'departamento', 'ciudad', 'telefono']
const CAMPOS_AGENTE = [...CAMPOS_CLIENTE, 'empresa', 'descripcionNegocio', 'ciudadOperacion', 'tipoEventos']
const valor = (id) => document.getElementById(id).value

// ─── Reglas de validación (las mismas del prototipo) ─────────────────────────
function validar(campo) {
  const v = valor(campo)
  if (!v) return ''
  switch (campo) {
    case 'correo': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'valido' : 'invalido'
    case 'password': return v.length >= 8 ? 'valido' : 'invalido'
    case 'confirmar': return v === valor('password') ? 'valido' : 'invalido'
    case 'identificacion': return v.length >= 6 ? 'valido' : 'invalido'
    case 'telefono': return /^\+?[\d\s-]{7,}$/.test(v) ? 'valido' : 'invalido'
    default: return v.length > 1 ? 'valido' : ''
  }
}

function pintarCampo(campo) {
  const contenedor = document.querySelector(`[data-campo="${campo}"]`)
  if (!contenedor || contenedor.querySelector('select')) return
  AuthView.estadoCampo(contenedor, tocados.has(campo) ? validar(campo) : '')
}

// ─── Ubicación en cascada ────────────────────────────────────────────────────
function cargarDepartamentos() {
  const deptos = UBICACION_REGISTRO.departamentos[selPais.value] || []
  RegistroView.llenarSelect(selDepto, deptos, selPais.value ? 'Selecciona...' : 'Primero selecciona un país', !selPais.value)
  RegistroView.llenarSelect(selCiudad, [], 'Primero selecciona departamento', true)
}
function cargarCiudades() {
  const ciudades = UBICACION_REGISTRO.ciudades[selDepto.value] || []
  RegistroView.llenarSelect(selCiudad, ciudades, selDepto.value ? 'Selecciona...' : 'Primero selecciona departamento', !selDepto.value)
}

RegistroView.llenarSelect(selPais, UBICACION_REGISTRO.paises, 'Selecciona un país')
selPais.value = 'Colombia'
RegistroView.colorSelect(selPais)
cargarDepartamentos()

selPais.addEventListener('change', () => { RegistroView.colorSelect(selPais); cargarDepartamentos() })
selDepto.addEventListener('change', () => { RegistroView.colorSelect(selDepto); cargarCiudades() })
selCiudad.addEventListener('change', () => RegistroView.colorSelect(selCiudad))
document.getElementById('tipoEventos').addEventListener('change', (e) => RegistroView.colorSelect(e.target))
RegistroView.colorSelect(document.getElementById('tipoEventos'))

// ─── Eventos del formulario ──────────────────────────────────────────────────
AuthView.prepararMostrarClave()

formulario.addEventListener('input', (e) => {
  const campo = e.target.id
  if (!campo) return
  if (e.target.value) tocados.add(campo)
  pintarCampo(campo)
  if (campo === 'password') { RegistroView.pintarFuerza(e.target.value); pintarCampo('confirmar') }
  if (campo === 'nombre') actualizarResumen()
})

document.querySelectorAll('.opcion-rol').forEach(b => b.addEventListener('click', () => {
  rol = b.dataset.rol
  RegistroView.mostrarRol(rol)
  AuthView.errorServidor('')
}))

publicidad.addEventListener('click', () => {
  publicidad.setAttribute('aria-checked', String(publicidad.getAttribute('aria-checked') !== 'true'))
})

terminos.addEventListener('change', () => { boton.disabled = cargando || !terminos.checked })

const gridPlanes = document.getElementById('grid-planes')
function elegirPlan(clave) {
  planSeleccionado = clave
  RegistroView.pintarPlanes(gridPlanes, PLANES, planSeleccionado)
  RegistroView.errorPlan(false)
  actualizarResumen()
}
gridPlanes.addEventListener('click', (e) => {
  const tarjeta = e.target.closest('[data-plan]')
  if (tarjeta) elegirPlan(tarjeta.dataset.plan)
})
gridPlanes.addEventListener('keydown', (e) => {
  const tarjeta = e.target.closest('[data-plan]')
  if (tarjeta && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); elegirPlan(tarjeta.dataset.plan) }
})
RegistroView.pintarPlanes(gridPlanes, PLANES, null)

function actualizarResumen() {
  RegistroView.pintarResumen(valor('nombre'), PLANES.find(p => p.clave === planSeleccionado))
}
actualizarResumen()

// ─── Envío ───────────────────────────────────────────────────────────────────
formulario.addEventListener('submit', async (e) => {
  e.preventDefault()
  const campos = rol === 'agente' ? CAMPOS_AGENTE : CAMPOS_CLIENTE
  campos.forEach(c => { tocados.add(c); pintarCampo(c) })

  if (rol === 'agente' && !planSeleccionado) { RegistroView.errorPlan(true); return }
  if (!terminos.checked) return
  const hayErrores = campos.some(c => validar(c) === 'invalido')
  const faltan = campos.some(c => !valor(c))
  if (hayErrores || faltan) return

  AuthView.errorServidor('')
  cargando = true
  AuthView.cargando(boton, true, 'Creando cuenta…')

  const datos = {
    identificacion: valor('identificacion'),
    nombre: valor('nombre'),
    correo: valor('correo'),
    password: valor('password'),
    direccion: valor('direccion'),
  }

  try {
    if (rol === 'cliente') {
      const { usuario } = await AuthModel.registrarCliente(datos)
      window.location.href = paginaInicioDe(usuario.rol)
    } else {
      const { usuario } = await AuthModel.registrarAgente({
        ...datos,
        empresa: valor('empresa'),
        descripcionNegocio: valor('descripcionNegocio'),
        plan: planSeleccionado,
      })
      const plan = PLANES.find(p => p.clave === planSeleccionado)
      mostrarToast('Cuenta de Agente creada correctamente.', { detalle: `Plan ${plan.nombre} seleccionado correctamente.`, duracion: 0 })
      setTimeout(() => { window.location.href = paginaInicioDe(usuario.rol) }, 1500)
    }
  } catch (error) {
    AuthView.errorServidor(error.message)
    cargando = false
    AuthView.cargando(boton, false)
    boton.disabled = !terminos.checked
  }
})
