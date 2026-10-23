// js/controllers/agente/formularioEventoController.js
// CONTROLADOR reutilizable del formulario de evento (registrar y editar):
// ubicación en cascada desde PostgreSQL (/api/paises, /departamentos, /ciudades),
// formato del precio, estado, imagen y validación.

import { peticion } from '../../models/api.js'
import { CiudadModel } from '../../models/ciudadModel.js'
import { EventoModel } from '../../models/eventoModel.js'
import { FormularioEventoView } from '../../views/agente/formularioEventoView.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const OBLIGATORIOS = ['nombre', 'descripcion', 'pais', 'departamento', 'ciudad', 'teatro', 'direccion', 'fecha', 'hora', 'fecha_fin', 'hora_fin', 'capacidad', 'precio']

/** "85000" → "$ 85.000" */
function formatoPrecio(texto) {
  const digitos = String(texto ?? '').replace(/\D/g, '')
  return digitos ? '$ ' + Number(digitos).toLocaleString('es-CO') : ''
}

/** "$ 85.000" → 85000 */
function limpiarPrecio(texto) {
  if (String(texto).trim().toLowerCase() === 'gratis') return 0
  const digitos = String(texto ?? '').replace(/\D/g, '')
  return digitos === '' ? NaN : Number(digitos)
}

/**
 * Dibuja el formulario dentro de "contenedor" y conecta sus eventos.
 * @param {HTMLElement} contenedor
 * @param {object} opciones { modo: 'registrar'|'editar', datos, alGuardar(payload), alCancelar() }
 */
export async function montarFormulario(contenedor, { modo, datos = {}, alGuardar, alCancelar }) {
  const editar = modo === 'editar'
  let estado = datos.estado || 'Programado'
  let imagenDataUrl = datos.imagen_evento || null
  let errores = {}
  let listaEstados = []
  let listaPaises = []

  try {
    const [paisesBD, estadosBD] = await Promise.all([
      peticion('/paises'),
      EventoModel.listarEstados(),
    ])
    listaPaises = paisesBD.map(p => ({ valor: p.id_pais, texto: p.nombre_pais }))
    listaEstados = estadosBD
  } catch (err) {
    mostrarToast(err.message || 'Error al cargar catálogos de ubicación.', { tipo: 'error' })
  }

  // Si es un registro nuevo y existe Colombia en la lista, lo preseleccionamos para ahorrar clics
  if (!editar && !datos.id_pais) {
    const colombia = listaPaises.find(p => p.texto.toLowerCase() === 'colombia')
    if (colombia) datos.id_pais = colombia.valor
  }

  contenedor.innerHTML = FormularioEventoView.html({
    modo,
    datos,
    paises: listaPaises,
    estados: listaEstados,
  })

  const $ = (id) => document.getElementById(id)
  const form = $('form-evento')

  // ── Ubicación en cascada (País -> Departamento -> Ciudad) ─────────────────
  const cargarDepartamentos = async (idPais, idDepSeleccionado = '') => {
    if (!idPais) {
      FormularioEventoView.opciones('departamento', 'Seleccionar departamento', [])
      FormularioEventoView.opciones('ciudad', 'Seleccionar ciudad', [])
      return
    }
    try {
      const deps = await peticion(`/departamentos?id_pais=${idPais}`)
      const opciones = deps.map(d => ({ valor: d.id_departamento, texto: d.nombre_departamento }))
      FormularioEventoView.opciones('departamento', 'Seleccionar departamento', opciones, idDepSeleccionado)
    } catch {
      FormularioEventoView.opciones('departamento', 'Seleccionar departamento', [])
    }
  }

  const cargarCiudades = async (idDepartamento, idCiudadSeleccionada = '') => {
    if (!idDepartamento) {
      FormularioEventoView.opciones('ciudad', 'Seleccionar ciudad', [])
      return
    }
    try {
      const ciudades = await CiudadModel.listar(idDepartamento)
      const opciones = ciudades.map(c => ({ valor: c.id_ciudad, texto: c.nombre_ciudad }))
      FormularioEventoView.opciones('ciudad', 'Seleccionar ciudad', opciones, idCiudadSeleccionada)
    } catch {
      FormularioEventoView.opciones('ciudad', 'Seleccionar ciudad', [])
    }
  }

  // Carga inicial de selectores encadenados
  await cargarDepartamentos($('pais').value, datos.id_departamento)
  await cargarCiudades($('departamento').value, datos.id_ciudad)

  $('pais').addEventListener('change', async () => {
    await cargarDepartamentos($('pais').value)
    await cargarCiudades('')
  })
  $('departamento').addEventListener('change', async () => {
    await cargarCiudades($('departamento').value)
  })

  // ── Sincronizar fecha_fin mínima con fecha de inicio ──────────────────────
  $('fecha').addEventListener('change', () => {
    if ($('fecha').value && (!$('fecha_fin').value || $('fecha_fin').value < $('fecha').value)) {
      $('fecha_fin').value = $('fecha').value
    }
  })

  // ── Precio con formato de pesos ───────────────────────────────────────────
  if (datos.precio_base !== undefined) {
    $('precio').value = formatoPrecio(datos.precio_base)
  }
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
    // Al registrar un evento nuevo, la regla de negocio exige que nazca en "Programado"
    if (!editar && chip.dataset.estado !== 'Programado') {
      mostrarToast('Un evento nuevo siempre se crea en estado Programado.', { duracion: 2200 })
      return
    }
    estado = chip.dataset.estado
    FormularioEventoView.marcarEstado(estado)
  })

  // ── Imagen (clic o arrastrar y soltar) ────────────────────────────────────
  const zona = $('zona-imagen')
  const input = $('imagen')
  if (zona && input) {
    const leer = (archivo) => {
      if (!archivo) return
      if (archivo.size > 2 * 1024 * 1024) {
        mostrarToast('La imagen no puede pesar más de 2 MB.', { tipo: 'error' })
        return
      }
      const lector = new FileReader()
      lector.onload = (ev) => {
        imagenDataUrl = ev.target.result
        FormularioEventoView.imagen(imagenDataUrl)
      }
      lector.readAsDataURL(archivo)
    }
    FormularioEventoView.imagen(imagenDataUrl)
    zona.addEventListener('click', (e) => {
      if (e.target.closest('[data-accion="quitar-imagen"]')) {
        e.stopPropagation(); imagenDataUrl = null; input.value = ''; FormularioEventoView.imagen(null); return
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const valores = {
      nombre: $('nombre').value.trim(),
      descripcion: $('descripcion').value.trim(),
      informacion: $('informacion')?.value.trim() || '',
      pais: $('pais').value,
      departamento: $('departamento').value,
      ciudad: $('ciudad').value,
      teatro: $('teatro').value.trim(),
      direccion: $('direccion').value.trim(),
      fecha: $('fecha').value,
      hora: $('hora').value,
      fecha_fin: $('fecha_fin').value,
      hora_fin: $('hora_fin').value,
      capacidad: $('capacidad').value,
      precio: $('precio').value,
      causa_cancelacion: $('causa_cancelacion')?.value.trim() || '',
    }

    errores = {}
    OBLIGATORIOS.forEach(c => { if (!String(valores[c] || '').trim()) errores[c] = 'Este campo es obligatorio.' })

    if (valores.capacidad && (!Number.isInteger(Number(valores.capacidad)) || Number(valores.capacidad) < 1)) {
      errores.capacidad = 'La capacidad debe ser un entero mayor a 0.'
    }

    const precioNum = limpiarPrecio(valores.precio)
    if (Number.isNaN(precioNum) || precioNum < 0) {
      errores.precio = 'Ingresa un precio válido.'
    }

    const fechaInicioISO = valores.fecha && valores.hora ? `${valores.fecha}T${valores.hora}:00` : ''
    const fechaFinISO = valores.fecha_fin && valores.hora_fin ? `${valores.fecha_fin}T${valores.hora_fin}:00` : ''
    if (fechaInicioISO && fechaFinISO && Date.parse(fechaFinISO) <= Date.parse(fechaInicioISO)) {
      errores.fecha_fin = 'La fecha/hora de fin debe ser posterior al inicio.'
    }

    if (editar && estado === 'Cancelado' && !valores.causa_cancelacion) {
      errores.causa_cancelacion = 'Debes indicar la causa de cancelación.'
    }

    FormularioEventoView.errores(errores)
    if (Object.keys(errores).length) {
      form.querySelector('.entrada--error, .selector--error, .area-texto--error')?.focus()
      return
    }

    const estadoObj = listaEstados.find(s => s.nombre_estado === estado)

    // Objeto listo con los nombres exactos de columnas que espera backend/controllers/eventoController.js
    const payload = {
      nombre_evento: valores.nombre,
      descripcion_evento: valores.descripcion,
      observaciones: valores.informacion || null,
      teatro: valores.teatro,
      direccion_evento: valores.direccion,
      id_ciudad: Number(valores.ciudad),
      fecha_inicio: fechaInicioISO,
      fecha_fin: fechaFinISO,
      capacidad: Number(valores.capacidad),
      precio_base: precioNum,
      imagen_evento: imagenDataUrl || null,
      estado,
      id_estado: estadoObj ? estadoObj.id_estado : null,
      causa_cancelacion: estado === 'Cancelado' ? valores.causa_cancelacion : null,
    }

    try {
      await alGuardar(payload)
    } catch (err) {
      mostrarToast(err.message || 'No se pudo guardar el evento.', { tipo: 'error' })
    }
  })
}