// js/utils/formato.js
// Funciones pequeñas de apoyo que usan las vistas para mostrar datos.

/** Formato de pesos colombianos: 95000 → "$ 95.000" */
export function cop(valor) {
  return "$ " + Math.round(valor).toLocaleString("es-CO");
}

/** Número con separador de miles: 3842 → "3.842" */
export function num(valor) {
  return Number(valor).toLocaleString("es-CO");
}

/** Iniciales de un nombre: "Laura García" → "LG" */
export function iniciales(nombre, porDefecto = "?") {
  const texto = (nombre || porDefecto).trim();
  return texto
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/** Primer nombre: "Laura García" → "Laura" */
export function primerNombre(nombre, porDefecto = "") {
  return (nombre || porDefecto).trim().split(/\s+/)[0];
}

/** Escapa texto antes de meterlo en innerHTML (evita inyección de HTML). */
export function esc(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "12 sep 2026" → "12 Sep 2026" */
export function capitalizarMes(fecha) {
  return fecha.replace(
    /^(\d+) (\w+) (\d+)$/,
    (_, d, m, a) => `${d} ${m.charAt(0).toUpperCase() + m.slice(1)} ${a}`,
  );
}

/** Plural sencillo: plural(3, 'evento') → "eventos" */
export function plural(cantidad, palabra, pluralPalabra = palabra + "s") {
  return cantidad === 1 ? palabra : pluralPalabra;
}

/** Tarea 13: "2026-01-05 09:00" (o "2026-01-05") → "5 de enero de 2026" */
export function fechaLarga(texto) {
  if (!texto) return "";
  const fecha = new Date(`${String(texto).slice(0, 10)}T00:00:00`);
  return Number.isNaN(fecha.getTime())
    ? ""
    : fecha.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

/** Tarea 13: fecha ISO → "5 nov 2026, 2:15 p. m." */
export function fechaHora(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? ""
    : fecha.toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

/** Tarea 15: tiempo transcurrido para la campana → "Hace 5 min", "Ayer", "3 nov 2026" */
export function haceCuanto(fecha) {
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(d.getTime())) return "";
  const minutos = Math.floor((Date.now() - d.getTime()) / 60000);
  if (minutos < 1) return "Justo ahora";
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  return capitalizarMes(
    d
      .toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(".", ""),
  );
}
