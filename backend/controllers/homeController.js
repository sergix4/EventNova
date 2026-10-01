// controllers/homeController.js
// Un "Controller" recibe la peticion (request), habla con el Model si
// necesita datos, y responde. La API responde con JSON: la Vista
// (las paginas HTML de /frontend) es quien decide como se ve esa
// informacion en pantalla.

const homeController = {
  estado(req, res) {
    res.json({
      mensaje: 'API de EventNova funcionando correctamente',
      estado: 'ok',
    });
  },
};

module.exports = homeController;
