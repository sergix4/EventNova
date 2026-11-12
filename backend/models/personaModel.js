// models/personaModel.js
// Sprint 3 · Tarea 4: Modelo de usuarios (personas).
//
// Un "Model" en MVC tiene SOLO las consultas SQL. Aquí se trabaja con la
// persona (tabla USUARIO), sus teléfonos (TELEFONOS) y la tabla de su rol
// (CLIENTE, AGENTE o ADMINISTRADOR). No sabe nada de HTTP ni de sesiones.
//
// Lo usa controllers/personaController.js (rutas /api/usuarios).

const pool = require("../config/db");

// ─── Consulta base ───────────────────────────────────────────────────────────
// Trae la persona con su ubicación, sus teléfonos (como lista), su rol y los
// campos propios del rol. NUNCA se trae la contraseña.
const SELECT_PERSONA = `
  SELECT u.numero_id, u.correo, u.nombre, u.direccion,
         TO_CHAR(u.fecha_nacimiento, 'YYYY-MM-DD')     AS fecha_nacimiento,
         TO_CHAR(u.fecha_registro, 'YYYY-MM-DD HH24:MI') AS fecha_registro,
         u.activo, u.motivo_suspension,
         TO_CHAR(u.fecha_suspension, 'YYYY-MM-DD HH24:MI') AS fecha_suspension,
         u.id_ciudad, c.nombre_ciudad, d.id_departamento, d.nombre_departamento,
         p.id_pais, p.nombre_pais,
         ARRAY(SELECT t.telefono FROM public."TELEFONOS" t
               WHERE t.numero_id = u.numero_id ORDER BY t.telefono) AS telefonos,
         CASE WHEN cl.numero_id IS NOT NULL THEN 'cliente'
              WHEN ag.numero_id IS NOT NULL THEN 'agente'
              WHEN ad.numero_id IS NOT NULL THEN 'administrador'
         END AS rol,
         cl.codigo_cliente, cl.puntos, cl.visualizar_publicidad,
         ag.nombre_empresa, ag.descripcion_agente, ag.comision, ag.experiencia,
         ag.id_plan, tp.nombre_plan, tp.limite_evento,
         ad.codigo_admin, ad.salario, ad.horario,
         (SELECT COUNT(*)::int FROM public."RESERVA" r WHERE r.id_cliente = u.numero_id) AS total_reservas,
         (SELECT COUNT(*)::int FROM public."EVENTO"  e WHERE e.id_agente  = u.numero_id) AS total_eventos
  FROM public."USUARIO" u
  LEFT JOIN public."CIUDAD" c         ON c.id_ciudad = u.id_ciudad
  LEFT JOIN public."DEPARTAMENTO" d   ON d.id_departamento = c.id_departamento
  LEFT JOIN public."PAIS" p           ON p.id_pais = d.id_pais
  LEFT JOIN public."CLIENTE" cl       ON cl.numero_id = u.numero_id
  LEFT JOIN public."AGENTE" ag        ON ag.numero_id = u.numero_id
  LEFT JOIN public."TIPO_PLAN" tp     ON tp.id_plan = ag.id_plan
  LEFT JOIN public."ADMINISTRADOR" ad ON ad.numero_id = u.numero_id
`;

// Condición SQL de cada rol. Se usa un objeto (y no el texto que manda el
// usuario) para que nunca se pueda inyectar SQL por el parámetro ?rol=
const FILTRO_ROL = {
  cliente: "cl.numero_id IS NOT NULL",
  agente: "ag.numero_id IS NOT NULL",
  administrador: "ad.numero_id IS NOT NULL",
};

// Convierte una fila de la consulta en un objeto ordenado para el frontend:
// datos de la persona + ubicación + solo el bloque de SU rol.
function formatear(fila) {
  return {
    numero_id: fila.numero_id,
    nombre: fila.nombre,
    correo: fila.correo,
    direccion: fila.direccion,
    fecha_nacimiento: fila.fecha_nacimiento,
    fecha_registro: fila.fecha_registro,
    activo: fila.activo, // false = cuenta suspendida
    fecha_suspension: fila.fecha_suspension,
    motivo_suspension: fila.motivo_suspension,
    rol: fila.rol,
    telefonos: fila.telefonos || [],
    ubicacion: {
      id_ciudad: fila.id_ciudad,
      ciudad: fila.nombre_ciudad,
      id_departamento: fila.id_departamento,
      departamento: fila.nombre_departamento,
      id_pais: fila.id_pais,
      pais: fila.nombre_pais,
    },
    cliente:
      fila.rol === "cliente"
        ? {
            codigo_cliente: fila.codigo_cliente,
            puntos: fila.puntos,
            visualizar_publicidad: fila.visualizar_publicidad,
            total_reservas: fila.total_reservas,
          }
        : null,
    agente:
      fila.rol === "agente"
        ? {
            nombre_empresa: fila.nombre_empresa,
            descripcion_agente: fila.descripcion_agente,
            comision: Number(fila.comision), // NUMERIC llega como texto desde pg
            experiencia: fila.experiencia,
            id_plan: fila.id_plan,
            plan: fila.nombre_plan,
            limite_eventos: fila.limite_evento, // Tarea 14: cupo del plan
            total_eventos: fila.total_eventos,
          }
        : null,
    administrador:
      fila.rol === "administrador"
        ? {
            codigo_admin: fila.codigo_admin,
            salario: Number(fila.salario),
            horario: fila.horario,
          }
        : null,
  };
}

const PersonaModel = {
  // Listado con filtro opcional por rol y búsqueda por nombre, correo,
  // identificación o empresa (agentes). Ej: listar({ rol: 'agente', buscar: 'valle' })
  async listar({ rol, buscar } = {}) {
    const condiciones = [];
    const valores = [];

    if (rol) condiciones.push(FILTRO_ROL[rol]);

    if (buscar) {
      valores.push(`%${buscar}%`);
      const n = `$${valores.length}`;
      condiciones.push(`(u.nombre ILIKE ${n} OR u.correo ILIKE ${n}
                         OR u.numero_id ILIKE ${n} OR ag.nombre_empresa ILIKE ${n})`);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(" AND ")}`
      : "";
    const result = await pool.query(
      `${SELECT_PERSONA} ${where} ORDER BY u.nombre ASC`,
      valores,
    );
    return result.rows.map(formatear);
  },

  // Una sola persona por su número de identificación (o null si no existe)
  async obtener(numero_id) {
    const result = await pool.query(
      `${SELECT_PERSONA} WHERE u.numero_id = $1`,
      [numero_id],
    );
    return result.rows[0] ? formatear(result.rows[0]) : null;
  },

  // ¿Otro usuario ya usa ese correo? (el correo debe seguir siendo único)
  async existeCorreo(correo, excluirNumeroId) {
    const result = await pool.query(
      `SELECT 1 FROM public."USUARIO" WHERE LOWER(correo) = LOWER($1) AND numero_id <> $2 LIMIT 1`,
      [correo, excluirNumeroId],
    );
    return result.rowCount > 0;
  },

  // ¿Ya existe un usuario con ese correo O con esa identificación? (para registrar)
  async existeCorreoOIdentificacion(correo, numero_id) {
    const result = await pool.query(
      `SELECT 1 FROM public."USUARIO" WHERE LOWER(correo) = LOWER($1) OR numero_id = $2 LIMIT 1`,
      [correo, numero_id],
    );
    return result.rowCount > 0;
  },

  // Sprint 3 · Tarea 6 (+ auditoría final): registra una persona nueva del rol
  // indicado ('cliente' | 'agente' | 'administrador') EN UNA TRANSACCIÓN.
  // Se insertan USUARIO, sus TELEFONOS y la fila de CLIENTE, AGENTE o
  // ADMINISTRADOR; si algo falla no queda nada a medias. 'datos' ya viene
  // validado desde el controlador y la contraseña ya viene encriptada (contrasenaHash).
  async crear(rol, datos) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. La persona
      await client.query(
        `INSERT INTO public."USUARIO"
           (numero_id, correo, nombre, contraseña, direccion, fecha_nacimiento, id_ciudad)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          datos.numero_id,
          datos.correo,
          datos.nombre,
          datos.contrasenaHash,
          datos.direccion,
          datos.fecha_nacimiento,
          datos.id_ciudad,
        ],
      );

      // 2. Sus teléfonos (de 1 a 3)
      for (const telefono of datos.telefonos) {
        await client.query(
          `INSERT INTO public."TELEFONOS" (numero_id, telefono) VALUES ($1, $2)`,
          [datos.numero_id, telefono],
        );
      }

      // 3. Los datos propios del rol
      if (rol === "cliente") {
        await client.query(
          `INSERT INTO public."CLIENTE" (numero_id, codigo_cliente, puntos, visualizar_publicidad)
           VALUES ($1, $2, $3, $4)`,
          [datos.numero_id, `CLI-${datos.numero_id}`, datos.puntos, datos.visualizar_publicidad],
        );
      } else if (rol === "agente") {
        await client.query(
          `INSERT INTO public."AGENTE" (numero_id, id_plan, nombre_empresa, descripcion_agente, comision, experiencia)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [datos.numero_id, datos.id_plan, datos.nombre_empresa, datos.descripcion_agente, datos.comision, datos.experiencia],
        );
      } else {
        await client.query(
          `INSERT INTO public."ADMINISTRADOR" (numero_id, codigo_admin, salario, horario)
           VALUES ($1, $2, $3, $4)`,
          [datos.numero_id, `ADM-${datos.numero_id}`, datos.salario, datos.horario],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    return PersonaModel.obtener(datos.numero_id); // la persona recién creada
  },

  // ¿Esa identificación sigue siendo de un administrador ACTIVO? (lo usa adminVigente)
  async esAdministrador(numero_id) {
    const result = await pool.query(
      `SELECT 1 FROM public."ADMINISTRADOR" ad
       JOIN public."USUARIO" u ON u.numero_id = ad.numero_id
       WHERE ad.numero_id = $1 AND u.activo`,
      [numero_id],
    );
    return result.rowCount > 0;
  },

  // ¿La persona sigue existiendo con ese rol y ACTIVA? (lo usa authMiddleware para
  // que la sesión de un usuario suspendido por el administrador deje de servir)
  async tieneRol(numero_id, rol) {
    const tabla = { cliente: "CLIENTE", agente: "AGENTE", administrador: "ADMINISTRADOR" }[rol];
    if (!tabla) return false;
    const result = await pool.query(
      `SELECT 1 FROM public."${tabla}" t
       JOIN public."USUARIO" u ON u.numero_id = t.numero_id
       WHERE t.numero_id = $1 AND u.activo`,
      [numero_id],
    );
    return result.rowCount > 0;
  },

  // Cuántos administradores ACTIVOS hay (siempre debe quedar al menos uno)
  async contarAdministradores() {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM public."ADMINISTRADOR" ad
       JOIN public."USUARIO" u ON u.numero_id = ad.numero_id
       WHERE u.activo`,
    );
    return result.rows[0].total;
  },

  // Modifica la persona, sus teléfonos y los campos de su rol EN UNA TRANSACCIÓN:
  // si algo falla, no queda nada a medias.
  // 'datos' ya viene validado y completo desde el controlador.
  async actualizar(numero_id, rol, datos) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Datos de la persona (el numero_id NO se cambia: es la llave primaria)
      await client.query(
        `UPDATE public."USUARIO"
         SET nombre = $1, correo = $2, direccion = $3, fecha_nacimiento = $4, id_ciudad = $5
         WHERE numero_id = $6`,
        [
          datos.nombre,
          datos.correo,
          datos.direccion,
          datos.fecha_nacimiento,
          datos.id_ciudad,
          numero_id,
        ],
      );

      // 2. Teléfonos: se borran los anteriores y se guardan los nuevos
      await client.query(
        `DELETE FROM public."TELEFONOS" WHERE numero_id = $1`,
        [numero_id],
      );
      for (const telefono of datos.telefonos) {
        await client.query(
          `INSERT INTO public."TELEFONOS" (numero_id, telefono) VALUES ($1, $2)`,
          [numero_id, telefono],
        );
      }

      // 3. Campos propios del rol
      if (rol === "cliente") {
        await client.query(
          `UPDATE public."CLIENTE" SET puntos = $1, visualizar_publicidad = $2 WHERE numero_id = $3`,
          [datos.puntos, datos.visualizar_publicidad, numero_id],
        );
      } else if (rol === "agente") {
        await client.query(
          `UPDATE public."AGENTE"
           SET nombre_empresa = $1, descripcion_agente = $2, comision = $3, experiencia = $4, id_plan = $5
           WHERE numero_id = $6`,
          [
            datos.nombre_empresa,
            datos.descripcion_agente,
            datos.comision,
            datos.experiencia,
            datos.id_plan,
            numero_id,
          ],
        );
      } else if (rol === "administrador") {
        await client.query(
          `UPDATE public."ADMINISTRADOR" SET salario = $1, horario = $2 WHERE numero_id = $3`,
          [datos.salario, datos.horario, numero_id],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    return PersonaModel.obtener(numero_id); // devuelve la persona ya actualizada
  },

  // Ajustes finales: SUSPENDE o REACTIVA la cuenta (ya no se elimina a nadie).
  // activo = false -> suspendida (guarda la fecha y el motivo)
  // activo = true  -> reactivada (borra la fecha y el motivo)
  // Sus reservas, eventos y demás datos NO se tocan.
  async cambiarActivo(numero_id, activo, motivo = null) {
    await pool.query(
      `UPDATE public."USUARIO"
       SET activo = $1,
           fecha_suspension  = CASE WHEN $1 THEN NULL ELSE (NOW() AT TIME ZONE 'America/Bogota') END,
           motivo_suspension = CASE WHEN $1 THEN NULL ELSE $2::varchar END
       WHERE numero_id = $3`,
      [activo, motivo, numero_id],
    );
    return PersonaModel.obtener(numero_id);
  },

  // ─── Sprint 3 · Tarea 13: «Mi perfil» ──────────────────────────────────────
  // Hash de la contraseña (solo se usa para compararlo con bcrypt, nunca sale de aquí)
  async obtenerHashContrasena(numero_id) {
    const result = await pool.query(
      `SELECT contraseña FROM public."USUARIO" WHERE numero_id = $1`,
      [numero_id],
    );
    return result.rows[0]?.contraseña || null;
  },

  // Guarda la contraseña nueva (ya viene encriptada desde el controlador)
  async actualizarContrasena(numero_id, contrasenaHash) {
    await pool.query(
      `UPDATE public."USUARIO" SET contraseña = $1 WHERE numero_id = $2`,
      [contrasenaHash, numero_id],
    );
  },

  // Números reales del agente para su perfil
  async estadisticasAgente(numero_id) {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT e.id_evento)::int AS eventos_registrados,
              COUNT(DISTINCT e.id_evento) FILTER (
                WHERE es.nombre_estado IN ('Programado', 'En Boletería', 'En Vivo'))::int AS eventos_activos,
              COUNT(r.id_reserva) FILTER (WHERE er.nombre_estado <> 'Cancelada')::int AS reservas_recibidas,
              COALESCE(SUM(r.numero_entradas) FILTER (WHERE er.nombre_estado <> 'Cancelada'), 0)::int AS entradas_vendidas
       FROM public."EVENTO" e
       JOIN public."ESTADO" es               ON es.id_estado = e.id_estado
       LEFT JOIN public."RESERVA" r          ON r.id_evento = e.id_evento
       LEFT JOIN public."ESTADO_RESERVA" er  ON er.id_estado_reserva = r.id_estado_reserva
       WHERE e.id_agente = $1`,
      [numero_id],
    );
    return result.rows[0];
  },
};

module.exports = PersonaModel;
