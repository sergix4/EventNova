// js/views/componentes/panel.js
// VISTA compartida: barras laterales de los tres paneles (cliente, agente y
// administrador). Cada página HTML tiene un <aside id="barra-lateral"> vacío
// y su controlador llama a una de estas funciones para dibujarlo.

import { icono } from './iconos.js'
import { esc, iniciales } from '../../utils/formato.js'

// ─── Menús de cada rol ──────────────────────────────────────────────────────
const MENU_CLIENTE = [
  { clave: 'inicio',   texto: 'Inicio',           icono: 'casa',         url: '/pages/cliente/inicio.html' },
  { clave: 'explorar', texto: 'Explorar eventos', icono: 'brujula',      url: '/pages/cliente/explorar.html' },
  { clave: 'reservas', texto: 'Mis reservas',     icono: 'portapapeles', url: '/pages/cliente/mis-reservas.html' },
  { clave: 'perfil',   texto: 'Mi perfil',        icono: 'usuario',      url: '/pages/cliente/perfil.html' },
]

const MENU_AGENTE = [
  { clave: 'mis-eventos',      texto: 'Mis eventos',      icono: 'cuadricula',    url: '/pages/agente/mis-eventos.html' },
  { clave: 'registrar-evento', texto: 'Registrar evento', icono: 'calendarioMas', url: '/pages/agente/registrar-evento.html' },
  { clave: 'reservas',         texto: 'Reservas',         icono: 'ticket',        url: '/pages/agente/reservas.html' },
  { clave: 'perfil',           texto: 'Perfil',           icono: 'perfil',        url: '/pages/agente/perfil.html' },
]

const MENU_ADMIN = [
  { clave: 'dashboard',            texto: 'Dashboard',            icono: 'cuadricula', url: '/pages/admin/dashboard.html' },
  { clave: 'reportes-generales',   texto: 'Reportes generales',   icono: 'reporte',    url: '/pages/admin/reportes-generales.html' },
  { clave: 'reportes-comerciales', texto: 'Reportes comerciales', icono: 'dolar',      url: '/pages/admin/reportes-comerciales.html' },
  { clave: 'cobertura',            texto: 'Cobertura y eventos',  icono: 'globo',      url: '/pages/admin/cobertura.html' },
  { clave: 'reservas-operacion',   texto: 'Reservas y operación', icono: 'ticket',     url: '/pages/admin/operacion.html' },
  { clave: 'ubicacion',            texto: 'Ubicación geográfica', icono: 'ubicacion',  url: '/pages/admin/ubicacion.html' },
  { clave: 'perfil',               texto: 'Perfil',               icono: 'perfil',     url: '/pages/admin/perfil.html' },
]

function enlaces(menu, activo, conPunto) {
  return menu.map(item => {
    const esActivo = item.clave === activo
    return `
      <a href="${item.url}" class="enlace-nav${esActivo ? ' enlace-nav--activo' : ''}"${esActivo ? ' aria-current="page"' : ''}>
        <span class="enlace-nav__icono">${icono(item.icono, 18)}</span>
        <span class="enlace-nav__texto">${item.texto}</span>
        ${conPunto && esActivo ? '<span class="enlace-nav__punto"></span>' : ''}
      </a>`
  }).join('')
}

function logo(clase = '', tamanoIcono = 20) {
  return `
    <a href="/" class="logo ${clase}">
      <span class="logo__icono">${icono('ticket', tamanoIcono)}</span>
      <span class="logo__texto">Event<span>Nova</span></span>
    </a>`
}

/** Barra lateral del CLIENTE */
export function barraCliente(activo, usuario) {
  const nombre = usuario?.nombre || 'Cliente'
  return `
    <div class="barra-lateral__logo">${logo('logo--mini', 18)}</div>
    <nav class="barra-lateral__nav" aria-label="Menú del cliente">
      <p class="barra-lateral__titulo">Menú</p>
      ${enlaces(MENU_CLIENTE, activo, true)}
    </nav>
    <div class="barra-lateral__pie">
      <div class="usuario-mini">
        <div class="usuario-mini__avatar">${esc(iniciales(nombre))}</div>
        <div class="usuario-mini__texto">
          <p class="usuario-mini__nombre">${esc(nombre)}</p>
          <p class="usuario-mini__rol">Cliente</p>
        </div>
      </div>
      <button type="button" class="boton-salir" data-accion="cerrar-sesion">
        ${icono('salir', 16)}<span>Cerrar sesión</span>
      </button>
    </div>`
}

/** Barra lateral del AGENTE */
export function barraAgente(activo, usuario) {
  const nombre = usuario?.nombre || 'Agente'
  return `
    <div class="barra-lateral__logo">
      ${logo()}
      <div><span class="barra-lateral__insignia">Panel Agente</span></div>
    </div>
    <nav class="barra-lateral__nav" aria-label="Menú del agente">${enlaces(MENU_AGENTE, activo, false)}</nav>
    <div class="barra-lateral__pie">
      <div class="usuario-gestion">
        <div class="usuario-gestion__avatar">${esc(iniciales(nombre))}</div>
        <div class="usuario-mini__texto">
          <p class="usuario-mini__nombre">${esc(nombre)}</p>
          <p class="usuario-mini__rol">Agente</p>
        </div>
      </div>
      <button type="button" class="boton-salir" data-accion="cerrar-sesion">${icono('salir', 18)}Cerrar sesión</button>
    </div>`
}

/** Barra lateral del ADMINISTRADOR */
export function barraAdmin(activo, usuario) {
  const nombre = usuario?.nombre || 'Administrador EventNova'
  return `
    <div class="barra-lateral__logo">
      ${logo()}
      <div><span class="barra-lateral__insignia barra-lateral__insignia--admin">Panel Administrador</span></div>
    </div>
    <nav class="barra-lateral__nav" aria-label="Menú del administrador">${enlaces(MENU_ADMIN, activo, false)}</nav>
    <div class="barra-lateral__pie">
      <div class="usuario-gestion">
        <div class="usuario-gestion__avatar usuario-gestion__avatar--admin">${usuario ? esc(iniciales(nombre)) : 'AE'}</div>
        <div class="usuario-mini__texto">
          <p class="usuario-mini__nombre">${esc(nombre)}</p>
          <p class="usuario-mini__rol">Administrador</p>
        </div>
      </div>
      <button type="button" class="boton-salir" data-accion="cerrar-sesion">${icono('salir', 18)}Cerrar sesión</button>
    </div>`
}

/** Notificaciones de ejemplo del cliente (campana de la cabecera) */
export function panelNotificaciones(notificaciones, leidas) {
  return `
    <div class="notificaciones__cabecera">
      <strong>Notificaciones</strong>
      <button type="button" data-accion="marcar-leidas">Marcar todas como leídas</button>
    </div>
    ${notificaciones.map(n => `
      <div class="notificacion${leidas ? ' notificacion--leida' : ''}">
        <span class="notificacion__emoji">${n.emoji}</span>
        <div class="notificacion__cuerpo">
          <p class="notificacion__texto">${esc(n.texto)}</p>
          <p class="notificacion__tiempo">${esc(n.tiempo)}</p>
        </div>
        <span class="notificacion__no-leida"></span>
      </div>`).join('')}`
}
