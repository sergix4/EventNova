// js/views/cliente/perfilClienteView.js
// VISTA del perfil del cliente (datos de la sesión + preferencias).

import { icono } from '../componentes/iconos.js'
import { esc, iniciales } from '../../utils/formato.js'

function filaCampo(nombreIcono, etiqueta, valor) {
  return `
    <div class="fila-campo">
      ${icono(nombreIcono, 16)}
      <div><p class="fila-info__etiqueta">${etiqueta}</p><p class="fila-info__valor">${esc(valor)}</p></div>
    </div>`
}

function filaAlternar(id, etiqueta, descripcion, activo) {
  return `
    <div class="fila-alternar">
      <div><p id="etq-${id}">${etiqueta}</p><p>${descripcion}</p></div>
      <button type="button" class="interruptor" role="switch" aria-checked="${activo}" aria-labelledby="etq-${id}" data-preferencia="${id}"></button>
    </div>`
}

export const PerfilClienteView = {
  mostrar(usuario, { editando, preferencias }) {
    const nombre = usuario?.nombre || 'Cliente'
    document.getElementById('perfil').innerHTML = `
      <section class="tarjeta tarjeta-perfil">
        <div class="tarjeta-perfil__avatar">
          <div class="tarjeta-perfil__iniciales">${esc(iniciales(nombre))}</div>
          <button type="button" class="tarjeta-perfil__editar" aria-label="Cambiar foto">${icono('editar', 15)}</button>
        </div>
        <div style="flex:1;min-width:0">
          <p class="tarjeta-perfil__nombre">${esc(nombre)}</p>
          <p class="tarjeta-perfil__rol">Cliente</p>
          <div class="tarjeta-perfil__etiquetas">
            <span class="etiqueta-indigo">Cuenta activa</span>
            <span class="etiqueta-gris" style="padding:4px 10px">ID: ${usuario?.numero_id ? 'CLI-' + esc(usuario.numero_id) : '—'}</span>
          </div>
        </div>
        <div class="guardado" id="aviso-guardado" hidden>✓ Guardado</div>
      </section>

      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera">
          <h2 class="titulo-acento">Información personal</h2>
          <button type="button" class="boton-editar${editando ? ' boton-editar--activo' : ''}" data-accion="editar">${icono('editar', 15)}${editando ? 'Guardar cambios' : 'Editar'}</button>
        </div>
        ${filaCampo('usuario', 'Nombre completo', usuario?.nombre || '—')}
        ${filaCampo('documentoId', 'N.° de identificación', usuario?.numero_id || '—')}
        ${filaCampo('correo', 'Correo electrónico', usuario?.correo || '—')}
        ${filaCampo('telefono', 'Teléfono', 'No registrado')}
        ${filaCampo('ubicacion', 'Ciudad', 'No registrada')}
        ${filaCampo('ubicacion', 'Dirección', usuario?.direccion || '—')}
      </section>

      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera"><h2 class="titulo-acento titulo-acento--coral">Preferencias</h2></div>
        ${filaAlternar('publicidad', 'Publicidad personalizada', 'Recibe sugerencias de eventos según tus intereses.', preferencias.publicidad)}
        ${filaAlternar('correo', 'Notificaciones por correo', 'Recibe confirmaciones y actualizaciones de tus reservas.', preferencias.correo)}
        ${filaAlternar('reservas', 'Notificaciones de reservas', 'Alertas cuando el estado de tu reserva cambie.', preferencias.reservas)}
      </section>

      <section class="tarjeta seccion-perfil">
        <div class="seccion-perfil__cabecera"><h2 class="titulo-acento" style="--acento:var(--primario-claro)">Seguridad</h2></div>
        <button type="button" class="opcion-seguridad">
          ${icono('escudo', 16)}
          <div><strong>Cambiar contraseña</strong><span>Última actualización: hace 3 meses</span></div>
          <span style="color:var(--gris-400)">${icono('derecha', 14)}</span>
        </button>
      </section>

      <section class="zona-peligro">
        <div><strong>Cerrar sesión</strong><p>Saldrás de tu cuenta en este dispositivo.</p></div>
        <button type="button" data-accion="cerrar-sesion">Cerrar sesión</button>
      </section>
      <div class="panel__espaciador"></div>`
  },

  mostrarGuardado(visible) {
    document.getElementById('aviso-guardado').hidden = !visible
  },
}
