import { useState } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
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

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconHash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7M19 12H5" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

function IconAlertTriangle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'
type ReservationStatus = 'idle' | 'reservada' | 'confirmada' | 'cancelada'

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio',   label: 'Inicio',          icon: <IconHome /> },
  { key: 'explorar', label: 'Explorar eventos', icon: <IconCompass /> },
  { key: 'reservas', label: 'Mis reservas',     icon: <IconClipboard /> },
  { key: 'perfil',   label: 'Mi perfil',        icon: <IconUser /> },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeNav,
  onNav,
  onLogout,
}: {
  activeNav: NavKey
  onNav: (k: NavKey) => void
  onLogout: () => void
}) {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 220, flexShrink: 0 }}>
      <div className="px-5 py-5 flex items-center gap-2.5 shrink-0 border-b border-gray-100" style={{ height: 64 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4f46e5' }}>
          <span className="text-white"><IconTicket size={18} /></span>
        </div>
        <span className="text-base tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
          Event<span style={{ color: '#4f46e5' }}>Nova</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs text-gray-400 px-2 mb-2 uppercase tracking-widest" style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          Menú
        </p>
        {navItems.map(({ key, label, icon }) => {
          const active = activeNav === key
          return (
            <button
              key={key}
              onClick={() => onNav(key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left w-full"
              style={{
                background: active ? '#eef2ff' : 'transparent',
                color: active ? '#4338ca' : '#6b7280',
                fontWeight: active ? 700 : 500,
              }}
            >
              <span className="shrink-0" style={{ color: active ? '#4f46e5' : '#9ca3af' }}>{icon}</span>
              <span className="truncate">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#4f46e5' }} />}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontWeight: 700 }}>
            LG
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Laura García</p>
            <p className="text-xs text-gray-400">Cliente</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-2 py-2 mt-1 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <IconLogOut />
          <span style={{ fontWeight: 500 }}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="mt-0.5 shrink-0" style={{ color: '#6366f1' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-sm text-gray-800 break-words" style={{ fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  )
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function EventStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; dot: string }> = {
    'Programado':   { bg: '#eef2ff', text: '#4338ca', dot: '#6366f1' },
    'En Boletería': { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
    'En Vivo':      { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  }
  const c = cfg[status] || cfg['Programado']
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: c.bg, color: c.text, fontWeight: 700 }}>
      <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

// ─── Reservation status banner ────────────────────────────────────────────────

function ReservationBanner({ status, onCancel }: { status: ReservationStatus; onCancel: () => void }) {
  const cfg = {
    reservada: {
      bg: '#fffbeb', border: '#fde68a', icon: <IconClock />, iconColor: '#d97706',
      title: 'Reserva pendiente de confirmación',
      desc: 'Tu reserva fue registrada exitosamente. Está pendiente de confirmación por parte del agente.',
      pill: { bg: '#fef3c7', text: '#92400e', label: 'Reservada' },
    },
    confirmada: {
      bg: '#f0fdf4', border: '#bbf7d0', icon: <IconCheck />, iconColor: '#16a34a',
      title: '¡Reserva confirmada!',
      desc: 'Tu reserva está confirmada. Recibirás tus entradas digitales en el correo registrado.',
      pill: { bg: '#dcfce7', text: '#15803d', label: 'Confirmada' },
    },
    cancelada: {
      bg: '#fef2f2', border: '#fecaca', icon: <IconAlertTriangle />, iconColor: '#dc2626',
      title: 'Reserva cancelada',
      desc: 'Esta reserva fue cancelada. Si tienes dudas, contacta al agente responsable del evento.',
      pill: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelada' },
    },
  }
  if (status === 'idle') return null
  const c = cfg[status]
  return (
    <div className="rounded-2xl border p-5 flex items-start gap-4" style={{ background: c.bg, borderColor: c.border }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'white', color: c.iconColor }}>
        {c.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{c.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.pill.bg, color: c.pill.text, fontWeight: 600 }}>
            {c.pill.label}
          </span>
        </div>
        <p className="text-xs text-gray-600">{c.desc}</p>
      </div>
      {status !== 'cancelada' && (
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0 underline underline-offset-2"
          style={{ fontWeight: 500 }}
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

// ─── Payment Modal (multi-step) ───────────────────────────────────────────────

type PayStep = 'summary' | 'processing' | 'success'
type PayMethod = 'Tarjeta débito' | 'Tarjeta crédito' | 'PSE' | 'Nequi'

const PAY_METHODS: { id: PayMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'Tarjeta débito',
    label: 'Tarjeta débito',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
      </svg>
    ),
    desc: 'Pago inmediato con tu tarjeta',
  },
  {
    id: 'Tarjeta crédito',
    label: 'Tarjeta crédito',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 15h.01M10 15h.01"/>
      </svg>
    ),
    desc: 'Hasta 36 cuotas sin intereses',
  },
  {
    id: 'PSE',
    label: 'PSE',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    desc: 'Débito automático desde tu banco',
  },
  {
    id: 'Nequi',
    label: 'Nequi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>
      </svg>
    ),
    desc: 'Paga con tu cuenta Nequi',
  },
]

function PaymentModal({
  qty, total, onSuccess, onClose,
}: {
  qty: number; total: number; onSuccess: () => void; onClose: () => void
}) {
  const [step, setStep] = useState<PayStep>('summary')
  const [method, setMethod] = useState<PayMethod>('PSE')
  const [txnCode] = useState(() => 'TXN-' + Math.floor(800000 + Math.random() * 99999))

  const pay = () => {
    setStep('processing')
    setTimeout(() => setStep('success'), 2000)
  }

  const fmtTotal = total === 0 ? 'Gratis' : `$ ${total.toLocaleString('es-CO')}`
  const today = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,30,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={step === 'processing' ? undefined : onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ maxHeight: '92vh', overflowY: 'auto', animation: 'slideUp 0.2s ease' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Step: summary + payment method ── */}
        {step === 'summary' && (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eef2ff' }}>
                <span style={{ color: '#4f46e5' }}><IconTicket size={20} /></span>
              </div>
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 800 }}>Reservar y pagar</h2>
                <p className="text-xs text-gray-400">Revisa tu pedido y elige el método de pago</p>
              </div>
            </div>

            {/* Reservation summary */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600, letterSpacing: '0.06em' }}>Resumen de la reserva</p>
              <div className="flex flex-col gap-0 divide-y divide-gray-50">
                {[
                  { label: 'Evento',          value: 'Festival de Música Urbana' },
                  { label: 'Fecha',           value: '12 de septiembre, 2025' },
                  { label: 'Ciudad',          value: 'Medellín, Antioquia' },
                  { label: 'Entradas',        value: `${qty} entrada${qty > 1 ? 's' : ''}` },
                  { label: 'Precio c/u',      value: `$ ${(total / qty).toLocaleString('es-CO')}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</span>
                    <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 border-t border-gray-200 mt-1">
                  <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Total a pagar</span>
                  <span className="text-lg" style={{ fontWeight: 800, color: '#4f46e5' }}>{fmtTotal}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600, letterSpacing: '0.06em' }}>Método de pago</p>
              <div className="grid grid-cols-2 gap-2">
                {PAY_METHODS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className="flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all"
                    style={method === m.id
                      ? { borderColor: '#4f46e5', background: '#eef2ff', color: '#4f46e5' }
                      : { borderColor: '#e5e7eb', background: 'white', color: '#6b7280' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span style={{ color: method === m.id ? '#4f46e5' : '#9ca3af' }}>{m.icon}</span>
                      {method === m.id && (
                        <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#4f46e5' }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </div>
                    <span className="text-xs" style={{ fontWeight: 700, color: method === m.id ? '#3730a3' : '#374151' }}>{m.label}</span>
                    <span className="text-xs" style={{ fontWeight: 400, color: '#9ca3af', lineHeight: 1.3 }}>{m.desc}</span>
                  </button>
                ))}
              </div>

              {/* Simulated card fields - only for card methods */}
              {(method === 'Tarjeta débito' || method === 'Tarjeta crédito') && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-400 bg-gray-50" style={{ fontWeight: 500 }}>
                      •••• •••• •••• 4287
                    </div>
                    <div className="w-16 px-3 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-400 bg-gray-50 text-center" style={{ fontWeight: 500 }}>
                      08/27
                    </div>
                    <div className="w-14 px-3 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-400 bg-gray-50 text-center" style={{ fontWeight: 500 }}>
                      •••
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">Campos simulados — no ingresar datos reales</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-5 flex flex-col gap-2.5">
              <button
                onClick={pay}
                className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
                style={{ background: '#f4845f', fontWeight: 700 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Pagar {fmtTotal}
              </button>
              <button
                onClick={onClose}
                className="w-full text-sm text-gray-500 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancelar
              </button>
              <p className="text-xs text-gray-400 text-center">
                🔒 Pago simulado · No se realizará ningún cobro real
              </p>
            </div>
          </>
        )}

        {/* ── Step: processing ── */}
        {step === 'processing' && (
          <div className="px-8 py-16 flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#eef2ff' }}>
              <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base text-gray-900 mb-1" style={{ fontWeight: 700 }}>Procesando pago…</p>
              <p className="text-sm text-gray-400">Por favor espera unos segundos</p>
            </div>
            <div className="w-full max-w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ background: '#4f46e5', animation: 'payProgress 2s linear forwards' }} />
            </div>
          </div>
        )}

        {/* ── Step: success ── */}
        {step === 'success' && (
          <>
            <div className="px-6 py-6 flex flex-col items-center gap-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#16a34a' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-900" style={{ fontWeight: 800 }}>¡Pago realizado correctamente!</p>
                <p className="text-sm text-gray-500 mt-0.5">Tu reserva ha sido confirmada</p>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-0 divide-y divide-gray-50">
              {[
                { label: 'Evento',               value: 'Festival de Música Urbana' },
                { label: 'N.° de entradas',       value: `${qty} entrada${qty > 1 ? 's' : ''}` },
                { label: 'Total pagado',          value: fmtTotal },
                { label: 'Método de pago',        value: method },
                { label: 'Fecha del pago',        value: today },
                { label: 'Código de transacción', value: txnCode },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</span>
                  <span className="text-sm text-gray-900 text-right max-w-40" style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>Estado</span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#16a34a' }} />
                  Pagado
                </span>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-col gap-2.5">
              <button
                onClick={() => { onSuccess() }}
                className="w-full text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: '#4f46e5', fontWeight: 700 }}
              >
                Ver mi reserva
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes payProgress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface EventDetailPageProps {
  onBack: () => void
  onLogout: () => void
  onNavigate?: (key: NavKey) => void
  activeNav?: NavKey
}

export default function EventDetailPage({ onBack, onLogout, onNavigate, activeNav = 'explorar' }: EventDetailPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [observations, setObservations] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus>('idle')
  const [liked, setLiked] = useState(false)

  const PRICE = 95000
  const CAPACITY = 320
  const SOLD = 218
  const available = CAPACITY - SOLD
  const total = PRICE * qty

  const handlePaymentSuccess = () => {
    setShowModal(false)
    setReservationStatus('confirmada')
    // Navigate to Mis Reservas after a brief moment
    setTimeout(() => onNavigate?.('reservas'), 600)
  }

  const handleCancel = () => setReservationStatus('cancelada')

  const alreadyReserved = reservationStatus !== 'idle'

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col h-full shrink-0" style={{ width: 220 }}>
        <Sidebar activeNav={activeNav} onNav={(k) => onNavigate?.(k)} onLogout={onLogout} />
      </div>

      {/* Sidebar mobile drawer */}
      <div
        className="fixed left-0 top-0 h-full z-40 md:hidden flex flex-col transition-transform duration-200"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', width: 220 }}
      >
        <Sidebar activeNav={activeNav} onNav={(k) => { onNavigate?.(k); setSidebarOpen(false) }} onLogout={onLogout} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
              <IconMenu />
            </button>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm flex-wrap">
              <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 transition-colors" style={{ fontWeight: 500 }}>
                Inicio
              </button>
              <span className="text-gray-300"><IconChevronRight /></span>
              <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 transition-colors" style={{ fontWeight: 500 }}>
                Explorar eventos
              </button>
              <span className="text-gray-300"><IconChevronRight /></span>
              <span className="text-gray-700 truncate max-w-40" style={{ fontWeight: 600 }}>Detalle del evento</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              <IconBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#f4845f' }} />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>
              LG
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">

          {/* Hero image */}
          <div className="relative w-full bg-indigo-900 overflow-hidden" style={{ height: 320 }}>
            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&h=600&fit=crop&auto=format"
              alt="Festival de Música Urbana"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,5,40,0.85) 0%, rgba(10,5,40,0.3) 55%, transparent 100%)' }} />

            {/* Back button */}
            <button
              onClick={onBack}
              className="absolute top-5 left-6 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl"
              style={{ fontWeight: 500 }}
            >
              <IconArrowLeft />
              Volver
            </button>

            {/* Action buttons top-right */}
            <div className="absolute top-5 right-6 flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
                <IconShare />
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: liked ? '#f4845f' : 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', color: 'white' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'white' : 'none'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Event title overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-600 bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20" style={{ fontWeight: 600 }}>
                  Festival
                </span>
                <EventStatusBadge status="En Boletería" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white mb-2" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                Festival de Música Urbana
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
                <div className="flex items-center gap-1.5">
                  <IconMapPin /><span>Medellín, Antioquia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconBuilding /><span>Estadio Atanasio Girardot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconCalendar /><span>12 de septiembre, 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconClock /><span>6:00 PM – 11:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-7xl mx-auto px-6 py-7 grid lg:grid-cols-3 gap-7">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Reservation status banner */}
              {alreadyReserved && (
                <ReservationBanner status={reservationStatus} onCancel={handleCancel} />
              )}

              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: '#4f46e5' }} />
                  Sobre el evento
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-3" style={{ fontWeight: 400 }}>
                  <p>
                    El <strong className="text-gray-800">Festival de Música Urbana</strong> regresa a Medellín con una edición inolvidable. Tres escenarios simultáneos, más de 20 artistas nacionales e internacionales y una experiencia diseñada para los amantes del reggaetón, el trap, el hip-hop y el R&B.
                  </p>
                  <p>
                    Desde el atardecer hasta la medianoche, el Estadio Atanasio Girardot se convertirá en el epicentro de la cultura urbana colombiana. El evento incluye zonas de gastronomía, arte urbano interactivo, zonas VIP y acceso a plataformas de streaming en vivo.
                  </p>
                  <p>
                    Este festival cuenta con todas las medidas de seguridad y logística necesarias para garantizar una experiencia segura, organizada y memorable para todos los asistentes.
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base text-gray-900 mb-1 flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: '#f4845f' }} />
                  Información del evento
                </h2>
                <p className="text-xs text-gray-400 mb-4 ml-4">Todos los datos oficiales del evento.</p>
                <div>
                  <InfoRow icon={<IconHash />}    label="Código del evento"     value="EVT-2025-0912-MDE" />
                  <InfoRow icon={<IconBuilding />} label="Lugar / Recinto"       value="Estadio Atanasio Girardot" />
                  <InfoRow icon={<IconMapPin />}   label="Ciudad"                value="Medellín, Antioquia, Colombia" />
                  <InfoRow icon={<IconCalendar />} label="Fecha"                 value="12 de septiembre de 2025" />
                  <InfoRow icon={<IconClock />}    label="Hora de inicio"        value="6:00 PM" />
                  <InfoRow icon={<IconClock />}    label="Hora estimada de fin"  value="11:30 PM" />
                  <InfoRow
                    icon={<IconUsers />}
                    label="Capacidad disponible"
                    value={`${available} de ${CAPACITY} lugares disponibles`}
                  />
                </div>

                {/* Capacity bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Ocupación actual</span>
                    <span style={{ fontWeight: 600, color: available < 50 ? '#dc2626' : '#374151' }}>
                      {Math.round((SOLD / CAPACITY) * 100)}% vendido
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(SOLD / CAPACITY) * 100}%`,
                        background: available < 50 ? '#ef4444' : '#4f46e5',
                      }}
                    />
                  </div>
                  {available < 80 && (
                    <p className="text-xs mt-1.5" style={{ color: '#dc2626', fontWeight: 500 }}>
                      ⚠ Quedan solo {available} entradas disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right column — Booking card ──────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col gap-5 sticky top-6">

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5" style={{ fontWeight: 500 }}>Precio por entrada</p>
                    <p className="text-3xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                      $ 95.000
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">COP — impuestos incluidos</p>
                  </div>
                  <EventStatusBadge status="En Boletería" />
                </div>

                <div className="h-px bg-gray-100" />

                {alreadyReserved ? (
                  /* Already reserved state */
                  <div className="flex flex-col gap-4">
                    <div
                      className="rounded-xl p-4 flex flex-col gap-3"
                      style={{
                        background: reservationStatus === 'confirmada' ? '#f0fdf4' : reservationStatus === 'cancelada' ? '#fef2f2' : '#fffbeb',
                        border: `1px solid ${reservationStatus === 'confirmada' ? '#bbf7d0' : reservationStatus === 'cancelada' ? '#fecaca' : '#fde68a'}`,
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Entradas reservadas</span>
                        <span className="text-gray-900" style={{ fontWeight: 700 }}>{qty}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Valor total</span>
                        <span className="text-gray-900" style={{ fontWeight: 700 }}>$ {total.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="h-px" style={{ background: '#e5e7eb' }} />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Estado</span>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: reservationStatus === 'confirmada' ? '#dcfce7' : reservationStatus === 'cancelada' ? '#fee2e2' : '#fef3c7',
                            color: reservationStatus === 'confirmada' ? '#15803d' : reservationStatus === 'cancelada' ? '#991b1b' : '#92400e',
                            fontWeight: 700,
                          }}
                        >
                          {reservationStatus === 'reservada' ? 'Reservada' : reservationStatus === 'confirmada' ? 'Confirmada' : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                    {reservationStatus === 'cancelada' && (
                      <button
                        onClick={() => setReservationStatus('idle')}
                        className="w-full text-sm py-3 rounded-xl border-2 hover:bg-indigo-50 transition-colors"
                        style={{ color: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600 }}
                      >
                        Volver a reservar
                      </button>
                    )}
                  </div>
                ) : (
                  /* Booking form */
                  <>
                    {/* Qty selector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                        Número de entradas
                      </label>
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-1">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all text-xl"
                          disabled={qty <= 1}
                          style={{ opacity: qty <= 1 ? 0.4 : 1 }}
                        >
                          −
                        </button>
                        <div className="text-center">
                          <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{qty}</p>
                          <p className="text-xs text-gray-400">{qty === 1 ? 'entrada' : 'entradas'}</p>
                        </div>
                        <button
                          onClick={() => setQty((q) => Math.min(10, q + 1))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all text-xl"
                          disabled={qty >= 10}
                          style={{ opacity: qty >= 10 ? 0.4 : 1 }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Observations */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                        Observaciones <span className="text-gray-400" style={{ fontWeight: 400 }}>(opcional)</span>
                      </label>
                      <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Alguna indicación especial para tu reserva…"
                        rows={3}
                        className="text-sm text-gray-800 border border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none placeholder-gray-400 focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ fontWeight: 400 }}
                      />
                    </div>

                    {/* Price breakdown */}
                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{qty} × $ 95.000</span>
                        <span className="text-gray-700" style={{ fontWeight: 600 }}>$ {total.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Cargo por servicio</span>
                        <span>$ 0</span>
                      </div>
                      <div className="h-px bg-gray-200 my-1" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Total</span>
                        <span className="text-lg text-gray-900" style={{ fontWeight: 800 }}>$ {total.toLocaleString('es-CO')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-white py-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
                      style={{ background: '#f4845f', fontWeight: 700 }}
                    >
                      <IconTicket size={18} />
                      Reservar y pagar
                    </button>

                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      Pago 100% seguro · Múltiples métodos disponibles
                    </p>
                  </>
                )}
              </div>

              {/* Help card */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-sm text-indigo-800 mb-1" style={{ fontWeight: 700 }}>¿Necesitas ayuda?</p>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  Contacta al agente responsable del evento si tienes preguntas sobre disponibilidad, ubicaciones o precios especiales.
                </p>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </main>
      </div>

      {/* Payment modal */}
      {showModal && (
        <PaymentModal
          qty={qty}
          total={total}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
