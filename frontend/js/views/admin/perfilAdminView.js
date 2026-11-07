// js/views/admin/perfilAdminView.js
// VISTA del perfil del administrador.
// Sprint 3 · Tarea 13: todo sale de la BD (GET /api/auth/perfil). Ya no se
// usan PERFIL_ADMIN ni ACTIVIDAD_CUENTA de ejemplo. La edición y el cambio de
// contraseña usan las ventanas compartidas (componentes/formPerfil.js).

import { icono } from "../componentes/iconos.js";
import { FormPerfilView, textoUbicacion } from "../componentes/formPerfil.js";
import {
  esc,
  iniciales,
  cop,
  fechaLarga,
  fechaHora,
} from "../../utils/formato.js";



function tarjeta(titulo, subtitulo, cuerpo, accion = "") {
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera">
        <div><h2 class="tarjeta__titulo">${titulo}</h2><p class="tarjeta__subtitulo">${subtitulo}</p></div>
        ${accion}
      </div>
      <div class="tarjeta__cuerpo">${cuerpo}</div>
    </section>`;
}

const dato = (etiqueta, valor) =>
  `<div class="cuenta-dato"><small>${etiqueta}</small><p>${esc(valor || "No registrado")}</p></div>`;

function opcionSeguridad(accion, ic, titulo, sub, color, fondo, boton) {
  return `
    <div class="opcion-admin">
      <div class="opcion-admin__izq">
        <div class="opcion-admin__icono" style="--fondo-icono:${fondo};--color-icono:${color}">${icono(ic, 18)}</div>
        <div><strong>${titulo}</strong><small>${sub}</small></div>
      </div>
      ${boton.replace("<button", `<button data-accion="${accion}"`)}
    </div>`;
}

export const PerfilAdminView = {
  /**
      * @param perfil  perfil de GET /api/auth/perfil (rol administrador)
      */
     mostrar({ perfil }) {
    const admin = perfil.administrador;
    const contenido = document.getElementById("contenido");
    contenido.classList.add("panel__contenido--medio");
    contenido.innerHTML = `
      ${tarjeta(
        "Información personal",
        "Datos personales asociados a tu cuenta de administrador",
        `
        <div class="perfil-admin__cabecera">
          <div class="perfil-admin__avatar">${esc(iniciales(perfil.nombre))}</div>
          <div>
            <p class="perfil-admin__nombre">${esc(perfil.nombre)}</p>
            <p class="perfil-admin__correo">${esc(perfil.correo)}</p>
            <div class="perfil-admin__insignias">
              <span class="insignia insignia--admin"><span class="insignia__punto"></span>Administrador</span>
              <span class="insignia insignia--activa"><span class="insignia__punto"></span>Cuenta activa</span>
            </div>
          </div>
        </div>
        <div class="cuenta-grid" style="margin-top:20px">
          ${dato("Nombre completo", perfil.nombre)}
          ${dato("Correo electrónico", perfil.correo)}
          ${dato("Nº de identificación", perfil.numero_id)}
          ${dato(perfil.telefonos.length > 1 ? "Teléfonos" : "Teléfono", perfil.telefonos.join(" · "))}
          ${dato("Fecha de nacimiento", fechaLarga(perfil.fecha_nacimiento))}
          ${dato("Dirección", perfil.direccion)}
          ${dato("Ubicación", textoUbicacion(perfil.ubicacion))}
        </div>`,
        `<button type="button" class="boton boton--secundario" data-accion="editar-perfil">${icono("editar", 15)}Editar perfil</button>`,
      )}
 
      ${tarjeta(
        "Información de la cuenta",
        "Detalles del estado y acceso de tu cuenta administrativa",
        `
        <div class="cuenta-grid">
          <div class="cuenta-dato"><small>Rol</small><span class="pildora-cuenta pildora-cuenta--admin">Administrador</span></div>
          <div class="cuenta-dato"><small>Estado de la cuenta</small><span class="pildora-cuenta pildora-cuenta--activa">Activo</span></div>
          ${dato("Fecha de registro", fechaLarga(perfil.fecha_registro))}
          ${dato("Sesión actual iniciada", fechaHora(perfil.inicio_sesion) || "—")}
          ${dato("Código de administrador", admin.codigo_admin)}
          ${dato("Horario", admin.horario)}
          ${dato("Salario mensual", cop(admin.salario))}
          <div class="cuenta-dato cuenta-dato--indigo"><small>Tipo de cuenta</small><span class="pildora-cuenta pildora-cuenta--indigo">${icono("escudo", 14)}Cuenta administrativa</span></div>
        </div>
        <p class="campo__ayuda" style="margin-top:12px">El salario y el horario los modifica otro administrador desde Usuarios → Administradores.</p>`,
      )}
 
      ${tarjeta(
        "Seguridad",
        "Administra las opciones de seguridad y acceso de tu cuenta",
        `
        <div class="opciones-admin">
          ${opcionSeguridad(
            "cambiar-clave",
            "llave",
            "Cambiar contraseña",
            "Te pediremos tu contraseña actual.",
            "#4f46e5",
            "#eef2ff",
            `<button type="button" class="boton boton--secundario">${icono("llave", 15)}Cambiar</button>`,
          )}
          ${opcionSeguridad(
            "cambiar-correo",
            "correo",
            "Cambiar correo electrónico",
            "Es el correo con el que inicias sesión.",
            "#d97706",
            "#fffbeb",
            `<button type="button" class="boton boton--secundario boton--ambar">${icono("correo", 15)}Cambiar</button>`,
          )}
          ${opcionSeguridad(
            "cerrar-sesion",
            "salir",
            "Cerrar sesión",
            "Sal de tu cuenta en este dispositivo.",
            "#dc2626",
            "#fef2f2",
            `<button type="button" class="boton boton--rojo-contorno">${icono("salir", 15)}Cerrar sesión</button>`,
          )}
        </div>`,
      )}
 

      <div class="espacio-final"></div>`;

  },

  mostrarError(mensaje) {
    document.getElementById("contenido").innerHTML =
      FormPerfilView.errorCarga(mensaje);
  },
};
