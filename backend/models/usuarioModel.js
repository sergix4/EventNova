// models/usuarioModel.js
// Un "Model" en MVC representa una entidad y contiene las consultas SQL
// relacionadas con esa tabla. No conoce nada de HTTP, sesiones ni rutas.
//
// Este Model gestiona el acceso a datos de personas para autenticación:
// buscar un usuario por correo (login) y crear un cliente nuevo (registro).

const pool = require('../config/db');

// Inserta el USUARIO y su teléfono. Se llama dentro de una transacción ya abierta.
async function insertarUsuarioBase(client, { numero_id, correo, nombre, contraseñaHash, direccion, id_ciudad, telefono }) {
  await client.query(
    `INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, direccion, id_ciudad)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [numero_id, correo, nombre, contraseñaHash, direccion || null, id_ciudad]
  );
  await client.query(
    `INSERT INTO public."TELEFONOS" (numero_id, telefono) VALUES ($1, $2)`,
    [numero_id, telefono]
  );
}

// Trae el teléfono y la ciudad de un usuario (para mostrarlos en "Mi perfil").
// 'db' puede ser el pool o un client de una transacción abierta.
async function obtenerContacto(db, numero_id) {
  const result = await db.query(
    `SELECT (SELECT MIN(t.telefono) FROM public."TELEFONOS" t WHERE t.numero_id = u.numero_id) AS telefono,
            u.id_ciudad,
            c.nombre_ciudad,
            d.nombre_departamento,
            p.nombre_pais
     FROM public."USUARIO" u
     LEFT JOIN public."CIUDAD" c       ON c.id_ciudad = u.id_ciudad
     LEFT JOIN public."DEPARTAMENTO" d ON d.id_departamento = c.id_departamento
     LEFT JOIN public."PAIS" p         ON p.id_pais = d.id_pais
     WHERE u.numero_id = $1`,
    [numero_id]
  );
  const fila = result.rows[0] || {};
  return {
    telefono: fila.telefono || null,
    id_ciudad: fila.id_ciudad || null,
    ciudad: fila.nombre_ciudad || null,
    departamento: fila.nombre_departamento || null,
    pais: fila.nombre_pais || null,
  };
}

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

        const contacto = await obtenerContacto(pool, fila.numero_id);

    return {
      numero_id: fila.numero_id,
      correo: fila.correo,
      nombre: fila.nombre,
      direccion: fila.direccion,
      ...contacto, // telefono, id_ciudad, ciudad
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
  // Crea un usuario nuevo y lo registra como Cliente, de forma transaccional
  async createCliente({ numero_id, correo, nombre, contraseñaHash, direccion, id_ciudad, telefono, visualizar_publicidad }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await insertarUsuarioBase(client, { numero_id, correo, nombre, contraseñaHash, direccion, id_ciudad, telefono });

      await client.query(
        `INSERT INTO public."CLIENTE" (numero_id, codigo_cliente, visualizar_publicidad)
         VALUES ($1, $2, $3)`,
        [numero_id, `CLI-${numero_id}`, visualizar_publicidad]
      );

      const contacto = await obtenerContacto(client, numero_id);

      await client.query('COMMIT');
      return { numero_id, correo, nombre, direccion: direccion || null, ...contacto, rol: 'cliente' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Crea un usuario nuevo y lo registra como Agente, de forma transaccional
  async createAgente({ numero_id, correo, nombre, contraseñaHash, direccion, id_ciudad, telefono, id_plan, nombre_plan, nombre_empresa, descripcion_agente }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await insertarUsuarioBase(client, { numero_id, correo, nombre, contraseñaHash, direccion, id_ciudad, telefono });

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