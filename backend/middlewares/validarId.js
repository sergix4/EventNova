     // Revisa que el :id de la URL sea un número entero positivo ANTES de llegar al controlador.
     function validarId(req, res, next, valor) {
       if (!/^\d+$/.test(valor) || Number(valor) <= 0) {
         return res.status(400).json({ error: 'El id debe ser un número entero positivo.' });
       }
       next();
     }
     module.exports = validarId;