// js/controllers/comun/perfilComunController.js
// Sprint 3 · Tarea 13: CONTROLADOR compartido de «Mi perfil».
// Lo usan los perfiles de cliente, agente y administrador para:
//   - editarPerfil(): ventana con los datos de la persona (+ los del rol),
//     selectores encadenados país → departamento → ciudad y guardado en la BD.
//   - cambiarContrasena(): pide la actual y guarda la nueva.

import { PerfilModel } from "../../models/perfilModel.js";
import { AuthModel } from "../../models/authModel.js";
import { PaisModel } from "../../models/paisModel.js";
import { DepartamentoModel } from "../../models/departamentoModel.js";
import { CiudadModel } from "../../models/ciudadModel.js";
import { FormPerfilView } from "../../views/componentes/formPerfil.js";
import { abrirModal, cerrarModal } from "../../views/componentes/modal.js";
import { mostrarToast } from "../../views/componentes/toast.js";
import { dibujarBarra } from "./panelController.js";

const TELEFONO_VALIDO = /^\+?[\d\s-]{7,20}$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let paises = null; // se piden una sola vez

// ─── Selectores encadenados: país → departamento → ciudad ───────────────────
async function llenarDepartamentos(caja, idPais, seleccionado) {
  const lista = idPais ? await DepartamentoModel.listar(idPais) : [];
  FormPerfilView.opciones(
    caja,
    "pf-departamento",
    lista.map((d) => ({
      id: d.id_departamento,
      nombre: d.nombre_departamento,
    })),
    seleccionado,
    "Selecciona un departamento",
    idPais ? "Sin departamentos" : "Primero elige un país",
  );
}

async function llenarCiudades(caja, idDepartamento, seleccionada) {
  const lista = idDepartamento ? await CiudadModel.listar(idDepartamento) : [];
  FormPerfilView.opciones(
    caja,
    "pf-ciudad",
    lista.map((c) => ({ id: c.id_ciudad, nombre: c.nombre_ciudad })),
    seleccionada,
    "Selecciona una ciudad",
    idDepartamento ? "Sin ciudades" : "Primero elige un departamento",
  );
}

async function prepararUbicacion(caja, ubicacion) {
  paises ??= await PaisModel.listar();
  FormPerfilView.opciones(
    caja,
    "pf-pais",
    paises.map((p) => ({ id: p.id_pais, nombre: p.nombre_pais })),
    ubicacion.id_pais,
    "Selecciona un país",
    "Sin países",
  );
  await llenarDepartamentos(caja, ubicacion.id_pais, ubicacion.id_departamento);
  await llenarCiudades(caja, ubicacion.id_departamento, ubicacion.id_ciudad);

  caja.querySelector("#pf-pais").addEventListener("change", async (e) => {
    await llenarDepartamentos(caja, e.target.value);
    await llenarCiudades(caja, "");
  });
  caja
    .querySelector("#pf-departamento")
    .addEventListener("change", (e) => llenarCiudades(caja, e.target.value));
}

// ─── Formulario ─────────────────────────────────────────────────────────────
function leerFormulario(caja) {
  const valor = (id) => caja.querySelector("#" + id).value.trim();
  return {
    nombre: valor("pf-nombre"),
    correo: valor("pf-correo").toLowerCase(),
    fecha_nacimiento: valor("pf-nacimiento") || null,
    direccion: valor("pf-direccion"),
    telefonos: ["pf-tel-0", "pf-tel-1", "pf-tel-2"].map(valor).filter(Boolean),
    id_ciudad: Number(valor("pf-ciudad")) || null,
  };
}

// Validación rápida en el navegador (el backend vuelve a validar todo)
function validar(datos) {
  if (!datos.nombre) return "El nombre es obligatorio.";
  if (!CORREO_VALIDO.test(datos.correo))
    return "El correo no tiene un formato válido.";
  if (datos.telefonos.length === 0)
    return "Debes registrar al menos un teléfono.";
  if (datos.telefonos.some((t) => !TELEFONO_VALIDO.test(t)))
    return "Hay un teléfono con formato no válido.";
  if (new Set(datos.telefonos).size !== datos.telefonos.length)
    return "No repitas el mismo teléfono.";
  if (!datos.id_ciudad) return "Selecciona país, departamento y ciudad.";
  return "";
}

/**
 * Abre la ventana "Editar mi perfil" y guarda en la base de datos.
 * @param persona   perfil actual (GET /api/auth/perfil)
 * @param opciones
 *   rol        'cliente' | 'agente' | 'administrador' (para redibujar la barra lateral)
 *   extra      { titulo, html } campos propios del rol (opcional)
 *   leerExtra  (caja) => { ...campos del rol }  (opcional)
 *   enfocar    id del campo que recibe el foco al abrir (por defecto el nombre)
 *   alGuardar  (perfilNuevo) => void  para redibujar la página
 */
export async function editarPerfil(
  persona,
  { rol, extra = null, leerExtra, enfocar = "pf-nombre", alGuardar } = {},
) {
  const caja = abrirModal(FormPerfilView.modalEditar(persona, extra), {
    clase: "modal--xl",
    cerrarAlHacerClicFuera: false,
  });
  caja.querySelector("#" + enfocar)?.focus();

  try {
    await prepararUbicacion(caja, persona.ubicacion);
  } catch (error) {
    FormPerfilView.error(caja, error.message);
  }

  caja.addEventListener("input", () => FormPerfilView.error(caja, ""));
  caja.querySelector("#form-perfil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
      ...leerFormulario(caja),
      ...(leerExtra ? leerExtra(caja) : {}),
    };
    const problema = validar(datos);
    if (problema) return FormPerfilView.error(caja, problema);

    const boton = caja.querySelector("#guardar-perfil");
    boton.disabled = true;
    try {
      const { usuario } = await PerfilModel.actualizar(datos);
      cerrarModal();
      // La sesión ya quedó actualizada en el backend: se redibuja la barra lateral
      dibujarBarra(rol, "perfil", await AuthModel.obtenerSesion());
      mostrarToast("Perfil actualizado correctamente.", { duracion: 3000 });
      alGuardar?.(usuario);
    } catch (error) {
      boton.disabled = false;
      FormPerfilView.error(caja, error.message);
    }
  });
}

/** Abre la ventana "Cambiar contraseña" y la guarda en la base de datos. */
export function cambiarContrasena() {
  const caja = abrirModal(FormPerfilView.modalContrasena(), {
    clase: "modal--sm",
    cerrarAlHacerClicFuera: false,
  });
  const valor = (id) => caja.querySelector("#" + id).value;
  caja.querySelector("#pf-clave-actual").focus();
  caja.addEventListener("input", () => FormPerfilView.error(caja, ""));

  caja
    .querySelector("#form-contrasena")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const actual = valor("pf-clave-actual");
      const nueva = valor("pf-clave-nueva");
      if (!actual || !nueva)
        return FormPerfilView.error(caja, "Todos los campos son obligatorios.");
      if (nueva.length < 8)
        return FormPerfilView.error(
          caja,
          "La nueva contraseña debe tener al menos 8 caracteres.",
        );
      if (nueva !== valor("pf-clave-confirmar"))
        return FormPerfilView.error(
          caja,
          "Las contraseñas nuevas no coinciden.",
        );

      const boton = caja.querySelector("#guardar-contrasena");
      boton.disabled = true;
      try {
        await PerfilModel.cambiarContrasena(actual, nueva);
        cerrarModal();
        mostrarToast("Contraseña actualizada correctamente.", {
          duracion: 3000,
        });
      } catch (error) {
        boton.disabled = false;
        FormPerfilView.error(caja, error.message);
      }
    });
}
