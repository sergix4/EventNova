// js/controllers/admin/usuariosController.js
// CONTROLADOR de la gestión de clientes, agentes (Sprint 3 · Tarea 5)
// y administradores (Sprint 3 · Tarea 6).
// Conecta pages/admin/usuarios.html con:
//   - PersonaModel  → /api/usuarios (listar, editar y eliminar personas)
//   - PlanModel     → /api/planes   (selector de plan del agente)
//   - País / Departamento / Ciudad → selectores encadenados del modal

import { iniciarAdmin } from "./comunAdminController.js";
import { PersonaModel } from "../../models/personaModel.js";
import { PlanModel } from "../../models/planModel.js";
import { PaisModel } from "../../models/paisModel.js";
import { DepartamentoModel } from "../../models/departamentoModel.js";
import { CiudadModel } from "../../models/ciudadModel.js";
import { UsuariosView } from "../../views/admin/usuariosView.js";
import { abrirModal, cerrarModal } from "../../views/componentes/modal.js";
import { mostrarToast } from "../../views/componentes/toast.js";
import { paginacion, paginar } from "../../views/componentes/paginacion.js";

const POR_PAGINA = 8;
const PLURAL = {
  cliente: "clientes",
  agente: "agentes",
  administrador: "administradores",
};
const NOMBRE_ROL = {
  cliente: "Cliente",
  agente: "Agente",
  administrador: "Administrador",
};
const NUMERO_ID_VALIDO = /^[A-Za-z0-9-]{5,20}$/;
const TELEFONO_VALIDO = /^\+?[\d\s-]{7,20}$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Estado de la pantalla ──────────────────────────────────────────────────
let rol = "cliente"; // pestaña activa
let usuarios = []; // lista que devolvió la API para el rol activo
let pagina = 1;
let temporizador = null; // para no llamar a la API en cada tecla del buscador
let planes = null; // se piden una sola vez (al editar el primer agente)
let paises = null; // ídem
let usuarioSesion = null; // administrador que tiene la sesión abierta (no puede eliminarse)

// ─── Listado ────────────────────────────────────────────────────────────────
async function cargarUsuarios() {
  const buscar = document.getElementById("buscar-usuario").value.trim();
  UsuariosView.error("");
  UsuariosView.cargandoTabla(rol);
  try {
    usuarios = await PersonaModel.listar(rol, buscar);
  } catch (error) {
    usuarios = [];
    UsuariosView.error(error.message);
  }
  pagina = 1;
  dibujarTabla();
}

function dibujarTabla() {
  const buscar = document.getElementById("buscar-usuario").value.trim();
  const textoVacio = buscar
    ? `No hay ${PLURAL[rol]} que coincidan con "${buscar}".`
    : `Aún no hay ${PLURAL[rol]} registrados.`;

  UsuariosView.filas(
    rol,
    paginar(usuarios, pagina, POR_PAGINA),
    textoVacio,
    usuarioSesion?.numero_id,
  );
  UsuariosView.total(
    `${usuarios.length} ${usuarios.length === 1 ? rol : PLURAL[rol]}`,
  );
  UsuariosView.paginacion(
    paginacion(pagina, usuarios.length, POR_PAGINA, PLURAL[rol]),
  );
}

function cambiarPestana(nuevoRol) {
  if (nuevoRol === rol) return;
  rol = nuevoRol;
  document.getElementById("buscar-usuario").value = "";
  UsuariosView.pestanaActiva(rol);
  UsuariosView.cabecera(rol);
  UsuariosView.botonRegistrar(rol === "administrador");
  cargarUsuarios();
}

const buscarPersona = (id) => usuarios.find((u) => u.numero_id === id);

// ─── Ver ────────────────────────────────────────────────────────────────────
function ver(id) {
  const persona = buscarPersona(id);
  if (!persona) return;
  const caja = abrirModal(UsuariosView.detalle(persona), {
    clase: "modal--lg",
  });
  caja
    .querySelector("[data-editar]")
    .addEventListener("click", () => editar(id));
}

// ─── Editar ─────────────────────────────────────────────────────────────────
// Selectores encadenados: país → departamento → ciudad
async function llenarDepartamentos(idPais, seleccionado) {
  const lista = idPais ? await DepartamentoModel.listar(idPais) : [];
  UsuariosView.opciones(
    "departamento",
    lista.map((d) => ({
      id: d.id_departamento,
      nombre: d.nombre_departamento,
    })),
    seleccionado,
    "Selecciona un departamento",
    idPais ? "Sin departamentos" : "Primero elige un país",
  );
}

async function llenarCiudades(idDepartamento, seleccionada) {
  const lista = idDepartamento ? await CiudadModel.listar(idDepartamento) : [];
  UsuariosView.opciones(
    "ciudad",
    lista.map((c) => ({ id: c.id_ciudad, nombre: c.nombre_ciudad })),
    seleccionada,
    "Selecciona una ciudad",
    idDepartamento ? "Sin ciudades" : "Primero elige un departamento",
  );
}

async function prepararUbicacion(ubicacion) {
  paises ??= await PaisModel.listar();
  UsuariosView.opciones(
    "pais",
    paises.map((p) => ({ id: p.id_pais, nombre: p.nombre_pais })),
    ubicacion.id_pais,
    "Selecciona un país",
    "Sin países",
  );
  await llenarDepartamentos(ubicacion.id_pais, ubicacion.id_departamento);
  await llenarCiudades(ubicacion.id_departamento, ubicacion.id_ciudad);

  document.getElementById("pais").addEventListener("change", async (e) => {
    await llenarDepartamentos(e.target.value);
    await llenarCiudades("");
  });
  document
    .getElementById("departamento")
    .addEventListener("change", (e) => llenarCiudades(e.target.value));
}

/** Lee el formulario del modal y arma el body del PUT */
function leerFormulario(persona) {
  const valor = (id) => document.getElementById(id).value.trim();
  const datos = {
    nombre: valor("nombre"),
    correo: valor("correo").toLowerCase(),
    direccion: valor("direccion"),
    fecha_nacimiento: valor("fecha-nacimiento") || null,
    id_ciudad: Number(valor("ciudad")),
    telefonos: ["tel-0", "tel-1", "tel-2"].map(valor).filter(Boolean),
  };
  if (persona.nuevo) {
    // Solo al registrar: identificación y contraseña
    datos.numero_id = valor("numero-id");
    datos.password = document.getElementById("contrasena").value;
    datos.confirmar = document.getElementById("confirmar-contrasena").value;
  }
  if (persona.rol === "cliente") {
    datos.puntos = Number(valor("puntos"));
    datos.visualizar_publicidad = document.getElementById("publicidad").checked;
  } else if (persona.rol === "administrador") {
    datos.salario = valor("salario") === "" ? NaN : Number(valor("salario"));
    datos.horario = valor("horario");
  } else {
    datos.nombre_empresa = valor("empresa");
    datos.id_plan = Number(valor("plan"));
    datos.comision = Number(valor("comision"));
    datos.experiencia = valor("experiencia"); // texto: vacío → error en el backend
    datos.descripcion_agente = valor("descripcion");
  }
  return datos;
}

/** Validación rápida en el navegador (el backend vuelve a validar todo) */
function validar(datos) {
  if ("numero_id" in datos && !NUMERO_ID_VALIDO.test(datos.numero_id))
    return "La identificación debe tener entre 5 y 20 caracteres (letras, números o guiones).";
  if ("password" in datos && datos.password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres.";
  if ("password" in datos && datos.password !== datos.confirmar)
    return "Las contraseñas no coinciden.";
  if (!datos.nombre) return "El nombre es obligatorio.";
  if (!CORREO_VALIDO.test(datos.correo))
    return "El correo no tiene un formato válido.";
  if (datos.telefonos.length === 0)
    return "Debes registrar al menos un teléfono.";
  if (datos.telefonos.some((t) => !TELEFONO_VALIDO.test(t)))
    return "Hay un teléfono con formato no válido.";
  if (!datos.id_ciudad) return "Debes seleccionar país, departamento y ciudad.";
  if (
    "puntos" in datos &&
    (!Number.isInteger(datos.puntos) || datos.puntos < 0)
  )
    return "Los puntos deben ser un entero mayor o igual a 0.";
  if ("nombre_empresa" in datos && !datos.nombre_empresa)
    return "El nombre de la empresa es obligatorio.";
  if ("salario" in datos && (Number.isNaN(datos.salario) || datos.salario < 0))
    return "El salario debe ser un número mayor o igual a 0.";
  if ("horario" in datos && !datos.horario) return "El horario es obligatorio.";
  return "";
}

async function editar(id) {
  const persona = buscarPersona(id);
  if (!persona) return;
  try {
    if (persona.rol === "agente") planes ??= await PlanModel.listar();
  } catch (error) {
    return mostrarToast(error.message, { error: true, duracion: 4000 });
  }

  const caja = abrirModal(UsuariosView.formulario(persona, planes || []), {
    clase: "modal--xl",
    cerrarAlHacerClicFuera: false,
  });
  try {
    await prepararUbicacion(persona.ubicacion);
  } catch (error) {
    UsuariosView.errorFormulario(error.message);
  }
  caja.querySelector("#nombre").focus();

  caja.querySelector("#form-usuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = leerFormulario(persona);
    const problema = validar(datos);
    UsuariosView.errorFormulario(problema);
    if (problema) return;

    UsuariosView.guardando(true);
    try {
      await PersonaModel.actualizar(id, datos);
      cerrarModal();
      mostrarToast(`${NOMBRE_ROL[persona.rol]} actualizado correctamente.`, {
        duracion: 2500,
      });
      const paginaActual = pagina;
      await cargarUsuarios();
      pagina = Math.min(
        paginaActual,
        Math.max(1, Math.ceil(usuarios.length / POR_PAGINA)),
      );
      dibujarTabla();
    } catch (error) {
      UsuariosView.errorFormulario(error.message); // p. ej. 409 "Ya existe otro usuario con ese correo."
      UsuariosView.guardando(false);
    }
  });
}

// ─── Registrar administrador (Tarea 6) ──────────────────────────────────────
// Reutiliza el mismo formulario de "Editar" con una persona vacía marcada
// como nueva: así aparecen los campos de identificación y contraseña.
async function registrar() {
  const nuevo = {
    nuevo: true,
    rol: "administrador",
    numero_id: "",
    nombre: "",
    correo: "",
    direccion: "",
    fecha_nacimiento: "",
    telefonos: [],
    ubicacion: {},
    administrador: { salario: "", horario: "Lunes a viernes 8:00 - 17:00" },
  };

  const caja = abrirModal(UsuariosView.formulario(nuevo), {
    clase: "modal--xl",
    cerrarAlHacerClicFuera: false,
  });
  try {
    await prepararUbicacion(nuevo.ubicacion);
  } catch (error) {
    UsuariosView.errorFormulario(error.message);
  }
  caja.querySelector("#nombre").focus();

  caja.querySelector("#form-usuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = leerFormulario(nuevo);
    const problema = validar(datos);
    UsuariosView.errorFormulario(problema);
    if (problema) return;

    delete datos.confirmar; // el backend solo necesita la contraseña
    UsuariosView.guardando(true);
    try {
      await PersonaModel.crearAdministrador(datos);
      cerrarModal();
      mostrarToast(`${datos.nombre} ya es administrador de EventNova.`, {
        duracion: 3000,
      });
      await cargarUsuarios();
    } catch (error) {
      UsuariosView.errorFormulario(error.message); // p. ej. 409 "Ya existe un usuario con ese correo…"
      UsuariosView.guardando(false, "Registrar administrador");
    }
  });
}

// ─── Eliminar ───────────────────────────────────────────────────────────────
function eliminar(id) {
  const persona = buscarPersona(id);
  if (!persona) return;
  const caja = abrirModal(UsuariosView.confirmarEliminar(persona), {
    clase: "modal--sm",
  });
  caja
    .querySelector("#confirmar-eliminar")
    .addEventListener("click", async () => {
      cerrarModal();
      try {
        await PersonaModel.eliminar(id);
        mostrarToast(`${persona.nombre} fue eliminado correctamente.`, {
          duracion: 2500,
        });
        await cargarUsuarios();
      } catch (error) {
        // 409: "No se puede eliminar: el cliente tiene 10 reserva(s) asociada(s)."
        mostrarToast("No se pudo eliminar", {
          detalle: error.message,
          error: true,
          duracion: 5000,
          cerrable: true,
        });
      }
    });
}

// ─── Arranque ───────────────────────────────────────────────────────────────
usuarioSesion = await iniciarAdmin("usuarios");
UsuariosView.cabecera(rol);

document
  .getElementById("boton-registrar-admin")
  .addEventListener("click", registrar);

document
  .querySelectorAll("[data-rol]")
  .forEach((boton) =>
    boton.addEventListener("click", () => cambiarPestana(boton.dataset.rol)),
  );

document.getElementById("buscar-usuario").addEventListener("input", () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarUsuarios, 300); // espera a que deje de escribir
});

document.getElementById("tabla-usuarios").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-ver], [data-editar], [data-eliminar]");
  if (!boton) return;
  if (boton.dataset.ver) return ver(boton.dataset.ver);
  if (boton.dataset.editar) return editar(boton.dataset.editar);
  eliminar(boton.dataset.eliminar);
});

document
  .getElementById("paginacion-usuarios")
  .addEventListener("click", (e) => {
    const boton = e.target.closest("[data-pagina]");
    if (!boton || boton.disabled) return;
    pagina = Number(boton.dataset.pagina);
    dibujarTabla();
  });

cargarUsuarios();
