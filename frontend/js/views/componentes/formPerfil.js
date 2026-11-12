// js/views/componentes/formPerfil.js
// Sprint 3 · Tarea 13: VISTA compartida de «Mi perfil» para los 3 roles.
// Dibuja la ventana "Editar perfil" (datos de la persona + los campos extra
// que mande cada rol) y la ventana "Cambiar contraseña".

import { icono } from "./iconos.js";
import { esc } from "../../utils/formato.js";
import { mostrarToast } from "./toast.js";

function campo(
  id,
  etiqueta,
  control,
  { requerido = false, ancho = false, ayuda = "" } = {},
) {
  return `
    <div class="campo${ancho ? " form-perfil__ancho" : ""}">
      <label class="campo__etiqueta" for="${id}">${etiqueta}${requerido ? ' <span class="campo__requerido--rojo">*</span>' : ""}</label>
      ${control}
      ${ayuda ? `<p class="campo__ayuda">${ayuda}</p>` : ""}
    </div>`;
}

export const entradaPerfil = (id, valor, extra = "") =>
  `<input class="entrada" id="${id}" value="${esc(valor ?? "")}" ${extra}>`;

const selector = (id, texto) =>
  `<div class="envoltura-select"><select class="selector" id="${id}" disabled><option value="">${texto}</option></select></div>`;

export { campo as campoPerfil };

/** "Cali, Valle del Cauca, Colombia" (o '' si no tiene ciudad) */
export function textoUbicacion(u) {
  return [u?.ciudad, u?.departamento, u?.pais].filter(Boolean).join(", ");
}

export const FormPerfilView = {
  /**
   * Ventana "Editar perfil".
   * @param p        persona que devuelve GET /api/auth/perfil
   * @param extra    { titulo, html } campos propios del rol (opcional)
   */
  modalEditar(p, extra = null) {
    // Auditoría 4: mínimo 18 años y desde 1900 (igual que el backend)
    const hace18 = new Date();
    hace18.setFullYear(hace18.getFullYear() - 18);
    const maxNacimiento = hace18.toISOString().slice(0, 10);
    const tel = (i) =>
      entradaPerfil(
        `pf-tel-${i}`,
        p.telefonos[i],
        `type="tel" maxlength="20" placeholder="${i === 0 ? "+57 300 000 0000" : "Opcional"}"`,
      );

    return `
      <form id="form-perfil" novalidate>
        <div class="modal__cabecera">
          <div><h3 class="modal__titulo">Editar mi perfil</h3><p class="modal__subtitulo">Los cambios se guardan en tu cuenta de EventNova</p></div>
          <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono("cerrar", 18)}</button>
        </div>
        <div class="modal__cuerpo">
          <p class="form-perfil__seccion">Datos personales</p>
          <div class="form-perfil__grid">
            ${campo("pf-nombre", "Nombre completo", entradaPerfil("pf-nombre", p.nombre, 'maxlength="100" autocomplete="name"'), { requerido: true, ancho: true })}
            ${campo("pf-identificacion", "Identificación", entradaPerfil("pf-identificacion", p.numero_id, "disabled"), { ayuda: "No se puede modificar." })}
            ${campo("pf-correo", "Correo electrónico", entradaPerfil("pf-correo", p.correo, 'type="email" maxlength="150" autocomplete="email"'), { requerido: true })}
            ${campo("pf-nacimiento", "Fecha de nacimiento", entradaPerfil("pf-nacimiento", p.fecha_nacimiento, `type="date" min="1900-01-01" max="${maxNacimiento}"`))}
            ${campo("pf-direccion", "Dirección", entradaPerfil("pf-direccion", p.direccion, 'maxlength="255" autocomplete="street-address"'))}
          </div>
 
          <p class="form-perfil__seccion">Teléfonos <span class="campo__opcional">(de 1 a 3)</span></p>
          <div class="form-perfil__grid form-perfil__grid--3">
            ${campo("pf-tel-0", "Teléfono 1", tel(0), { requerido: true })}
            ${campo("pf-tel-1", "Teléfono 2", tel(1))}
            ${campo("pf-tel-2", "Teléfono 3", tel(2))}
          </div>
 
          <p class="form-perfil__seccion">Ubicación</p>
          <div class="form-perfil__grid form-perfil__grid--3">
            ${campo("pf-pais", "País", selector("pf-pais", "Cargando países…"), { requerido: true })}
            ${campo("pf-departamento", "Departamento", selector("pf-departamento", "Primero elige un país"), { requerido: true })}
            ${campo("pf-ciudad", "Ciudad", selector("pf-ciudad", "Primero elige un departamento"), { requerido: true })}
          </div>
 
          ${
            extra
              ? `
          <p class="form-perfil__seccion">${extra.titulo}</p>
          <div class="form-perfil__grid">${extra.html}</div>`
              : ""
          }
 
          <p class="form-perfil__error" id="error-perfil" role="alert" hidden></p>
        </div>
        <div class="modal__pie">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="submit" class="boton boton--primario boton--seminegrita" id="guardar-perfil">${icono("check", 15)}Guardar cambios</button>
        </div>
      </form>`;
  },

  /** Ventana "Cambiar contraseña" */
  modalContrasena() {
    const clave = (id, etiqueta, autocompletar) =>
      campo(
        id,
        etiqueta,
        entradaPerfil(
          id,
          "",
          `type="password" placeholder="••••••••" autocomplete="${autocompletar}"`,
        ),
        { ancho: true },
      );
    return `
      <form id="form-contrasena" novalidate>
        <div class="modal__cabecera">
          <div><h3 class="modal__titulo">Cambiar contraseña</h3><p class="modal__subtitulo">La nueva contraseña debe tener al menos 8 caracteres.</p></div>
          <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono("cerrar", 18)}</button>
        </div>
        <div class="modal__cuerpo">
          <div class="form-perfil__grid">
            ${clave("pf-clave-actual", "Contraseña actual", "current-password")}
            ${clave("pf-clave-nueva", "Nueva contraseña", "new-password")}
            ${clave("pf-clave-confirmar", "Confirmar nueva contraseña", "new-password")}
          </div>
          <p class="form-perfil__error" id="error-perfil" role="alert" hidden></p>
        </div>
        <div class="modal__pie">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="submit" class="boton boton--primario boton--seminegrita" id="guardar-contrasena">Guardar contraseña</button>
        </div>
      </form>`;
  },

  /** Llena un <select> de la ventana (país, departamento o ciudad) */
  opciones(caja, idSelect, lista, valor, texto, textoVacio) {
    const select = caja.querySelector("#" + idSelect);
    const habilitado = lista.length > 0;
    select.innerHTML =
      `<option value="">${habilitado ? texto : textoVacio}</option>` +
      lista
        .map((o) => `<option value="${o.id}">${esc(o.nombre)}</option>`)
        .join("");
    select.disabled = !habilitado;
    select.value = valor ? String(valor) : "";
  },

  /** Lo que se dibuja si el perfil no se pudo cargar */
  errorCarga(mensaje) {
    return `
      <div class="vacio">
        <div class="vacio__icono">${icono("alerta", 28)}</div>
        <p class="vacio__titulo">No se pudo cargar tu perfil</p>
        <p class="vacio__texto">${esc(mensaje)}</p>
        <button type="button" class="boton boton--primario" onclick="location.reload()">Reintentar</button>
      </div>`;
  },

  /** Muestra (o esconde, si mensaje es vacío) el error dentro de la ventana */
  error(caja, mensaje) {
    const parrafo = caja.querySelector("#error-perfil");
    parrafo.hidden = !mensaje;
    parrafo.textContent = mensaje || "";
  },
};
