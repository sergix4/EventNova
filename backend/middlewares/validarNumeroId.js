// middlewares/validarNumeroId.js
// Revisa que el :id de las rutas de usuarios sea un número de identificación
// válido ANTES de llegar al controlador.
//
// OJO: no se usa validarId.js porque en USUARIO la llave es numero_id, que es
// VARCHAR(20) (puede tener ceros a la izquierda, ej. '0000000001', o letras
// en un pasaporte). Por eso aquí se aceptan letras, números y guiones.
function validarNumeroId(req, res, next, valor) {
  if (!/^[A-Za-z0-9-]{1,20}$/.test(valor)) {
    return res.status(400).json({ error: 'El número de identificación no es válido.' });
  }
  next();
}

module.exports = validarNumeroId;