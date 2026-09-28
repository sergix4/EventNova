// src/services/api.ts
// Centraliza la comunicacion con el backend (la API de EventNova).
// En una app de React esto cumple el rol de "Controller" del lado del
// frontend: le pide datos reales al servidor y se los entrega a las
// paginas (Vistas) para que los muestren.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface UsuarioSesion {
  numero_id: string
  correo: string
  nombre: string
  direccion?: string | null
  rol: 'cliente' | 'agente' | 'administrador'
  // Solo viene lleno cuando el rol es 'agente'
  agente?: {
    nombre_empresa: string
    descripcion_agente: string | null
    plan: string
  } | null
}

export async function getEstadoApi() {
  const respuesta = await fetch(`${API_URL}/status`)
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar con la API de EventNova')
  }
  return respuesta.json()
}

export async function loginApi(correo: string, contraseña: string): Promise<{ mensaje: string; usuario: UsuarioSesion }> {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ correo, contraseña }),
  })

  const data = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(data.error || 'No se pudo iniciar sesión')
  }
  return data
}

export async function registerClienteApi(datos: {
  identificacion: string
  nombre: string
  correo: string
  password: string
  direccion?: string
}): Promise<{ mensaje: string; usuario: UsuarioSesion }> {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos),
  })

  const data = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(data.error || 'No se pudo crear la cuenta')
  }
  return data
}

export async function registerAgenteApi(datos: {
  identificacion: string
  nombre: string
  correo: string
  password: string
  direccion?: string
  empresa: string
  descripcionNegocio?: string
  plan: 'basico' | 'profesional' | 'empresa'
}): Promise<{ mensaje: string; usuario: UsuarioSesion }> {
  const respuesta = await fetch(`${API_URL}/auth/register-agente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos),
  })

  const data = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(data.error || 'No se pudo crear la cuenta de agente')
  }
  return data
}

// ─── Ubicación geográfica: Países ──────────────────────────────────────────

export interface Pais {
  id_pais: number
  nombre_pais: string
}

async function manejarRespuesta(respuesta: Response) {
  const data = await respuesta.json()
  if (!respuesta.ok) {
    throw new Error(data.error || 'Ocurrió un error inesperado')
  }
  return data
}

export function getPaisesApi(): Promise<Pais[]> {
  return fetch(`${API_URL}/paises`).then(manejarRespuesta)
}

export function crearPaisApi(nombre_pais: string): Promise<Pais> {
  return fetch(`${API_URL}/paises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_pais }),
  }).then(manejarRespuesta)
}

export function actualizarPaisApi(id: number, nombre_pais: string): Promise<Pais> {
  return fetch(`${API_URL}/paises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_pais }),
  }).then(manejarRespuesta)
}

export function eliminarPaisApi(id: number): Promise<{ mensaje: string }> {
  return fetch(`${API_URL}/paises/${id}`, { method: 'DELETE' }).then(manejarRespuesta)
}