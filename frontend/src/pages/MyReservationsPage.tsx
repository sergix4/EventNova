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
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function IconCompass() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
}
function IconClipboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
}
function IconUser() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function IconLogOut() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
}
function IconSearch() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
}
function IconChevronDown() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
}
function IconBell() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
}
function IconMenu() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
}
function IconX() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
}
function IconCalendar() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
}
function IconMapPin() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}
function IconEye() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
}
function IconAlertCircle() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
}
function IconArrowRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
}
function IconChevronLeft() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
}
function IconChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
}

// ─── Types & Data ─────────────────────────────────────────────────────────────

type ReservationStatus = 'Reservada' | 'Confirmada' | 'Cancelada'
type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'

type PaymentStatus = 'Pagado' | 'Pendiente' | 'Cancelado' | 'Reembolsado'

interface Reservation {
  id: string
  eventName: string
  eventCategory: string
  eventImage: string
  eventDate: string
  eventTime: string
  city: string
  tickets: number
  bookedOn: string
  total: number
  status: ReservationStatus
  cancelReason?: string
  eventFinalized?: boolean
  code: string
  paymentStatus?: PaymentStatus
  paymentMethod?: string
  paymentDate?: string
  paymentCode?: string
}

const RESERVATIONS: Reservation[] = [
  {
    id: 'R001',
    code: 'RES-2025-0912-001',
    eventName: 'Festival de Música Urbana',
    eventCategory: 'Festival',
    eventImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=120&h=80&fit=crop&auto=format',
    eventDate: '12 Sep 2025',
    eventTime: '6:00 PM',
    city: 'Medellín',
    tickets: 2,
    bookedOn: '3 Ago 2025',
    total: 190000,
    status: 'Confirmada',
    eventFinalized: true,
    paymentStatus: 'Pagado',
    paymentMethod: 'PSE',
    paymentDate: '4 Ago 2025',
    paymentCode: 'TXN-712201',
  },
  {
    id: 'R002',
    code: 'RES-2025-0920-002',
    eventName: 'Noche de Comedia Stand-Up',
    eventCategory: 'Comedia',
    eventImage: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=120&h=80&fit=crop&auto=format',
    eventDate: '20 Sep 2025',
    eventTime: '8:30 PM',
    city: 'Bogotá',
    tickets: 1,
    bookedOn: '10 Ago 2025',
    total: 70000,
    status: 'Reservada',
    paymentStatus: 'Pendiente',
    paymentMethod: 'Nequi',
    paymentDate: '10 Ago 2025',
    paymentCode: 'TXN-712202',
  },
  {
    id: 'R003',
    code: 'RES-2025-1005-003',
    eventName: 'Teatro bajo las Estrellas',
    eventCategory: 'Teatro',
    eventImage: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=120&h=80&fit=crop&auto=format',
    eventDate: '5 Oct 2025',
    eventTime: '7:00 PM',
    city: 'Cali',
    tickets: 3,
    bookedOn: '15 Ago 2025',
    total: 165000,
    status: 'Confirmada',
    eventFinalized: true,
    paymentStatus: 'Pagado',
    paymentMethod: 'Tarjeta crédito',
    paymentDate: '15 Ago 2025',
    paymentCode: 'TXN-712203',
  },
  {
    id: 'R004',
    code: 'RES-2025-0801-004',
    eventName: 'Maluma · World Tour 2025',
    eventCategory: 'Concierto',
    eventImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=120&h=80&fit=crop&auto=format',
    eventDate: '15 Ago 2025',
    eventTime: '8:00 PM',
    city: 'Bogotá',
    tickets: 2,
    bookedOn: '22 Jul 2025',
    total: 240000,
    status: 'Cancelada',
    cancelReason: 'El cliente solicitó cancelación voluntaria antes de la fecha límite.',
    paymentStatus: 'Reembolsado',
    paymentMethod: 'Tarjeta débito',
    paymentDate: '23 Jul 2025',
    paymentCode: 'TXN-712204',
  },
  {
    id: 'R005',
    code: 'RES-2025-1018-005',
    eventName: 'Concierto Sinfónico — Beethoven',
    eventCategory: 'Clásica',
    eventImage: 'https://images.unsplash.com/photo-1519682718457-c82ce8296645?w=120&h=80&fit=crop&auto=format',
    eventDate: '18 Oct 2025',
    eventTime: '5:00 PM',
    city: 'Bogotá',
    tickets: 2,
    bookedOn: '20 Ago 2025',
    total: 240000,
    status: 'Reservada',
    eventFinalized: true,
    paymentStatus: 'Pendiente',
    paymentMethod: 'PSE',
    paymentDate: '20 Ago 2025',
    paymentCode: 'TXN-712205',
  },
  {
    id: 'R006',
    code: 'RES-2025-0710-006',
    eventName: 'Rock en el Parque 2025',
    eventCategory: 'Festival',
    eventImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=120&h=80&fit=crop&auto=format',
    eventDate: '10 Jul 2025',
    eventTime: '12:00 PM',
    city: 'Bogotá',
    tickets: 4,
    bookedOn: '1 Jun 2025',
    total: 0,
    status: 'Cancelada',
    cancelReason: 'Evento cancelado por el organizador debido a condiciones climáticas adversas.',
    paymentStatus: 'Cancelado',
    paymentMethod: 'Nequi',
    paymentDate: '2 Jun 2025',
    paymentCode: 'TXN-712206',
  },
]

const statusCfg: Record<ReservationStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  Reservada:  { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b', label: 'Reservada' },
  Confirmada: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Confirmada' },
  Cancelada:  { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', dot: '#ef4444', label: 'Cancelada' },
}

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio',   label: 'Inicio',          icon: <IconHome /> },
  { key: 'explorar', label: 'Explorar eventos', icon: <IconCompass /> },
  { key: 'reservas', label: 'Mis reservas',     icon: <IconClipboard /> },
  { key: 'perfil',   label: 'Mi perfil',        icon: <IconUser /> },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeNav, onNav, onLogout }: { activeNav: NavKey; onNav: (k: NavKey) => void; onLogout: () => void }) {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 220, flexShrink: 0 }}>
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-gray-100" style={{ height: 64 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4f46e5' }}>
          <span className="text-white"><IconTicket size={18} /></span>
        </div>
        <span className="text-base tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
          Event<span style={{ color: '#4f46e5' }}>Nova</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-xs text-gray-400 px-2 mb-2 uppercase" style={{ fontWeight: 600, letterSpacing: '0.08em' }}>Menú</p>
        {navItems.map(({ key, label, icon }) => {
          const active = activeNav === key
          return (
            <button key={key} onClick={() => onNav(key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left w-full"
              style={{ background: active ? '#eef2ff' : 'transparent', color: active ? '#4338ca' : '#6b7280', fontWeight: active ? 700 : 500 }}>
              <span className="shrink-0" style={{ color: active ? '#4f46e5' : '#9ca3af' }}>{icon}</span>
              <span className="truncate">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#4f46e5' }} />}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>LG</div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Laura García</p>
            <p className="text-xs text-gray-400">Cliente</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-2 py-2 mt-1 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <IconLogOut /><span style={{ fontWeight: 500 }}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReservationStatus }) {
  const c = statusCfg[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ background: c.bg, color: c.text, borderColor: c.border, fontWeight: 600 }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  )
}

// ─── Payment badge ────────────────────────────────────────────────────────────

const payCfg: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
  Pagado:      { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  Pendiente:   { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  Cancelado:   { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
  Reembolsado: { bg: '#f5f3ff', text: '#5b21b6', dot: '#8b5cf6' },
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const c = payCfg[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text, fontWeight: 600 }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function StarRow({ stars, size = 18, color = '#f59e0b' }: { stars: number; size?: number; color?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= stars ? color : 'none'} stroke={i <= stars ? color : '#d1d5db'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

function DetailDrawer({ reservation, onClose, onViewEvent, onRate, ratingInfo }: {
  reservation: Reservation
  onClose: () => void
  onViewEvent: () => void
  onRate: (r: Reservation) => void
  ratingInfo?: { stars: number; comment: string; submitted: boolean }
}) {
  const c = statusCfg[reservation.status]
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}
      style={{ background: 'rgba(10,10,30,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white h-full w-full max-w-sm flex flex-col shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideIn 0.22s ease' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Detalle de reserva</h2>
            <p className="text-xs text-gray-400 mt-0.5">{reservation.code}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Event image + name */}
        <div className="relative h-36 bg-indigo-100 shrink-0 overflow-hidden">
          <img src={reservation.eventImage.replace('w=120&h=80', 'w=600&h=300')} alt={reservation.eventName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-xs text-white/70 block mb-0.5">{reservation.eventCategory}</span>
            <p className="text-base text-white leading-snug" style={{ fontWeight: 700 }}>{reservation.eventName}</p>
          </div>
        </div>

        {/* Status */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>Estado de la reserva</span>
            <StatusBadge status={reservation.status} />
          </div>
          {reservation.status === 'Cancelada' && reservation.cancelReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <span className="text-red-400 shrink-0 mt-0.5"><IconAlertCircle /></span>
              <div>
                <p className="text-xs text-red-700 mb-0.5" style={{ fontWeight: 600 }}>Causa de cancelación</p>
                <p className="text-xs text-red-600 leading-relaxed">{reservation.cancelReason}</p>
              </div>
            </div>
          )}
          {reservation.status === 'Confirmada' && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Tu reserva fue confirmada. Tus entradas digitales están disponibles en el correo registrado.
              </p>
            </div>
          )}
          {reservation.status === 'Reservada' && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Pendiente de confirmación por el agente. Te notificaremos cuando sea aprobada.
              </p>
            </div>
          )}
        </div>

        {/* Info rows */}
        <div className="px-6 py-4 flex flex-col divide-y divide-gray-100 flex-1">
          {[
            { label: 'Evento',          value: reservation.eventName },
            { label: 'Fecha del evento',value: `${reservation.eventDate} · ${reservation.eventTime}` },
            { label: 'Ciudad',          value: reservation.city },
            { label: 'N.° de entradas', value: `${reservation.tickets} entrada${reservation.tickets > 1 ? 's' : ''}` },
            { label: 'Fecha de reserva',value: reservation.bookedOn },
            { label: 'Valor total',     value: reservation.total === 0 ? 'Gratis' : `$ ${reservation.total.toLocaleString('es-CO')} COP` },
            { label: 'Código',          value: reservation.code },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3">
              <span className="text-xs text-gray-400 shrink-0" style={{ fontWeight: 500 }}>{label}</span>
              <span className="text-xs text-gray-800 text-right" style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Payment info */}
        {reservation.paymentStatus && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>Información del pago</p>
            <div className="flex flex-col gap-0 divide-y divide-gray-50 rounded-xl overflow-hidden border border-gray-100">
              {[
                { label: 'Estado del pago', node: <PaymentBadge status={reservation.paymentStatus} /> },
                { label: 'Método de pago',  node: <span className="text-xs text-gray-800" style={{ fontWeight: 600 }}>{reservation.paymentMethod}</span> },
                { label: 'Total pagado',    node: <span className="text-xs text-gray-800" style={{ fontWeight: 700 }}>{reservation.total === 0 ? 'Gratis' : `$ ${reservation.total.toLocaleString('es-CO')} COP`}</span> },
                { label: 'Fecha de pago',   node: <span className="text-xs text-gray-500" style={{ fontWeight: 500 }}>{reservation.paymentDate ?? '—'}</span> },
                { label: 'Código TXN',      node: <span className="text-xs text-gray-500 font-mono" style={{ fontWeight: 600 }}>{reservation.paymentCode ?? '—'}</span> },
              ].map(({ label, node }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-gray-50">
                  <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</span>
                  {node}
                </div>
              ))}
            </div>
          </div>
        )}

        {reservation.eventFinalized && reservation.status !== 'Cancelada' && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>Calificación del evento</p>
            {ratingInfo?.submitted ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <StarRow stars={ratingInfo.stars} size={22} />
                  <span className="text-sm text-amber-700" style={{ fontWeight: 700 }}>Evento calificado</span>
                </div>
                {ratingInfo.comment && (
                  <p className="text-xs text-gray-500 italic leading-relaxed">"{ratingInfo.comment}"</p>
                )}
              </div>
            ) : (
              <button onClick={() => onRate(reservation)}
                className="w-full flex items-center justify-center gap-2.5 text-sm py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: '#fff7f5', color: '#f4845f', fontWeight: 700, border: '2px solid #fcd9c8' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Calificar evento
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex flex-col gap-2.5 border-t border-gray-100 shrink-0">
          <button onClick={onViewEvent}
            className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#f4845f', fontWeight: 700 }}>
            <IconTicket size={16} />
            Ver evento
          </button>
          {reservation.status === 'Reservada' && (
            <button className="w-full text-sm py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
              style={{ fontWeight: 600 }}>
              Cancelar reserva
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reservation row (table) ──────────────────────────────────────────────────

function ReservationRow({ res, onView, onRate, ratingInfo }: {
  res: Reservation
  onView: (r: Reservation) => void
  onRate: (r: Reservation) => void
  ratingInfo?: { stars: number; submitted: boolean }
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-indigo-50/40 transition-colors group">
      {/* Event */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-100 shrink-0">
            <img src={res.eventImage} alt={res.eventName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600, maxWidth: 200 }}>{res.eventName}</p>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
              {res.eventCategory}
            </span>
          </div>
        </div>
      </td>
      {/* Date */}
      <td className="py-4 px-4 whitespace-nowrap">
        <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{res.eventDate}</p>
        <p className="text-xs text-gray-400">{res.eventTime}</p>
      </td>
      {/* City */}
      <td className="py-4 px-4 hidden md:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span style={{ color: '#6366f1' }}><IconMapPin /></span>
          {res.city}
        </div>
      </td>
      {/* Tickets */}
      <td className="py-4 px-4 text-center hidden lg:table-cell">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm" style={{ background: '#eef2ff', color: '#4338ca', fontWeight: 700 }}>
          {res.tickets}
        </span>
      </td>
      {/* Booked on */}
      <td className="py-4 px-4 hidden xl:table-cell">
        <p className="text-sm text-gray-500">{res.bookedOn}</p>
      </td>
      {/* Total */}
      <td className="py-4 px-4 whitespace-nowrap">
        <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
          {res.total === 0 ? 'Gratis' : `$ ${res.total.toLocaleString('es-CO')}`}
        </p>
        {res.status === 'Cancelada' && (
          <p className="text-xs text-gray-400 line-through">{res.total > 0 ? `$ ${res.total.toLocaleString('es-CO')}` : ''}</p>
        )}
      </td>
      {/* Status */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={res.status} />
          {res.paymentStatus && <PaymentBadge status={res.paymentStatus} />}
          {res.paymentMethod && (
            <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{res.paymentMethod}</span>
          )}
          {res.status === 'Cancelada' && res.cancelReason && (
            <div className="flex items-center gap-1 text-xs text-red-500 max-w-36">
              <span className="shrink-0"><IconAlertCircle /></span>
              <span className="truncate" title={res.cancelReason}>{res.cancelReason}</span>
            </div>
          )}
        </div>
      </td>
      {/* Action */}
      <td className="py-4 px-5">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onView(res)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group-hover:border-indigo-300"
            style={{ fontWeight: 600 }}
          >
            <IconEye />
            Ver detalle
          </button>
          {res.eventFinalized && res.status !== 'Cancelada' && (
            ratingInfo?.submitted ? (
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: '#fffbeb' }}>
                <StarRow stars={ratingInfo.stars} size={12} />
                <span className="text-amber-700 whitespace-nowrap" style={{ fontWeight: 600 }}>Calificado</span>
              </div>
            ) : (
              <button
                onClick={() => onRate(res)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all whitespace-nowrap"
                style={{ borderColor: '#f4845f', color: '#f4845f', fontWeight: 600, background: '#fff7f5' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Calificar
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function ReservationCard({ res, onView, onRate, ratingInfo }: {
  res: Reservation
  onView: (r: Reservation) => void
  onRate: (r: Reservation) => void
  ratingInfo?: { stars: number; submitted: boolean }
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-indigo-100 shrink-0">
          <img src={res.eventImage} alt={res.eventName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-900 leading-snug" style={{ fontWeight: 700 }}>{res.eventName}</p>
            <StatusBadge status={res.status} />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 flex items-center gap-1"><IconCalendar />{res.eventDate}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><IconMapPin />{res.city}</span>
          </div>
        </div>
      </div>

      {res.status === 'Cancelada' && res.cancelReason && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-start gap-2">
          <span className="text-red-400 shrink-0 mt-0.5"><IconAlertCircle /></span>
          <p className="text-xs text-red-600 leading-relaxed">{res.cancelReason}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">{res.tickets} entrada{res.tickets > 1 ? 's' : ''} · {res.bookedOn}</p>
          <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
            {res.total === 0 ? 'Gratis' : `$ ${res.total.toLocaleString('es-CO')}`}
          </p>
          {res.paymentStatus && <PaymentBadge status={res.paymentStatus} />}
        </div>
        <button
          onClick={() => onView(res)}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          style={{ fontWeight: 600 }}
        >
          <IconEye />
          Ver detalle
        </button>
      </div>
      {res.eventFinalized && res.status !== 'Cancelada' && (
        <div className="pt-2 border-t border-gray-100">
          {ratingInfo?.submitted ? (
            <div className="flex items-center gap-2">
              <StarRow stars={ratingInfo.stars} size={14} />
              <span className="text-xs text-amber-700" style={{ fontWeight: 600 }}>Evento calificado</span>
            </div>
          ) : (
            <button onClick={() => onRate(res)}
              className="w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl transition-all"
              style={{ background: '#fff7f5', color: '#f4845f', fontWeight: 700, border: '1px solid #fcd9c8' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Calificar evento
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, bg, color, icon }: { label: string; value: number; sub: string; bg: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-2xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#eef2ff' }}>
        <span style={{ color: '#6366f1' }}><IconTicket size={36} /></span>
      </div>
      <p className="text-lg text-gray-800 mb-2" style={{ fontWeight: 700 }}>Todavía no tienes reservas</p>
      <p className="text-sm text-gray-400 max-w-xs mb-6 leading-relaxed">
        Explora los eventos disponibles y realiza tu primera reserva. ¡Es rápido y sencillo!
      </p>
      <button
        onClick={onExplore}
        className="flex items-center gap-2 text-sm text-white px-6 py-3.5 rounded-xl shadow-md hover:opacity-90 transition-all"
        style={{ background: '#4f46e5', fontWeight: 600 }}
      >
        Explorar eventos
        <IconArrowRight />
      </button>
    </div>
  )
}

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({
  reservation,
  draftStars,
  draftComment,
  hoverStar,
  onHover,
  onSelect,
  onCommentChange,
  onSubmit,
  onClose,
}: {
  reservation: Reservation
  draftStars: number
  draftComment: string
  hoverStar: number
  onHover: (s: number) => void
  onSelect: (s: number) => void
  onCommentChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}) {
  const displayStars = hoverStar || draftStars
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,30,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeUp 0.2s ease' }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Calificar evento</h3>
            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{reservation.eventName}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Stars */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(i => (
              <button key={i}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(0)}
                onClick={() => onSelect(i)}
                className="transition-transform hover:scale-110 active:scale-95">
                <svg width="36" height="36" viewBox="0 0 24 24"
                  fill={i <= displayStars ? '#f59e0b' : 'none'}
                  stroke={i <= displayStars ? '#f59e0b' : '#d1d5db'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500" style={{ fontWeight: 500 }}>
            {displayStars === 0 ? 'Selecciona una calificación' :
             displayStars === 1 ? 'Muy malo' :
             displayStars === 2 ? 'Malo' :
             displayStars === 3 ? 'Regular' :
             displayStars === 4 ? 'Bueno' : 'Excelente'}
          </p>
        </div>
        {/* Comment */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>
            Comentario <span className="text-gray-300 font-normal">(opcional)</span>
          </label>
          <textarea
            value={draftComment}
            onChange={e => onCommentChange(e.target.value)}
            placeholder="Cuéntanos tu experiencia…"
            rows={3}
            className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none placeholder-gray-300 transition-colors"
            style={{ fontWeight: 400 }}
            onFocus={e => e.target.style.borderColor = '#4f46e5'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 600 }}>
            Cancelar
          </button>
          <button onClick={onSubmit} disabled={draftStars === 0}
            className="flex-1 py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#f4845f', fontWeight: 700 }}>
            Enviar calificación
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface MyReservationsPageProps {
  onLogout: () => void
  onViewEvent?: () => void
  onNavigate?: (key: NavKey) => void
  activeNav?: NavKey
}

const PAGE_SIZE = 5

export default function MyReservationsPage({ onLogout, onViewEvent, onNavigate, activeNav = 'reservas' }: MyReservationsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | ''>('')
  const [filterDate, setFilterDate] = useState('')
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [page, setPage] = useState(1)
  const [ratingTarget, setRatingTarget] = useState<Reservation | null>(null)
  const [ratings, setRatings] = useState<Record<string, { stars: number; comment: string; submitted: boolean }>>({})
  const [hoverStar, setHoverStar] = useState(0)
  const [draftStars, setDraftStars] = useState(0)
  const [draftComment, setDraftComment] = useState('')

  const filtered = RESERVATIONS.filter((r) => {
    const q = search.toLowerCase()
    const matchQ = !q || r.eventName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
    const matchStatus = !filterStatus || r.status === filterStatus
    return matchQ && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || filterStatus || filterDate

  const counts = {
    total: RESERVATIONS.length,
    confirmadas: RESERVATIONS.filter((r) => r.status === 'Confirmada').length,
    canceladas: RESERVATIONS.filter((r) => r.status === 'Cancelada').length,
  }

  const resetFilters = () => { setSearch(''); setFilterStatus(''); setFilterDate(''); setPage(1) }

  const openRating = (res: Reservation) => {
    setDraftStars(ratings[res.id]?.stars ?? 0)
    setDraftComment(ratings[res.id]?.comment ?? '')
    setHoverStar(0)
    setRatingTarget(res)
  }

  const submitRating = () => {
    if (!ratingTarget || draftStars === 0) return
    setRatings(prev => ({ ...prev, [ratingTarget.id]: { stars: draftStars, comment: draftComment, submitted: true } }))
    setRatingTarget(null)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col h-full shrink-0" style={{ width: 220 }}>
        <Sidebar activeNav={activeNav} onNav={(k) => onNavigate?.(k)} onLogout={onLogout} />
      </div>

      {/* Sidebar mobile */}
      <div className="fixed left-0 top-0 h-full z-40 md:hidden flex flex-col transition-transform duration-200"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', width: 220 }}>
        <Sidebar activeNav={activeNav} onNav={(k) => { onNavigate?.(k); setSidebarOpen(false) }} onLogout={onLogout} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}><IconMenu /></button>
            <div>
              <h1 className="text-lg text-gray-900 leading-tight" style={{ fontWeight: 700 }}>Mis reservas</h1>
              <p className="text-xs text-gray-400 leading-none">Consulta el estado de todas tus reservas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              <IconBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#f4845f' }} />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>LG</div>
          </div>
        </header>

        {/* Scrollable */}
        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total de reservas" value={counts.total} sub="Historial completo"
              bg="#eef2ff" color="#4f46e5"
              icon={<IconTicket size={20} />}
            />
            <StatCard
              label="Confirmadas" value={counts.confirmadas} sub="Reservas aprobadas"
              bg="#f0fdf4" color="#16a34a"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
            />
            <StatCard
              label="Canceladas" value={counts.canceladas} sub="No se realizará cobro"
              bg="#fef2f2" color="#dc2626"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg>}
            />
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2.5 flex-1 min-w-48 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-400 focus-within:bg-white transition-all">
              <span className="text-gray-400 shrink-0"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar por evento, ciudad o código…"
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
                style={{ fontWeight: 400 }}
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <IconX />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-300 transition-colors">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as ReservationStatus | ''); setPage(1) }}
                className="text-sm text-gray-700 outline-none bg-transparent appearance-none pr-5 cursor-pointer"
                style={{ fontWeight: 500 }}>
                <option value="">Todos los estados</option>
                <option value="Reservada">Reservada</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-300 transition-colors">
              <span className="text-gray-400 shrink-0"><IconCalendar /></span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => { setFilterDate(e.target.value); setPage(1) }}
                className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
                style={{ fontWeight: 500 }}
              />
            </div>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                style={{ fontWeight: 500 }}>
                <IconX />
                Limpiar
              </button>
            )}

            <div className="ml-auto text-xs text-gray-400" style={{ fontWeight: 500 }}>
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </div>
          </div>

          {/* Content */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {hasFilters ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f3f4f6' }}>
                    <span className="text-gray-400"><IconSearch /></span>
                  </div>
                  <p className="text-gray-700 mb-1" style={{ fontWeight: 600 }}>Sin resultados</p>
                  <p className="text-sm text-gray-400 mb-4">Ninguna reserva coincide con los filtros aplicados.</p>
                  <button onClick={resetFilters} className="text-sm text-white px-5 py-2.5 rounded-xl" style={{ background: '#4f46e5', fontWeight: 600 }}>
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <EmptyState onExplore={() => onNavigate?.('explorar')} />
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ background: '#fafafa' }}>
                        {['Evento', 'Fecha', 'Ciudad', 'Entradas', 'Reservado el', 'Total', 'Estado', 'Acción'].map((h, i) => (
                          <th key={h}
                            className={`py-3.5 px-4 text-left text-xs text-gray-400 ${i === 3 ? 'text-center hidden lg:table-cell' : i === 4 ? 'hidden xl:table-cell' : i === 2 ? 'hidden md:table-cell' : ''}`}
                            style={{ fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((r) => (
                        <ReservationRow key={r.id} res={r} onView={setSelectedRes} onRate={openRating} ratingInfo={ratings[r.id] ? { stars: ratings[r.id].stars, submitted: ratings[r.id].submitted } : undefined} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <IconChevronLeft />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
                          style={{
                            background: p === page ? '#4f46e5' : 'transparent',
                            color: p === page ? 'white' : '#6b7280',
                            fontWeight: p === page ? 700 : 400,
                            border: p === page ? 'none' : '1px solid #e5e7eb',
                          }}>
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <IconChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {paginated.map((r) => (
                  <ReservationCard key={r.id} res={r} onView={setSelectedRes} onRate={openRating} ratingInfo={ratings[r.id] ? { stars: ratings[r.id].stars, submitted: ratings[r.id].submitted } : undefined} />
                ))}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40">
                      <IconChevronLeft />
                    </button>
                    <span className="text-sm text-gray-600" style={{ fontWeight: 600 }}>{page} / {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40">
                      <IconChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="h-2" />
        </main>
      </div>

      {/* Detail drawer */}
      {selectedRes && (
        <DetailDrawer
          reservation={selectedRes}
          onClose={() => setSelectedRes(null)}
          onViewEvent={() => { setSelectedRes(null); onViewEvent?.() }}
          onRate={openRating}
          ratingInfo={ratings[selectedRes.id]}
        />
      )}

      {ratingTarget && (
        <RatingModal
          reservation={ratingTarget}
          draftStars={draftStars}
          draftComment={draftComment}
          hoverStar={hoverStar}
          onHover={setHoverStar}
          onSelect={setDraftStars}
          onCommentChange={setDraftComment}
          onSubmit={submitRating}
          onClose={() => setRatingTarget(null)}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
