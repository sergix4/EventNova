// js/models/api.js
// Punto único de comunicación con el backend (Express + PostgreSQL).
// Todos los Modelos del frontend usan esta función para hacer peticiones.
// Como las páginas y la API salen del mismo servidor, basta con rutas
// relativas que empiezan por /api.

const API_URL = '/api'

const LOGIN_URL = new URL('../../pages/login.html', import.meta.url).href

// M2: si la sesión se vence o la cuenta es suspendida con la página abierta,
// se manda al login (una sola vez, aunque fallen varias peticiones a la vez).
let redirigiendo = false
function irAlLogin(aviso) {
  if (redirigiendo || window.location.pathname.endsWith('/pages/login.html')) return
  redirigiendo = true
  try { sessionStorage.setItem('eventnova-aviso', aviso) } catch {}
  window.location.replace(LOGIN_URL)
}

/**
 * Hace una petición a la API y devuelve el JSON de la respuesta.
 * Si el servidor responde con error, lanza un Error con el mensaje del backend.
 */
export async function peticion(ruta, { metodo = 'GET', datos } = {}) {
  const opciones = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', // envía la cookie de sesión
  }
  if (datos !== undefined) opciones.body = JSON.stringify(datos)

  let respuesta
  try {
    respuesta = await fetch(API_URL + ruta, opciones)
  } catch {
    throw new Error('No se pudo conectar con el servidor de EventNova.')
  }

  const json = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    // M2: 401 = sin sesión o cuenta suspendida (el login fallido no cuenta)
    if (respuesta.status === 401 && ruta !== '/auth/login') {
      irAlLogin(json.codigo === 'CUENTA_SUSPENDIDA' ? 'suspendida' : 'sesion')
    }
    const error = new Error(json.error || 'Ocurrió un error inesperado')
    error.status = respuesta.status
    throw error
  }
  return json
}
