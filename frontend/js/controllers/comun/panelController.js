// js/controllers/comun/panelController.js
// CONTROLADOR compartido por todas las páginas con barra lateral.
//   - Verifica la sesión (y el rol) con el backend.
//   - Dibuja la barra lateral correcta.
//   - Conecta "Cerrar sesión", el menú en celulares y la campana del cliente.

import { AuthModel } from "../../models/authModel.js";
import { ReservaModel } from "../../models/reservaModel.js";
import {
  barraCliente,
  barraAgente,
  barraAdmin,
  panelNotificaciones,
} from "../../views/componentes/panel.js";
import { iniciales, haceCuanto } from "../../utils/formato.js";

const BARRAS = {
  cliente: barraCliente,
  agente: barraAgente,
  administrador: barraAdmin,
};

// Usuario con sesión (lo guarda iniciarPanel; la campana lo usa para su clave)
let usuarioActual = null;

const PAGINA_INICIO_POR_ROL = {
  cliente: "/pages/cliente/inicio.html",
  agente: "/pages/agente/mis-eventos.html",
  administrador: "/pages/admin/dashboard.html",
};

export function paginaInicioDe(rol) {
  return PAGINA_INICIO_POR_ROL[rol] || "/";
}

/**
 * Prepara el panel y devuelve el usuario con sesión (o null).
 * @param {object} config
 *   rol             'cliente' | 'agente' | 'administrador'
 *   activo          clave del ítem del menú que se marca como activo
 *   requiereSesion  si es true y no hay sesión del rol indicado, redirige al login
 */
export async function iniciarPanel({ rol, activo, requiereSesion = true }) {
  const usuario = await AuthModel.obtenerSesion();

  if (requiereSesion && (!usuario || usuario.rol !== rol)) {
    // Sin sesión (o con otro rol): se manda al login
    window.location.replace("/pages/login.html");
    return new Promise(() => {}); // detiene la ejecución del controlador de la página
  }

  const usuarioDelRol = usuario && usuario.rol === rol ? usuario : null;
  usuarioActual = usuarioDelRol;
  dibujarBarra(rol, activo, usuarioDelRol);

  conectarCerrarSesion();
  conectarMenuMovil();

  return usuarioDelRol;
}

/**
 * Dibuja la barra lateral y el avatar de la cabecera con los datos del usuario.
 * Tarea 13: «Mi perfil» la vuelve a llamar después de guardar, para que el
 * nombre nuevo se vea sin recargar la página.
 */
export function dibujarBarra(rol, activo, usuario) {
  document.getElementById("barra-lateral").innerHTML = BARRAS[rol](
    activo,
    usuario,
  );
  const avatar = document.getElementById("avatar-cabecera");
  if (avatar) avatar.textContent = iniciales(usuario?.nombre, "Cliente");
}

/** Todos los botones con data-accion="cerrar-sesion" cierran la sesión. */
export function conectarCerrarSesion() {
  document.addEventListener("click", async (e) => {
    if (!e.target.closest('[data-accion="cerrar-sesion"]')) return;
    await AuthModel.cerrarSesion();
    window.location.href = "/";
  });
}

function conectarMenuMovil() {
  document
    .querySelectorAll('[data-accion="abrir-menu"]')
    .forEach((boton) =>
      boton.addEventListener("click", () =>
        document.body.classList.add("panel--menu-abierto"),
      ),
    );
  document
    .querySelector(".panel__velo")
    ?.addEventListener("click", () =>
      document.body.classList.remove("panel--menu-abierto"),
    );
}

// ─── Campana de notificaciones del cliente (Sprint 3 · Tarea 15) ───────────
// Las notificaciones salen de las reservas REALES del cliente (GET /api/reservas).
// "Marcar todas como leídas" guarda en el navegador (localStorage) la fecha de
// la más reciente; así el punto rojo no vuelve a salir al cambiar de página.

const claveLeidas = () =>
  `eventnova:notificaciones-leidas:${usuarioActual?.numero_id || "anonimo"}`;

function leerUltimaLeida() {
  try {
    return Number(localStorage.getItem(claveLeidas())) || 0;
  } catch {
    return 0; // navegador sin localStorage: todas quedan como no leídas
  }
}

function guardarUltimaLeida(ms) {
  try {
    localStorage.setItem(claveLeidas(), String(ms));
  } catch {
    /* si no se puede guardar, solo dura mientras esté abierta la página */
  }
}

export async function iniciarNotificaciones() {
  const contenedor = document.querySelector(".notificaciones");
  if (!contenedor) return;
  const boton = contenedor.querySelector('[data-accion="notificaciones"]');
  const punto = contenedor.querySelector(".notificaciones__punto");
  const panel = contenedor.querySelector(".notificaciones__panel");
  if (!boton || !panel) return;

  let avisos = [];
  let error = "";
  let ultimaLeida = leerUltimaLeida();

  const dibujar = () => {
    const lista = avisos.map((a) => ({
      ...a,
      tiempo: haceCuanto(a.fecha),
      leida: a.fecha.getTime() <= ultimaLeida,
    }));
    panel.innerHTML = panelNotificaciones(lista, error);
    // El punto solo aparece si hay alguna notificación sin leer
    if (punto) punto.hidden = !lista.some((n) => !n.leida);
  };

  if (punto) punto.hidden = true; // no se muestra hasta saber si hay algo nuevo

  boton.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.closest('[data-accion="marcar-leidas"]')) {
      ultimaLeida = Math.max(
        ...avisos.map((a) => a.fecha.getTime()),
        ultimaLeida,
      );
      guardarUltimaLeida(ultimaLeida);
      dibujar();
    }
  });
  document.addEventListener("click", () => {
    panel.hidden = true;
  });

  try {
    avisos = await ReservaModel.notificacionesCliente();
  } catch (err) {
    error = err.message;
  }
  dibujar();
}
