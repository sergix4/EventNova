// controllers/personaController.js
// Sprint 3 · Tarea 4: endpoints de usuarios (personas) · /api/usuarios
//
// El Controller recibe la petición, valida los datos, le pide al Model que
// consulte o guarde, y responde en JSON. Solo el administrador llega hasta
// aquí (lo garantiza soloAdmin en routes/personaRoutes.js).

const bcrypt = require("bcryptjs");
const PersonaModel = require("../models/personaModel");
const PlanModel = require("../models/planModel");
const CiudadModel = require("../models/ciudadModel");
const { texto } = require("../utils/texto");

const ROLES = ["cliente", "agente", "administrador"];
const TELEFONO_VALIDO = /^\+?[\d\s-]{7,20}$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TELEFONOS = 3;
const NUMERO_ID_VALIDO = /^[A-Za-z0-9-]{5,20}$/;
const MIN_CONTRASENA = 8;
const MAX_CONTRASENA = 72; // bcrypt solo tiene en cuenta los primeros 72 caracteres

// "Si el campo no viene en el body, se conserva el valor actual".
// Así el frontend puede mandar solo lo que cambió.
const tomar = (valor, actual) => (valor === undefined ? actual : valor);

// Arma los datos finales (actuales + los que llegaron) y los valida.
// Devuelve { error } o { datos } listos para PersonaModel.actualizar()
async function prepararDatos(actual, body) {
  // ─── 1. Datos de la persona ──────────────────────────────────────────────
  const nombre = String(tomar(body.nombre, actual.nombre) || "").trim();
  const correo = String(tomar(body.correo, actual.correo) || "")
    .trim()
    .toLowerCase();
  const direccion =
    String(tomar(body.direccion, actual.direccion) || "").trim() || null;
  const fecha_nacimiento =
    tomar(body.fecha_nacimiento, actual.fecha_nacimiento) || null;
  const id_ciudad = Number(tomar(body.id_ciudad, actual.ubicacion.id_ciudad));

  if (!nombre || nombre.length > 100)
    return { error: "El nombre es obligatorio (máximo 100 caracteres)." };
  if (!CORREO_VALIDO.test(correo) || correo.length > 150)
    return { error: "El correo no tiene un formato válido." };
  if (direccion && direccion.length > 255)
    return { error: "La dirección no puede superar 255 caracteres." };

  if (fecha_nacimiento) {
    const fecha = new Date(`${fecha_nacimiento}T00:00:00`);
    // Comprueba que la fecha exista de verdad (ej. 2025-02-31 NO existe)
    const [anio, mes, dia] = String(fecha_nacimiento).split("-").map(Number);
    const fechaReal =
      fecha.getFullYear() === anio &&
      fecha.getMonth() + 1 === mes &&
      fecha.getDate() === dia;
    if (
      !FECHA_VALIDA.test(fecha_nacimiento) ||
      Number.isNaN(fecha.getTime()) ||
      !fechaReal
    ) {
      return {
        error: "La fecha de nacimiento no es válida (formato AAAA-MM-DD).",
      };
    }
    if (fecha > new Date())
      return { error: "La fecha de nacimiento no puede ser futura." };
  }

  if (!Number.isInteger(id_ciudad) || id_ciudad <= 0)
    return { error: "Debes seleccionar una ciudad." };
  if (!(await CiudadModel.getById(id_ciudad)))
    return { error: "La ciudad seleccionada no existe." };

  // ─── 2. Teléfonos (tabla TELEFONOS): de 1 a 3, válidos y sin repetir ─────
  const listaTel = tomar(body.telefonos, actual.telefonos);
  if (!Array.isArray(listaTel))
    return { error: "Los teléfonos deben enviarse como una lista." };
  const telefonos = listaTel.map((t) => String(t || "").trim()).filter(Boolean);
  if (telefonos.length === 0)
    return { error: "Debes registrar al menos un teléfono." };
  if (telefonos.length > MAX_TELEFONOS)
    return { error: `Máximo ${MAX_TELEFONOS} teléfonos por persona.` };
  if (telefonos.some((t) => !TELEFONO_VALIDO.test(t)))
    return { error: "Hay un teléfono con formato no válido." };
  if (new Set(telefonos).size !== telefonos.length)
    return { error: "No repitas el mismo teléfono." };

  const datos = {
    nombre,
    correo,
    direccion,
    fecha_nacimiento,
    id_ciudad,
    telefonos,
  };

  // ─── 3. Campos propios de cada rol ───────────────────────────────────────
  if (actual.rol === "cliente") {
    const puntos = Number(tomar(body.puntos, actual.cliente.puntos));
    const publicidad = tomar(
      body.visualizar_publicidad,
      actual.cliente.visualizar_publicidad,
    );
    if (!Number.isInteger(puntos) || puntos < 0)
      return {
        error: "Los puntos deben ser un número entero mayor o igual a 0.",
      };
    if (typeof publicidad !== "boolean")
      return { error: "visualizar_publicidad debe ser true o false." };
    datos.puntos = puntos;
    datos.visualizar_publicidad = publicidad;
  }

  if (actual.rol === "agente") {
    const nombre_empresa = String(
      tomar(body.nombre_empresa, actual.agente.nombre_empresa) || "",
    ).trim();
    const descripcion =
      String(
        tomar(body.descripcion_agente, actual.agente.descripcion_agente) || "",
      ).trim() || null;
    // Tarea 16: vacío NO cuenta como 0 (Number("") da 0)
    const comTexto = tomar(body.comision, actual.agente.comision);
    const comision =
      comTexto === "" || comTexto === null ? NaN : Number(comTexto);

    // Sprint 3 · Corrección tarea 13: un campo vacío ya NO se guarda como 0
    // (Number("") da 0). Vacío o null → NaN → la validación de abajo lo rechaza.
    const expTexto = tomar(body.experiencia, actual.agente.experiencia);
    const experiencia =
      expTexto === "" || expTexto === null ? NaN : Number(expTexto);

    const id_plan = Number(tomar(body.id_plan, actual.agente.id_plan));

    if (!nombre_empresa || nombre_empresa.length > 150)
      return {
        error:
          "El nombre de la empresa es obligatorio (máximo 150 caracteres).",
      };
    if (descripcion && descripcion.length > 500)
      return {
        error: "La descripción del negocio no puede superar 500 caracteres.",
      };
    if (Number.isNaN(comision) || comision < 0 || comision > 100)
      return { error: "La comisión debe ser un porcentaje entre 0 y 100." };
    if (!Number.isInteger(experiencia) || experiencia < 0 || experiencia > 60)
      return {
        error:
          "Los años de experiencia deben ser un número entero entre 0 y 60.",
      };
    const plan = Number.isInteger(id_plan)
      ? await PlanModel.getById(id_plan)
      : null;
    if (!plan) return { error: "El plan seleccionado no existe." };

    // Sprint 3 · Tarea 14: no se puede bajar a un plan con menos cupo que los
    // eventos activos que ya tiene el agente (vale para el admin y para el agente)
    if (plan.id_plan !== actual.agente.id_plan) {
      const cupo = await PlanModel.cupoDeAgente(actual.numero_id);
      if (cupo && cupo.eventos_activos > plan.limite_evento)
        return {
          error: `No se puede cambiar al ${plan.nombre_plan}: permite ${plan.limite_evento} eventos activos y hay ${cupo.eventos_activos}. Primero deben finalizar o cancelarse algunos.`,
        };
    }

    Object.assign(datos, {
      nombre_empresa,
      descripcion_agente: descripcion,
      comision,
      experiencia,
      id_plan,
    });
  }

  if (actual.rol === "administrador") {
    const salTexto = tomar(body.salario, actual.administrador.salario);
    const salario =
      salTexto === "" || salTexto === null ? NaN : Number(salTexto);

    const horario = String(
      tomar(body.horario, actual.administrador.horario) || "",
    ).trim();
    if (Number.isNaN(salario) || salario < 0 || salario > 9999999999)
      return {
        error: "El salario debe ser un número entre 0 y 9.999.999.999.",
      };

    if (!horario || horario.length > 100)
      return { error: "El horario es obligatorio (máximo 100 caracteres)." };
    Object.assign(datos, { salario, horario });
  }

  return { datos };
}

const personaController = {
  // GET /api/usuarios?rol=cliente|agente|administrador&buscar=texto
  async listar(req, res) {
    // texto(): si llega ?rol[]=cliente (una lista) cuenta como vacío y no da error 500
    const rol = texto(req.query.rol).toLowerCase();
    const buscar = texto(req.query.buscar);

    if (rol && !ROLES.includes(rol)) {
      return res
        .status(400)
        .json({ error: "El rol debe ser cliente, agente o administrador." });
    }
    try {
      const usuarios = await PersonaModel.listar({
        rol: rol || null,
        buscar: buscar || null,
      });
      res.json(usuarios);
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/usuarios/:id
  async obtener(req, res) {
    try {
      const persona = await PersonaModel.obtener(req.params.id);
      if (!persona)
        return res.status(404).json({ error: "Usuario no encontrado." });
      res.json(persona);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // POST /api/usuarios/clientes | /agentes | /administradores
  // (Sprint 3 · Tarea 6 para administradores; auditoría final: también clientes y agentes)
  // Solo un administrador con sesión llega aquí (soloAdmin en las rutas).
  // rol = 'cliente' | 'agente' | 'administrador' (lo pone la ruta)
  async crearPersona(req, res, rol) {
    const body = req.body || {};
    const numero_id = String(body.numero_id || "").trim();
    const contrasena = String(body.password || "");

    // 1. Lo que solo existe al registrar: identificación y contraseña
    if (!NUMERO_ID_VALIDO.test(numero_id)) {
      return res.status(400).json({
        error:
          "La identificación debe tener entre 5 y 20 caracteres (letras, números o guiones).",
      });
    }
    if (contrasena.length < MIN_CONTRASENA || contrasena.length > MAX_CONTRASENA) {
      return res.status(400).json({
        error: `La contraseña debe tener entre ${MIN_CONTRASENA} y ${MAX_CONTRASENA} caracteres.`,
      });
    }

    // 2. El resto se valida con la MISMA función que usa "Editar".
    //    Se le pasa una persona "vacía" del rol para que todos los campos
    //    tengan que venir en el body (no hay valores actuales que conservar).
    const vacio = {
      rol,
      numero_id: "",
      nombre: "",
      correo: "",
      direccion: null,
      fecha_nacimiento: null,
      telefonos: [],
      ubicacion: { id_ciudad: null },
      cliente: { puntos: 0, visualizar_publicidad: true },
      agente: { nombre_empresa: "", descripcion_agente: null, comision: "", experiencia: "", id_plan: undefined },
      administrador: { salario: undefined, horario: "" },
    };

    try {
      const { error, datos } = await prepararDatos(vacio, body);
      if (error) return res.status(400).json({ error });

      // 3. Correo e identificación deben ser únicos
      if (
        await PersonaModel.existeCorreoOIdentificacion(datos.correo, numero_id)
      ) {
        return res.status(409).json({
          error:
            "Ya existe un usuario con ese correo o número de identificación.",
        });
      }

      // 4. Se guarda con la contraseña encriptada (nunca en texto plano)
      const contrasenaHash = await bcrypt.hash(contrasena, 10);
      const persona = await PersonaModel.crear(rol, {
        ...datos,
        numero_id,
        contrasenaHash,
      });

      const NOMBRE = { cliente: "Cliente", agente: "Agente", administrador: "Administrador" };
      res.status(201).json({
        mensaje: `${NOMBRE[rol]} registrado correctamente.`,
        usuario: persona,
      });
    } catch (error) {
      if (error.code === "23505") {
        // UNIQUE / PK repetida (dos registros al mismo tiempo)
        return res.status(409).json({
          error:
            "Ya existe un usuario con ese correo o número de identificación.",
        });
      }
      console.error(`Error al registrar ${rol}:`, error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // PUT /api/usuarios/:id
  async actualizar(req, res) {
    const { id } = req.params;
    try {
      const actual = await PersonaModel.obtener(id);
      if (!actual)
        return res.status(404).json({ error: "Usuario no encontrado." });

      // El rol y la identificación no se cambian desde aquí
      if (req.body.numero_id !== undefined && req.body.numero_id !== id) {
        return res.status(400).json({
          error: "El número de identificación no se puede modificar.",
        });
      }

      const { error, datos } = await prepararDatos(actual, req.body || {});
      if (error) return res.status(400).json({ error });

      if (await PersonaModel.existeCorreo(datos.correo, id)) {
        return res
          .status(409)
          .json({ error: "Ya existe otro usuario con ese correo." });
      }

      const persona = await PersonaModel.actualizar(id, actual.rol, datos);

      // Si el administrador se editó a sí mismo, se refresca su sesión
      const sesion = req.session.usuario;
      if (sesion && sesion.numero_id === id) {
        Object.assign(sesion, {
          nombre: persona.nombre,
          correo: persona.correo,
          direccion: persona.direccion,
          telefono: persona.telefonos[0] || null,
          ciudad: persona.ubicacion.ciudad,
          departamento: persona.ubicacion.departamento,
          pais: persona.ubicacion.pais,
        });
      }

      res.json({
        mensaje: "Usuario actualizado correctamente.",
        usuario: persona,
      });
    } catch (error) {
      if (error.code === "23505") {
        // UNIQUE violation (correo repetido)
        return res
          .status(409)
          .json({ error: "Ya existe otro usuario con ese correo." });
      }
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // DELETE /api/usuarios/:id
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const persona = await PersonaModel.obtener(id);
      if (!persona)
        return res.status(404).json({ error: "Usuario no encontrado." });

      // Reglas de negocio: no se borra a quien tenga historia en el sistema
      if (persona.rol === "cliente" && persona.cliente.total_reservas > 0) {
        return res.status(409).json({
          error: `No se puede eliminar: el cliente tiene ${persona.cliente.total_reservas} reserva(s) asociada(s).`,
        });
      }
      if (persona.rol === "agente" && persona.agente.total_eventos > 0) {
        return res.status(409).json({
          error: `No se puede eliminar: el agente tiene ${persona.agente.total_eventos} evento(s) asociado(s).`,
        });
      }
      if (persona.rol === "administrador") {
        if (req.session.usuario.numero_id === id) {
          return res.status(409).json({
            error: "No puedes eliminar tu propia cuenta de administrador.",
          });
        }
        if ((await PersonaModel.contarAdministradores()) <= 1) {
          return res.status(409).json({
            error: "Debe quedar al menos un administrador en el sistema.",
          });
        }
      }

      await PersonaModel.eliminar(id);
      res.json({ mensaje: "Usuario eliminado correctamente." });
    } catch (error) {
      if (error.code === "23503") {
        // FK violation: respaldo por si algo quedó asociado
        return res.status(409).json({
          error: "No se puede eliminar: el usuario tiene registros asociados.",
        });
      }
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },
};

module.exports = personaController;

// Sprint 3 · Tarea 13: perfilController reutiliza las mismas validaciones
module.exports.prepararDatos = prepararDatos;
