// controllers/ciudadController.js
// CONTROLADOR de ciudades: valida lo que llega y decide qué responder.
const CiudadModel = require('../models/ciudadModel');
const DepartamentoModel = require('../models/departamentoModel');

// Valida y limpia el body. Devuelve { error } o { nombre, idDepartamento }
function validar(body) {
  const nombre = (body.nombre_ciudad || '').trim();
  const idDepartamento = Number(body.id_departamento);
  if (!nombre) return { error: 'El nombre de la ciudad es obligatorio.' };
  if (!Number.isInteger(idDepartamento) || idDepartamento <= 0) {
    return { error: 'Debes seleccionar un departamento.' };
  }
  return { nombre, idDepartamento };
}

const ciudadController = {
  async listar(req, res) {
    try {
      const { id_departamento } = req.query; // opcional: /api/ciudades?id_departamento=1
      const ciudades = id_departamento
        ? await CiudadModel.getByDepartamento(Number(id_departamento))
        : await CiudadModel.getAll();
      res.json(ciudades);
    } catch (error) {
      console.error('Error al listar ciudades:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async obtener(req, res) {
    try {
      const ciudad = await CiudadModel.getById(req.params.id);
      if (!ciudad) return res.status(404).json({ error: 'Ciudad no encontrada.' });
      res.json(ciudad);
    } catch (error) {
      console.error('Error al obtener ciudad:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async crear(req, res) {
    const { error, nombre, idDepartamento } = validar(req.body);
    if (error) return res.status(400).json({ error });
    try {
      if (!(await DepartamentoModel.getById(idDepartamento))) {
        return res.status(400).json({ error: 'El departamento seleccionado no existe.' });
      }
      if (await CiudadModel.existsByNombre(nombre, idDepartamento)) {
        return res.status(409).json({ error: 'Ya existe una ciudad con ese nombre en ese departamento.' });
      }
      const ciudad = await CiudadModel.create(nombre, idDepartamento);
      res.status(201).json(ciudad);
    } catch (error) {
      console.error('Error al crear ciudad:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const { error, nombre, idDepartamento } = validar(req.body);
    if (error) return res.status(400).json({ error });
    try {
      if (!(await DepartamentoModel.getById(idDepartamento))) {
        return res.status(400).json({ error: 'El departamento seleccionado no existe.' });
      }
      if (await CiudadModel.existsByNombre(nombre, idDepartamento, id)) {
        return res.status(409).json({ error: 'Ya existe otra ciudad con ese nombre en ese departamento.' });
      }
      const ciudad = await CiudadModel.update(id, nombre, idDepartamento);
      if (!ciudad) return res.status(404).json({ error: 'Ciudad no encontrada.' });
      res.json(ciudad);
    } catch (error) {
      console.error('Error al actualizar ciudad:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async eliminar(req, res) {
    try {
      const eliminada = await CiudadModel.remove(req.params.id);
      if (!eliminada) return res.status(404).json({ error: 'Ciudad no encontrada.' });
      res.json({ mensaje: 'Ciudad eliminada correctamente.' });
    } catch (error) {
      if (error.code === '23503') { // FK violation: hay usuarios que viven en esa ciudad
        return res.status(409).json({ error: 'No se puede eliminar: la ciudad tiene usuarios asociados.' });
      }
      console.error('Error al eliminar ciudad:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },
};

module.exports = ciudadController;