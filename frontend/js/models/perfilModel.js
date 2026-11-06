// js/models/perfilModel.js
// Sprint 3 · Tarea 13: MODELO de «Mi perfil».
// Habla con /api/auth/perfil, que siempre trabaja con el usuario de la SESIÓN
// (cliente, agente o administrador). No recibe identificación en la URL.

import { peticion } from "./api.js";

export const PerfilModel = {
  /** Datos completos del usuario con sesión (persona, teléfonos, ubicación y su rol) */
  obtener() {
    return peticion("/auth/perfil");
  },

  /** datos: solo los campos que cambian. Devuelve { mensaje, usuario } */
  actualizar(datos) {
    return peticion("/auth/perfil", { metodo: "PUT", datos });
  },

  /** Cambia la contraseña pidiendo la actual */
  cambiarContrasena(actual, nueva) {
    return peticion("/auth/perfil/contrasena", {
      metodo: "PUT",
      datos: { actual, nueva },
    });
  },
};
