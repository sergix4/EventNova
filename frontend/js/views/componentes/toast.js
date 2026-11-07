// js/views/componentes/toast.js
// VISTA compartida: aviso flotante verde ("Evento creado correctamente.").
// Con { error: true } sale en rojo (p. ej. cuando el backend responde 409).

import { icono } from "./iconos.js";
import { esc } from "../../utils/formato.js";

let temporizador = null;

// Tarea 16: es el ÚNICO aviso de éxito/error de toda la aplicación.
//   mostrarToast('Guardado.')                      -> verde
//   mostrarToast(error.message, { error: true })   -> rojo (dura más por defecto)
// El mensaje se escapa aquí, así que NO hace falta usar esc() al llamarlo.
export function mostrarToast(
  mensaje,
  {
    detalle = "",
    duracion,
    abajo = false,
    cerrable = false,
    error = false,
  } = {},
) {
  document.querySelector(".toast")?.remove();
  clearTimeout(temporizador);
  duracion ??= error ? 4500 : 2500;

  const toast = document.createElement("div");
  toast.className =
    "toast" + (abajo ? " toast--abajo" : "") + (error ? " toast--error" : "");
  toast.setAttribute("role", error ? "alert" : "status"); // el lector de pantalla lee los errores de inmediato
  toast.innerHTML = `
    <span class="toast__icono">${icono(error ? "cerrar" : "check", 14, { grosor: 2.5 })}</span>
    <span>${esc(mensaje)}${detalle ? `<span class="toast__detalle">${esc(detalle)}</span>` : ""}</span>

    ${cerrable ? `<button type="button" class="toast__cerrar" aria-label="Cerrar">${icono("cerrar", 18)}</button>` : ""}`;
  document.body.appendChild(toast);
  toast
    .querySelector(".toast__cerrar")
    ?.addEventListener("click", () => toast.remove());
  if (duracion) temporizador = setTimeout(() => toast.remove(), duracion);
  return toast;
}
