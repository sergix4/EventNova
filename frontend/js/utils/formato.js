// js/utils/formato.js
// Funciones pequeñas de apoyo que usan las vistas para mostrar datos.

/** Formato de pesos colombianos: 95000 → "$ 95.000" */
export function cop(valor) {
  return '$ ' + Math.round(valor).toLocaleString('es-CO')
}

/** Número con separador de miles: 3842 → "3.842" */
export function num(valor) {
  return Number(valor).toLocaleString('es-CO')
}

/** Iniciales de un nombre: "Laura García" → "LG" */
export function iniciales(nombre, porDefecto = '?') {
  const texto = (nombre || porDefecto).trim()
  return texto.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

/** Primer nombre: "Laura García" → "Laura" */
export function primerNombre(nombre, porDefecto = '') {
  return (nombre || porDefecto).trim().split(/\s+/)[0]
}

/** Escapa texto antes de meterlo en innerHTML (evita inyección de HTML). */
export function esc(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** "12 sep 2026" → "12 Sep 2026" */
export function capitalizarMes(fecha) {
  return fecha.replace(/^(\d+) (\w+) (\d+)$/, (_, d, m, a) => `${d} ${m.charAt(0).toUpperCase() + m.slice(1)} ${a}`)
}

/** Plural sencillo: plural(3, 'evento') → "eventos" */
export function plural(cantidad, palabra, pluralPalabra = palabra + 's') {
  return cantidad === 1 ? palabra : pluralPalabra
}
