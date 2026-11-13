// js/models/eventoModel.js
// MODELO de eventos en el frontend: conecta con /api/eventos y adapta
// las filas de PostgreSQL al formato que esperan las Vistas.

import { peticion } from "./api.js";
import { BASE_URL } from "./config.js";
import { capitalizarMes } from "../utils/formato.js";

// Imagen local para los eventos sin imagen (funciona aunque no haya internet)
const IMAGEN_DEFECTO = new URL("../../img/evento-defecto.svg", import.meta.url).href;

// Equivalencia del estado del evento con el texto que muestra la página de inicio
const ESTADO_EN_INICIO = {
  Programado: { texto: "Próximamente", color: "ambar" },
  "En Boletería": { texto: "Disponible", color: "verde" },
  "En boletería": { texto: "Disponible", color: "verde" },
  "En Vivo": { texto: "En curso", color: "rojo" },
  "En vivo": { texto: "En curso", color: "rojo" },
  Finalizado: { texto: "Agotado", color: "rojo" },
  Cancelado: { texto: "Agotado", color: "rojo" },
};

// Formatea un timestamp ISO de PostgreSQL a fecha legible ("15 oct 2026"), input date ("2026-10-15") y hora ("18:00")
function desglosarFecha(iso) {
  if (!iso) return { fechaLegible: "", fechaInput: "", horaInput: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()))
    return { fechaLegible: String(iso), fechaInput: "", horaInput: "" };

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  const fechaCorta = d
    .toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");
  return {
    fechaLegible: capitalizarMes(fechaCorta),
    fechaInput: `${yyyy}-${mm}-${dd}`,
    horaInput: `${hh}:${min}`,
  };
}

// Ajustes finales: "29 de oct de 2026" o, si el evento dura varios días,
// "29 de oct – 26 de nov de 2026" (así se ve que una exposición sigue En Vivo)
function rangoFechas(inicioIso, finIso) {
  const ini = desglosarFecha(inicioIso);
  const fin = desglosarFecha(finIso);
  if (!fin.fechaInput || ini.fechaInput === fin.fechaInput) return ini.fechaLegible;
  const mismoAnio = ini.fechaInput.slice(0, 4) === fin.fechaInput.slice(0, 4);
  const desde = mismoAnio ? ini.fechaLegible.replace(/( de)? \d{4}$/, "") : ini.fechaLegible;
  return `${desde} – ${fin.fechaLegible}`;
}

// Adapta una fila de PostgreSQL (SELECT_BASE) al objeto que usan MisEventosView y FormularioEventoView
function adaptarEventoBD(fila) {
  const inicio = desglosarFecha(fila.fecha_inicio);
  const fin = desglosarFecha(fila.fecha_fin);
  const precioNum = Number(fila.precio_base) || 0;

  return {
    id: fila.id_evento,
    id_evento: fila.id_evento,
    codigo: fila.codigo_evento,
    nombre: fila.nombre_evento,
    descripcion: fila.descripcion_evento || "",
    teatro: fila.teatro || "",
    direccion: fila.direccion_evento || "",
    observaciones: fila.observaciones || "",
    informacion: fila.observaciones || "",
    // Ajustes finales: los listados ya no traen el base64, solo "tiene_imagen";
    // la imagen se pide aparte. El detalle (GET /api/eventos/:id) sí la trae completa.
    imagen:
      fila.imagen_evento ||
      (fila.tiene_imagen ? `${BASE_URL}/api/eventos/${fila.id_evento}/imagen` : IMAGEN_DEFECTO),
    imagen_evento: fila.imagen_evento || "", // solo viene en el detalle (formulario de editar)
    id_ciudad: fila.id_ciudad,
    ciudad: fila.nombre_ciudad,
    id_departamento: fila.id_departamento,
    departamento: fila.nombre_departamento,
    id_pais: fila.id_pais,
    pais: fila.nombre_pais,
    fecha: inicio.fechaLegible,
    fechaFin: fin.fechaLegible,
    fechaRango: rangoFechas(fila.fecha_inicio, fila.fecha_fin),
    fecha_inicio_input: inicio.fechaInput,
    hora_inicio_input: inicio.horaInput,
    fecha_fin_input: fin.fechaInput,
    hora_fin_input: fin.horaInput,
    capacidad: Number(fila.capacidad) || 0,
    precio_base: precioNum,
    precio:
      precioNum === 0 ? "Gratis" : "$ " + precioNum.toLocaleString("es-CO"),
    reservas: Number(fila.reservas) || 0, // entradas reservadas (sin canceladas)
    fechaRegistro: fila.fecha_registro || null, // cuándo se registró el evento (tarjeta "+N este mes")
    id_estado: fila.id_estado,
    estado: fila.nombre_estado,
    causa_cancelacion: fila.causa_cancelacion || "",
    reservas_canceladas: Number(fila.reservas_canceladas) || 0, // al cancelar el evento
    id_agente: fila.id_agente,
    nombre_agente: fila.nombre_agente,
    nombre_empresa: fila.nombre_empresa,
  };
}

export const EventoModel = {
  // ─── CRUD real contra /api/eventos (Sprint 2 - Tarea 3) ───────────────────

  /** Lista eventos desde PostgreSQL con filtros opcionales { id_estado, id_ciudad, id_agente, mis_eventos } */
  async listar(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.id_estado) params.set("id_estado", filtros.id_estado);
    if (filtros.id_ciudad) params.set("id_ciudad", filtros.id_ciudad);
    if (filtros.id_agente) params.set("id_agente", filtros.id_agente);
    if (filtros.mis_eventos) params.set("mis_eventos", "1");

    const qs = params.toString();
    const filas = await peticion(`/eventos${qs ? `?${qs}` : ""}`);
    return filas.map(adaptarEventoBD);
  },

  /** Eventos registrados por el agente en sesión (tabla "Mis eventos") */
  async obtenerDelAgente() {
    return this.listar({ mis_eventos: 1 });
  },

  /** Obtiene un evento por su ID desde PostgreSQL */
  async obtenerPorId(id) {
    const fila = await peticion(`/eventos/${id}`);
    return adaptarEventoBD(fila);
  },

  /** Lista los 5 estados de la tabla ESTADO */
  async listarEstados() {
    return peticion("/eventos/estados");
  },

  /** Crea un evento nuevo en PostgreSQL (POST /api/eventos) */
  async crear(datos) {
    const creado = await peticion("/eventos", { metodo: "POST", datos });
    return adaptarEventoBD(creado);
  },

  /** Actualiza los datos de un evento existente (PUT /api/eventos/:id) */
  async actualizar(id, datos) {
    const actualizado = await peticion(`/eventos/${id}`, {
      metodo: "PUT",
      datos,
    });
    return adaptarEventoBD(actualizado);
  },

  /** Cambia el estado de un evento (PATCH /api/eventos/:id/estado) */
  async cambiarEstado(id, id_estado, causa_cancelacion = null) {
    const actualizado = await peticion(`/eventos/${id}/estado`, {
      metodo: "PATCH",
      datos: { id_estado, causa_cancelacion },
    });
    return adaptarEventoBD(actualizado);
  },

  /** Elimina un evento sin reservas (DELETE /api/eventos/:id) */
  async eliminar(id) {
    return peticion(`/eventos/${id}`, { metodo: "DELETE" });
  },

  // ─── Métodos usados por Inicio, Catálogo y Detalle ────────────────────────

  /** 4 eventos destacados de la página principal (Home pública).
   *  Solo eventos REALES y disponibles: primero los que más entradas han vendido
   *  (los más "famosos") y, si empatan, los más próximos a realizarse. */
  async obtenerDestacados() {
    const reales = await this.listarCatalogo(); // ya vienen ordenados por fecha de inicio
    return [...reales]
      .sort((a, b) => b.reservas - a.reservas) // sort estable: los empates conservan el orden por fecha
      .slice(0, 4)
      .map((e) => {
        const disponibles = e.capacidad - e.reservas;
        let est = ESTADO_EN_INICIO[e.estado] ?? ESTADO_EN_INICIO["Programado"];
        // "Agotado" y "Últimas entradas" solo aplican cuando la venta está abierta
        if (e.estado === "En Boletería") {
          if (disponibles <= 0) est = { texto: "Agotado", color: "rojo" };
          else if (disponibles < e.capacidad * 0.2)
            est = { texto: "Últimas entradas", color: "ambar" };
        }
        return {
          id: e.id,
          nombre: e.nombre,
          ciudad: e.ciudad,
          fecha: e.fechaRango,
          hora: e.hora_inicio_input,
          precio: e.precio,
          estadoTexto: est.texto,
          estadoColor: est.color,
          recinto: e.teatro, // antes se llamaba "categoria", pero es el teatro/lugar
          imagen: e.imagen,
        };
      });
  },

  /** Detalle de un evento (subtarea 3.1: lee ?id=... de la URL si existe) */
  async obtenerDetalle(idParam) {
    const id = idParam || new URLSearchParams(window.location.search).get("id");
    if (id) {
      const ev = await this.obtenerPorId(id);
      return {
        id: ev.id,
        codigo: ev.codigo,
        nombre: ev.nombre,
        estado: ev.estado,
        ciudad: ev.ciudad,
        departamento: ev.departamento,
        pais: ev.pais,
        recinto: ev.teatro + (ev.direccion ? ` · ${ev.direccion}` : ""),
        fechaLarga: ev.fechaRango,
        fechaCorta: ev.fechaRango,
        fechaInicio: ev.fecha,
        fechaFin: ev.fechaFin,
        horaInicio: ev.hora_inicio_input,
        horaFin: ev.hora_fin_input,
        precio: ev.precio_base,
        capacidad: ev.capacidad,
        vendidas: ev.reservas,
        imagen: ev.imagen,
        parrafos: (ev.descripcion || "Sin descripción disponible.")
          .split(/\n+/)
          .filter(Boolean),
      };
    }
    // Si entran sin ?id=, intenta mostrar el primer evento real
    const lista = await this.listar();
    if (lista.length > 0) return this.obtenerDetalle(lista[0].id);
    return null;
  },

  // ─── Catálogo del cliente (Sprint 2 - Tarea 4) ────────────────────────────

  /** Eventos disponibles desde GET /api/eventos/catalogo.
   *  Filtros opcionales: { id_pais, id_departamento, id_ciudad, fecha_desde, fecha_hasta } */
  async listarCatalogo(filtros = {}) {
    const params = new URLSearchParams();
    for (const campo of [
      "id_pais",
      "id_departamento",
      "id_ciudad",
      "fecha_desde",
      "fecha_hasta",
    ]) {
      if (filtros[campo]) params.set(campo, filtros[campo]);
    }
    const qs = params.toString();
    const filas = await peticion(`/eventos/catalogo${qs ? `?${qs}` : ""}`);
    return filas.map(adaptarEventoBD);
  },

  /** Ciudades (con departamento y país) que tienen eventos disponibles, para los filtros */
  async obtenerCiudadesCatalogo() {
    return peticion("/eventos/catalogo/ciudades");
  },

  /** Eventos disponibles para el cliente (Inicio y Explorar). El backend ya excluye Cancelados y Finalizados. */
  async obtenerCatalogo(filtros = {}) {
    const eventos = await this.listarCatalogo(filtros);
    return eventos.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion,
      teatro: e.teatro,
      pais: e.pais,
      departamento: e.departamento,
      ciudad: e.ciudad,
      fecha: e.fechaRango,
      hora: e.hora_inicio_input,
      precio: e.precio,
      cuposTotal: e.capacidad,
      cuposVendidos: e.reservas,
      estado: e.estado,
      recinto: e.teatro, // antes "categoria": en realidad es el teatro/lugar
      imagen: e.imagen,
    }));
  },

  /** Primeros 6 eventos para la página de inicio del cliente */
  async obtenerParaInicioCliente() {
    return (await this.obtenerCatalogo()).slice(0, 6);
  },
};
