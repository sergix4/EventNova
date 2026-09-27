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