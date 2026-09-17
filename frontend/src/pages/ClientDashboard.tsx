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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
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

function IconX() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function IconFilter() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type EventStatus = 'Programado' | 'En Boletería' | 'En Vivo' | 'Finalizado' | 'Cancelado'

interface EventItem {
  id: number
  name: string
  city: string
  department: string
  country: string
  date: string
  time: string
  price: string
  status: EventStatus
  category: string
  image: string
  rating: number
}

const events: EventItem[] = [
  {
    id: 1,
    name: 'Festival de Música Urbana',
    city: 'Medellín', department: 'Antioquia', country: 'Colombia',
    date: '12 Sep 2025', time: '6:00 PM',
    price: '$ 95.000', status: 'En Boletería', category: 'Festival',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=380&fit=crop&auto=format',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Noche de Comedia Stand-Up',
    city: 'Bogotá', department: 'Bogotá D.C.', country: 'Colombia',
    date: '20 Sep 2025', time: '8:30 PM',
    price: '$ 70.000', status: 'Programado', category: 'Comedia',
    image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=600&h=380&fit=crop&auto=format',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Teatro bajo las Estrellas',
    city: 'Cali', department: 'Valle del Cauca', country: 'Colombia',
    date: '5 Oct 2025', time: '7:00 PM',
    price: '$ 55.000', status: 'Programado', category: 'Teatro',
    image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=380&fit=crop&auto=format',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Concierto Sinfónico — Beethoven',
    city: 'Bogotá', department: 'Bogotá D.C.', country: 'Colombia',
    date: '18 Oct 2025', time: '5:00 PM',
    price: '$ 120.000', status: 'En Boletería', category: 'Clásica',
    image: 'https://images.unsplash.com/photo-1519682718457-c82ce8296645?w=600&h=380&fit=crop&auto=format',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Rock en el Parque 2025',
    city: 'Bogotá', department: 'Bogotá D.C.', country: 'Colombia',
    date: '1 Nov 2025', time: '12:00 PM',
    price: 'Gratis', status: 'Programado', category: 'Festival',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=380&fit=crop&auto=format',
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Feria de las Flores — Tarde Cultural',
    city: 'Medellín', department: 'Antioquia', country: 'Colombia',
    date: '8 Nov 2025', time: '3:00 PM',
    price: '$ 40.000', status: 'En Vivo', category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1582711012124-a56cf82307a0?w=600&h=380&fit=crop&auto=format',
    rating: 4.3,
  },
]

const statusConfig: Record<EventStatus, { label: string; bg: string; text: string; dot: string }> = {
  'Programado':   { label: 'Programado',   bg: '#eef2ff', text: '#4338ca', dot: '#6366f1' },
  'En Boletería': { label: 'En Boletería', bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  'En Vivo':      { label: 'En Vivo',      bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  'Finalizado':   { label: 'Finalizado',   bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
  'Cancelado':    { label: 'Cancelado',    bg: '#fdf2f8', text: '#9d174d', dot: '#ec4899' },
}

type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio',   label: 'Inicio',           icon: <IconHome /> },
  { key: 'explorar', label: 'Explorar eventos',  icon: <IconCompass /> },
  { key: 'reservas', label: 'Mis reservas',      icon: <IconClipboard /> },
  { key: 'perfil',   label: 'Mi perfil',         icon: <IconUser /> },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EventStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.text, fontWeight: 600 }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cfg.dot, ...(status === 'En Vivo' ? { animation: 'pulse 1.5s infinite' } : {}) }}
      />
      {cfg.label}
    </span>
  )
}

function EventCard({ event, onReserve }: { event: EventItem; onReserve: (e: EventItem) => void }) {
  const bookable = event.status === 'Programado' || event.status === 'En Boletería'
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-40 bg-indigo-100 overflow-hidden shrink-0">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <span className="text-xs font-600 bg-white/90 backdrop-blur-sm text-indigo-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
            {event.category}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={event.status} />
        </div>
        {/* Rating — solo eventos finalizados con calificaciones */}
        {event.status === 'Finalizado' && event.rating > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            <span style={{ color: '#fbbf24' }}><IconStar /></span>
            {event.rating}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors" style={{ fontWeight: 700 }}>
          {event.name}
        </h3>

        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span style={{ color: '#6366f1' }}><IconMapPin /></span>
            {event.city}, {event.department}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#6366f1' }}><IconCalendar /></span>
              {event.date}
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#6366f1' }}><IconClock /></span>
              {event.time}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Desde</span>
            <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{event.price}</span>
          </div>
          <button
            onClick={() => bookable && onReserve(event)}
            disabled={!bookable}
            className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
            style={{
              fontWeight: 600,
              background: bookable ? '#f4845f' : '#f3f4f6',
              color: bookable ? 'white' : '#9ca3af',
              cursor: bookable ? 'pointer' : 'not-allowed',
            }}
          >
            Ver detalles
            {bookable && <IconArrowRight />}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string; value: string | number; sub?: string; accent?: string; icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent ? `${accent}18` : '#eef2ff', color: accent || '#4f46e5' }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-2xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  )
}

function SelectFilter({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-indigo-300 transition-colors">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 outline-none bg-transparent appearance-none pr-5 cursor-pointer"
        style={{ fontWeight: 500, minWidth: 90 }}
      >
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <IconChevronDown />
      </span>
    </div>
  )
}

// ─── Reservation Modal ────────────────────────────────────────────────────────

function ReserveModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const [qty, setQty] = useState(1)
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  const priceNum = event.price === 'Gratis' ? 0 : parseInt(event.price.replace(/\D/g, ''), 10)
  const total = priceNum * qty

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => { setConfirming(false); setDone(true) }, 1400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,15,30,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-36 bg-indigo-100">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <IconX />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className="text-xs font-600 text-white/80">{event.category}</span>
            <p className="text-base font-700 text-white leading-tight" style={{ fontWeight: 700 }}>{event.name}</p>
          </div>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-900 mb-1" style={{ fontWeight: 700 }}>¡Reserva confirmada!</p>
              <p className="text-sm text-gray-500">Recibirás tus entradas en tu correo registrado.</p>
            </div>
            <button
              onClick={onClose}
              className="text-sm text-white px-8 py-3 rounded-xl"
              style={{ background: '#4f46e5', fontWeight: 600 }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span style={{ color: '#6366f1' }}><IconMapPin /></span>
                {event.city}, {event.department}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6366f1' }}><IconCalendar /></span>
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#6366f1' }}><IconClock /></span>
                  {event.time}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Cantidad de entradas</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg text-gray-900" style={{ fontWeight: 700 }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Total a pagar</span>
              <span className="text-xl text-gray-900" style={{ fontWeight: 800 }}>
                {priceNum === 0 ? 'Gratis' : `$ ${total.toLocaleString('es-CO')}`}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: '#f4845f', fontWeight: 700 }}
            >
              {confirming ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Confirmando…
                </>
              ) : 'Confirmar reserva'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeNav,
  onNav,
  onLogout,
  collapsed,
}: {
  activeNav: NavKey
  onNav: (k: NavKey) => void
  onLogout: () => void
  collapsed?: boolean
}) {
  return (
    <aside
      className="flex flex-col h-full bg-white border-r border-gray-100"
      style={{ width: collapsed ? 64 : 220, transition: 'width 0.2s', flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 shrink-0 border-b border-gray-100" style={{ height: 64 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4f46e5' }}>
          <span className="text-white"><IconTicket size={18} /></span>
        </div>
        {!collapsed && (
          <span className="text-base tracking-tight text-gray-900 whitespace-nowrap" style={{ fontWeight: 800 }}>
            Event<span style={{ color: '#4f46e5' }}>Nova</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs text-gray-400 px-2 mb-2 uppercase tracking-widest" style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            Menú
          </p>
        )}
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
              title={collapsed ? label : undefined}
            >
              <span className="shrink-0" style={{ color: active ? '#4f46e5' : '#9ca3af' }}>{icon}</span>
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#4f46e5' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontWeight: 700 }}
          >
            LG
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Laura García</p>
              <p className="text-xs text-gray-400 truncate">Cliente</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-2 py-2 mt-1 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <span className="shrink-0"><IconLogOut /></span>
          {!collapsed && <span style={{ fontWeight: 500 }}>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

interface ClientDashboardProps {
  onLogout: () => void
  onViewEvent?: () => void
  onNavigate?: (key: NavKey) => void
  activeNav?: NavKey
}

export default function ClientDashboard({ onLogout, onViewEvent, onNavigate, activeNav = 'inicio' }: ClientDashboardProps) {
  const [search, setSearch] = useState('')
  const [filterPais, setFilterPais] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterCiudad, setFilterCiudad] = useState('')
  const [filterFecha, setFilterFecha] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [reserveEvent, setReserveEvent] = useState<EventItem | null>(null)
  const handleViewDetails = (event: EventItem) => { if (onViewEvent) { onViewEvent() } else { setReserveEvent(event) } }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifsRead, setNotifsRead] = useState(false)

  const filtered = events.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    const matchPais = !filterPais || e.country === filterPais
    const matchDept = !filterDept || e.department === filterDept
    const matchCiudad = !filterCiudad || e.city === filterCiudad
    const matchEstado = !filterEstado || e.status === filterEstado
    const notEnded = e.status !== 'Finalizado' && e.status !== 'Cancelado'
    return matchSearch && matchPais && matchDept && matchCiudad && matchEstado && notEnded
  })

  const resetFilters = () => {
    setSearch(''); setFilterPais(''); setFilterDept(''); setFilterCiudad(''); setFilterFecha(''); setFilterEstado('')
  }

  const hasFilters = search || filterPais || filterDept || filterCiudad || filterFecha || filterEstado

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile as drawer */}
      <div
        className="hidden md:flex flex-col h-full shrink-0"
        style={{ width: 220 }}
      >
        <Sidebar activeNav={activeNav} onNav={(k) => onNavigate?.(k)} onLogout={onLogout} />
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className="fixed left-0 top-0 h-full z-40 md:hidden flex flex-col transition-transform duration-200"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', width: 220 }}
      >
        <Sidebar activeNav={activeNav} onNav={(k) => { onNavigate?.(k); setSidebarOpen(false) }} onLogout={onLogout} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu />
            </button>
            <div>
              <h1 className="text-lg text-gray-900 leading-tight" style={{ fontWeight: 700 }}>
                Hola, Laura 👋
              </h1>
              <p className="text-xs text-gray-500 leading-none">Encuentra tu próximo evento.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell + notification panel */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                <IconBell />
                {!notifsRead && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#f4845f' }} />
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div
                    className="absolute right-0 top-11 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    style={{ width: 320 }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Notificaciones</p>
                      <button
                        onClick={() => { setNotifsRead(true); setNotifOpen(false) }}
                        className="text-xs hover:underline"
                        style={{ color: '#4f46e5', fontWeight: 600 }}
                      >
                        Marcar todas como leídas
                      </button>
                    </div>
                    {[
                      { icon: '✅', text: 'Tu reserva para Festival de Música Urbana fue confirmada.', time: 'Hace 2 horas', read: notifsRead },
                      { icon: '⏳', text: 'Tu reserva para Noche de Comedia Stand-Up está pendiente.', time: 'Hace 5 horas', read: notifsRead },
                      { icon: '📢', text: 'Un evento que reservaste tiene una actualización.', time: 'Ayer', read: notifsRead },
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                        style={{ background: n.read ? 'white' : '#fafafe' }}
                      >
                        <span className="text-base shrink-0 mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug" style={{ fontWeight: n.read ? 400 : 500 }}>{n.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#4f46e5' }} />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontWeight: 700 }}
            >
              LG
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Reservas activas"
              value={3}
              sub="Pagadas y confirmadas"
              icon={<IconClipboard />}
            />
            <StatCard
              label="Reservas confirmadas"
              value={7}
              sub="Histórico total"
              accent="#10b981"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
            <StatCard
              label="Próximo evento"
              value="12 Sep"
              sub="Festival de Música Urbana · 6:00 PM"
              accent="#f4845f"
              icon={<IconCalendar />}
            />
          </div>

          {/* Search + filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            {/* Search bar */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:bg-white transition-all">
              <span className="text-gray-400 shrink-0"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar eventos por nombre, ciudad o categoría…"
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
                style={{ fontWeight: 400 }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <IconX />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-2">
              <SelectFilter
                label="País"
                options={['Colombia', 'México', 'Argentina']}
                value={filterPais}
                onChange={setFilterPais}
              />
              <SelectFilter
                label="Departamento"
                options={['Antioquia', 'Bogotá D.C.', 'Valle del Cauca']}
                value={filterDept}
                onChange={setFilterDept}
              />
              <SelectFilter
                label="Ciudad"
                options={['Bogotá', 'Medellín', 'Cali', 'Barranquilla']}
                value={filterCiudad}
                onChange={setFilterCiudad}
              />
              <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-indigo-300 transition-colors">
                <span className="text-gray-400 shrink-0"><IconCalendar /></span>
                <input
                  type="date"
                  value={filterFecha}
                  onChange={(e) => setFilterFecha(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
                  style={{ fontWeight: 500, minWidth: 110 }}
                />
              </div>
              <SelectFilter
                label="Estado"
                options={['Programado', 'En Boletería', 'En Vivo']}
                value={filterEstado}
                onChange={setFilterEstado}
              />
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-xl border-2 transition-all hover:bg-indigo-50"
                style={{ color: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600 }}
              >
                <IconFilter />
                {hasFilters ? 'Limpiar' : 'Filtrar'}
              </button>
            </div>
          </div>

          {/* Events grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>
                  Eventos disponibles
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} encontrados
                </p>
              </div>
              {hasFilters && (
                <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                  Filtros activos
                </span>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((event) => (
                  <EventCard key={event.id} event={event} onReserve={handleViewDetails} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#eef2ff' }}>
                  <span style={{ color: '#6366f1' }}><IconCompass /></span>
                </div>
                <p className="text-gray-700 mb-1" style={{ fontWeight: 600 }}>No se encontraron eventos</p>
                <p className="text-sm text-gray-400 mb-4">Intenta ajustar los filtros o el término de búsqueda.</p>
                <button
                  onClick={resetFilters}
                  className="text-sm text-white px-5 py-2.5 rounded-xl"
                  style={{ background: '#4f46e5', fontWeight: 600 }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="h-2" />
        </main>
      </div>

      {/* Reserve modal */}
      {reserveEvent && (
        <ReserveModal event={reserveEvent} onClose={() => setReserveEvent(null)} />
      )}
    </div>
  )
}
