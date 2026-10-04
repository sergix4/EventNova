// models/ciudadModel.js
// MODELO de ciudades: consultas SQL sobre la tabla CIUDAD.
// Cada ciudad pertenece a un departamento (id_departamento -> DEPARTAMENTO),
// y cada departamento a un país.
const pool = require('../config/db');

// Consulta base: la ciudad junto con su departamento y su país
const SELECT_BASE = `
  SELECT c.id_ciudad, c.id_departamento, c.nombre_ciudad,
         d.nombre_departamento, d.id_pais, p.nombre_pais
  FROM public."CIUDAD" c
  JOIN public."DEPARTAMENTO" d ON d.id_departamento = c.id_departamento
  JOIN public."PAIS" p ON p.id_pais = d.id_pais`;

const CiudadModel = {
  async getAll() {
    const result = await pool.query(
      `${SELECT_BASE} ORDER BY p.nombre_pais ASC, d.nombre_departamento ASC, c.nombre_ciudad ASC`
    );
    return result.rows;
  },

  // Útil para llenar selects de ciudad filtrados por departamento
  async getByDepartamento(idDepartamento) {
    const result = await pool.query(
      `${SELECT_BASE} WHERE c.id_departamento = $1 ORDER BY c.nombre_ciudad ASC`,
      [idDepartamento]
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`${SELECT_BASE} WHERE c.id_ciudad = $1`, [id]);
    return result.rows[0];
  },

  // ¿Ya existe ese nombre dentro del MISMO departamento? (excludeId se usa al editar)
  async existsByNombre(nombre, idDepartamento, excludeId = null) {
    const query = excludeId
      ? 'SELECT 1 FROM public."CIUDAD" WHERE LOWER(nombre_ciudad) = LOWER($1) AND id_departamento = $2 AND id_ciudad <> $3'
      : 'SELECT 1 FROM public."CIUDAD" WHERE LOWER(nombre_ciudad) = LOWER($1) AND id_departamento = $2';
    const params = excludeId ? [nombre, idDepartamento, excludeId] : [nombre, idDepartamento];
    const result = await pool.query(query, params);
    return result.rowCount > 0;
  },

  async create(nombre_ciudad, id_departamento) {
    const result = await pool.query(
      'INSERT INTO public."CIUDAD" (nombre_ciudad, id_departamento) VALUES ($1, $2) RETURNING id_ciudad',
      [nombre_ciudad, id_departamento]
    );
    return this.getById(result.rows[0].id_ciudad);
  },

  async update(id, nombre_ciudad, id_departamento) {
    const result = await pool.query(
      'UPDATE public."CIUDAD" SET nombre_ciudad = $1, id_departamento = $2 WHERE id_ciudad = $3 RETURNING id_ciudad',
      [nombre_ciudad, id_departamento, id]
    );
    if (result.rowCount === 0) return undefined;
    return this.getById(id);
  },

  async remove(id) {
    const result = await pool.query('DELETE FROM public."CIUDAD" WHERE id_ciudad = $1', [id]);
    return result.rowCount > 0;
  },
};

module.exports = CiudadModel;