// models/usuarioModel.js
// Un "Model" en MVC representa una entidad y contiene las consultas SQL
// relacionadas con esa tabla. No conoce nada de HTTP, sesiones ni rutas.
//
// Este Model gestiona el acceso a datos de personas para autenticación:
// buscar un usuario por correo (login) y crear un cliente nuevo (registro).

const pool = require('../config/db');

const UsuarioModel = {
  // Busca un usuario por correo, junto con su rol (cliente/agente/administrador)
  async findByEmail(correo) {
    const result = await pool.query(
        `SELECT u.numero_id, u.correo, u.nombre, u.contraseña, u.direccion,
              c.numero_id  AS es_cliente,
              a.numero_id  AS es_agente,
              ad.numero_id AS es_administrador
       FROM public."USUARIO" u
       LEFT JOIN public."CLIENTE" c        ON c.numero_id = u.numero_id
       LEFT JOIN public."AGENTE" a         ON a.numero_id = u.numero_id
       LEFT JOIN public."ADMINISTRADOR" ad ON ad.numero_id = u.numero_id
       WHERE u.correo = $1`,
      [correo]
    );

    const fila = result.rows[0];
    if (!fila) return null;

    let rol = null;
    if (fila.es_cliente) rol = 'cliente';
    else if (fila.es_agente) rol = 'agente';
    else if (fila.es_administrador) rol = 'administrador';

       return {
      numero_id: fila.numero_id,
      correo: fila.correo,
      nombre: fila.nombre,
      direccion: fila.direccion,
      contraseña: fila.contraseña, // hash — solo se usa dentro del backend
      rol,
    };
  },

  // Verifica si ya existe un usuario con ese correo o ese número de identificación
  async existsByEmailOrId(correo, numero_id) {
    const result = await pool.query(
      `SELECT 1 FROM public."USUARIO" WHERE correo = $1 OR numero_id = $2 LIMIT 1`,
      [correo, numero_id]
    );
    return result.rowCount > 0;
  },

  // Crea un usuario nuevo y lo registra como Cliente, de forma transaccional
  async createCliente({ numero_id, correo, nombre, contraseñaHash, direccion }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, direccion)
         VALUES ($1, $2, $3, $4, $5)`,
        [numero_id, correo, nombre, contraseñaHash, direccion || null]
      );

      const codigoCliente = `CLI-${numero_id}`;
      await client.query(
        `INSERT INTO public."CLIENTE" (numero_id, codigo_cliente)
         VALUES ($1, $2)`,
        [numero_id, codigoCliente]
      );

  await client.query('COMMIT');
      return { numero_id, correo, nombre, direccion: direccion || null, rol: 'cliente' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = UsuarioModel;