// controllers/homeController.js
// Un "Controller" recibe la peticion (request), habla con el Model si necesita
// datos, y decide que View renderizar. No contiene SQL ni HTML directamente.

const homeController = {
  mostrarInicio(req, res) {
    res.render('index', {
      titulo: 'EventNova - Gestion y Reserva de Eventos',
    });
  },
};

module.exports = homeController;
