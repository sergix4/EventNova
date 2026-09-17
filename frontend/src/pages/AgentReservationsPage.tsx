import { useState } from 'react'
import { AGENT_CARLOS_RESERVATIONS, AGENT_CARLOS_PAYMENTS, SharedPayment, SHARED_EVENTS } from '../sharedData'

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentNavKey = 'mis-eventos' | 'registrar-evento' | 'reservas' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AgentNavKey) => void
  activeNav: AgentNavKey
}

type ReservationStatus = 'Pendiente' | 'Confirmada' | 'Cancelada'

interface Reservation {
  id: number
  clientName: string
  clientEmail: string
  eventName: string
  eventDate: string
  eventTime: string
  tickets: number
  totalValue: string
  totalValueRaw: number
  reservationDate: string
  status: ReservationStatus
  cancellationReason?: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconAlertCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_RESERVATIONS: Reservation[] = AGENT_CARLOS_RESERVATIONS.map((r, i) => {
  const ev = SHARED_EVENTS.find(e => e.id === r.eventoId)!
  return {
    id: i + 1,
    clientName: r.clienteNombre,
    clientEmail: r.clienteCorreo,
    eventName: r.eventoNombre,
    eventDate: ev.fecha.replace(/^(\d+) (\w+) (\d+)$/, (_, d, m, y) =>
      `${d} ${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`),
    eventTime: ev.hora,
    tickets: r.entradas,
    totalValue: r.valorTotalStr,
    totalValueRaw: r.valorTotal,
    reservationDate: r.fechaReserva,
    status: r.estado,
    ...(r.causaCancelacion ? { cancellationReason: r.causaCancelacion } : {}),
  }
})

const EVENT_OPTIONS = ['Todos los eventos', ...Array.from(new Set(INITIAL_RESERVATIONS.map(r => r.eventName)))]
const PAGE_SIZE = 8

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: AgentNavKey; label: string; icon: React.ReactNode }[] = [
  {
    key: 'mis-eventos',
    label: 'Mis eventos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'registrar-evento',
    label: 'Registrar evento',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <line x1="12" x2="12" y1="14" y2="18" /><line x1="10" x2="14" y1="16" y2="16" />
      </svg>
    ),
  },
  {
    key: 'reservas',
    label: 'Reservas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2M13 17v2M13 11v2" />
      </svg>
    ),
  },
  {
    key: 'perfil',
    label: 'Perfil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AgentSidebar({ activeNav, onNavigate, onLogout }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
            <span className="text-white"><IconTicket /></span>
          </div>
          <span className="text-xl tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
            Event<span style={{ color: '#4f46e5' }}>Nova</span>
          </span>
        </div>
        <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#eef2ff', color: '#4f46e5' }}>
          Panel Agente
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${
                isActive ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={isActive ? { background: '#4f46e5', fontWeight: 600 } : { fontWeight: 500 }}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 700 }}
          >
            CM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Carlos Martínez</p>
            <p className="text-xs text-gray-400">Agente</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <IconLogOut />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, { bg: string; text: string; dot: string }> = {
    'Pendiente':  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
    'Confirmada': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Cancelada':  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Detalle de reserva</h3>
            <p className="text-xs text-gray-400 mt-0.5">ID #{reservation.id.toString().padStart(5, '0')}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          {/* Client */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cliente</p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 700 }}>
                {reservation.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{reservation.clientName}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><IconMail />{reservation.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Event */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Evento</p>
            <DetailRow icon={<IconTicket />} label="Nombre" value={reservation.eventName} />
            <DetailRow icon={<IconCalendar />} label="Fecha" value={reservation.eventDate} />
            <DetailRow icon={<IconClock />} label="Hora" value={reservation.eventTime} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* Reservation info */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Reserva</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <p className="text-xl text-indigo-700" style={{ fontWeight: 800 }}>{reservation.tickets}</p>
                <p className="text-xs text-indigo-500" style={{ fontWeight: 500 }}>Entrada{reservation.tickets !== 1 ? 's' : ''}</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: '#fff7f5' }}>
                <p className="text-xl" style={{ fontWeight: 800, color: '#f4845f' }}>{reservation.totalValue}</p>
                <p className="text-xs" style={{ color: '#f4845f', fontWeight: 500 }}>Valor total</p>
              </div>
            </div>
            <DetailRow icon={<IconCalendar />} label="Fecha de reserva" value={reservation.reservationDate} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado actual</p>
            <StatusBadge status={reservation.status} />
          </div>

          {/* Cancellation reason */}
          {reservation.status === 'Cancelada' && reservation.cancellationReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
              <p className="text-xs text-red-500 font-semibold mb-1">Causa de cancelación</p>
              <p className="text-sm text-red-700">{reservation.cancellationReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs min-w-0">
        {icon}
        <span style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <span className="text-sm text-gray-700 text-right" style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

// ─── Update Status Modal ──────────────────────────────────────────────────────

function UpdateStatusModal({
  reservation,
  onClose,
  onSave,
}: {
  reservation: Reservation
  onClose: () => void
  onSave: (id: number, status: ReservationStatus, reason?: string) => void
}) {
  const [selected, setSelected] = useState<ReservationStatus>(reservation.status)
  const [reason, setReason] = useState(reservation.cancellationReason ?? '')
  const [reasonError, setReasonError] = useState(false)
  const [saved, setSaved] = useState(false)

  const STATUS_OPTIONS: ReservationStatus[] = ['Pendiente', 'Confirmada', 'Cancelada']

  const statusStyle: Record<ReservationStatus, { activeBg: string; activeText: string; activeBorder: string }> = {
    'Pendiente':  { activeBg: '#fffbeb', activeText: '#d97706', activeBorder: '#d97706' },
    'Confirmada': { activeBg: '#ecfdf5', activeText: '#059669', activeBorder: '#059669' },
    'Cancelada':  { activeBg: '#fef2f2', activeText: '#dc2626', activeBorder: '#dc2626' },
  }

  const handleSave = () => {
    if (selected === 'Cancelada' && !reason.trim()) {
      setReasonError(true)
      return
    }
    setSaved(true)
    setTimeout(() => {
      onSave(reservation.id, selected, selected === 'Cancelada' ? reason.trim() : undefined)
      onClose()
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Actualizar estado de reserva</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{reservation.clientName} · {reservation.eventName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Current status */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-500" style={{ fontWeight: 500 }}>Estado actual</span>
            <StatusBadge status={reservation.status} />
          </div>

          {/* New status */}
          <div>
            <p className="text-sm text-gray-700 mb-2.5" style={{ fontWeight: 600 }}>Nuevo estado</p>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map(s => {
                const isSelected = selected === s
                const st = statusStyle[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSelected(s); setReasonError(false) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all"
                    style={
                      isSelected
                        ? { background: st.activeBg, color: st.activeText, borderColor: st.activeBorder, fontWeight: 600 }
                        : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280', fontWeight: 500 }
                    }
                  >
                    <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: isSelected ? st.activeBorder : '#d1d5db', background: isSelected ? st.activeBg : 'white' }}>
                      {isSelected && <span className="w-2 h-2 rounded-full" style={{ background: st.activeText }} />}
                    </span>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cancellation reason */}
          {selected === 'Cancelada' && (
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
                Causa de cancelación <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe el motivo de la cancelación…"
                value={reason}
                onChange={e => { setReason(e.target.value); setReasonError(false) }}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all resize-none text-gray-700 placeholder-gray-400 ${
                  reasonError
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
                }`}
              />
              {reasonError && (
                <span className="flex items-center gap-1 text-xs text-red-500 mt-1" style={{ fontWeight: 500 }}>
                  <IconAlertCircle />
                  Este campo es obligatorio cuando el estado es Cancelada.
                </span>
              )}
            </div>
          )}

          {/* Success */}
          {saved && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>
              <IconCheck />
              Estado de reserva actualizado correctamente.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-6 py-2.5 rounded-xl text-sm text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            style={{ background: '#f4845f', fontWeight: 600 }}
          >
            Guardar cambio
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AgentReservationsPage({ onLogout, onNavigate, activeNav }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('Todos los eventos')
  const [statusFilter, setStatusFilter] = useState<'Todos' | ReservationStatus>('Todos')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [detailTarget, setDetailTarget] = useState<Reservation | null>(null)
  const [updateTarget, setUpdateTarget] = useState<Reservation | null>(null)
  const [paymentDetail, setPaymentDetail] = useState<SharedPayment | null>(null)

  // Stats
  const total = reservations.length
  const pending = reservations.filter(r => r.status === 'Pendiente').length
  const confirmed = reservations.filter(r => r.status === 'Confirmada').length
  const cancelled = reservations.filter(r => r.status === 'Cancelada').length

  // Filter
  const filtered = reservations.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = r.clientName.toLowerCase().includes(q) || r.eventName.toLowerCase().includes(q)
    const matchEvent = eventFilter === 'Todos los eventos' || r.eventName === eventFilter
    const matchStatus = statusFilter === 'Todos' || r.status === statusFilter
    const matchDate = !dateFilter || r.eventDate.toLowerCase().includes(dateFilter.toLowerCase()) || r.reservationDate.toLowerCase().includes(dateFilter.toLowerCase())
    return matchSearch && matchEvent && matchStatus && matchDate
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleUpdateStatus = (id: number, status: ReservationStatus, reason?: string) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status, cancellationReason: reason } : r)
    )
  }

  const stats = [
    { label: 'Reservas totales',     value: total,     icon: <IconTicket />,   color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Reservas pendientes',  value: pending,   icon: <PendingIcon />,  color: '#d97706', bg: '#fffbeb' },
    { label: 'Reservas confirmadas', value: confirmed, icon: <ConfirmIcon />,  color: '#059669', bg: '#ecfdf5' },
    { label: 'Reservas canceladas',  value: cancelled, icon: <CancelIcon />,   color: '#dc2626', bg: '#fef2f2' },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AgentSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Reservas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Administra las reservas solicitadas para tus eventos.</p>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontWeight: 500 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Listado de reservas</h2>
                <p className="text-xs text-gray-400 mt-0.5">{filtered.length} reserva{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-52">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
                <input
                  type="text"
                  placeholder="Buscar por cliente o evento…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all"
                />
              </div>

              {/* Evento */}
              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={e => { setEventFilter(e.target.value); setCurrentPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {EVENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
              </div>

              {/* Estado */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value as typeof statusFilter); setCurrentPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
              </div>

              {/* Fecha */}
              <input
                type="text"
                placeholder="Filtrar por fecha…"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); setCurrentPage(1) }}
                className="pl-3 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all placeholder-gray-400"
                style={{ minWidth: 160 }}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100" style={{ background: '#fafafa' }}>
                    {['Cliente', 'Evento', 'Fecha del evento', 'Entradas', 'Valor total', 'Fecha de reserva', 'Estado', 'Acciones'].map(col => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                        style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                        No se encontraron reservas con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : paged.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                      style={{ background: idx % 2 === 0 ? 'white' : 'transparent' }}
                    >
                      {/* Cliente */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 700 }}
                          >
                            {r.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{r.clientName}</p>
                            <p className="text-xs text-gray-400">{r.clientEmail}</p>
                          </div>
                        </div>
                      </td>
                      {/* Evento */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-700 line-clamp-1 max-w-40 block" style={{ fontWeight: 500 }}>{r.eventName}</span>
                      </td>
                      {/* Fecha evento */}
                      <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.eventDate}</td>
                      {/* Entradas */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700" style={{ fontWeight: 600 }}>
                          {r.tickets}
                          <span className="text-gray-400 text-xs" style={{ fontWeight: 400 }}>entrada{r.tickets !== 1 ? 's' : ''}</span>
                        </span>
                      </td>
                      {/* Valor */}
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ fontWeight: 700, color: '#f4845f' }}>{r.totalValue}</td>
                      {/* Fecha reserva */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{r.reservationDate}</td>
                      {/* Estado */}
                      <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                      {/* Acciones */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetailTarget(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                            style={{ fontWeight: 500 }}
                          >
                            <IconEye />
                            Ver detalle
                          </button>
                          <button
                            onClick={() => setUpdateTarget(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors whitespace-nowrap"
                            style={{ fontWeight: 500 }}
                          >
                            <IconRefresh />
                            Actualizar estado
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length} reservas
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <IconChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all"
                      style={p === currentPage ? { background: '#4f46e5', color: 'white', fontWeight: 600 } : { color: '#6b7280', fontWeight: 500 }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <IconChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* ── Pagos recibidos ── */}
          <PaymentsSection onViewPayment={setPaymentDetail} />

        </div>
      </main>

      {/* Modals */}
      {detailTarget && <DetailModal reservation={detailTarget} onClose={() => setDetailTarget(null)} />}
      {updateTarget && (
        <UpdateStatusModal
          reservation={updateTarget}
          onClose={() => setUpdateTarget(null)}
          onSave={(id, status, reason) => {
            handleUpdateStatus(id, status, reason)
            setUpdateTarget(null)
          }}
        />
      )}
      {paymentDetail && <PaymentDetailModal payment={paymentDetail} onClose={() => setPaymentDetail(null)} />}
    </div>
  )
}

// ─── Payment badge ────────────────────────────────────────────────────────────

type PaymentStatus = 'Pagado' | 'Pendiente' | 'Cancelado' | 'Reembolsado'

const payStatusCfg: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
  Pagado:      { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  Pendiente:   { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  Cancelado:   { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
  Reembolsado: { bg: '#f5f3ff', text: '#5b21b6', dot: '#8b5cf6' },
}

function PayBadge({ status }: { status: string }) {
  const c = payStatusCfg[status as PaymentStatus] ?? payStatusCfg['Pendiente']
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text, fontWeight: 600 }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

// ─── Payment detail modal ─────────────────────────────────────────────────────

function PaymentDetailModal({ payment, onClose }: { payment: SharedPayment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,30,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.22s ease' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Detalle del pago</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{payment.codigoTransaccion}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-0 divide-y divide-gray-50">
          {[
            { label: 'Cliente',                value: payment.clienteNombre },
            { label: 'Correo',                 value: payment.clienteCorreo },
            { label: 'Evento',                 value: payment.eventoNombre },
            { label: 'Cantidad de entradas',   value: `${payment.entradas} entrada${payment.entradas !== 1 ? 's' : ''}` },
            { label: 'Valor pagado',           value: payment.valorStr },
            { label: 'Método de pago',         value: payment.metodoPago },
            { label: 'Fecha y hora',           value: `${payment.fechaPago}, ${payment.horaPago}` },
            { label: 'Código de transacción',  value: payment.codigoTransaccion },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3">
              <span className="text-xs text-gray-400 shrink-0" style={{ fontWeight: 500 }}>{label}</span>
              <span className="text-sm text-gray-800 text-right font-mono" style={{ fontWeight: label === 'Código de transacción' ? 600 : 600 }}>{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3">
            <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>Estado del pago</span>
            <PayBadge status={payment.estado} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-colors"
            style={{ background: '#4f46e5', fontWeight: 600 }}>Cerrar</button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}

// ─── Payments section ─────────────────────────────────────────────────────────

const PAY_PAGE_SIZE = 5

function PaymentsSection({ onViewPayment }: { onViewPayment: (p: SharedPayment) => void }) {
  const payments = AGENT_CARLOS_PAYMENTS
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)

  const totalRecibido = payments.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.valor, 0)
  const countPagados    = payments.filter(p => p.estado === 'Pagado').length
  const countPendientes = payments.filter(p => p.estado === 'Pendiente').length
  const countCancelados = payments.filter(p => p.estado === 'Cancelado' || p.estado === 'Reembolsado').length

  const filtered = payments.filter(p => {
    const q = search.toLowerCase()
    const ms = p.clienteNombre.toLowerCase().includes(q) || p.eventoNombre.toLowerCase().includes(q) || p.codigoTransaccion.toLowerCase().includes(q)
    const mst = statusFilter === 'Todos' || p.estado === statusFilter
    return ms && mst
  })

  const totalPages = Math.ceil(filtered.length / PAY_PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAY_PAGE_SIZE, page * PAY_PAGE_SIZE)

  return (
    <div className="flex flex-col gap-5">
      {/* Section title */}
      <div>
        <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Pagos recibidos</h2>
        <p className="text-xs text-gray-400 mt-0.5">Historial de pagos de los clientes por reservas en tus eventos.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total recibido',   value: `$ ${totalRecibido.toLocaleString('es-CO')}`, color: '#4f46e5', bg: '#eef2ff',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
          { label: 'Pagos recibidos',  value: String(countPagados),    color: '#059669', bg: '#ecfdf5',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          { label: 'Pagos pendientes', value: String(countPendientes), color: '#d97706', bg: '#fffbeb',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label: 'Cancelados/Reimb.',value: String(countCancelados), color: '#dc2626', bg: '#fef2f2',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg> },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>{icon}</div>
            <div>
              <p className="text-xl text-gray-900" style={{ fontWeight: 800 }}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-40">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input type="text" placeholder="Buscar cliente, evento o TXN…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-indigo-400 placeholder-gray-400 text-gray-700"
              style={{ fontWeight: 400 }} />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
              style={{ fontWeight: 500 }}>
              {['Todos', 'Pagado', 'Pendiente', 'Cancelado', 'Reembolsado'].map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100" style={{ background: '#fafafa' }}>
                {['Cliente', 'Evento', 'Fecha pago', 'Entradas', 'Método', 'Valor', 'Estado', 'Código TXN', ''].map(col => (
                  <th key={col} className="px-5 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                    style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-400">Sin resultados.</td></tr>
              ) : paged.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors"
                  style={{ background: idx % 2 === 0 ? 'white' : 'transparent' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', fontWeight: 700 }}>
                        {p.clienteNombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{p.clienteNombre}</p>
                        <p className="text-xs text-gray-400">{p.clienteCorreo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-700 line-clamp-1 max-w-36 block" style={{ fontWeight: 500 }}>{p.eventoNombre}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{p.fechaPago}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 text-center" style={{ fontWeight: 700 }}>{p.entradas}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{p.metodoPago}</td>
                  <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ fontWeight: 700, color: '#f4845f' }}>{p.valorStr}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><PayBadge status={p.estado} /></td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 font-mono whitespace-nowrap" style={{ fontWeight: 600 }}>{p.codigoTransaccion}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => onViewPayment(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                      style={{ fontWeight: 500 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">Mostrando {(page - 1) * PAY_PAGE_SIZE + 1}–{Math.min(page * PAY_PAGE_SIZE, filtered.length)} de {filtered.length} pagos</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all"
                  style={n === page ? { background: '#4f46e5', color: 'white', fontWeight: 600 } : { color: '#6b7280', fontWeight: 500 }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Stat icons ───────────────────────────────────────────────────────────────

function PendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ConfirmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  )
}
