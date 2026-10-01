// js/views/agente/perfilAgenteView.js
// VISTA del perfil del agente: datos personales, datos de agente, plan,
// planes disponibles, facturación, seguridad y sus ventanas de edición.

import { icono } from '../componentes/iconos.js'
import { esc } from '../../utils/formato.js'

const fila = (etiqueta, valor) => `<div class="fila-dato"><span>${etiqueta}</span><span>${esc(valor || 'No registrado')}</span></div>`
const ini = (nombre) => (nombre || '').split(' ').map(n => n[0]).join('').slice(0, 2)

function seccion(titulo, cuerpo, accion = '') {
  return `
    <section class="tarjeta tarjeta--recortada">
      <div class="tarjeta__cabecera" style="flex-wrap:nowrap"><h2 class="tarjeta__titulo">${titulo}</h2>${accion}</div>
      <div class="tarjeta__cuerpo">${cuerpo}</div>
    </section>`
}

function botonEditar(accion, texto) {
  return `<button type="button" class="boton boton--secundario" style="padding:8px 14px" data-accion="${accion}">${icono('editar', 15)}${texto}</button>`
}

function campo(id, etiqueta, valor, { tipo = 'text', placeholder = '', completo = false, soloLectura = false } = {}) {
  return `
    <div class="campo${completo ? ' grid-form__completo' : ''}">
      <label class="campo__etiqueta campo__etiqueta--chica" for="${id}">${etiqueta}</label>
      <input type="${tipo}" id="${id}" class="entrada${soloLectura ? ' entrada--solo-lectura' : ''}" value="${esc(valor)}" placeholder="${placeholder}"${soloLectura ? ' readonly' : ''}>
    </div>`
}

function cabeceraModal(titulo) {
  return `
    <div class="modal__cabecera" style="align-items:center">
      <h3 class="modal__titulo">${titulo}</h3>
      <button type="button" class="boton-icono boton-icono--sin-borde" data-cerrar-modal aria-label="Cerrar">${icono('cerrar', 18)}</button>
    </div>`
}

function pieModal(textoGuardar = 'Guardar cambios', id = 'guardar') {
  return `
    <div class="modal__pie">
      <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
      <button type="button" class="boton boton--coral boton--seminegrita" id="${id}">${textoGuardar}</button>
    </div>`
}

export const PerfilAgenteView = {
  mostrar({ personal, agente, planes, planActual }) {
    const plan = planes.find(p => p.clave === planActual)
    document.getElementById('contenido').innerHTML = `
      ${seccion('Información personal', `
        <div class="perfil-agente__cabecera">
          <div class="perfil-agente__avatar">${esc(ini(personal.nombre))}</div>
          <div><p class="perfil-agente__nombre">${esc(personal.nombre)}</p><span class="etiqueta-agente">Agente</span></div>
        </div>
        ${fila('Nombre completo', personal.nombre)}
        ${fila('Tipo de usuario', 'Agente')}
        ${fila('Correo electrónico', personal.correo)}
        ${fila('Número de identificación', personal.identificacion)}
        ${fila('Teléfono', personal.telefono)}
        ${fila('Dirección', personal.direccion)}
        ${fila('País', personal.pais)}
        ${fila('Departamento', personal.departamento)}
        ${fila('Ciudad', personal.ciudad)}`, botonEditar('editar-personal', 'Editar perfil'))}

      ${seccion('Información como agente', `
        ${fila('Nombre del agente', agente.nombre)}
        ${fila('Empresa o negocio', agente.empresa)}
        ${fila('Descripción del negocio', agente.descripcion)}
        ${fila('Ciudad de operación', agente.ciudad)}
        ${fila('Eventos registrados', '12')}
        ${fila('Eventos activos', '9')}
        ${fila('Reservas recibidas', '7.156')}
        ${fila('Agente desde', '15 de enero de 2025')}`, botonEditar('editar-agente', 'Editar información'))}

      <section class="plan-activo">
        <div class="plan-activo__fila">
          <div>
            <p class="plan-activo__rotulo">Plan activo</p>
            <h2 class="plan-activo__nombre">${esc(plan.nombre)}</h2>
            <div class="plan-activo__estado">
              <span class="plan-activo__pildora"><span class="insignia__punto"></span>Activo</span>
              <span class="plan-activo__cobro">Próximo cobro: 30 de septiembre de 2026</span>
            </div>
          </div>
          <div class="plan-activo__precio"><strong>${esc(plan.precioCorto)}</strong><span>por mes</span></div>
        </div>
        <ul class="plan-activo__beneficios">
          ${plan.beneficios.slice(0, 3).map(b => `<li><span>${icono('check', 16, { grosor: 2.5 })}</span>${esc(b)}</li>`).join('')}
        </ul>
        <div class="plan-activo__acciones">
          <button type="button" class="boton-blanco">Administrar plan</button>
          <button type="button" class="boton-vidrio" data-accion="cambiar-plan">Cambiar plan</button>
        </div>
      </section>

      ${seccion('Planes disponibles', `
        <div class="planes-perfil">
          ${planes.map(p => {
            const actual = p.clave === planActual
            return `
              <div class="plan-perfil${actual ? ' plan-perfil--actual' : ''}">
                ${p.recomendado ? `<span class="plan-perfil__recomendado">${icono('estrella', 14, { relleno: 'currentColor', grosor: 0 })}Recomendado</span>` : ''}
                <p class="plan-perfil__nombre">${esc(p.nombre)}</p>
                <p class="plan-perfil__precio">${esc(p.precioCorto)}</p>
                <p class="plan-perfil__periodo">COP por mes</p>
                <ul>${p.beneficios.map(b => `<li><span>${icono('check', 16, { grosor: 2.5 })}</span>${esc(b)}</li>`).join('')}</ul>
                ${actual
                  ? '<button type="button" class="plan-perfil__boton plan-perfil__boton--actual" disabled>Plan actual</button>'
                  : `<button type="button" class="plan-perfil__boton" data-elegir-plan="${p.clave}">Elegir plan</button>`}
              </div>`
          }).join('')}
        </div>`)}

      ${seccion('Información de facturación', `
        ${fila('Plan actual', plan.nombre)}
        ${fila('Precio mensual', plan.precio + ' por mes')}
        ${fila('Método de pago', 'Tarjeta Visa •••• 4821')}
        ${fila('Próxima fecha de cobro', '30 de septiembre de 2026')}
        ${fila('Estado de suscripción', 'Activo')}
        <div class="acciones-facturacion">
          <button type="button" class="boton boton--secundario">${icono('tarjetaCredito', 18)}Actualizar método de pago</button>
          <button type="button" class="boton boton--rojo-contorno" data-accion="cancelar-suscripcion">Cancelar suscripción</button>
        </div>`)}

      <section class="tarjeta tarjeta--recortada">
        <div class="tarjeta__cabecera" style="justify-content:flex-start;gap:8px"><span style="color:var(--gris-400)">${icono('escudo', 18)}</span><h2 class="tarjeta__titulo">Seguridad de la cuenta</h2></div>
        <div class="lista-seguridad">
          <button type="button" class="opcion-lista" data-accion="cambiar-clave">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#eef2ff;--color-icono:#4f46e5">${icono('llave', 16)}</span><span><strong>Cambiar contraseña</strong><small>Actualiza tu contraseña de acceso</small></span></span>
            ${icono('derecha', 16)}
          </button>
          <button type="button" class="opcion-lista">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#fffbeb;--color-icono:#d97706">${icono('monitor', 16)}</span><span><strong>Cerrar sesiones activas</strong><small>Cierra sesión en todos los dispositivos</small></span></span>
            ${icono('derecha', 16)}
          </button>
          <button type="button" class="opcion-lista opcion-lista--peligro" data-accion="cerrar-sesion">
            <span class="opcion-lista__izq"><span class="opcion-lista__icono" style="--fondo-icono:#fef2f2;--color-icono:#dc2626">${icono('salir', 18)}</span><span><strong>Cerrar sesión</strong><small>Salir de tu cuenta de EventNova</small></span></span>
            ${icono('derecha', 16)}
          </button>
        </div>
      </section>
      <div class="panel__espaciador"></div>`
  },

  // ─── Ventanas ─────────────────────────────────────────────────────────────
  modalPersonal(p) {
    const paises = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú']
    return `
      ${cabeceraModal('Editar perfil')}
      <div class="modal__cuerpo">
        <div class="grid-form">
          ${campo('m-nombre', 'Nombre completo', p.nombre, { placeholder: 'Nombre completo', completo: true })}
          ${campo('m-tipo', 'Tipo de usuario', 'Agente', { soloLectura: true })}
          ${campo('m-correo', 'Correo electrónico', p.correo, { tipo: 'email', placeholder: 'correo@ejemplo.com' })}
          ${campo('m-identificacion', 'Número de identificación', p.identificacion, { placeholder: 'CC / NIT' })}
          ${campo('m-telefono', 'Teléfono', p.telefono, { placeholder: '+57 300 000 0000' })}
          ${campo('m-direccion', 'Dirección', p.direccion, { placeholder: 'Calle, número, barrio', completo: true })}
          <div class="campo">
            <label class="campo__etiqueta campo__etiqueta--chica" for="m-pais">País</label>
            <div class="envoltura-select"><select id="m-pais" class="selector">${paises.map(x => `<option${x === (p.pais || 'Colombia') ? ' selected' : ''}>${x}</option>`).join('')}</select></div>
          </div>
          ${campo('m-departamento', 'Departamento', p.departamento, { placeholder: 'Departamento / Estado' })}
          ${campo('m-ciudad', 'Ciudad', p.ciudad, { placeholder: 'Ciudad' })}
        </div>
      </div>
      ${pieModal()}`
  },

  modalAgente(a) {
    return `
      ${cabeceraModal('Editar información de agente')}
      <div class="modal__cuerpo">
        ${campo('m-agente', 'Nombre del agente', a.nombre)}
        ${campo('m-empresa', 'Empresa o negocio', a.empresa)}
        <div class="campo"><label class="campo__etiqueta campo__etiqueta--chica" for="m-descripcion">Descripción del negocio</label><textarea id="m-descripcion" class="area-texto" rows="3">${esc(a.descripcion)}</textarea></div>
        ${campo('m-ciudad-op', 'Ciudad principal de operación', a.ciudad)}
      </div>
      ${pieModal()}`
  },

  modalPlan(plan) {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#eef2ff;color:#4f46e5">${icono('ticket', 20)}</div>
          <div><h3 class="modal__titulo">Cambiar plan</h3><p class="confirmacion__texto">¿Estás seguro de que deseas cambiar tu plan de EventNova a <strong style="color:var(--gris-700)">${esc(plan.nombre)}</strong>?</p></div>
        </div>
        <div class="cambio-plan"><span>${esc(plan.nombre)}</span><strong>${esc(plan.precioCorto)} / mes</strong></div>
        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--neutro" data-cerrar-modal>Cancelar</button>
          <button type="button" class="boton boton--coral boton--seminegrita" id="confirmar">Confirmar cambio</button>
        </div>
      </div>`
  },

  modalCancelarSuscripcion() {
    return `
      <div class="confirmacion">
        <div class="confirmacion__fila">
          <div class="confirmacion__icono" style="background:#fef2f2;color:#dc2626">${icono('advertencia', 22)}</div>
          <div><h3 class="modal__titulo">Cancelar suscripción</h3><p class="confirmacion__texto">¿Estás seguro de que deseas cancelar tu suscripción a EventNova? Perderás el acceso a las funciones de tu plan al final del período de facturación.</p></div>
        </div>
        <div class="pila" style="gap:8px">
          <button type="button" class="boton boton--primario boton--bloque" data-cerrar-modal>Continuar con mi plan</button>
          <button type="button" class="boton boton--rojo-contorno boton--bloque" id="confirmar">Cancelar suscripción</button>
        </div>
      </div>`
  },

  modalClave() {
    return `
      ${cabeceraModal('Cambiar contraseña')}
      <div class="modal__cuerpo">
        ${campo('clave-actual', 'Contraseña actual', '', { tipo: 'password', placeholder: '••••••••' })}
        ${campo('clave-nueva', 'Nueva contraseña', '', { tipo: 'password', placeholder: '••••••••' })}
        ${campo('clave-confirmar', 'Confirmar nueva contraseña', '', { tipo: 'password', placeholder: '••••••••' })}
        <p class="error-texto" id="error-clave" hidden></p>
        <div class="mensaje-exito" id="exito-clave" hidden>${icono('check', 16, { grosor: 2.5 })}Contraseña actualizada correctamente.</div>
      </div>
      ${pieModal('Guardar cambio')}`
  },
}
