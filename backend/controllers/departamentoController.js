// controllers/departamentoController.js
// CONTROLADOR de departamentos: valida lo que llega y decide qué responder.
const DepartamentoModel = require('../models/departamentoModel');
const PaisModel = require('../models/paisModel');

// Valida y limpia el body. Devuelve { error } o { nombre, idPais }
function validar(body) {
  const nombre = (body.nombre_departamento || '').trim();
  const idPais = Number(body.id_pais);
  if (!nombre) return { error: 'El nombre del departamento es obligatorio.' };
  if (!Number.isInteger(idPais) || idPais <= 0) return { error: 'Debes seleccionar un país.' };
  return { nombre, idPais };
}

const departamentoController = {
  async listar(req, res) {
    try {
      const { id_pais } = req.query; // opcional: /api/departamentos?id_pais=1
      const departamentos = id_pais
        ? await DepartamentoModel.getByPais(Number(id_pais))
        : await DepartamentoModel.getAll();
      res.json(departamentos);
    } catch (error) {
      console.error('Error al listar departamentos:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async obtener(req, res) {
    try {
      const departamento = await DepartamentoModel.getById(req.params.id);
      if (!departamento) return res.status(404).json({ error: 'Departamento no encontrado.' });
      res.json(departamento);
    } catch (error) {
      console.error('Error al obtener departamento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async crear(req, res) {
    const { error, nombre, idPais } = validar(req.body);
    if (error) return res.status(400).json({ error });
    try {
      if (!(await PaisModel.getById(idPais))) {
        return res.status(400).json({ error: 'El país seleccionado no existe.' });
      }
      if (await DepartamentoModel.existsByNombre(nombre, idPais)) {
        return res.status(409).json({ error: 'Ya existe un departamento con ese nombre en ese país.' });
      }
      const departamento = await DepartamentoModel.create(nombre, idPais);
      res.status(201).json(departamento);
    } catch (error) {
      console.error('Error al crear departamento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const { error, nombre, idPais } = validar(req.body);
    if (error) return res.status(400).json({ error });
    try {
      if (!(await PaisModel.getById(idPais))) {
        return res.status(400).json({ error: 'El país seleccionado no existe.' });
      }
      if (await DepartamentoModel.existsByNombre(nombre, idPais, id)) {
        return res.status(409).json({ error: 'Ya existe otro departamento con ese nombre en ese país.' });
      }
      const departamento = await DepartamentoModel.update(id, nombre, idPais);
      if (!departamento) return res.status(404).json({ error: 'Departamento no encontrado.' });
      res.json(departamento);
    } catch (error) {
      console.error('Error al actualizar departamento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async eliminar(req, res) {
    try {
      const eliminado = await DepartamentoModel.remove(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Departamento no encontrado.' });
      res.json({ mensaje: 'Departamento eliminado correctamente.' });
    } catch (error) {
      if (error.code === '23503') { // FK violation: tiene ciudades asociadas
        return res.status(409).json({ error: 'No se puede eliminar: el departamento tiene ciudades asociadas.' });
      }
      console.error('Error al eliminar departamento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },
};

module.exports = departamentoController;