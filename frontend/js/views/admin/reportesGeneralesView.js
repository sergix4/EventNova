// js/views/admin/reportesGeneralesView.js
// VISTA de "Reportes generales" del administrador.
// Solo DIBUJA: recibe los datos REALES que el controlador trajo de
// GET /api/reportes/generales y los convierte en HTML y gráficas (Chart.js).

import { icono } from '../componentes/iconos.js'
import { graficoBarras, graficoDona } from '../componentes/graficos.js'
import { esc, num, cop, plural } from '../../utils/formato.js'
import { leyenda } from './comunAdminView.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export const TIPOS_REGISTRO = {
  cliente: { fondo: '#eef2ff', color: '#4f46e5', texto: 'Cliente' },
  agente:  { fondo: '#fffbeb', color: '#d97706', texto: 'Agente' },
  admin:   { fondo: '#f5f3ff', color: '#7c3aed', texto: 'Admin' },
  evento:  { fondo: '#ecfdf5', color: '#059669', texto: 'Evento' },
  reserva: { fondo: '#fff7f5', color: '#f4845f', texto: 'Reserva' },
}

// Colores de cada estado real de la base de datos: [fondo, texto/color]
const COLOR_ESTADO = {
  // Usuarios
  'Registrado':   ['#eef2ff', '#4f46e5'],
  // Eventos (tabla ESTADO)
  'Programado':   ['#eff6ff', '#1d4ed8'],
  'En Boletería': ['#ecfdf5', '#059669'],
  'En Vivo':      ['#fff7ed', '#ea580c'],
  'Finalizado':   ['#f3f4f6', '#4b5563'],
  'Cancelado':    ['#fef2f2', '#dc2626'],
  // Reservas (tabla ESTADO_RESERVA)
  'Reservada':    ['#fffbeb', '#b45309'],
  'Confirmada':   ['#ecfdf5', '#047857'],
  'Cancelada':    ['#fef2f2', '#dc2626'],
}
const colorEstado = (estado) => COLOR_ESTADO[estado] || ['#f3f4f6', '#6b7280']

const sumar = (lista) => lista.reduce((a, b) => a + b, 0)

/** Porcentaje con 1 decimal sin dividir entre 0: (3, 0) → "0.0" */
const porcentaje = (parte, total) => (total ? (parte / total) * 100 : 0).toFixed(1)

/** Mensaje cuando una tarjeta no tiene datos todavía */
const sinDatos = (texto) => `<p class="mensaje-tarjeta-vacia">${esc(texto)}</p>`

/** Fecha del registro: "3 nov 2026, 9:05 a. m." */
function fechaRegistro(fechaISO) {
  if (!fechaISO) return 'Sin fecha'
  const fecha = new Date(fechaISO)
  const dia = fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
  const hora = fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
  return `${dia}, ${hora}`
}

/** Construye las 5 categorías (clientes, agentes, ...) a partir de los totales REALES */
function categorias(t) {
  return [
    { tipo: 'Clientes', etiqueta: 'Clientes registrados', sub: 'Usuarios registrados como clientes', valor: t.clientes, nuevos: t.clientes_mes, icono: 'usuarios', color: '#4f46e5', fondo: '#eef2ff' },
    { tipo: 'Agentes', etiqueta: 'Agentes registrados', sub: 'Agentes registrados en EventNova', valor: t.agentes, nuevos: t.agentes_mes, icono: 'maletin', color: '#f4845f', fondo: '#fff7f5' },
    { tipo: 'Administradores', etiqueta: 'Administradores registrados', sub: 'Administradores del sistema', valor: t.administradores, nuevos: t.administradores_mes, icono: 'escudo', color: '#d97706', fondo: '#fffbeb' },
    { tipo: 'Reservas', etiqueta: 'Reservas registradas', sub: 'Reservas realizadas en el sistema', valor: t.reservas, nuevos: t.reservas_mes, icono: 'ticket', color: '#059669', fondo: '#ecfdf5' },
    { tipo: 'Eventos', etiqueta: 'Eventos registrados', sub: 'Eventos creados en EventNova', valor: t.eventos, nuevos: t.eventos_mes, icono: 'calendario', color: '#7c3aed', fondo: '#f5f3ff' },
  ]
}

/** Píldora "+3 este mes": verde si hubo registros nuevos este mes, gris si no */
const variacion = (c, clase = 'kpi-admin__tendencia') => {
  const sube = c.nuevos > 0
  return `<span class="${clase} ${clase}--${sube ? 'sube' : 'igual'}">${sube ? icono('tendenciaArriba', 12) : ''}${sube ? '+' : ''}${num(c.nuevos)} este mes</span>`
}

function kpi(c, maximo) {
  return `
    <article class="kpi kpi--holgado" style="--color-icono:${c.color};--fondo-icono:${c.fondo}">
      <div class="kpi__superior">
        <div class="kpi__icono kpi__icono--grande">${icono(c.icono, 20)}</div>
        ${variacion(c)}
      </div>
      <div>
        <p class="kpi__valor kpi__valor--grande">${num(c.valor)}</p>
        <p class="kpi__etiqueta kpi__etiqueta--fuerte">${c.etiqueta}</p>
        <p class="kpi__sub">${c.sub}</p>
      </div>
      <div class="kpi__mini-barra"><span style="width:${maximo ? Math.min(100, Math.round(c.valor / maximo * 100)) : 0}%"></span></div>
    </article>`
}

function distribucion(cats) {
  const usuarios = cats.slice(0, 3)
  const total = sumar(usuarios.map(c => c.valor))
  return `
    <section class="tarjeta tarjeta--recortada col-2">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Distribución de usuarios</h2>
        <p class="tarjeta__subtitulo">Clientes · Agentes · Administradores</p>
      </div></div>
      <div class="tarjeta__cuerpo">
        ${total ? '<div class="grafica grafica--220"><canvas id="grafica-usuarios" aria-label="Distribución de usuarios"></canvas></div>' : sinDatos('Todavía no hay usuarios registrados.')}
        <div class="lista-distribucion">${usuarios.map(c => `
          <div>
            <span class="lista-distribucion__nombre"><i class="punto-color punto-color--12" style="--color:${c.color}"></i>${c.tipo}</span>
            <span class="lista-distribucion__valores"><strong>${num(c.valor)}</strong><small>${porcentaje(c.valor, total)}%</small></span>
          </div>`).join('')}
        </div>
      </div>
    </section>`
}

function resumen(cats) {
  const total = sumar(cats.map(c => c.valor))
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">Resumen de registros</h2>
        <p class="tarjeta__subtitulo">Totales históricos del sistema (${num(total)} registros) · no dependen del año elegido</p>
      </div></div>
      <div class="tabla-contenedor">
        <table class="tabla tabla--amplia">
          <thead><tr><th>Tipo de registro</th><th>Cantidad</th><th>Porcentaje del total</th><th>Nuevos este mes</th></tr></thead>
          <tbody>${cats.map(c => {
            const pct = porcentaje(c.valor, total)
            return `
            <tr>
              <td><div class="celda-icono"><span class="icono-tipo" style="--fondo-icono:${c.fondo};--color-icono:${c.color}">${icono(c.icono, 20)}</span><strong>${c.tipo}</strong></div></td>
              <td class="texto-negrita">${num(c.valor)}</td>
              <td><div class="porcentaje"><div class="barra barra--gruesa"><div class="barra__relleno" style="width:${pct}%;background:${c.color}"></div></div><span>${pct}%</span></div></td>
              <td>${variacion(c, 'tendencia')}</td>
            </tr>`
          }).join('')}
          </tbody>
        </table>
      </div>
    </section>`
}

/**
 * Tarjeta de reparto por estado (se usa para eventos y para reservas).
 * filas: [{ estado, cantidad, extra? }]
 */
function tarjetaEstados({ id, titulo, subtitulo, filas, vacio }) {
  const total = sumar(filas.map(f => f.cantidad))
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera"><div>
        <h2 class="tarjeta__titulo">${titulo}</h2>
        <p class="tarjeta__subtitulo">${subtitulo} · ${num(total)} en total</p>
      </div></div>
      <div class="tarjeta__cuerpo">
        ${total ? `<div class="grafica grafica--220"><canvas id="${id}" aria-label="${titulo}"></canvas></div>` : sinDatos(vacio)}
        <div class="lista-distribucion">${filas.map(f => `
          <div>
            <span class="lista-distribucion__nombre"><i class="punto-color punto-color--12" style="--color:${colorEstado(f.estado)[1]}"></i>${esc(f.estado)}</span>
            <span class="lista-distribucion__valores">${f.extra ? `<small style="width:auto">${f.extra}</small>` : ''}<strong>${num(f.cantidad)}</strong><small>${porcentaje(f.cantidad, total)}%</small></span>
          </div>`).join('')}
        </div>
      </div>
    </section>`
}

function ultimosRegistros(registros) {
  const tipos = Object.values(TIPOS_REGISTRO).map(t => `<option>${t.texto}</option>`).join('')
  // Los estados del filtro salen de los registros que llegaron (sin repetir)
  const estados = [...new Set(registros.map(r => r.estado))].sort()
    .map(e => `<option>${esc(e)}</option>`).join('')
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera tarjeta__cabecera--arriba">
        <div>
          <h2 class="tarjeta__titulo">Últimos registros</h2>
          <p class="tarjeta__subtitulo" id="conteo-registros"></p>
        </div>
        <div class="filtros-cabecera">
          <span class="etiqueta-filtros">${icono('filtro', 13)}Filtros:</span>
          <div class="envoltura-select envoltura-select--chica"><select class="selector" id="filtro-tipo" aria-label="Tipo"><option value="Todos">Todos los tipos</option>${tipos}</select></div>
          <div class="envoltura-select envoltura-select--chica"><select class="selector" id="filtro-estado" aria-label="Estado"><option value="Todos">Todos los estados</option>${estados}</select></div>
          <button type="button" class="boton-limpiar-mini" id="limpiar-filtros" hidden>${icono('cerrar', 12)}Limpiar filtros</button>
        </div>
      </div>
      <div class="tabla-contenedor">
        <table class="tabla tabla--amplia">
          <thead><tr><th>Tipo</th><th>Descripción</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody id="tabla-registros"></tbody>
        </table>
      </div>
      <div class="tarjeta__pie">
        <span id="pie-registros"></span>
        <span>Se muestran los ${registros.length} movimientos más recientes</span>
      </div>
    </section>`
}

export const ReportesGeneralesView = {
  /** Llena el selector de período con los años que tienen datos */
  mostrarPeriodos(anios, seleccionado) {
    const select = document.getElementById('periodo')
    if (!select) return
    select.innerHTML = anios
      .map(a => `<option value="${a}"${String(a) === String(seleccionado) ? ' selected' : ''}>${a}</option>`)
      .join('')
  },

  /** Mientras llegan los datos */
  mostrarCargando() {
    document.getElementById('contenido').innerHTML = sinDatos('Cargando reporte general…')
  },

  /** Si la API responde con error (por ejemplo, se venció la sesión) */
  mostrarError(mensaje) {
    document.getElementById('contenido').innerHTML = `
      <div class="vacio">
        <p class="vacio__texto">${esc(mensaje)}</p>
      </div>`
  },

  mostrar(datos) {
    const { anio, totales, eventosPorEstado, reservasPorEstado, reservasEventosMes, ultimosRegistros: registros } = datos
    const cats = categorias(totales)
    const maximo = Math.max(...cats.map(c => c.valor))
    const reservasAnio = sumar(reservasEventosMes.reservas)
    const eventosAnio = sumar(reservasEventosMes.eventos)

    document.getElementById('contenido').innerHTML = `
      <section class="grid-kpi grid-kpi--5" aria-label="Indicadores">${cats.map(c => kpi(c, maximo)).join('')}</section>

      <div class="grid-5">
        ${distribucion(cats)}
        <section class="tarjeta tarjeta--recortada col-3">
          <div class="tarjeta__cabecera">
            <div>
              <h2 class="tarjeta__titulo">Reservas y eventos</h2>
              <p class="tarjeta__subtitulo">Comparativa mensual ${anio} · ${num(reservasAnio)} ${plural(reservasAnio, 'reserva')} y ${num(eventosAnio)} ${plural(eventosAnio, 'evento')} creados</p>
            </div>
            ${leyenda([{ color: '#4f46e5', texto: 'Reservas' }, { color: '#f4845f', texto: 'Eventos' }])}
          </div>
          <div class="tarjeta__cuerpo">
            ${reservasAnio + eventosAnio
              ? '<div class="grafica grafica--260"><canvas id="grafica-reservas-eventos" aria-label="Reservas y eventos por mes"></canvas></div>'
              : sinDatos(`No hay reservas ni eventos registrados en ${anio}.`)}
          </div>
        </section>
      </div>

      <div class="grid-2">
        ${tarjetaEstados({
          id: 'grafica-eventos-estado', titulo: 'Eventos por estado',
          subtitulo: 'Programado · En Boletería · En Vivo · Finalizado · Cancelado',
          filas: eventosPorEstado, vacio: 'Todavía no hay eventos registrados.',
        })}
        ${tarjetaEstados({
          id: 'grafica-reservas-estado', titulo: 'Reservas por estado',
          subtitulo: 'Reservada · Confirmada · Cancelada',
          filas: reservasPorEstado.map(r => ({ ...r, extra: `${num(r.entradas)} ${plural(r.entradas, 'entrada')} · ${cop(r.valor)}` })),
          vacio: 'Todavía no hay reservas registradas.',
        })}
      </div>

      ${resumen(cats)}
      ${ultimosRegistros(registros)}
      <div class="espacio-final"></div>`

    // ── Gráficas (Chart.js). Solo se dibujan si su <canvas> existe ──────────
    const usuarios = cats.slice(0, 3)
    const totalUsuarios = sumar(usuarios.map(c => c.valor))
    const lienzoUsuarios = document.getElementById('grafica-usuarios')
    if (lienzoUsuarios) {
      graficoDona(lienzoUsuarios, {
        etiquetas: usuarios.map(c => c.tipo), datos: usuarios.map(c => c.valor), colores: usuarios.map(c => c.color),
        formatoTooltip: (c) => ` ${c.label}: ${num(c.raw)} (${porcentaje(c.raw, totalUsuarios)}%)`,
      })
    }

    const lienzoMes = document.getElementById('grafica-reservas-eventos')
    if (lienzoMes) {
      graficoBarras(lienzoMes, {
        etiquetas: MESES, separacion: 0.6,
        series: [
          { nombre: 'Reservas', datos: reservasEventosMes.reservas, color: '#4f46e5', anchoBarra: 0.8 },
          { nombre: 'Eventos', datos: reservasEventosMes.eventos, color: '#f4845f', anchoBarra: 0.8 },
        ],
      })
    }

    // Donas de eventos por estado y reservas por estado
    ;[['grafica-eventos-estado', eventosPorEstado], ['grafica-reservas-estado', reservasPorEstado]].forEach(([id, filas]) => {
      const lienzo = document.getElementById(id)
      if (!lienzo) return
      const total = sumar(filas.map(f => f.cantidad))
      graficoDona(lienzo, {
        etiquetas: filas.map(f => f.estado), datos: filas.map(f => f.cantidad), colores: filas.map(f => colorEstado(f.estado)[1]),
        formatoTooltip: (c) => ` ${c.label}: ${num(c.raw)} (${porcentaje(c.raw, total)}%)`,
      })
    })
  },

  /** Dibuja las filas de "Últimos registros" según los filtros */
  registros(lista, total, hayFiltros) {
    document.getElementById('conteo-registros').textContent = `${lista.length} ${plural(lista.length, 'registro')} ${plural(lista.length, 'encontrado')}`
    document.getElementById('pie-registros').textContent = `Mostrando ${lista.length} de ${total} registros`
    document.getElementById('limpiar-filtros').hidden = !hayFiltros
    document.getElementById('tabla-registros').innerHTML = lista.length === 0
      ? '<tr><td colspan="4" class="tabla__vacia">No se encontraron registros con los filtros seleccionados.</td></tr>'
      : lista.map(r => {
          const t = TIPOS_REGISTRO[r.tipo] || TIPOS_REGISTRO.cliente
          const [fondo, color] = colorEstado(r.estado)
          return `
          <tr>
            <td><span class="insignia insignia--tono" style="--fondo-icono:${t.fondo};--color-icono:${t.color}"><span class="insignia__punto"></span>${t.texto}</span></td>
            <td class="texto-medio">${esc(r.descripcion)}</td>
            <td class="texto-fecha">${esc(fechaRegistro(r.fecha))}</td>
            <td><span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${esc(r.estado)}</span></td>
          </tr>`
        }).join('')
  },
}