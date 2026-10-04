// models/departamentoModel.js
// MODELO de departamentos: consultas SQL sobre la tabla DEPARTAMENTO.
// Cada departamento pertenece a un país (llave foránea id_pais -> PAIS).
const pool = require('../config/db');

// Consulta base: trae el departamento junto con el nombre de su país
const SELECT_BASE = `
  SELECT d.id_departamento, d.id_pais, d.nombre_departamento, p.nombre_pais
  FROM public."DEPARTAMENTO" d
  JOIN public."PAIS" p ON p.id_pais = d.id_pais`;

const DepartamentoModel = {
  async getAll() {
    const result = await pool.query(
      `${SELECT_BASE} ORDER BY p.nombre_pais ASC, d.nombre_departamento ASC`
    );
    return result.rows;
  },

  // Útil para el CRUD de ciudades: departamentos de un solo país
  async getByPais(idPais) {
    const result = await pool.query(
      `${SELECT_BASE} WHERE d.id_pais = $1 ORDER BY d.nombre_departamento ASC`,
      [idPais]
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`${SELECT_BASE} WHERE d.id_departamento = $1`, [id]);
    return result.rows[0];
  },

  // ¿Ya existe ese nombre dentro del MISMO país? (excludeId se usa al editar)
  async existsByNombre(nombre, idPais, excludeId = null) {
    const query = excludeId
      ? 'SELECT 1 FROM public."DEPARTAMENTO" WHERE LOWER(nombre_departamento) = LOWER($1) AND id_pais = $2 AND id_departamento <> $3'
      : 'SELECT 1 FROM public."DEPARTAMENTO" WHERE LOWER(nombre_departamento) = LOWER($1) AND id_pais = $2';
    const params = excludeId ? [nombre, idPais, excludeId] : [nombre, idPais];
    const result = await pool.query(query, params);
    return result.rowCount > 0;
  },

  async create(nombre_departamento, id_pais) {
    const result = await pool.query(
      'INSERT INTO public."DEPARTAMENTO" (nombre_departamento, id_pais) VALUES ($1, $2) RETURNING id_departamento',
      [nombre_departamento, id_pais]
    );
    return this.getById(result.rows[0].id_departamento);
  },

  async update(id, nombre_departamento, id_pais) {
    const result = await pool.query(
      'UPDATE public."DEPARTAMENTO" SET nombre_departamento = $1, id_pais = $2 WHERE id_departamento = $3 RETURNING id_departamento',
      [nombre_departamento, id_pais, id]
    );
    if (result.rowCount === 0) return undefined;
    return this.getById(id);
  },

  async remove(id) {
    const result = await pool.query(
      'DELETE FROM public."DEPARTAMENTO" WHERE id_departamento = $1',
      [id]
    );
    return result.rowCount > 0;
  },
};

module.exports = DepartamentoModel;