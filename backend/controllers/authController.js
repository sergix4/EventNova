// controllers/authController.js
// Un "Controller" recibe la peticion (request), habla con el Model si
// necesita datos, y responde. Como el backend es una API, responde con
// JSON en vez de renderizar una Vista HTML.

const bcrypt = require("bcryptjs");
const UsuarioModel = require("../models/usuarioModel");
const PlanModel = require("../models/planModel");
const CiudadModel = require("../models/ciudadModel");
const PersonaModel = require("../models/personaModel");
const { texto } = require("../utils/texto");

const TELEFONO_VALIDO = /^\+?[\d\s-]{7,20}$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Tarea 16: las mismas reglas que usa personaController (CRUD de administradores)
const NUMERO_ID_VALIDO = /^[A-Za-z0-9-]{5,20}$/;
const MIN_CONTRASENA = 8;
const MAX_CONTRASENA = 72; // bcrypt solo tiene en cuenta los primeros 72 caracteres

// Valida ciudad (obligatoria y existente) y teléfonos. Devuelve { error } o { idCiudad, tel, tel2 }
async function validarCiudadYTelefono({ id_ciudad, telefono, telefono2 }) {
  const idCiudad = Number(id_ciudad);
  if (!Number.isInteger(idCiudad) || idCiudad <= 0)
    return { error: "Debes seleccionar una ciudad." };
  if (!(await CiudadModel.getById(idCiudad)))
    return { error: "La ciudad seleccionada no existe." };

  const tel = texto(telefono);
  if (!TELEFONO_VALIDO.test(tel))
    return { error: "Ingresa un teléfono válido." };

  // Teléfono alternativo: es opcional, pero si viene debe ser válido y distinto al principal
  const tel2 = texto(telefono2);
  if (tel2 && !TELEFONO_VALIDO.test(tel2))
    return { error: "El teléfono alternativo no es válido." };
  if (tel2 && tel2 === tel)
    return {
      error: "El teléfono alternativo debe ser diferente al principal.",
    };

  return { idCiudad, tel, tel2: tel2 || null };
}

// Valida los datos propios del agente. Devuelve { error } o { exp }
// Ajustes finales: la comisión YA NO la elige el agente al registrarse;
// nace en 0 y solo el administrador la cambia (Usuarios → Editar).
function validarDatosAgente({ experiencia }) {
  const exp = Number(experiencia);
  if (
    experiencia === undefined ||
    experiencia === "" ||
    !Number.isInteger(exp) ||
    exp < 0 ||
    exp > 60
  ) {
    return {
      error: "Los años de experiencia deben ser un número entero entre 0 y 60.",
    };
  }
  return { exp };
}

// Tarea 16: valida los datos comunes del registro (cliente y agente).
// Devuelve { error } o { datos } ya limpios. Los largos son los de develop.sql.
function validarDatosRegistro(body) {
  const identificacion = texto(body.identificacion);
  const nombre = texto(body.nombre);
  const correo = texto(body.correo).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const direccion = texto(body.direccion) || null;

  if (!identificacion || !nombre || !correo || !password)
    return {
      error: "Identificación, nombre, correo y contraseña son obligatorios.",
    };
  if (!NUMERO_ID_VALIDO.test(identificacion))
    return {
      error:
        "La identificación debe tener entre 5 y 20 caracteres (letras, números o guiones).",
    };
  if (nombre.length > 100)
    return { error: "El nombre no puede superar 100 caracteres." };
  if (!CORREO_VALIDO.test(correo) || correo.length > 150)
    return { error: "El correo no tiene un formato válido." };
  if (password.length < MIN_CONTRASENA || password.length > MAX_CONTRASENA)
    return {
      error: `La contraseña debe tener entre ${MIN_CONTRASENA} y ${MAX_CONTRASENA} caracteres.`,
    };
  if (direccion && direccion.length > 255)
    return { error: "La dirección no puede superar 255 caracteres." };

  return { datos: { identificacion, nombre, correo, password, direccion } };
}

// Tarea 16: crea una sesión NUEVA (con otro id de cookie) y guarda el usuario.
// Así, si alguien le "plantó" una cookie al usuario antes del login, esa
// cookie vieja no queda con la sesión iniciada (ataque de fijación de sesión).
function iniciarSesion(req, usuario) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.usuario = usuario;
      resolve();
    });
  });
}

const authController = {
  async login(req, res) {
    const contraseña =
      typeof req.body.contraseña === "string" ? req.body.contraseña : "";
    const correo = texto(req.body.correo).toLowerCase();

    if (!correo || !contraseña) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios." });
    }

    try {
      const usuario = await UsuarioModel.findByEmail(correo);
      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas." });
      }

      const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!coincide) {
        return res.status(401).json({ error: "Credenciales inválidas." });
      }

      // Ajustes finales: la cuenta suspendida no puede entrar. Se revisa DESPUÉS
      // de la contraseña para no contarle a cualquiera que ese correo existe.
      if (!usuario.activo) {
        return res.status(403).json({
          error: "Tu cuenta está suspendida. Comunícate con el administrador de EventNova.",
        });
      }

      if (!usuario.rol) {
        return res
          .status(403)
          .json({ error: "El usuario no tiene un rol asignado." });
      }

      // Nunca guardar la contraseña en la sesión
      // Tarea 16: se crea una sesión nueva al iniciar sesión
      await iniciarSesion(req, {
        numero_id: usuario.numero_id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        direccion: usuario.direccion,
        telefono: usuario.telefono,
        ciudad: usuario.ciudad,
        departamento: usuario.departamento,
        pais: usuario.pais,
        rol: usuario.rol,
        agente: usuario.agente,
        inicio_sesion: new Date().toISOString(), // Tarea 13: «Sesión iniciada» en Mi perfil
      });

      return res.json({
        mensaje: "Inicio de sesión exitoso",
        usuario: req.session.usuario,
      });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async register(req, res) {
    // Tarea 16: validación común (tipos, formatos y largos máximos)
    const validacion = validarDatosRegistro(req.body);
    if (validacion.error)
      return res.status(400).json({ error: validacion.error });
    const datos = validacion.datos;

    try {
      // Ciudad y teléfono ANTES de tocar la BD
      const ub = await validarCiudadYTelefono(req.body);
      if (ub.error) return res.status(400).json({ error: ub.error });

      const yaExiste = await UsuarioModel.existsByEmailOrId(
        datos.correo,
        datos.identificacion,
      );
      if (yaExiste) {
        return res.status(409).json({
          error:
            "Ya existe una cuenta con ese correo o número de identificación.",
        });
      }

      const contraseñaHash = await bcrypt.hash(datos.password, 10);

      const usuario = await UsuarioModel.createCliente({
        numero_id: datos.identificacion,
        correo: datos.correo,
        nombre: datos.nombre,
        contraseñaHash,
        direccion: datos.direccion,
        id_ciudad: ub.idCiudad,
        telefono: ub.tel,
        telefono2: ub.tel2,
        visualizar_publicidad: req.body.publicidad !== false,
      });

      await iniciarSesion(req, usuario); // registro con auto-login (sesión nueva)
      return res
        .status(201)
        .json({ mensaje: "Cuenta creada correctamente", usuario });
    } catch (error) {
      if (error.code === "23505") {
        // dos registros iguales al mismo tiempo (correo o identificación repetidos)
        return res.status(409).json({
          error:
            "Ya existe una cuenta con ese correo o número de identificación.",
        });
      }
      console.error("Error en registro:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  async registerAgente(req, res) {
    // Tarea 16: misma validación común que el cliente + los datos del agente
    const validacion = validarDatosRegistro(req.body);
    if (validacion.error)
      return res.status(400).json({ error: validacion.error });
    const datos = validacion.datos;

    const empresa = texto(req.body.empresa);
    const descripcion = texto(req.body.descripcionNegocio) || null;
    if (!empresa || empresa.length > 150) {
      return res.status(400).json({
        error:
          "El nombre de la empresa es obligatorio (máximo 150 caracteres).",
      });
    }
    if (descripcion && descripcion.length > 500) {
      return res.status(400).json({
        error: "La descripción del negocio no puede superar 500 caracteres.",
      });
    }
    const idPlan = Number(req.body.id_plan); // Tarea 14: el plan llega por su id de TIPO_PLAN
    if (!Number.isInteger(idPlan) || idPlan <= 0) {
      return res
        .status(400)
        .json({ error: "Debes seleccionar un plan válido." });
    }
    const datosAgente = validarDatosAgente(req.body);
    if (datosAgente.error)
      return res.status(400).json({ error: datosAgente.error });

    try {
      const ub = await validarCiudadYTelefono(req.body);
      if (ub.error) return res.status(400).json({ error: ub.error });

      const yaExiste = await UsuarioModel.existsByEmailOrId(
        datos.correo,
        datos.identificacion,
      );
      if (yaExiste) {
        return res.status(409).json({
          error:
            "Ya existe una cuenta con ese correo o número de identificación.",
        });
      }

      const planDb = await PlanModel.getById(idPlan);
      if (!planDb) {
        return res
          .status(400)
          .json({ error: "El plan seleccionado no existe." });
      }

      const contraseñaHash = await bcrypt.hash(datos.password, 10);

      const usuario = await UsuarioModel.createAgente({
        numero_id: datos.identificacion,
        correo: datos.correo,
        nombre: datos.nombre,
        contraseñaHash,
        direccion: datos.direccion,
        id_ciudad: ub.idCiudad,
        telefono: ub.tel,
        telefono2: ub.tel2,
        id_plan: planDb.id_plan,
        nombre_plan: planDb.nombre_plan,
        nombre_empresa: empresa,
        descripcion_agente: descripcion,
        comision: 0, // la fija el administrador después
        experiencia: datosAgente.exp,
      });

      await iniciarSesion(req, usuario); // registro con auto-login (sesión nueva)
      return res
        .status(201)
        .json({ mensaje: "Cuenta de agente creada correctamente", usuario });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error:
            "Ya existe una cuenta con ese correo o número de identificación.",
        });
      }
      console.error("Error en registro de agente:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // Devuelve el usuario que tiene la sesion abierta (o null si no hay sesion).
  // Las paginas HTML lo usan para mostrar el nombre del usuario y para
  // proteger los paneles de cliente y agente.
  // M2: si la cuenta fue suspendida mientras tenía la sesión abierta, se cierra
  // la sesión y se avisa con { aviso: "suspendida" }.
  async sesion(req, res) {
    const usuario = req.session.usuario;
    if (!usuario) return res.json({ usuario: null });
    try {
      if (!(await PersonaModel.tieneRol(usuario.numero_id, usuario.rol))) {
        req.session.destroy(() => {});
        res.clearCookie("eventnova.sid");
        return res.json({ usuario: null, aviso: "suspendida" });
      }
      return res.json({ usuario });
    } catch (error) {
      console.error("Error al consultar la sesión:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie("eventnova.sid"); // Tarea 16: también se borra la cookie del navegador
      res.json({ mensaje: "Sesión cerrada" });
    });
  },
};

module.exports = authController;
