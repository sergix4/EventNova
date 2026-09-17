// models/paisModel.js
// Un "Model" en MVC representa una entidad y contiene las consultas SQL
// relacionadas con esa tabla. No conoce nada de HTML ni de rutas HTTP.

const pool = require('../config/db');

const PaisModel = {
  // Obtener todos los paises
  async getAll() {
    const result = await pool.query('SELECT * FROM pais ORDER BY nombre ASC');
    return result.rows;
  },

  // Obtener un pais por su id
  async getById(id) {
    const result = await pool.query('SELECT * FROM pais WHERE id_pais = $1', [id]);
    return result.rows[0];
  },

  // Crear un nuevo pais
  async create(nombre) {
    const result = await pool.query(
      'INSERT INTO pais (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  },

  // Actualizar un pais existente
  async update(id, nombre) {
    const result = await pool.query(
      'UPDATE pais SET nombre = $1 WHERE id_pais = $2 RETURNING *',
      [nombre, id]
    );
    return result.rows[0];
  },

  // Eliminar un pais
  async remove(id) {
    await pool.query('DELETE FROM pais WHERE id_pais = $1', [id]);
  },
};

module.exports = PaisModel;
