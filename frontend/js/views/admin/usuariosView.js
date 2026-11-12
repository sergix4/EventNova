// js/views/admin/usuariosView.js
// VISTA de la gestión de clientes y agentes (pages/admin/usuarios.html).
// Solo arma HTML y actualiza la pantalla: no llama a la API ni guarda nada.
// El controlador (usuariosController.js) decide CUÁNDO se usa cada función.

import { icono } from "../componentes/iconos.js";
import { cop, esc, iniciales, num } from "../../utils/formato.js";
import { mostrarToast } from "../componentes/toast.js";

// ─── Columnas de la tabla según el rol ──────────────────────────────────────
const COLUMNAS = {
  cliente: [
    "Cliente",
    "Identificación",
    "Ubicación",
    "Teléfono",
    "Puntos",
    "Reservas",
    "Acciones",
  ],
  agente: [
    "Agente",
    "Empresa",
    "Plan",
    "Comisión",
    "Eventos",
    "Ubicación",
    "Acciones",
  ],
  administrador: [
    "Administrador",
    "Identificación",
    "Horario",
    "Salario",
    "Ubicación",
    "Acciones",
  ],
};

const NOMBRE_ROL = {
  cliente: "Cliente",
  agente: "Agente",
  administrador: "Administrador",
};
// Texto bajo el título de la ventana "Registrar …"
const SUBTITULO_NUEVO = {
  cliente: "Podrá iniciar sesión, ver eventos y hacer reservas",
  agente: "Podrá registrar eventos y administrar sus reservas",
  administrador: "Tendrá acceso completo al panel de administración",
};

/** "2026-01-05 09:00" → "05 ene 2026" */
function fechaCorta(texto) {
  if (!texto) return "—";
  const fecha = new Date(`${texto.slice(0, 10)}T00:00:00`);
  return fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "Cali, Valle del Cauca" (o un guion si no tiene ciudad) */
function ubicacionCorta(u) {
  return u.ciudad ? `${u.ciudad}, ${u.departamento}` : "—";
}

/** Avatar + nombre + correo dentro de la tabla.
 *  extra: HTML opcional que va junto al nombre (ej. la etiqueta "Tú") */
function celdaPersona(p, extra = "") {
  // Ajustes finales: etiqueta roja si la cuenta está suspendida
  if (!p.activo) extra += '<span class="etiqueta-suspendido">Suspendido</span>';
  return `
    <div class="persona">
      <span class="avatar">${esc(iniciales(p.nombre))}</span>
      <div><p class="persona__nombre">${esc(p.nombre)}${extra}</p><p class="persona__correo">${esc(p.correo)}</p></div>
    </div>`;
}

/** Regla del equipo: no se suspende a quien tiene reservas o eventos vinculados.
 *  Devuelve el motivo (para el title del botón) o "" si se puede suspender. */
function vinculos(p) {
  const n = p.cliente?.total_reservas || p.agente?.total_eventos || 0;
  if (!n) return "";
  const que = p.cliente ? `reserva${n === 1 ? "" : "s"}` : `evento${n === 1 ? "" : "s"}`;
  return `No se puede suspender: tiene ${n} ${que} vinculad${p.cliente ? "a" : "o"}${n === 1 ? "" : "s"}`;
}

/** Botones Ver / Editar / Suspender o Reactivar (Ajustes finales: ya no se elimina a nadie).
 *  esYo = true cuando la fila es el administrador con sesión: no puede suspenderse. */
function celdaAcciones(p, esYo = false) {
  const id = esc(p.numero_id);
  const nombre = esc(p.nombre);
  let botonEstado;
  if (esYo) {
    botonEstado = `<button type="button" class="crud__eliminar" disabled title="No puedes suspender tu propia cuenta">Suspender</button>`;
  } else if (p.activo && vinculos(p)) {
    botonEstado = `<button type="button" class="crud__eliminar" disabled title="${esc(vinculos(p))}">Suspender</button>`;
  } else if (p.activo) {
    botonEstado = `<button type="button" class="crud__eliminar" data-suspender="${id}" aria-label="Suspender ${nombre}">Suspender</button>`;
  } else {
    botonEstado = `<button type="button" class="crud__reactivar" data-reactivar="${id}" aria-label="Reactivar ${nombre}">Reactivar</button>`;
  }
  return `
    <td class="crud__acciones">
      <button type="button" class="crud__editar" data-ver="${id}" aria-label="Ver ${nombre}">Ver</button>
      <button type="button" class="crud__editar" data-editar="${id}" aria-label="Editar ${nombre}">Editar</button>
      ${botonEstado}
    </td>`;
}

/** <tr> normal o atenuado si la cuenta está suspendida */
const abrirFila = (p) => (p.activo ? "<tr>" : '<tr class="fila--suspendida">');

function filaCliente(p) {
  return `
    ${abrirFila(p)}
      <td>${celdaPersona(p)}</td>
      <td class="sin-salto">${esc(p.numero_id)}</td>
      <td>${esc(ubicacionCorta(p.ubicacion))}</td>
      <td class="sin-salto">${esc(p.telefonos[0] || "—")}</td>
      <td class="texto-centro"><span class="valor-indigo">${num(p.cliente.puntos)}</span></td>
      <td class="texto-centro texto-seminegrita">${p.cliente.total_reservas}</td>
      ${celdaAcciones(p)}
    </tr>`;
}

function filaAgente(p) {
  return `
    ${abrirFila(p)}
      <td>${celdaPersona(p)}</td>
      <td class="texto-medio">${esc(p.agente.nombre_empresa)}</td>
      <td class="sin-salto">${esc(p.agente.plan || "—")}</td>
      <td class="texto-centro">${p.agente.comision}%</td>
      <td class="texto-centro texto-seminegrita">${p.agente.total_eventos}</td>
      <td>${esc(ubicacionCorta(p.ubicacion))}</td>
      ${celdaAcciones(p)}
    </tr>`;
}

function filaAdministrador(p, idSesion) {
  const esYo = p.numero_id === idSesion;
  return `
    ${abrirFila(p)}
      <td>${celdaPersona(p, esYo ? '<span class="etiqueta-tu">Tú</span>' : "")}</td>
      <td class="sin-salto">${esc(p.numero_id)}</td>
      <td>${esc(p.administrador.horario)}</td>
      <td class="sin-salto texto-seminegrita">${cop(p.administrador.salario)}</td>
      <td>${esc(ubicacionCorta(p.ubicacion))}</td>
      ${celdaAcciones(p, esYo)}
    </tr>`;
}

/** Una fila "dato" del modal Ver */
function dato(etiqueta, valor) {
  return `<div class="dato"><p class="dato__etiqueta">${etiqueta}</p><p class="dato__valor">${esc(valor ?? "—") || "—"}</p></div>`;
}

/** Campo de formulario (etiqueta + control + mensaje de error) */
function campo(
  id,
  etiqueta,
  control,
  { requerido = false, ancho = false } = {},
) {
  return `
    <div class="campo${ancho ? " form-usuario__ancho" : ""}">
      <label class="campo__etiqueta" for="${id}">${etiqueta}${requerido ? ' <span class="campo__requerido--rojo">*</span>' : ""}</label>
      ${control}
    </div>`;
}

const entrada = (id, valor, extra = "") =>
  `<input class="entrada" id="${id}" value="${esc(valor ?? "")}" ${extra}>`;

const selector = (id, texto, extra = "") =>
  `<div class="envoltura-select"><select class="selector" id="${id}" ${extra}><option value="">${texto}</option></select></div>`;

export const UsuariosView = {
  /** Marca la pestaña activa */
  pestanaActiva(rol) {
    document
      .querySelectorAll("[data-rol]")
      .forEach((boton) =>
        boton.setAttribute("aria-selected", String(boton.dataset.rol === rol)),
      );
    document
      .getElementById("panel-usuarios")
      .setAttribute("aria-labelledby", `pestana-${rol}`);
  },

  /** Encabezado de la tabla según el rol */
  cabecera(rol) {
    document.getElementById("cabecera-usuarios").innerHTML = `<tr>${COLUMNAS[
      rol
    ]
      .map(
        (c) =>
          `<th class="${c === "Acciones" ? "crud__acciones" : ["Puntos", "Reservas", "Comisión", "Eventos"].includes(c) ? "texto-centro" : ""}">${c}</th>`,
      )
      .join("")}</tr>`;
  },

  /** Filas de la tabla (solo la página actual).
   *  idSesion: identificación del administrador con sesión (para marcar "Tú") */
  filas(rol, lista, textoVacio, idSesion = null) {
    const columnas = COLUMNAS[rol].length;
    const FILA = {
      cliente: filaCliente,
      agente: filaAgente,
      administrador: (p) => filaAdministrador(p, idSesion),
    };
    document.getElementById("tabla-usuarios").innerHTML =
      lista.length === 0
        ? `<tr><td colspan="${columnas}" class="tabla__vacia">${esc(textoVacio)}</td></tr>`
        : lista.map(FILA[rol]).join("");
  },

  /** El botón de registrar cambia según la pestaña: "Registrar cliente", "Registrar agente"… */
  botonRegistrar(rol) {
    document.getElementById("texto-registrar").textContent =
      `Registrar ${NOMBRE_ROL[rol].toLowerCase()}`;
  },

  cargandoTabla(rol) {
    document.getElementById("tabla-usuarios").innerHTML =
      `<tr><td colspan="${COLUMNAS[rol].length}" class="tabla__vacia">Cargando…</td></tr>`;
  },

  total(texto) {
    document.getElementById("total-usuarios").textContent = texto;
  },

  paginacion(html) {
    document.getElementById("paginacion-usuarios").innerHTML = html;
  },

  error(mensaje) {
    const caja = document.getElementById("error-usuarios");
    caja.hidden = !mensaje;
    caja.textContent = mensaje || "";
  },

  // ─── Modal VER ────────────────────────────────────────────────────────────
  detalle(p) {
    const u = p.ubicacion;
    const propios =
      p.rol === "cliente"
        ? [
            dato("Código de cliente", p.cliente.codigo_cliente),
            dato("Puntos", num(p.cliente.puntos)),
            dato("Reservas", p.cliente.total_reservas),
            dato(
              "Recibe publicidad",
              p.cliente.visualizar_publicidad ? "Sí" : "No",
            ),
          ]
        : p.rol === "administrador"
          ? [
              dato("Código de administrador", p.administrador.codigo_admin),
              dato("Salario", cop(p.administrador.salario)),
              dato("Horario", p.administrador.horario),
            ]
          : [
              dato("Empresa", p.agente.nombre_empresa),
              dato("Plan", p.agente.plan),
              dato("Comisión", `${p.agente.comision}%`),
              dato("Experiencia", `${p.agente.experiencia} año(s)`),
              dato("Eventos registrados", p.agente.total_eventos),
            ];

    return `
      <div class="modal__cabecera">
        <div class="persona">
          <span class="avatar avatar--redondeado" style="width:40px;height:40px">${esc(iniciales(p.nombre))}</span>
          <div><h3 class="modal__titulo">${esc(p.nombre)}</h3><p class="modal__subtitulo">${NOMBRE_ROL[p.rol]} · ${esc(p.numero_id)}</p></div>
        </div>
        <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono("cerrar", 18)}</button>
      </div>
      <div class="modal__cuerpo">
        <p class="form-usuario__seccion">Datos personales</p>
        <div class="datos-grid">
          ${dato("Correo", p.correo)}
          ${dato("Teléfonos", p.telefonos.join(" · ") || "—")}
          ${dato("Fecha de nacimiento", p.fecha_nacimiento ? fechaCorta(p.fecha_nacimiento) : "—")}
          ${dato("Registrado el", fechaCorta(p.fecha_registro))}
          ${dato("Estado de la cuenta", p.activo ? "Activa" : `Suspendida desde el ${fechaCorta(p.fecha_suspension)}`)}
          ${p.activo ? "" : dato("Motivo de la suspensión", p.motivo_suspension || "Sin motivo registrado")}
          ${dato("Dirección", p.direccion || "—")}
          ${dato("Ubicación", u.ciudad ? `${u.ciudad}, ${u.departamento}, ${u.pais}` : "—")}
        </div>
        <p class="form-usuario__seccion">Datos de ${NOMBRE_ROL[p.rol].toLowerCase()}</p>
        <div class="datos-grid">${propios.join("")}</div>
        ${
          p.rol === "agente" && p.agente.descripcion_agente
            ? `<div class="dato"><p class="dato__etiqueta">Descripción</p><p class="texto-descripcion">${esc(p.agente.descripcion_agente)}</p></div>`
            : ""
        }
      </div>
      <div class="modal__pie">
        <button type="button" class="boton boton--neutro" data-cerrar-modal>Cerrar</button>
        <button type="button" class="boton boton--primario boton--seminegrita" data-editar="${esc(p.numero_id)}">Editar</button>
      </div>`;
  },

  // ─── Modal EDITAR ─────────────────────────────────────────────────────────
  formulario(p, planes = []) {
    const hoy = new Date().toISOString().slice(0, 10);
    const tel = (i) =>
      entrada(
        `tel-${i}`,
        p.telefonos[i],
        `type="tel" maxlength="20" placeholder="${i === 0 ? "+57 300 000 0000" : "Opcional"}"`,
      );

    const propios =
      p.rol === "cliente"
        ? `
        ${campo("puntos", "Puntos", entrada("puntos", p.cliente.puntos, 'type="number" min="0" step="1"'), { requerido: true })}
        <div class="campo">
          <span class="campo__etiqueta">Publicidad</span>
          <label class="casilla form-usuario__casilla">
            <input type="checkbox" id="publicidad" ${p.cliente.visualizar_publicidad ? "checked" : ""}>
            <span class="casilla__caja">${icono("check", 12, { grosor: 3 })}</span>
            <span>Recibe publicidad de eventos</span>
          </label>
        </div>`
        : p.rol === "administrador"
          ? `
        ${campo("salario", "Salario mensual (COP)", entrada("salario", p.administrador.salario, 'type="number" min="0" step="1000" placeholder="Ej. 3500000"'), { requerido: true })}
        ${campo("horario", "Horario", entrada("horario", p.administrador.horario, 'maxlength="100" placeholder="Lunes a viernes 8:00 - 17:00"'), { requerido: true })}`
          : `
        ${campo("empresa", "Empresa", entrada("empresa", p.agente.nombre_empresa, 'maxlength="150"'), { requerido: true })}
        ${campo(
          "plan",
          "Plan",
          `<div class="envoltura-select"><select class="selector" id="plan">${planes
            .map(
              (pl) =>
                `<option value="${pl.id_plan}" ${pl.id_plan === p.agente.id_plan ? "selected" : ""}>${esc(pl.nombre_plan)}</option>`,
            )
            .join("")}</select></div>`,
          { requerido: true },
        )}
        ${campo("comision", "Comisión (%)", entrada("comision", p.agente.comision, 'type="number" min="0" max="100" step="0.01"'), { requerido: true })}
        ${campo("experiencia", "Experiencia (años)", entrada("experiencia", p.agente.experiencia, 'type="number" min="0" max="60" step="1"'), { requerido: true })}
        ${campo("descripcion", "Descripción del negocio", `<textarea class="area-texto" id="descripcion" rows="3" maxlength="500">${esc(p.agente.descripcion_agente || "")}</textarea>`, { ancho: true })}`;

    return `
      <form id="form-usuario" novalidate>
        <div class="modal__cabecera">
          ${
            p.nuevo
              ? `<div><h3 class="modal__titulo">Registrar ${NOMBRE_ROL[p.rol].toLowerCase()}</h3><p class="modal__subtitulo">${SUBTITULO_NUEVO[p.rol]}</p></div>`
              : `<div><h3 class="modal__titulo">Editar ${NOMBRE_ROL[p.rol].toLowerCase()}</h3><p class="modal__subtitulo">${esc(p.nombre)} · ${esc(p.numero_id)}</p></div>`
          }
          <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono("cerrar", 18)}</button>
        </div>
        <div class="modal__cuerpo">
          <p class="form-usuario__seccion">Datos personales</p>
          <div class="form-usuario__grid">
            ${campo("nombre", "Nombre completo", entrada("nombre", p.nombre, 'maxlength="100" autocomplete="off"'), { requerido: true, ancho: true })}
            ${campo(
              "numero-id",
              "Identificación",
              entrada(
                "numero-id",
                p.numero_id,
                p.nuevo
                  ? 'maxlength="20" autocomplete="off" placeholder="Ej. 1112223334"'
                  : "disabled",
              ),
              { requerido: p.nuevo },
            )}
            ${campo("correo", "Correo", entrada("correo", p.correo, 'type="email" maxlength="150" autocomplete="off"'), { requerido: true })}
            ${campo("fecha-nacimiento", "Fecha de nacimiento", entrada("fecha-nacimiento", p.fecha_nacimiento, `type="date" max="${hoy}"`))}
            ${campo("direccion", "Dirección", entrada("direccion", p.direccion, 'maxlength="255"'))}
          </div>

          ${
            p.nuevo
              ? `
          <p class="form-usuario__seccion">Acceso</p>
          <div class="form-usuario__grid">
            ${campo("contrasena", "Contraseña", entrada("contrasena", "", 'type="password" minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres"'), { requerido: true })}
            ${campo("confirmar-contrasena", "Confirmar contraseña", entrada("confirmar-contrasena", "", 'type="password" autocomplete="new-password"'), { requerido: true })}
          </div>`
              : ""
          }
 
          <p class="form-usuario__seccion">Teléfonos <span class="campo__opcional">(de 1 a 3)</span></p>
          <div class="form-usuario__grid form-usuario__grid--3">
            ${campo("tel-0", "Principal", tel(0), { requerido: true })}
            ${campo("tel-1", "Teléfono 2", tel(1))}
            ${campo("tel-2", "Teléfono 3", tel(2))}
          </div>

          <p class="form-usuario__seccion">Ubicación</p>
          <div class="form-usuario__grid form-usuario__grid--3">
            ${campo("pais", "País", selector("pais", "Selecciona un país"), { requerido: true })}
            ${campo("departamento", "Departamento", selector("departamento", "Primero elige un país", "disabled"), { requerido: true })}
            ${campo("ciudad", "Ciudad", selector("ciudad", "Primero elige un departamento", "disabled"), { requerido: true })}
          </div>

          <p class="form-usuario__seccion">Datos de ${NOMBRE_ROL[p.rol].toLowerCase()}</p>
          <div class="form-usuario__grid">${propios}</div>

          <p class="error-caja" id="error-formulario" role="alert" hidden></p>
        </div>
        <div class="modal__pie">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="submit" class="boton boton--primario boton--seminegrita" id="guardar-usuario">${p.nuevo ? `Registrar ${NOMBRE_ROL[p.rol].toLowerCase()}` : "Guardar cambios"}</button>
        </div>
      </form>`;
  },

  /** Llena un <select> del modal (país, departamento o ciudad) */
  opciones(idSelect, lista, valor, texto, textoVacio) {
    const select = document.getElementById(idSelect);
    const habilitado = lista.length > 0;
    select.innerHTML =
      `<option value="">${habilitado ? texto : textoVacio}</option>` +
      lista
        .map((o) => `<option value="${o.id}">${esc(o.nombre)}</option>`)
        .join("");
    select.disabled = !habilitado;
    select.value = valor ? String(valor) : "";
  },

  // Tarea 16: el error sale en el toast rojo (queda encima del modal, que sigue abierto)
  errorFormulario(mensaje) {
    if (mensaje) mostrarToast(mensaje, { error: true });
  },

  guardando(activo, textoNormal = "Guardar cambios") {
    const boton = document.getElementById("guardar-usuario");
    if (!boton) return;
    boton.disabled = activo;
    boton.textContent = activo ? "Guardando…" : textoNormal;
  },

  // ─── Modal SUSPENDER (Ajustes finales: reemplaza a "Eliminar") ──────────────
  confirmarSuspender(p) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono("advertencia", 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Suspender ${NOMBRE_ROL[p.rol].toLowerCase()}?</h3>
            <p class="confirmacion__texto"><strong>${esc(p.nombre)}</strong> (${esc(p.numero_id)}) no podrá iniciar sesión mientras esté suspendido. <strong>No se borra nada</strong>: sus reservas, eventos y datos se conservan y puedes reactivarlo cuando quieras.</p>
          </div>
        </div>
        <div class="campo">
          <label class="campo__etiqueta" for="motivo-suspension">Motivo <span class="campo__opcional">(opcional)</span></label>
          <textarea class="area-texto" id="motivo-suspension" rows="2" maxlength="300" placeholder="Ej. Incumplimiento de las condiciones de uso"></textarea>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--peligro boton--seminegrita" id="confirmar-suspender">Suspender</button>
        </div>
      </div>`;
  },

  // ─── Modal REACTIVAR ──────────────────────────────────────────────────────
  confirmarReactivar(p) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#f0fdf4;color:#16a34a">${icono("check", 20)}</div>
          <div>
            <h3 class="modal__titulo">¿Reactivar ${NOMBRE_ROL[p.rol].toLowerCase()}?</h3>
            <p class="confirmacion__texto"><strong>${esc(p.nombre)}</strong> podrá volver a iniciar sesión con su correo y contraseña de siempre.</p>
          </div>
        </div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--primario boton--seminegrita" id="confirmar-reactivar">Reactivar</button>
        </div>
      </div>`;
  },
};
