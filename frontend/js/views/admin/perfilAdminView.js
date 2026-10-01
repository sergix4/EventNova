// js/views/admin/perfilAdminView.js
// VISTA del perfil del administrador.

import { icono } from '../componentes/iconos.js'
import { esc, iniciales } from '../../utils/formato.js'

const OPCIONES = {
  pais: ['Colombia', 'Ecuador', 'Perú', 'Panamá'],
  departamento: ['Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander'],
  ciudad: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'],
}
const PREFERENCIAS = [
  { id: 'sistema', icono: 'campana', titulo: 'Recibir notificaciones del sistema', sub: 'Alertas generales de la plataforma' },
  { id: 'reportes', icono: 'actividad', titulo: 'Recibir alertas de reportes', sub: 'Notificaciones sobre reportes y estadísticas' },
  { id: 'actividad', icono: 'campana', titulo: 'Recibir alertas de actividad', sub: 'Actividad de usuarios, eventos y reservas' },
]

function tarjeta(titulo, subtitulo, cuerpo, accion = '', idAccion = '') {
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera">
        <div><h2 class="tarjeta__titulo">${titulo}</h2><p class="tarjeta__subtitulo">${subtitulo}</p></div>
        ${idAccion ? `<div id="${idAccion}">${accion}</div>` : accion}
      </div>
      <div class="tarjeta__cuerpo">${cuerpo}</div>
    </section>`
}

function campo(id, etiqueta, valor, { tipo = 'text', ayuda = '', siempreBloqueado = false } = {}) {
  return `
    <div class="campo">
      <label class="campo__etiqueta campo__etiqueta--sm" for="p-${id}">${etiqueta}</label>
      <input type="${tipo}" class="entrada" id="p-${id}" value="${esc(valor)}" disabled ${siempreBloqueado ? 'data-fijo' : 'data-editable'}>
      ${ayuda ? `<p class="campo__ayuda">${ayuda}</p>` : ''}
    </div>`
}

function campoSelect(id, etiqueta, valor) {
  return `
    <div class="campo">
      <label class="campo__etiqueta campo__etiqueta--sm" for="p-${id}">${etiqueta}</label>
      <div class="envoltura-select"><select class="selector" id="p-${id}" disabled data-editable>${OPCIONES[id].map(o => `<option${o === valor ? ' selected' : ''}>${o}</option>`).join('')}</select></div>
    </div>`
}

function opcionSeguridad(accion, ic, titulo, sub, color, fondo, boton) {
  return `
    <div class="opcion-admin">
      <div class="opcion-admin__izq">
        <div class="opcion-admin__icono" style="--fondo-icono:${fondo};--color-icono:${color}">${icono(ic, 18)}</div>
        <div><strong>${titulo}</strong><small>${sub}</small></div>
      </div>
      ${boton.replace('<button', `<button data-accion="${accion}"`)}
    </div>`
}

function campoClave(id, etiqueta) {
  return `
    <div class="campo">
      <label class="campo__etiqueta campo__etiqueta--sm" for="${id}">${etiqueta}</label>
      <div class="campo-clave">
        <input type="password" class="entrada" id="${id}" placeholder="••••••••" autocomplete="off">
        <button type="button" data-ver-clave="${id}" aria-label="Mostrar contraseña">${icono('ojo', 16)}</button>
      </div>
    </div>`
}

export const PerfilAdminView = {
  mostrar({ perfil, actividad, preferencias }) {
    const contenido = document.getElementById('contenido')
    contenido.classList.add('panel__contenido--medio')
    contenido.innerHTML = `
      ${tarjeta('Información personal', 'Datos personales asociados a tu cuenta de administrador', `
        <div class="perfil-admin__cabecera">
          <div class="perfil-admin__avatar">${esc(iniciales(perfil.nombre))}</div>
          <div>
            <p class="perfil-admin__nombre" id="perfil-nombre">${esc(perfil.nombre)}</p>
            <p class="perfil-admin__correo" id="perfil-correo">${esc(perfil.correo)}</p>
            <div class="perfil-admin__insignias">
              <span class="insignia insignia--admin"><span class="insignia__punto"></span>Administrador</span>
              <span class="insignia insignia--activa"><span class="insignia__punto"></span>Cuenta activa</span>
            </div>
          </div>
        </div>
        <form class="grid-campos-admin" id="form-perfil" novalidate>
          ${campo('nombre', 'Nombre completo', perfil.nombre)}
          ${campo('correo', 'Correo electrónico', perfil.correo, { tipo: 'email' })}
          ${campo('identificacion', 'Nº de identificación', perfil.identificacion)}
          ${campo('telefono', 'Teléfono', perfil.telefono, { tipo: 'tel' })}
          ${campo('direccion', 'Dirección', perfil.direccion)}
          ${campo('rol', 'Rol', 'Administrador', { ayuda: 'El rol es de solo lectura y no puede modificarse.', siempreBloqueado: true })}
          ${campoSelect('pais', 'País', perfil.pais)}
          ${campoSelect('departamento', 'Departamento', perfil.departamento)}
          ${campoSelect('ciudad', 'Ciudad', perfil.ciudad)}
        </form>`, this.botonesEdicion(false), 'acciones-perfil')}

      ${tarjeta('Información de la cuenta', 'Detalles del estado y acceso de tu cuenta administrativa', `
        <div class="cuenta-grid">
          <div class="cuenta-dato"><small>Rol</small><span class="pildora-cuenta pildora-cuenta--admin">Administrador</span></div>
          <div class="cuenta-dato"><small>Estado de la cuenta</small><span class="pildora-cuenta pildora-cuenta--activa">Activo</span></div>
          <div class="cuenta-dato"><small>Fecha de registro</small><p>15 de enero de 2026</p></div>
          <div class="cuenta-dato"><small>Último acceso</small><p>31 Ago 2026, 08:12 AM</p></div>
          <div class="cuenta-dato"><small>Correo de la cuenta</small><p id="cuenta-correo">${esc(perfil.correo)}</p></div>
          <div class="cuenta-dato cuenta-dato--indigo"><small>Tipo de cuenta</small><span class="pildora-cuenta pildora-cuenta--indigo">${icono('escudo', 14)}Cuenta administrativa</span></div>
        </div>`)}

      ${tarjeta('Seguridad', 'Administra las opciones de seguridad y acceso de tu cuenta', `
        <div class="opciones-admin">
          ${opcionSeguridad('cambiar-clave', 'llave', 'Cambiar contraseña', 'Actualiza tu contraseña de acceso al panel.', '#4f46e5', '#eef2ff',
            `<button type="button" class="boton boton--secundario">${icono('llave', 15)}Cambiar</button>`)}
          ${opcionSeguridad('cambiar-correo', 'correo', 'Cambiar correo electrónico', 'Actualiza el correo asociado a tu cuenta.', '#d97706', '#fffbeb',
            `<button type="button" class="boton boton--secundario boton--ambar">${icono('correo', 15)}Cambiar</button>`)}
          ${opcionSeguridad('cerrar-sesiones', 'salir', 'Cerrar sesiones activas', 'Finaliza todas las sesiones abiertas en otros dispositivos.', '#dc2626', '#fef2f2',
            `<button type="button" class="boton boton--rojo-contorno">${icono('salir', 15)}Cerrar sesiones</button>`)}
        </div>`)}

      ${tarjeta('Preferencias', 'Configura las notificaciones y el idioma del panel', `
        <div class="opciones-admin opciones-admin--holgadas" id="preferencias">
          ${PREFERENCIAS.map(p => `
          <div class="opcion-admin">
            <div class="opcion-admin__izq">
              <div class="opcion-admin__icono opcion-admin__icono--chico" data-icono-pref="${p.id}">${icono(p.icono, 16)}</div>
              <div><strong id="etq-${p.id}">${p.titulo}</strong><small>${p.sub}</small></div>
            </div>
            <button type="button" class="interruptor" role="switch" aria-checked="${preferencias[p.id]}" aria-labelledby="etq-${p.id}" data-preferencia="${p.id}"></button>
          </div>`).join('')}
          <div class="opcion-admin opcion-admin--fija">
            <div class="opcion-admin__izq">
              <div class="opcion-admin__icono opcion-admin__icono--chico" style="--fondo-icono:#eef2ff;--color-icono:#4f46e5">${icono('globo', 16)}</div>
              <div><strong>Idioma del panel</strong><small>Selecciona el idioma de la interfaz</small></div>
            </div>
            <div class="envoltura-select"><select class="selector selector--cabecera" id="idioma" aria-label="Idioma del panel"><option>Español</option><option>English</option><option>Português</option></select></div>
          </div>
        </div>`)}

      ${tarjeta('Actividad de la cuenta', 'Historial de accesos y acciones recientes', `
        <div class="tabla-contenedor tabla-borde-completo">
          <table class="tabla tabla--amplia">
            <thead><tr><th>Actividad</th><th>Fecha</th><th>Dispositivo</th><th>Estado</th></tr></thead>
            <tbody>${actividad.map(a => {
              const [fondo, color] = a.estado === 'Exitoso' ? ['#ecfdf5', '#059669'] : ['#fef2f2', '#dc2626']
              return `
              <tr>
                <td class="texto-seminegrita">${esc(a.actividad)}</td>
                <td class="texto-fecha texto-fecha--normal">${esc(a.fecha)}</td>
                <td class="texto-fecha texto-fecha--normal">${esc(a.dispositivo)}</td>
                <td><span class="insignia insignia--tono" style="--fondo-icono:${fondo};--color-icono:${color}"><span class="insignia__punto"></span>${a.estado}</span></td>
              </tr>`
            }).join('')}
            </tbody>
          </table>
        </div>`)}
      <div class="espacio-final"></div>`
    this.marcarPreferencias(preferencias)
  },

  botonesEdicion(editando) {
    return editando
      ? `<div class="acciones-fila">
           <button type="button" class="boton boton--neutro" data-accion="cancelar-edicion">Cancelar</button>
           <button type="button" class="boton boton--primario boton--seminegrita" data-accion="guardar-perfil">${icono('check', 15)}Guardar cambios</button>
         </div>`
      : `<button type="button" class="boton boton--secundario" data-accion="editar-perfil">${icono('editar', 15)}Editar perfil</button>`
  },

  /** Activa o bloquea los campos editables */
  modoEdicion(editando, perfil) {
    document.querySelectorAll('#form-perfil [data-editable]').forEach(control => {
      control.disabled = !editando
      const clave = control.id.replace('p-', '')
      if (!editando && perfil) control.value = perfil[clave]
    })
    document.getElementById('acciones-perfil').innerHTML = this.botonesEdicion(editando)
    if (editando) document.getElementById('p-nombre').focus()
  },

  actualizarCabecera(perfil) {
    document.getElementById('perfil-nombre').textContent = perfil.nombre
    document.getElementById('perfil-correo').textContent = perfil.correo
    document.getElementById('cuenta-correo').textContent = perfil.correo
  },

  marcarPreferencias(preferencias) {
    Object.entries(preferencias).forEach(([id, activo]) => {
      document.querySelector(`[data-preferencia="${id}"]`).setAttribute('aria-checked', String(activo))
      const caja = document.querySelector(`[data-icono-pref="${id}"]`)
      caja.style.setProperty('--fondo-icono', activo ? '#eef2ff' : '#f3f4f6')
      caja.style.setProperty('--color-icono', activo ? '#4f46e5' : '#9ca3af')
    })
  },

  modalClave() {
    return `
      <div class="modal__cabecera">
        <div><h3 class="modal__titulo">Cambiar contraseña</h3><p class="modal__subtitulo">La nueva contraseña debe tener al menos 8 caracteres.</p></div>
        <button type="button" class="boton-icono" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
      </div>
      <form class="modal__cuerpo" id="form-clave" novalidate>
        <div class="error-caja" id="error-clave" hidden></div>
        ${campoClave('clave-actual', 'Contraseña actual')}
        ${campoClave('clave-nueva', 'Nueva contraseña')}
        ${campoClave('clave-confirmar', 'Confirmar nueva contraseña')}
      </form>
      <div class="modal__pie modal__pie--mitades">
        <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
        <button type="submit" form="form-clave" class="boton boton--primario boton--seminegrita">Guardar</button>
      </div>`
  },

  errorClave(mensaje) {
    const caja = document.getElementById('error-clave')
    caja.hidden = !mensaje
    caja.innerHTML = mensaje ? `${icono('cerrar', 16)}${mensaje}` : ''
  },

  alternarClave(boton) {
    const input = document.getElementById(boton.dataset.verClave)
    const visible = input.type === 'password'
    input.type = visible ? 'text' : 'password'
    boton.innerHTML = icono(visible ? 'ojoTachado' : 'ojo', 16)
    boton.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña')
  },
}
