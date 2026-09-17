// src/services/api.ts
// Este archivo centraliza la comunicacion con el backend (la API de
// EventNova). En una app de React esto cumple el rol de "Controller" del
// lado del frontend: es quien le pide datos reales al servidor y se los
// entrega a las paginas (Vistas) para que los muestren.
//
// Por ahora las paginas siguen usando datos de ejemplo (sharedData.ts).
// A medida que se construyan los endpoints reales en el backend
// (/api/paises, /api/eventos, /api/reservas, etc.) se iran reemplazando
// esos datos de ejemplo por llamadas a las funciones de aqui.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function getEstadoApi() {
  const respuesta = await fetch(`${API_URL}/status`)
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar con la API de EventNova')
  }
  return respuesta.json()
}

// Ejemplo de como se veran los proximos servicios (aun no implementados):
// export async function getEventos() {
//   const respuesta = await fetch(`${API_URL}/eventos`)
//   return respuesta.json()
// }
