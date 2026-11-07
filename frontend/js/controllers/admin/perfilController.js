// js/controllers/admin/perfilController.js
// CONTROLADOR del perfil del administrador.
// Sprint 3 · Tarea 13: los datos salen de la BD (GET /api/auth/perfil) y
// "Editar perfil", "Cambiar correo" y "Cambiar contraseña" guardan en la BD.

import { iniciarAdmin } from "./comunAdminController.js";
import {
  editarPerfil,
  cambiarContrasena,
} from "../comun/perfilComunController.js";
import { PerfilModel } from "../../models/perfilModel.js";
import { PerfilAdminView } from "../../views/admin/perfilAdminView.js";

let perfil = null;

const dibujar = () => PerfilAdminView.mostrar({ perfil });

function editar(enfocar = "pf-nombre") {
  editarPerfil(perfil, {
    rol: "administrador",
    enfocar,
    alGuardar: (nuevo) => {
      perfil = nuevo;
      dibujar();
    },
  });
}

const ACCIONES = {
  "editar-perfil": () => editar(),
  "cambiar-correo": () => editar("pf-correo"),
  "cambiar-clave": cambiarContrasena,
  // 'cerrar-sesion' lo atiende panelController (conectarCerrarSesion)
};

async function iniciar() {
  await iniciarAdmin("perfil");

  try {
    perfil = await PerfilModel.obtener();
  } catch (error) {
    return PerfilAdminView.mostrarError(error.message);
  }
  dibujar();

  document.getElementById("contenido").addEventListener("click", (e) => {
    const boton = e.target.closest("[data-accion]");
    if (boton && ACCIONES[boton.dataset.accion])
      return ACCIONES[boton.dataset.accion]();

  });
}

iniciar();
