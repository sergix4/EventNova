// js/controllers/agente/registrarEventoController.js
// CONTROLADOR de "Registrar evento".
// Sprint 3 · Tarea 14: antes de mostrar el formulario se revisa el cupo del
// plan. Si el agente ya llegó al límite de eventos activos, se muestra un
// aviso en vez del formulario (el backend también lo bloquea con un 409).

import { iniciarPanel } from "../comun/panelController.js";
import { montarFormulario } from "./formularioEventoController.js";
import { EventoModel } from "../../models/eventoModel.js";
import { PerfilModel } from "../../models/perfilModel.js";
import { mostrarToast } from "../../views/componentes/toast.js";
import { icono } from "../../views/componentes/iconos.js";
import { esc } from "../../utils/formato.js";

const IR_A_MIS_EVENTOS = () => {
  window.location.href = "/pages/agente/mis-eventos.html";
};

// Aviso cuando el plan ya no tiene cupo
function avisoLimite({ plan, limite_eventos, estadisticas }) {
  return `
    <section class="tarjeta">
      <div class="vacio">
        <div class="vacio__icono">${icono("advertencia", 28)}</div>
        <p class="vacio__titulo">Llegaste al límite de tu ${esc(plan)}</p>
        <p class="vacio__texto">Tienes ${estadisticas.eventos_activos} eventos activos y tu plan permite ${limite_eventos}.<br>
          Para registrar otro, espera a que finalice alguno, cancela uno o cambia a un plan superior.</p>
        <a class="boton boton--primario" href="/pages/agente/perfil.html#planes-disponibles">Ver planes</a>
      </div>
    </section>`;
}

async function iniciar() {
  await iniciarPanel({ rol: "agente", activo: "registrar-evento" });
  const contenido = document.getElementById("contenido");

  try {
    const { agente } = await PerfilModel.obtener();
    if (agente.estadisticas.eventos_activos >= agente.limite_eventos) {
      contenido.innerHTML = avisoLimite(agente);
      return;
    }
  } catch {
    // Si no se pudo revisar el cupo se deja el formulario: el backend valida igual
  }

  montarFormulario(contenido, {
    modo: "registrar",
    alCancelar: IR_A_MIS_EVENTOS,
    alGuardar: async (datos) => {
      await EventoModel.crear(datos); // POST /api/eventos (valida el límite del plan)
      mostrarToast("Evento creado correctamente.", { duracion: 1800 });
      setTimeout(IR_A_MIS_EVENTOS, 1800);
    },
  });
}

iniciar();
