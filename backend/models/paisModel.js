// models/paisModel.js
const pool = require('../config/db');

const PaisModel = {
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM public."PAIS" ORDER BY nombre_pais ASC'
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM public."PAIS" WHERE id_pais = $1',
      [id]
    );
    return result.rows[0];
  },

  async existsByNombre(nombre, excludeId = null) {
    const query = excludeId
      ? 'SELECT 1 FROM public."PAIS" WHERE LOWER(nombre_pais) = LOWER($1) AND id_pais <> $2'
      : 'SELECT 1 FROM public."PAIS" WHERE LOWER(nombre_pais) = LOWER($1)';
    const params = excludeId ? [nombre, excludeId] : [nombre];
    const result = await pool.query(query, params);
    return result.rowCount > 0;
  },

  async create(nombre_pais) {
    const result = await pool.query(
      'INSERT INTO public."PAIS" (nombre_pais) VALUES ($1) RETURNING *',
      [nombre_pais]
    );
    return result.rows[0];
  },

  async update(id, nombre_pais) {
    const result = await pool.query(
      'UPDATE public."PAIS" SET nombre_pais = $1 WHERE id_pais = $2 RETURNING *',
      [nombre_pais, id]
    );
    return result.rows[0];
  },

  async remove(id) {
    await pool.query('DELETE FROM public."PAIS" WHERE id_pais = $1', [id]);
  },
};

module.exports = PaisModel;