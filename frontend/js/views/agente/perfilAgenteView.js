// js/views/agente/perfilAgenteView.js
// VISTA del perfil del agente: datos personales, datos de agente, plan,
// planes disponibles, facturación y seguridad.
// Sprint 3 · Tarea 13: los datos personales y de agente salen de la BD; la
// ventana de edición y la de contraseña son las compartidas (componentes/formPerfil.js).
// El plan, los planes y la facturación siguen con la lista fija PLANES (tarea 14).

import { icono } from "../componentes/iconos.js";
import {
  FormPerfilView,
  campoPerfil,
  entradaPerfil,
} from "../componentes/formPerfil.js";
import { esc, num, fechaLarga } from "../../utils/formato.js";

const fila = (etiqueta, valor) =>
  `<div class="fila-dato"><span>${etiqueta}</span><span>${esc(valor || "No registrado")}</span></div>`;
const ini = (nombre) =>
  (nombre || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

function seccion(titulo, cuerpo, accion = "") {
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera" style="flex-wrap:nowrap"><h2 class="tarjeta__titulo">${titulo}</h2>${accion}</div>
      <div class="tarjeta__cuerpo">${cuerpo}</div>
    </section>`;
}

function botonEditar(accion, texto) {
  return `<button type="button" class="boton boton--secundario" style="padding:8px 14px" data-accion="${accion}">${icono("editar", 15)}${texto}</button>`;
}

export const PerfilAgenteView = {
  /**
   * @param perfil      perfil de GET /api/auth/perfil (rol agente)
   * @param planes      lista fija PLANES (tarea 14 la pasará a la BD)
   * @param planActual  clave del plan del agente ('basico' | 'profesional' | 'empresa')
   */
  mostrar({ perfil, planes, planActual }) {
    const plan = planes.find((p) => p.clave === planActual);
    const agente = perfil.agente;
    const est = agente.estadisticas || {};
    const u = perfil.ubicacion;
    document.getElementById("contenido").innerHTML = `
      ${seccion(
        "Información personal",
        `
        <div class="perfil-agente__cabecera">
          <div class="perfil-agente__avatar">${esc(ini(perfil.nombre))}</div>
          <div><p class="perfil-agente__nombre">${esc(perfil.nombre)}</p><span class="etiqueta-agente">Agente</span></div>
        </div>
        ${fila("Nombre completo", perfil.nombre)}
        ${fila("Tipo de usuario", "Agente")}
        ${fila("Correo electrónico", perfil.correo)}
        ${fila("Número de identificación", perfil.numero_id)}
        ${fila(perfil.telefonos.length > 1 ? "Teléfonos" : "Teléfono", perfil.telefonos.join(" · "))}
        ${fila("Fecha de nacimiento", fechaLarga(perfil.fecha_nacimiento))}
        ${fila("Dirección", perfil.direccion)}
        ${fila("País", u.pais)}
        ${fila("Departamento", u.departamento)}
        ${fila("Ciudad", u.ciudad)}`,
        botonEditar("editar-personal", "Editar perfil"),
      )}
 
      ${seccion(
        "Información como agente",
        `
        ${fila("Empresa o negocio", agente.nombre_empresa)}
        ${fila("Descripción del negocio", agente.descripcion_agente)}
        ${fila("Experiencia", `${agente.experiencia} ${agente.experiencia === 1 ? "año" : "años"}`)}
        ${fila("Comisión", `${num(agente.comision)} %`)}
        ${fila("Eventos registrados", num(est.eventos_registrados ?? 0))}
        ${fila("Eventos activos", num(est.eventos_activos ?? 0))}
        ${fila("Reservas recibidas", `${num(est.reservas_recibidas ?? 0)} (${num(est.entradas_vendidas ?? 0)} entradas)`)}
        ${fila("Agente desde", fechaLarga(perfil.fecha_registro))}
        <p class="campo__ayuda" style="margin-top:8px">La comisión y el plan los gestiona el administrador.</p>`,
        botonEditar("editar-agente", "Editar información"),
      )}
 
      <section class="plan-activo">
        <div class="plan-activo__fila">
          <div>
            <p class="plan-activo__rotulo">Plan activo</p>
            <h2 class="plan-activo__nombre">${esc(plan.nombre)}</h2>
            <div class="plan-activo__estado">
              <span class="plan-activo__pildora"><span class="insignia__punto"></span>Activo</span>
              <span class="plan-activo__cobro">Próximo cobro: 30 de septiembre de 2026</span>
            </div>
          </div>
          <div class="plan-activo__precio"><strong>${esc(plan.precioCorto)}</strong><span>por mes</span></div>
        </div>
        <ul class="plan-activo__beneficios">
          ${plan.beneficios
            .slice(0, 3)
            .map(
              (b) =>
                `<li><span>${icono("check", 16, { grosor: 2.5 })}</span>${esc(b)}</li>`,
            )
            .join("")}
        </ul>
        <div class="plan-activo__acciones">
          <button type="button" class="boton-blanco">Administrar plan</button>
          <button type="button" class="boton-vidrio" data-accion="cambiar-plan">Cambiar plan</button>
        </div>
      </section>
 
      ${seccion(
        "Planes disponibles",
        `
        <div class="planes-perfil">
          ${planes
            .map((p) => {
              const actual = p.clave === planActual;
              return `
              <div class="plan-perfil${actual ? " plan-perfil--actual" : ""}">
                ${p.recomendado ? `<span class="plan-perfil__recomendado">${icono("estrella", 14, { relleno: "currentColor", grosor: 0 })}Recomendado</span>` : ""}
                <p class="plan-perfil__nombre">${esc(p.nombre)}</p>
                <p class="plan-perfil__precio">${esc(p.precioCorto)}</p>
                <p class="plan-perfil__periodo">COP por mes</p>
                <ul>${p.beneficios.map((b) => `<li><span>${icono("check", 16, { grosor: 2.5 })}</span>${esc(b)}</li>`).join("")}</ul>
                ${
                  actual
                    ? '<button type="button" class="plan-perfil__boton plan-perfil__boton--actual" disabled>Plan actual</button>'
                    : `<button type="button" class="plan-perfil__boton" data-elegir-plan="${p.clave}">Elegir plan</button>`
                }
              </div>`;
            })
            .join("")}
        </div>`,
      )}
 
      ${seccion(
        "Información de facturación",
        `
        ${fila("Plan actual", plan.nombre)}
        ${fila("Precio mensual", plan.precio + " por mes")}
        ${fila("Método de pago", "Tarjeta Visa •••• 4821")}
        ${fila("Próxima fecha de cobro", "30 de septiembre de 2026")}
        ${fila("Estado de suscripción", "Activo")}
        <div class="acciones-facturacion">
          <button type="button" class="boton boton--secundario">${icono("tarjetaCredito", 18)}Actualizar método de pago</button>
          <button type="button" class="boton boton--rojo-contorno" data-accion="cancelar-suscripcion">Cancelar suscripción</button>
        </div>`,
      )}
 
      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera" style="justify-content:flex-start;gap:8px"><span style="color:var(--gris-400)">${icono("escudo", 18)}</span><h2 class="tarjeta__titulo">Seguridad de la cuenta</h2></div>
        <div class="lista-seguridad">
          <button type="button" class="opcion-lista" data-accion="cambiar-clave">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#eef2ff;--color-icono:#4f46e5">${icono("llave", 16)}</span><span><strong>Cambiar contraseña</strong><small>Actualiza tu contraseña de acceso</small></span></span>
            ${icono("derecha", 16)}
          </button>
          <button type="button" class="opcion-lista">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#fffbeb;--color-icono:#d97706">${icono("monitor", 16)}</span><span><strong>Cerrar sesiones activas</strong><small>Cierra sesión en todos los dispositivos</small></span></span>
            ${icono("derecha", 16)}
          </button>
          <button type="button" class="opcion-lista opcion-lista--peligro" data-accion="cerrar-sesion">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#fef2f2;--color-icono:#dc2626">${icono("salir", 18)}</span><span><strong>Cerrar sesión</strong><small>Salir de tu cuenta de EventNova</small></span></span>
            ${icono("derecha", 16)}
          </button>
        </div>
      </section>
      <div class="panel__espaciador"></div>`;
  },

  /** Campos extra de la ventana "Editar mi perfil" (los que el agente puede cambiar) */
  camposAgente(agente) {
    return `
      ${campoPerfil("pf-empresa", "Empresa o negocio", entradaPerfil("pf-empresa", agente.nombre_empresa, 'maxlength="150"'), { requerido: true })}
      ${campoPerfil("pf-experiencia", "Experiencia (años)", entradaPerfil("pf-experiencia", agente.experiencia, 'type="number" min="0" max="60" step="1"'), { requerido: true })}
      ${campoPerfil(
        "pf-descripcion",
        "Descripción del negocio",
        `<textarea class="area-texto" id="pf-descripcion" rows="3" maxlength="500">${esc(agente.descripcion_agente || "")}</textarea>`,
        { ancho: true },
      )}`;
  },

  // ─── Ventanas del plan (simuladas hasta la tarea 14) ──────────────────────
  modalPlan(plan) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#eef2ff;color:#4f46e5">${icono("ticket", 20)}</div>
          <div><h3 class="modal__titulo">Cambiar plan</h3><p class="confirmacion__texto">¿Estás seguro de que deseas cambiar tu plan de EventNova a <strong style="color:var(--gris-700)">${esc(plan.nombre)}</strong>?</p></div>
        </div>
        <div class="cambio-plan"><span>${esc(plan.nombre)}</span><strong>${esc(plan.precioCorto)} / mes</strong></div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--coral boton--seminegrita" id="confirmar">Confirmar cambio</button>
        </div>
      </div>`;
  },

  modalCancelarSuscripcion() {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono("advertencia", 22)}</div>
          <div><h3 class="modal__titulo">Cancelar suscripción</h3><p class="confirmacion__texto">¿Estás seguro de que deseas cancelar tu suscripción a EventNova? Perderás el acceso a las funciones de tu plan al final del período de facturación.</p></div>
        </div>
        <div class="pila" style="gap:8px">
          <button type="button" class="boton boton--primario boton--bloque" data-cerrar-modal>Continuar con mi plan</button>
          <button type="button" class="boton boton--rojo-contorno boton--bloque" id="confirmar">Cancelar suscripción</button>
        </div>
      </div>`;
  },

  mostrarError(mensaje) {
    document.getElementById("contenido").innerHTML =
      FormPerfilView.errorCarga(mensaje);
  },
};
