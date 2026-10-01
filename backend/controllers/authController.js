// controllers/authController.js
// Un "Controller" recibe la peticion (request), habla con el Model si
// necesita datos, y responde. Como el backend es una API, responde con
// JSON en vez de renderizar una Vista HTML.

const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const PlanModel = require('../models/planModel'); 

const PLANES = {                                   
  basico: 'Plan Básico',
  profesional: 'Plan Profesional',
  empresa: 'Plan Empresa',
};

const authController = {
  async login(req, res) {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    try {
      const usuario = await UsuarioModel.findByEmail(correo);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!coincide) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      if (!usuario.rol) {
        return res.status(403).json({ error: 'El usuario no tiene un rol asignado.' });
      }

      // Nunca guardar la contraseña en la sesión
      req.session.usuario = {
        numero_id: usuario.numero_id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        direccion: usuario.direccion,
        rol: usuario.rol,
        agente: usuario.agente,  
      };

      return res.json({ mensaje: 'Inicio de sesión exitoso', usuario: req.session.usuario });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  async register(req, res) {
    const { identificacion, nombre, correo, password, direccion } = req.body;

    if (!identificacion || !nombre || !correo || !password) {
      return res.status(400).json({ error: 'Identificación, nombre, correo y contraseña son obligatorios.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
      const yaExiste = await UsuarioModel.existsByEmailOrId(correo, identificacion);
      if (yaExiste) {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese correo o número de identificación.' });
      }

      const contraseñaHash = await bcrypt.hash(password, 10);
      const usuario = await UsuarioModel.createCliente({
        numero_id: identificacion,
        correo,
        nombre,
        contraseñaHash,
        direccion,
      });

      req.session.usuario = usuario; // registro con auto-login
      return res.status(201).json({ mensaje: 'Cuenta creada correctamente', usuario });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

    async registerAgente(req, res) {
    const { identificacion, nombre, correo, password, direccion, empresa, descripcionNegocio, plan } = req.body;

    if (!identificacion || !nombre || !correo || !password || !empresa || !plan) {
      return res.status(400).json({ error: 'Identificación, nombre, correo, contraseña, empresa y plan son obligatorios.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (!PLANES[plan]) {
      return res.status(400).json({ error: 'El plan seleccionado no es válido.' });
    }

    try {
      const yaExiste = await UsuarioModel.existsByEmailOrId(correo, identificacion);
      if (yaExiste) {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese correo o número de identificación.' });
      }

      const planDb = await PlanModel.findByNombre(PLANES[plan]);
      if (!planDb) {
        return res.status(400).json({ error: 'El plan no existe en la base de datos. Ejecuta seed_planes.sql.' });
      }

      const contraseñaHash = await bcrypt.hash(password, 10);
      const usuario = await UsuarioModel.createAgente({
        numero_id: identificacion,
        correo,
        nombre,
        contraseñaHash,
        direccion,
        id_plan: planDb.id_plan,
        nombre_plan: planDb.nombre_plan,
        nombre_empresa: empresa,
        descripcion_agente: descripcionNegocio,
      });

      req.session.usuario = usuario; // registro con auto-login
      return res.status(201).json({ mensaje: 'Cuenta de agente creada correctamente', usuario });
    } catch (error) {
      console.error('Error en registro de agente:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // Devuelve el usuario que tiene la sesion abierta (o null si no hay sesion).
  // Las paginas HTML lo usan para mostrar el nombre del usuario y para
  // proteger los paneles de cliente y agente.
  sesion(req, res) {
    return res.json({ usuario: req.session.usuario || null });
  },

  logout(req, res) {
    req.session.destroy(() => res.json({ mensaje: 'Sesión cerrada' }));
  },
};

module.exports = authController;