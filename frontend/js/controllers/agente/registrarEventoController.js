// js/controllers/agente/registrarEventoController.js
// CONTROLADOR de "Registrar evento".

import { iniciarPanel } from '../comun/panelController.js'
import { montarFormulario } from './formularioEventoController.js'
import { EventoModel } from '../../models/eventoModel.js'
import { mostrarToast } from '../../views/componentes/toast.js'

const IR_A_MIS_EVENTOS = () => { window.location.href = '/pages/agente/mis-eventos.html' }

async function iniciar() {
  await iniciarPanel({ rol: 'agente', activo: 'registrar-evento' })

  montarFormulario(document.getElementById('contenido'), {
    modo: 'registrar',
    alCancelar: IR_A_MIS_EVENTOS,
    alGuardar: async (datos) => {
      await EventoModel.crear(datos) // pendiente: POST /api/eventos
      mostrarToast('Evento creado correctamente.', { duracion: 1800 })
      setTimeout(IR_A_MIS_EVENTOS, 1800)
    },
  })
}

iniciar()
