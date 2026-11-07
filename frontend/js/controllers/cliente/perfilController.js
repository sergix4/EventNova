// js/controllers/cliente/perfilController.js
// CONTROLADOR del perfil del cliente.
// Sprint 3 · Tarea 13: los datos salen de la BD (GET /api/auth/perfil) y
// "Editar", "Publicidad personalizada" y "Cambiar contraseña" guardan en la BD.

import {
  iniciarPanel,
  iniciarNotificaciones,
} from "../comun/panelController.js";
import {
  editarPerfil,
  cambiarContrasena,
} from "../comun/perfilComunController.js";
import { PerfilModel } from "../../models/perfilModel.js";
import { PerfilClienteView } from "../../views/cliente/perfilClienteView.js";
import { mostrarToast } from "../../views/componentes/toast.js";

// Estas dos todavía no tienen columna en la BD: solo cambian en pantalla
const preferencias = { correo: true, reservas: true };
let perfil = null;

const dibujar = () => PerfilClienteView.mostrar(perfil, preferencias);

// "Publicidad personalizada" = CLIENTE.visualizar_publicidad
async function cambiarPublicidad(boton) {
  const activo = !perfil.cliente.visualizar_publicidad;
  boton.disabled = true;
  try {
    const { usuario } = await PerfilModel.actualizar({
      visualizar_publicidad: activo,
    });
    perfil = usuario;
    PerfilClienteView.marcarPreferencia("publicidad", activo);
    mostrarToast(
      activo
        ? "Recibirás sugerencias de eventos."
        : "Ya no recibirás publicidad personalizada.",
      { duracion: 2500 },
    );
  } catch (error) {
    mostrarToast(error.message, { error: true, duracion: 3500 });
  } finally {
    boton.disabled = false;
  }
}

async function iniciar() {
  await iniciarPanel({ rol: "cliente", activo: "perfil" });
  iniciarNotificaciones();

  try {
    perfil = await PerfilModel.obtener();
  } catch (error) {
    return PerfilClienteView.mostrarError(error.message);
  }
  dibujar();

  document.getElementById("perfil").addEventListener("click", (e) => {
    const interruptor = e.target.closest("[data-preferencia]");
    if (interruptor) {
      const clave = interruptor.dataset.preferencia;
      if (clave === "publicidad") return cambiarPublicidad(interruptor);
      preferencias[clave] = !preferencias[clave];
      return PerfilClienteView.marcarPreferencia(clave, preferencias[clave]);
    }

    const accion = e.target.closest("[data-accion]")?.dataset.accion;
    if (accion === "editar") {
      editarPerfil(perfil, {
        rol: "cliente",
        alGuardar: (nuevo) => {
          perfil = nuevo;
          dibujar();
        },
      });
    }
    if (accion === "cambiar-clave") cambiarContrasena();
  });
}

iniciar();
