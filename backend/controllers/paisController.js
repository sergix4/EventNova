// controllers/paisController.js
const PaisModel = require("../models/paisModel");
const { texto } = require("../utils/texto");

const MAX_NOMBRE = 100; // VARCHAR(100) en la tabla PAIS

// Tarea 16: valida el nombre del país. Devuelve { error } o { nombre } ya limpio
function validarNombre(body) {
  const nombre = texto(body.nombre_pais);
  if (!nombre) return { error: "El nombre del país es obligatorio." };
  if (nombre.length > MAX_NOMBRE) {
    return {
      error: `El nombre del país no puede superar ${MAX_NOMBRE} caracteres.`,
    };
  }
  return { nombre };
}

const paisController = {
  async listar(req, res) {
    try {
      const paises = await PaisModel.getAll();
      res.json(paises);
    } catch (error) {
      console.error("Error al listar países:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async obtener(req, res) {
    try {
      const pais = await PaisModel.getById(req.params.id);
      if (!pais) return res.status(404).json({ error: "País no encontrado." });
      res.json(pais);
    } catch (error) {
      console.error("Error al obtener país:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async crear(req, res) {
    const { error, nombre } = validarNombre(req.body);
    if (error) return res.status(400).json({ error });
    try {
      const yaExiste = await PaisModel.existsByNombre(nombre);
      if (yaExiste) {
        return res
          .status(409)
          .json({ error: "Ya existe un país con ese nombre." });
      }
      const pais = await PaisModel.create(nombre);

      res.status(201).json(pais);
    } catch (error) {
      console.error("Error al crear país:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const { error, nombre } = validarNombre(req.body);
    if (error) return res.status(400).json({ error });
    try {
      const yaExiste = await PaisModel.existsByNombre(nombre, id);
      if (yaExiste) {
        return res
          .status(409)
          .json({ error: "Ya existe otro país con ese nombre." });
      }
      const pais = await PaisModel.update(id, nombre);

      if (!pais) return res.status(404).json({ error: "País no encontrado." });
      res.json(pais);
    } catch (error) {
      console.error("Error al actualizar país:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async eliminar(req, res) {
    try {
      const eliminado = await PaisModel.remove(req.params.id);
      if (!eliminado)
        return res.status(404).json({ error: "País no encontrado." });
      res.json({ mensaje: "País eliminado correctamente." });
    } catch (error) {
      if (error.code === "23503") {
        // FK violation: tiene departamentos asociados
        return res.status(409).json({
          error: "No se puede eliminar: el país tiene departamentos asociados.",
        });
      }
      console.error("Error al eliminar país:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },
};

module.exports = paisController;
