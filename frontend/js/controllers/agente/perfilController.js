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
import { PlanModel } from "../../models/planModel.js";
import { PerfilAgenteView } from "../../views/agente/perfilAgenteView.js";
import { abrirModal, cerrarModal } from "../../views/componentes/modal.js";
import { mostrarToast } from "../../views/componentes/toast.js";

const estado = { perfil: null, planes: [], planActual: null }; // planActual = id_plan
const dibujar = () => PerfilAgenteView.mostrar(estado);
const aviso = (mensaje) => mostrarToast(mensaje, { duracion: 2500 });

function usarPerfil(perfil) {
  estado.perfil = perfil;
  estado.planActual = perfil.agente.id_plan;
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
      experiencia: caja.querySelector("#pf-experiencia").value.trim(),
      descripcion_agente: caja.querySelector("#pf-descripcion").value.trim(),
    }),
    alGuardar: (perfil) => {
      usarPerfil(perfil);
      dibujar();
    },
  });
}

// ─── Plan (Tarea 14: se guarda en la BD) ────────────────────────────────────
function cambiarPlan(idPlan) {
  const plan = estado.planes.find((p) => p.id_plan === idPlan);
  const caja = abrirModal(PerfilAgenteView.modalPlan(plan), {
    cerrarAlHacerClicFuera: false,
  });
  const boton = caja.querySelector("#confirmar");
  boton.addEventListener("click", async () => {
    boton.disabled = true;
    try {
      const { mensaje, usuario } = await PerfilModel.cambiarPlan(idPlan);
      usarPerfil(usuario);
      cerrarModal();
      dibujar();
      aviso(mensaje);
    } catch (error) {
      // p. ej. bajar a un plan con menos cupo que los eventos activos
      cerrarModal();
      mostrarToast(error.message, { error: true, duracion: 5000 });
    }
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
    const [perfil, planes] = await Promise.all([
      PerfilModel.obtener(),
      PlanModel.tarjetas(),
    ]);
    estado.planes = planes;
    usarPerfil(perfil);
  } catch (error) {
    return PerfilAgenteView.mostrarError(error.message);
  }
  dibujar();

  document.getElementById("contenido").addEventListener("click", (e) => {
    const accion = e.target.closest("[data-accion]")?.dataset.accion;
    const planElegido =
      e.target.closest("[data-elegir-plan]")?.dataset.elegirPlan;
    if (planElegido) return cambiarPlan(Number(planElegido));
    if (accion === "editar-personal") editar("pf-nombre");
    if (accion === "editar-agente") editar("pf-empresa");
    if (accion === "cambiar-plan")
      document
        .getElementById("planes-disponibles")
        .scrollIntoView({ behavior: "smooth" });
    if (accion === "cancelar-suscripcion") cancelarSuscripcion();
    if (accion === "cambiar-clave") cambiarContrasena();
  });
}

iniciar();
