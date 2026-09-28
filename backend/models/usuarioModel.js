// models/usuarioModel.js
// Un "Model" en MVC representa una entidad y contiene las consultas SQL
// relacionadas con esa tabla. No conoce nada de HTTP, sesiones ni rutas.
//
// Este Model gestiona el acceso a datos de personas para autenticación:
// buscar un usuario por correo (login) y crear un cliente nuevo (registro).

const pool = require('../config/db');

const UsuarioModel = {
  // Busca un usuario por correo, junto con su rol (cliente/agente/administrador).
  // Si es agente, también trae los datos propios del agente (empresa, descripción y plan).
  async findByEmail(correo) {
    const result = await pool.query(
      `SELECT u.numero_id, u.correo, u.nombre, u.contraseña, u.direccion,
              c.numero_id  AS es_cliente,
              a.numero_id  AS es_agente,
              ad.numero_id AS es_administrador,
              a.nombre_empresa, a.descripcion_agente,
              p.nombre_plan
       FROM public."USUARIO" u
       LEFT JOIN public."CLIENTE" c        ON c.numero_id = u.numero_id
       LEFT JOIN public."AGENTE" a         ON a.numero_id = u.numero_id
       LEFT JOIN public."ADMINISTRADOR" ad ON ad.numero_id = u.numero_id
       LEFT JOIN public."TIPO_PLAN" p      ON p.id_plan = a.id_plan
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
      agente: rol === 'agente'
        ? {
            nombre_empresa: fila.nombre_empresa,
            descripcion_agente: fila.descripcion_agente,
            plan: fila.nombre_plan,
          }
        : null,
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

    // Crea un usuario nuevo y lo registra como Agente, de forma transaccional
   async createAgente({ numero_id, correo, nombre, contraseñaHash, direccion, id_plan, nombre_plan, nombre_empresa, descripcion_agente }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, direccion)
         VALUES ($1, $2, $3, $4, $5)`,
        [numero_id, correo, nombre, contraseñaHash, direccion || null]
      );

      await client.query(
        `INSERT INTO public."AGENTE" (numero_id, id_plan, nombre_empresa, descripcion_agente)
         VALUES ($1, $2, $3, $4)`,
        [numero_id, id_plan, nombre_empresa, descripcion_agente || null]
      );

            await client.query('COMMIT');
      return {
        numero_id,
        correo,
        nombre,
        direccion: direccion || null,
        rol: 'agente',
        agente: {
          nombre_empresa,
          descripcion_agente: descripcion_agente || null,
          plan: nombre_plan,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = UsuarioModel;