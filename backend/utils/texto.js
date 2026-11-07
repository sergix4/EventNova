// utils/texto.js
// Sprint 3 · Tarea 16: lee un campo del body como TEXTO, sin espacios a los lados.
//
// ¿Por qué? Antes se hacía (req.body.correo || '').trim(). Si alguien mandaba
// { "correo": 123 } o { "correo": {} }, .trim() no existe para un número u
// objeto y el servidor completo se caía. Con texto():
//   texto('  hola ')  -> 'hola'
//   texto(123)        -> '123'
//   texto({}) / []    -> ''   (cuenta como vacío y la validación lo rechaza)
function texto(valor) {
  if (typeof valor === "string") return valor.trim();
  if (typeof valor === "number" && Number.isFinite(valor)) return String(valor);
  return "";
}

module.exports = { texto };
