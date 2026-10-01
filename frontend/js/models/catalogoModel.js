// js/models/catalogoModel.js
// MODELO con listas de apoyo para los formularios (países, departamentos,
// ciudades, categorías, estados y planes).
//
// Son las mismas listas del prototipo. Cuando estén los CRUD de
// departamentos y ciudades en el backend, estas listas se reemplazan por
// peticiones a /api/paises, /api/departamentos y /api/ciudades.

// Formulario de registro de usuarios
export const UBICACION_REGISTRO = {
  paises: ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Venezuela', 'España'],
  departamentos: {
    Colombia: ['Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Cundinamarca', 'Nariño', 'Santander', 'Valle del Cauca'],
    México: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
    Argentina: ['Buenos Aires', 'Córdoba', 'Mendoza', 'Rosario'],
    Chile: ['Metropolitana', 'Valparaíso', 'Biobío'],
    Perú: ['Lima', 'Arequipa', 'Cusco'],
    Ecuador: ['Pichincha', 'Guayas', 'Azuay'],
    Venezuela: ['Caracas', 'Zulia', 'Carabobo'],
    España: ['Madrid', 'Cataluña', 'Andalucía'],
  },
  ciudades: {
    Antioquia: ['Medellín', 'Bello', 'Envigado', 'Itagüí'],
    Atlántico: ['Barranquilla', 'Soledad', 'Malambo'],
    'Bogotá D.C.': ['Bogotá'],
    Bolívar: ['Cartagena', 'Magangué'],
    Boyacá: ['Tunja', 'Duitama', 'Sogamoso'],
    Caldas: ['Manizales', 'La Dorada'],
    Cundinamarca: ['Soacha', 'Zipaquirá', 'Facatativá'],
    Nariño: ['Pasto', 'Ipiales'],
    Santander: ['Bucaramanga', 'Floridablanca', 'Girón'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
    'Ciudad de México': ['CDMX Centro', 'Tlalpan', 'Coyoacán'],
    Jalisco: ['Guadalajara', 'Zapopan'],
    'Buenos Aires': ['CABA', 'La Plata', 'Mar del Plata'],
    Lima: ['Lima Centro', 'Miraflores', 'San Isidro'],
    Pichincha: ['Quito', 'Cayambe'],
    Madrid: ['Madrid', 'Alcalá de Henares'],
  },
}

// Formularios de registrar / editar evento (agente)
export const UBICACION_EVENTOS = {
  paises: ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador'],
  departamentos: {
    Colombia: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Caldas', 'Cundinamarca', 'Santander'],
    México: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
    Argentina: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza'],
    Chile: ['Región Metropolitana', 'Valparaíso', 'Biobío'],
    Perú: ['Lima', 'Arequipa', 'Cusco'],
    Ecuador: ['Pichincha', 'Guayas', 'Azuay'],
  },
  ciudades: {
    'Bogotá D.C.': ['Bogotá'],
    Antioquia: ['Medellín', 'Envigado', 'Bello', 'Itagüí'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
    Atlántico: ['Barranquilla', 'Soledad'],
    Caldas: ['Manizales', 'Chinchiná'],
    Cundinamarca: ['Chía', 'Zipaquirá', 'Fusagasugá'],
    Santander: ['Bucaramanga', 'Floridablanca'],
    'Ciudad de México': ['Ciudad de México'],
    Jalisco: ['Guadalajara', 'Zapopan'],
    'Nuevo León': ['Monterrey', 'San Nicolás'],
    Puebla: ['Puebla de Zaragoza'],
    'Buenos Aires': ['Buenos Aires', 'Mar del Plata'],
    Córdoba: ['Córdoba'],
    'Santa Fe': ['Rosario', 'Santa Fe'],
    Mendoza: ['Mendoza'],
    'Región Metropolitana': ['Santiago'],
    Valparaíso: ['Valparaíso', 'Viña del Mar'],
    Biobío: ['Concepción'],
    Lima: ['Lima'],
    Arequipa: ['Arequipa'],
    Cusco: ['Cusco'],
    Pichincha: ['Quito'],
    Guayas: ['Guayaquil'],
    Azuay: ['Cuenca'],
  },
}

export const ESTADOS_EVENTO = ['Programado', 'En boletería', 'En vivo', 'Finalizado', 'Cancelado']
export const CATEGORIAS_EVENTO = ['Concierto', 'Festival', 'Teatro', 'Deporte', 'Comedia', 'Conferencia', 'Exposición', 'Otro']

// Planes de los agentes (coinciden con la tabla TIPO_PLAN y seed_planes.sql)
export const PLANES = [
  { clave: 'basico', nombre: 'Plan Básico', precio: '$29.900 COP', precioCorto: '$29.900',
    beneficios: ['Hasta 5 eventos activos', 'Gestión de reservas', 'Panel de eventos', 'Soporte básico'] },
  { clave: 'profesional', nombre: 'Plan Profesional', precio: '$49.900 COP', precioCorto: '$49.900', recomendado: true,
    beneficios: ['Hasta 20 eventos activos', 'Gestión de reservas', 'Panel de eventos', 'Estadísticas básicas', 'Soporte prioritario'] },
  { clave: 'empresa', nombre: 'Plan Empresa', precio: '$89.900 COP', precioCorto: '$89.900',
    beneficios: ['Eventos activos ilimitados', 'Gestión avanzada de reservas', 'Reportes avanzados', 'Múltiples usuarios', 'Soporte prioritario'] },
]
