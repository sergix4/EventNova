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

const RUTA_INICIO = new URL("../../../index.html", import.meta.url).href;
const RUTA_LOGIN = new URL("../../../pages/login.html", import.meta.url).href;

const PAGINA_INICIO_POR_ROL = {
  cliente: new URL("../../../pages/cliente/inicio.html", import.meta.url).href,
  agente: new URL("../../../pages/agente/mis-eventos.html", import.meta.url).href,
  administrador: new URL("../../../pages/admin/dashboard.html", import.meta.url).href,
};

export function paginaInicioDe(rol) {
  return PAGINA_INICIO_POR_ROL[rol] || RUTA_INICIO;
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
    window.location.replace(RUTA_LOGIN);
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
    window.location.href = RUTA_INICIO;
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

// Cada aviso se identifica por su reserva y su texto: si la reserva cambia de
// estado (pendiente → confirmada), el texto cambia y el aviso vuelve a salir como nuevo.
const idAviso = (a) => `${a.id_reserva}|${a.texto}`;

function leerLeidas() {
  try {
    const guardado = JSON.parse(localStorage.getItem(claveLeidas()) || "[]");
    return new Set(Array.isArray(guardado) ? guardado : []);
  } catch {
    return new Set(); // navegador sin localStorage: todas quedan como no leídas
  }
}

function guardarLeidas(leidas) {
  try {
    // Solo se guardan las últimas 50 para que no crezca sin límite
    localStorage.setItem(claveLeidas(), JSON.stringify([...leidas].slice(-50)));
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
  const leidas = leerLeidas();

  const dibujar = () => {
    const lista = avisos.map((a) => ({
      ...a,
      tiempo: haceCuanto(a.fecha),
      leida: leidas.has(idAviso(a)),
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
      avisos.forEach((a) => leidas.add(idAviso(a)));
      guardarLeidas(leidas);
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
