// js/controllers/agente/formularioEventoController.js
// CONTROLADOR reutilizable del formulario de evento (registrar y editar):
// ubicación en cascada, formato del precio, estado, imagen y validación.

import { UBICACION_EVENTOS, ESTADOS_EVENTO, CATEGORIAS_EVENTO } from '../../models/catalogoModel.js'
import { FormularioEventoView } from '../../views/agente/formularioEventoView.js'

const OBLIGATORIOS = ['nombre', 'descripcion', 'pais', 'departamento', 'ciudad', 'direccion', 'fecha', 'hora', 'capacidad', 'precio']

/** "85000" → "$ 85.000" */
function formatoPrecio(texto) {
  const digitos = texto.replace(/\D/g, '')
  return digitos ? '$ ' + Number(digitos).toLocaleString('es-CO') : ''
}

/**
 * Dibuja el formulario dentro de "contenedor" y conecta sus eventos.
 * @param {HTMLElement} contenedor
 * @param {object} opciones { modo: 'registrar'|'editar', datos, alGuardar(datos), alCancelar() }
 */
export function montarFormulario(contenedor, { modo, datos = {}, alGuardar, alCancelar }) {
  const editar = modo === 'editar'
  let estado = datos.estado || 'Programado'
  let imagen = null
  let errores = {}

  contenedor.innerHTML = FormularioEventoView.html({
    modo, datos,
    paises: UBICACION_EVENTOS.paises,
    categorias: CATEGORIAS_EVENTO,
    estados: ESTADOS_EVENTO,
  })

  const $ = (id) => document.getElementById(id)
  const form = $('form-evento')

  // ── Ubicación en cascada ──────────────────────────────────────────────────
  const cargarDepartamentos = (valor = '') => {
    FormularioEventoView.opciones('departamento', 'Seleccionar departamento', UBICACION_EVENTOS.departamentos[$('pais').value] || [], valor)
  }
  const cargarCiudades = (valor = '') => {
    FormularioEventoView.opciones('ciudad', 'Seleccionar ciudad', UBICACION_EVENTOS.ciudades[$('departamento').value] || [], valor)
  }
  cargarDepartamentos(datos.departamento)
  cargarCiudades(datos.ciudad)
  $('pais').addEventListener('change', () => { cargarDepartamentos(); cargarCiudades() })
  $('departamento').addEventListener('change', () => cargarCiudades())

  // ── Precio con formato de pesos ───────────────────────────────────────────
  $('precio').addEventListener('input', (e) => { e.target.value = formatoPrecio(e.target.value) })

  // ── Al escribir se borra el error de ese campo ────────────────────────────
  form.addEventListener('input', (e) => {
    if (!errores[e.target.id]) return
    delete errores[e.target.id]
    FormularioEventoView.errores(errores)
  })

  // ── Estado del evento ─────────────────────────────────────────────────────
  $('estados').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-estado]')
    if (!chip) return
    estado = chip.dataset.estado
    FormularioEventoView.marcarEstado(estado)
  })

  // ── Imagen (clic o arrastrar y soltar) ────────────────────────────────────
  if (!editar) {
    const zona = $('zona-imagen')
    const input = $('imagen')
    const leer = (archivo) => {
      if (!archivo) return
      imagen = archivo
      const lector = new FileReader()
      lector.onload = (ev) => FormularioEventoView.imagen(ev.target.result)
      lector.readAsDataURL(archivo)
    }
    FormularioEventoView.imagen(null)
    zona.addEventListener('click', (e) => {
      if (e.target.closest('[data-accion="quitar-imagen"]')) {
        e.stopPropagation(); imagen = null; input.value = ''; FormularioEventoView.imagen(null); return
      }
      input.click()
    })
    zona.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click() } })
    zona.addEventListener('dragover', (e) => { e.preventDefault(); zona.classList.add('zona-imagen--arrastrando') })
    zona.addEventListener('dragleave', () => zona.classList.remove('zona-imagen--arrastrando'))
    zona.addEventListener('drop', (e) => { e.preventDefault(); zona.classList.remove('zona-imagen--arrastrando'); leer(e.dataTransfer.files[0]) })
    input.addEventListener('change', () => leer(input.files[0]))
  }

  // ── Botones ───────────────────────────────────────────────────────────────
  form.querySelector('[data-accion="cancelar"]').addEventListener('click', alCancelar)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const valores = {
      nombre: $('nombre').value.trim(),
      descripcion: $('descripcion').value.trim(),
      categoria: $('categoria')?.value || '',
      informacion: $('informacion')?.value || '',
      pais: $('pais').value,
      departamento: $('departamento').value,
      ciudad: $('ciudad').value,
      direccion: $('direccion').value.trim(),
      fecha: $('fecha').value,
      hora: $('hora').value,
      capacidad: $('capacidad').value,
      precio: $('precio').value,
      estado,
      imagen,
    }

    errores = {}
    const obligatorios = editar ? ['nombre'] : OBLIGATORIOS
    obligatorios.forEach(c => { if (!String(valores[c]).trim()) errores[c] = 'Este campo es obligatorio.' })
    if (valores.capacidad && Number(valores.capacidad) < 1) errores.capacidad = 'Ingresa un número válido.'
    FormularioEventoView.errores(errores)
    if (Object.keys(errores).length) {
      form.querySelector('.entrada--error, .selector--error, .area-texto--error')?.focus()
      return
    }
    alGuardar(valores)
  })
}
