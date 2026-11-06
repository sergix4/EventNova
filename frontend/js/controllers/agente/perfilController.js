// js/controllers/agente/perfilController.js
// CONTROLADOR del perfil del agente.
// Sprint 3 · Tarea 13: los datos personales, de agente y sus números (eventos
// y reservas) salen de la BD (GET /api/auth/perfil). "Editar perfil",
// "Editar información" y "Cambiar contraseña" guardan en la BD.
// El cambio de plan y la facturación siguen simulados hasta la tarea 14.

import { iniciarPanel } from "../comun/panelController.js";
import {
  editarPerfil,
  cambiarContrasena,
} from "../comun/perfilComunController.js";
import { PerfilModel } from "../../models/perfilModel.js";
import { PLANES } from "../../models/catalogoModel.js";
import { PerfilAgenteView } from "../../views/agente/perfilAgenteView.js";
import { abrirModal, cerrarModal } from "../../views/componentes/modal.js";
import { mostrarToast } from "../../views/componentes/toast.js";

const estado = { perfil: null, planes: PLANES, planActual: "basico" };
const dibujar = () => PerfilAgenteView.mostrar(estado);
const aviso = (mensaje) => mostrarToast(mensaje, { duracion: 2500 });

function usarPerfil(perfil) {
  estado.perfil = perfil;
  estado.planActual =
    PLANES.find((p) => p.nombre === perfil.agente.plan)?.clave || "basico";
}

// Una sola ventana para los dos botones: "Editar información" pone el foco en la empresa
function editar(enfocar) {
  editarPerfil(estado.perfil, {
    rol: "agente",
    enfocar,
    extra: {
      titulo: "Datos de agente",
      html: PerfilAgenteView.camposAgente(estado.perfil.agente),
    },
    leerExtra: (caja) => ({
      nombre_empresa: caja.querySelector("#pf-empresa").value.trim(),
      experiencia: Number(caja.querySelector("#pf-experiencia").value),
      descripcion_agente: caja.querySelector("#pf-descripcion").value.trim(),
    }),
    alGuardar: (perfil) => {
      usarPerfil(perfil);
      dibujar();
    },
  });
}

// ─── Plan (simulado hasta la tarea 14) ──────────────────────────────────────
function cambiarPlan(clave) {
  const plan = PLANES.find((p) => p.clave === clave);
  const caja = abrirModal(PerfilAgenteView.modalPlan(plan), {
    cerrarAlHacerClicFuera: false,
  });
  caja.querySelector("#confirmar").addEventListener("click", () => {
    estado.planActual = clave;
    cerrarModal();
    dibujar();
    aviso("Plan actualizado correctamente.");
  });
}

function cancelarSuscripcion() {
  const caja = abrirModal(PerfilAgenteView.modalCancelarSuscripcion(), {
    cerrarAlHacerClicFuera: false,
  });
  caja.querySelector("#confirmar").addEventListener("click", () => {
    cerrarModal();
    aviso("Tu suscripción será cancelada al final del período.");
  });
}

async function iniciar() {
  await iniciarPanel({ rol: "agente", activo: "perfil" });

  try {
    usarPerfil(await PerfilModel.obtener());
  } catch (error) {
    return PerfilAgenteView.mostrarError(error.message);
  }
  dibujar();

  document.getElementById("contenido").addEventListener("click", (e) => {
    const accion = e.target.closest("[data-accion]")?.dataset.accion;
    const planElegido =
      e.target.closest("[data-elegir-plan]")?.dataset.elegirPlan;
    if (planElegido) return cambiarPlan(planElegido);
    if (accion === "editar-personal") editar("pf-nombre");
    if (accion === "editar-agente") editar("pf-empresa");
    if (accion === "cambiar-plan")
      cambiarPlan(PLANES.find((p) => p.clave !== estado.planActual).clave);
    if (accion === "cancelar-suscripcion") cancelarSuscripcion();
    if (accion === "cambiar-clave") cambiarContrasena();
  });
}

iniciar();
