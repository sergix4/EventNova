// controllers/perfilController.js
// Sprint 3 · Tarea 13: «Mi perfil» conectado a la base de datos · /api/auth/perfil
//
// Aquí cada usuario (cliente, agente o administrador) consulta y edita SUS
// PROPIOS datos. La diferencia con /api/usuarios (personaController) es:
//   - No se recibe un :id en la URL: el usuario sale de la SESIÓN, así nadie
//     puede editar a otra persona cambiando la URL.
//   - Solo se aceptan los campos que el propio usuario puede cambiar.
//     Puntos, comisión, plan, salario y horario los maneja el administrador.
//
// Las validaciones NO se repiten: se reutiliza prepararDatos() de personaController.

const bcrypt = require("bcryptjs");
const PersonaModel = require("../models/personaModel");
const { prepararDatos } = require("./personaController");

const MIN_CONTRASENA = 8;

// Campos que cualquier usuario puede cambiar de sí mismo
const CAMPOS_COMUNES = [
  "nombre",
  "correo",
  "direccion",
  "fecha_nacimiento",
  "id_ciudad",
  "telefonos",
];

// Campos extra según el rol
const CAMPOS_POR_ROL = {
  cliente: ["visualizar_publicidad"],
  agente: ["nombre_empresa", "descripcion_agente", "experiencia"],
  administrador: [],
};

// Copia del body SOLO con los campos permitidos (lo demás se ignora).
// Así, aunque alguien mande { puntos: 99999 } desde la consola, no pasa nada.
function soloPermitidos(body, rol) {
  const permitidos = [...CAMPOS_COMUNES, ...CAMPOS_POR_ROL[rol]];
  const limpio = {};
  for (const campo of permitidos) {
    if (body[campo] !== undefined) limpio[campo] = body[campo];
  }
  return limpio;
}

// Deja la sesión igual a lo que quedó en la base (la barra lateral la usa)
function refrescarSesion(sesion, persona) {
  Object.assign(sesion, {
    nombre: persona.nombre,
    correo: persona.correo,
    direccion: persona.direccion,
    telefono: persona.telefonos[0] || null,
    id_ciudad: persona.ubicacion.id_ciudad,
    ciudad: persona.ubicacion.ciudad,
    departamento: persona.ubicacion.departamento,
    pais: persona.ubicacion.pais,
  });
  if (persona.rol === "agente") {
    sesion.agente = {
      nombre_empresa: persona.agente.nombre_empresa,
      descripcion_agente: persona.agente.descripcion_agente,
      plan: persona.agente.plan,
    };
  }
}

// Lo que se le devuelve al frontend: la persona + datos extra del perfil
async function armarPerfil(req, persona) {
  if (persona.rol === "agente") {
    persona.agente.estadisticas = await PersonaModel.estadisticasAgente(
      persona.numero_id,
    );
  }
  persona.inicio_sesion = req.session.usuario.inicio_sesion || null;
  return persona;
}

// Busca en la BD al usuario de la sesión. Si ya no existe (lo eliminó un
// administrador), se cierra la sesión y se responde 401.
async function usuarioDeLaSesion(req, res) {
  const persona = await PersonaModel.obtener(req.session.usuario.numero_id);
  if (!persona) {
    req.session.destroy(() => {});
    res
      .status(401)
      .json({ error: "Tu cuenta ya no existe. Inicia sesión de nuevo." });
    return null;
  }
  return persona;
}

const perfilController = {
  // GET /api/auth/perfil
  async obtener(req, res) {
    try {
      const persona = await usuarioDeLaSesion(req, res);
      if (!persona) return;
      res.json(await armarPerfil(req, persona));
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // PUT /api/auth/perfil
  async actualizar(req, res) {
    const body = req.body || {};
    try {
      const actual = await usuarioDeLaSesion(req, res);
      if (!actual) return;

      if (body.numero_id !== undefined && body.numero_id !== actual.numero_id) {
        return res
          .status(400)
          .json({
            error: "El número de identificación no se puede modificar.",
          });
      }

      // Mismas validaciones que usa el administrador en /api/usuarios/:id
      const { error, datos } = await prepararDatos(
        actual,
        soloPermitidos(body, actual.rol),
      );
      if (error) return res.status(400).json({ error });

      if (await PersonaModel.existeCorreo(datos.correo, actual.numero_id)) {
        return res
          .status(409)
          .json({ error: "Ya existe otro usuario con ese correo." });
      }

      const persona = await PersonaModel.actualizar(
        actual.numero_id,
        actual.rol,
        datos,
      );
      refrescarSesion(req.session.usuario, persona);

      res.json({
        mensaje: "Perfil actualizado correctamente.",
        usuario: await armarPerfil(req, persona),
      });
    } catch (error) {
      if (error.code === "23505") {
        // UNIQUE violation (correo repetido)
        return res
          .status(409)
          .json({ error: "Ya existe otro usuario con ese correo." });
      }
      console.error("Error al actualizar el perfil:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // PUT /api/auth/perfil/contrasena   body: { actual, nueva }
  async cambiarContrasena(req, res) {
    const actual = String(req.body?.actual || "");
    const nueva = String(req.body?.nueva || "");

    if (!actual || !nueva) {
      return res
        .status(400)
        .json({ error: "Escribe tu contraseña actual y la nueva." });
    }
    if (nueva.length < MIN_CONTRASENA) {
      return res
        .status(400)
        .json({
          error: `La nueva contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`,
        });
    }
    if (nueva === actual) {
      return res
        .status(400)
        .json({ error: "La nueva contraseña debe ser diferente a la actual." });
    }

    try {
      const numeroId = req.session.usuario.numero_id;
      const hashGuardado = await PersonaModel.obtenerHashContrasena(numeroId);
      if (!hashGuardado) {
        req.session.destroy(() => {});
        return res
          .status(401)
          .json({ error: "Tu cuenta ya no existe. Inicia sesión de nuevo." });
      }

      // Se compara lo que escribió con el hash guardado (nunca se desencripta)
      if (!(await bcrypt.compare(actual, hashGuardado))) {
        return res
          .status(400)
          .json({ error: "La contraseña actual no es correcta." });
      }

      await PersonaModel.actualizarContrasena(
        numeroId,
        await bcrypt.hash(nueva, 10),
      );
      res.json({ mensaje: "Contraseña actualizada correctamente." });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },
};

module.exports = perfilController;
