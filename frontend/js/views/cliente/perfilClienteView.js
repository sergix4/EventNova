// js/views/cliente/perfilClienteView.js
// VISTA del perfil del cliente.
// Sprint 3 · Tarea 13: muestra los datos reales de la BD (USUARIO, TELEFONOS,
// CLIENTE y su ubicación). La edición se hace en la ventana compartida
// (js/views/componentes/formPerfil.js).

import { icono } from "../componentes/iconos.js";
import { FormPerfilView, textoUbicacion } from "../componentes/formPerfil.js";
import { esc, iniciales, num, fechaLarga } from "../../utils/formato.js";

function filaCampo(nombreIcono, etiqueta, valor) {
  return `
    <div class="fila-campo">
      ${icono(nombreIcono, 16)}
      <div><p class="fila-info__etiqueta">${etiqueta}</p><p class="fila-info__valor">${esc(valor)}</p></div>
    </div>`;
}

function filaAlternar(id, etiqueta, descripcion, activo) {
  return `
    <div class="fila-alternar">
      <div><p id="etq-${id}">${etiqueta}</p><p>${descripcion}</p></div>
      <button type="button" class="interruptor" role="switch" aria-checked="${activo}" aria-labelledby="etq-${id}" data-preferencia="${id}"></button>
    </div>`;
}

export const PerfilClienteView = {
  /**
   * @param p  perfil de GET /api/auth/perfil
   */
  mostrar(p) {
    document.getElementById("perfil").innerHTML = `
      <section class="tarjeta tarjeta-perfil">
        <div class="tarjeta-perfil__avatar">
          <div class="tarjeta-perfil__iniciales">${esc(iniciales(p.nombre))}</div>
        </div>
        <div style="flex:1;min-width:0">
          <p class="tarjeta-perfil__nombre">${esc(p.nombre)}</p>
          <p class="tarjeta-perfil__rol">Cliente${p.fecha_registro ? " desde el " + esc(fechaLarga(p.fecha_registro)) : ""}</p>
          <div class="tarjeta-perfil__etiquetas">
            <span class="etiqueta-indigo">Cuenta activa</span>
            <span class="etiqueta-gris" style="padding:4px 10px">ID: ${esc(p.cliente.codigo_cliente || p.numero_id)}</span>
          </div>
        </div>
      </section>
 
      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera">
          <h2 class="titulo-acento">Información personal</h2>
          <button type="button" class="boton-editar" data-accion="editar">${icono("editar", 15)}Editar</button>
        </div>
        ${filaCampo("usuario", "Nombre completo", p.nombre)}
        ${filaCampo("documentoId", "N.° de identificación", p.numero_id)}
        ${filaCampo("correo", "Correo electrónico", p.correo)}
        ${filaCampo("telefono", p.telefonos.length > 1 ? "Teléfonos" : "Teléfono", p.telefonos.join(" · ") || "No registrado")}
        ${filaCampo("calendario", "Fecha de nacimiento", fechaLarga(p.fecha_nacimiento) || "No registrada")}
        ${filaCampo("ubicacion", "Ubicación", textoUbicacion(p.ubicacion) || "No registrada")}
        ${filaCampo("casa", "Dirección", p.direccion || "No registrada")}
      </section>
 
      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera"><h2 class="titulo-acento" style="--acento:var(--primario-claro)">Mi cuenta</h2></div>
        ${filaCampo("estrella", "Puntos acumulados", num(p.cliente.puntos))}
        ${filaCampo("ticket", "Reservas realizadas", num(p.cliente.total_reservas))}
      </section>
 
      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera"><h2 class="titulo-acento titulo-acento--coral">Preferencias</h2></div>
        ${filaAlternar("publicidad", "Publicidad personalizada", "Recibe sugerencias de eventos según tus intereses.", p.cliente.visualizar_publicidad)}
      </section>
 
      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera"><h2 class="titulo-acento" style="--acento:var(--primario-claro)">Seguridad</h2></div>
        <button type="button" class="opcion-seguridad" data-accion="cambiar-clave">
          ${icono("escudo", 16)}
          <div><strong>Cambiar contraseña</strong><span>Te pediremos tu contraseña actual.</span></div>
          <span style="color:var(--gris-400)">${icono("derecha", 14)}</span>
        </button>
      </section>
 
      <section class="zona-peligro">
        <div><strong>Cerrar sesión</strong><p>Saldrás de tu cuenta en este dispositivo.</p></div>
        <button type="button" data-accion="cerrar-sesion">Cerrar sesión</button>
      </section>
      <div class="panel__espaciador"></div>`;
  },

  /** Cambia un interruptor sin redibujar toda la página */
  marcarPreferencia(id, activo) {
    document
      .querySelector(`[data-preferencia="${id}"]`)
      ?.setAttribute("aria-checked", String(activo));
  },

  mostrarError(mensaje) {
    document.getElementById("perfil").innerHTML =
      FormPerfilView.errorCarga(mensaje);
  },
};
