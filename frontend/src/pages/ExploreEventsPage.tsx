import { useState } from 'react'

type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'
type EventStatus = 'Programado' | 'En Boletería' | 'En Vivo' | 'Finalizado' | 'Cancelado'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}
function IconHome() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> }
function IconCompass() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg> }
function IconClipboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg> }
function IconUser() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function IconLogOut() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg> }
function IconBell() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg> }
function IconMenu() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg> }
function IconSearch() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> }
function IconX() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg> }
function IconMapPin() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> }
function IconCalendar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> }
function IconClock() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
function IconUsers() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> }
function IconArrowRight() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg> }
function IconChevronDown() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg> }
function IconStar() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> }
function IconSlidersH() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg> }

// ─── Data ─────────────────────────────────────────────────────────────────────

interface EventItem {
  id: number
  name: string
  description: string
  country: string
  department: string
  city: string
  date: string
  time: string
  price: string
  priceNum: number
  spotsTotal: number
  spotsSold: number
  status: EventStatus
  category: string
  image: string
  rating: number
}

const ALL_EVENTS: EventItem[] = [
  {
    id: 1,
    name: 'Festival de Música Urbana',
    description: 'Tres escenarios simultáneos, más de 20 artistas de reggaetón, trap, hip-hop y R&B en el Estadio Atanasio Girardot.',
    country: 'Colombia', department: 'Antioquia', city: 'Medellín',
    date: '12 Sep 2025', time: '6:00 PM', price: '$ 95.000', priceNum: 95000,
    spotsTotal: 320, spotsSold: 218, status: 'En Boletería', category: 'Festival',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=360&fit=crop&auto=format',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Noche de Comedia Stand-Up',
    description: 'Una noche de risas con los mejores comediantes colombianos en el teatro más íntimo de Bogotá.',
    country: 'Colombia', department: 'Bogotá D.C.', city: 'Bogotá',
    date: '20 Sep 2025', time: '8:30 PM', price: '$ 70.000', priceNum: 70000,
    spotsTotal: 180, spotsSold: 95, status: 'Programado', category: 'Comedia',
    image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?w=600&h=360&fit=crop&auto=format',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Teatro bajo las Estrellas',
    description: 'Una obra de teatro contemporáneo al aire libre con las estrellas como telón de fondo en el histórico centro de Cali.',
    country: 'Colombia', department: 'Valle del Cauca', city: 'Cali',
    date: '5 Oct 2025', time: '7:00 PM', price: '$ 55.000', priceNum: 55000,
    spotsTotal: 250, spotsSold: 80, status: 'Programado', category: 'Teatro',
    image: 'https://images.unsplash.com/photo-1576724196706-3f23f51ea351?w=600&h=360&fit=crop&auto=format',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Concierto Sinfónico — Beethoven',
    description: 'La Filarmónica de Bogotá interpreta las sinfonías más icónicas de Beethoven en una velada de música clásica.',
    country: 'Colombia', department: 'Bogotá D.C.', city: 'Bogotá',
    date: '18 Oct 2025', time: '5:00 PM', price: '$ 120.000', priceNum: 120000,
    spotsTotal: 400, spotsSold: 310, status: 'En Boletería', category: 'Clásica',
    image: 'https://images.unsplash.com/photo-1519682718457-c82ce8296645?w=600&h=360&fit=crop&auto=format',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Rock en el Parque 2025',
    description: 'El festival de rock más grande de Latinoamérica regresa a Bogotá con bandas nacionales e internacionales. Entrada libre.',
    country: 'Colombia', department: 'Bogotá D.C.', city: 'Bogotá',
    date: '1 Nov 2025', time: '12:00 PM', price: 'Gratis', priceNum: 0,
    spotsTotal: 5000, spotsSold: 1200, status: 'Programado', category: 'Festival',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=360&fit=crop&auto=format',
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Noche de Jazz y Blues',
    description: 'Una velada íntima con los mejores músicos de jazz y blues de Colombia en el emblemático Bar El Mono de Chapinero.',
    country: 'Colombia', department: 'Bogotá D.C.', city: 'Bogotá',
    date: '8 Nov 2025', time: '8:00 PM', price: '$ 45.000', priceNum: 45000,
    spotsTotal: 80, spotsSold: 60, status: 'En Boletería', category: 'Jazz',
    image: 'https://images.unsplash.com/photo-1707944494732-e706d511456d?w=600&h=360&fit=crop&auto=format',
    rating: 4.4,
  },
  {
    id: 7,
    name: 'Feria de las Flores — Tarde Cultural',
    description: 'Celebra la cultura antioqueña con música, gastronomía y el desfile de flores más famoso de Colombia.',
    country: 'Colombia', department: 'Antioquia', city: 'Medellín',
    date: '15 Nov 2025', time: '3:00 PM', price: '$ 40.000', priceNum: 40000,
    spotsTotal: 600, spotsSold: 390, status: 'En Vivo', category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1582711012124-a56cf82307a0?w=600&h=360&fit=crop&auto=format',
    rating: 4.3,
  },
  {
    id: 8,
    name: 'Noche de Salsa Caleña',
    description: 'Vive la pasión de la salsa con los mejores bailarines y orquestas del Pacífico colombiano en una noche llena de ritmo.',
    country: 'Colombia', department: 'Valle del Cauca', city: 'Cali',
    date: '22 Nov 2025', time: '9:00 PM', price: '$ 60.000', priceNum: 60000,
    spotsTotal: 200, spotsSold: 55, status: 'Programado', category: 'Baile',
    image: 'https://images.unsplash.com/photo-1718119617938-2a3b376fb7d6?w=600&h=360&fit=crop&auto=format',
    rating: 4.8,
  },
]

const STATUS_CFG: Record<EventStatus, { bg: string; text: string; border: string; dot: string }> = {
  'Programado':   { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe', dot: '#6366f1' },
  'En Boletería': { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', dot: '#f97316' },
  'En Vivo':      { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444' },
  'Finalizado':   { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
  'Cancelado':    { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff', dot: '#a855f7' },
}

const CATEGORIES = ['Todos', 'Festival', 'Concierto', 'Teatro', 'Comedia', 'Clásica', 'Jazz', 'Cultural', 'Baile']
const STATUSES: EventStatus[] = ['Programado', 'En Boletería', 'En Vivo']

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

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EventStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ background: c.bg, color: c.text, borderColor: c.border, fontWeight: 600 }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot, ...(status === 'En Vivo' ? { animation: 'pulse 1.5s infinite' } : {}) }} />
      {status}
    </span>
  )
}

// ─── Capacity bar ─────────────────────────────────────────────────────────────

function CapacityBar({ total, sold }: { total: number; sold: number }) {
  const pct = Math.round((sold / total) * 100)
  const available = total - sold
  const low = available < total * 0.2
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-400" style={{ fontWeight: 500 }}>Cupos disponibles</span>
        <span style={{ color: low ? '#dc2626' : '#374151', fontWeight: 600 }}>
          {available.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? '#ef4444' : '#4f46e5' }} />
      </div>
      {low && <p className="text-xs mt-1" style={{ color: '#dc2626', fontWeight: 500 }}>⚠ Últimos cupos</p>}
    </div>
  )
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, onViewDetail }: { event: EventItem; onViewDetail: () => void }) {
  const bookable = event.status === 'Programado' || event.status === 'En Boletería'
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative h-44 bg-indigo-100 overflow-hidden shrink-0">
        <img src={event.image} alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs bg-white/90 backdrop-blur-sm text-indigo-700 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={event.status} />
        </div>
        {event.status === 'Finalizado' && event.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            <span style={{ color: '#fbbf24' }}><IconStar /></span>
            {event.rating}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-sm text-gray-900 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1" style={{ fontWeight: 700 }}>
            {event.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{event.description}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span style={{ color: '#6366f1' }}><IconMapPin /></span>
            <span>{event.city}, {event.department}, {event.country}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
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

        {/* Capacity */}
        <CapacityBar total={event.spotsTotal} sold={event.spotsSold} />

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Desde</span>
            <span className="text-sm text-gray-900" style={{ fontWeight: 800 }}>{event.price}</span>
          </div>
          <button
            onClick={onViewDetail}
            disabled={!bookable}
            className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl transition-all"
            style={{
              background: bookable ? '#f4845f' : '#f3f4f6',
              color: bookable ? 'white' : '#9ca3af',
              fontWeight: 600,
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

// ─── Select filter ────────────────────────────────────────────────────────────

function SelectFilter({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-300 transition-colors">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 outline-none bg-transparent appearance-none pr-5 cursor-pointer"
        style={{ fontWeight: 500, minWidth: 90 }}>
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ExploreEventsPageProps {
  onLogout: () => void
  onNavigate?: (key: NavKey) => void
  activeNav?: NavKey
  onViewEvent?: () => void
}

export default function ExploreEventsPage({ onLogout, onNavigate, activeNav = 'explorar', onViewEvent }: ExploreEventsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifsRead, setNotifsRead] = useState(false)
  const [search, setSearch] = useState('')
  const [filterPais, setFilterPais] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterCiudad, setFilterCiudad] = useState('')
  const [filterFecha, setFilterFecha] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCat, setFilterCat] = useState('Todos')

  const cities = filterDept === 'Antioquia' ? ['Medellín'] : filterDept === 'Bogotá D.C.' ? ['Bogotá'] : filterDept === 'Valle del Cauca' ? ['Cali'] : ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena']

  const filtered = ALL_EVENTS.filter((e) => {
    const q = search.toLowerCase()
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    const matchPais = !filterPais || e.country === filterPais
    const matchDept = !filterDept || e.department === filterDept
    const matchCiudad = !filterCiudad || e.city === filterCiudad
    const matchStatus = !filterStatus || e.status === filterStatus
    const matchCat = filterCat === 'Todos' || e.category === filterCat
    const bookable = e.status !== 'Finalizado' && e.status !== 'Cancelado'
    return matchQ && matchPais && matchDept && matchCiudad && matchStatus && matchCat && bookable
  })

  const hasFilters = search || filterPais || filterDept || filterCiudad || filterFecha || filterStatus || filterCat !== 'Todos'

  const resetFilters = () => {
    setSearch(''); setFilterPais(''); setFilterDept(''); setFilterCiudad(''); setFilterFecha(''); setFilterStatus(''); setFilterCat('Todos')
  }

  const NOTIFS = [
    { icon: '✅', text: 'Tu reserva para Festival de Música Urbana fue confirmada.', time: 'Hace 2 horas' },
    { icon: '⏳', text: 'Tu reserva para Noche de Comedia Stand-Up está pendiente.', time: 'Hace 5 horas' },
    { icon: '📢', text: 'Un evento que reservaste tiene una actualización.', time: 'Ayer' },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>

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
              <h1 className="text-lg text-gray-900 leading-tight" style={{ fontWeight: 700 }}>Explorar eventos</h1>
              <p className="text-xs text-gray-400 leading-none">Encuentra eventos disponibles y reserva tu próxima experiencia.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen((o) => !o)}
                className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                <IconBell />
                {!notifsRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#f4845f' }} />}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ width: 320 }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Notificaciones</p>
                      <button onClick={() => { setNotifsRead(true); setNotifOpen(false) }}
                        className="text-xs hover:underline" style={{ color: '#4f46e5', fontWeight: 600 }}>
                        Marcar todas como leídas
                      </button>
                    </div>
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                        style={{ background: notifsRead ? 'white' : '#fafafe' }}>
                        <span className="text-base shrink-0 mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug" style={{ fontWeight: notifsRead ? 400 : 500 }}>{n.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {!notifsRead && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#4f46e5' }} />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>LG</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {/* Search + filters panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:bg-white transition-all">
              <span className="text-gray-400 shrink-0"><IconSearch /></span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, ciudad, categoría o descripción…"
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
                style={{ fontWeight: 400 }} />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 transition-colors"><IconX /></button>
              )}
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-2">
              <SelectFilter label="País" options={['Colombia', 'México', 'Argentina']} value={filterPais} onChange={(v) => { setFilterPais(v); setFilterDept(''); setFilterCiudad('') }} />
              <SelectFilter label="Departamento" options={['Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Atlántico', 'Bolívar']} value={filterDept} onChange={(v) => { setFilterDept(v); setFilterCiudad('') }} />
              <SelectFilter label="Ciudad" options={cities} value={filterCiudad} onChange={setFilterCiudad} />
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-300 transition-colors">
                <span className="text-gray-400 shrink-0"><IconCalendar /></span>
                <input type="date" value={filterFecha} onChange={(e) => setFilterFecha(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer" style={{ fontWeight: 500 }} />
              </div>
              <SelectFilter label="Estado" options={STATUSES} value={filterStatus} onChange={setFilterStatus} />
              {hasFilters && (
                <button onClick={resetFilters}
                  className="flex items-center gap-1.5 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                  style={{ fontWeight: 500 }}>
                  <IconX />
                  Limpiar
                </button>
              )}
              <div className="ml-auto text-xs text-gray-400" style={{ fontWeight: 500 }}>
                {filtered.length} {filtered.length === 1 ? 'evento' : 'eventos'}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className="text-xs px-3.5 py-1.5 rounded-full border transition-all"
                  style={{
                    background: filterCat === cat ? '#4f46e5' : 'white',
                    color: filterCat === cat ? 'white' : '#6b7280',
                    borderColor: filterCat === cat ? '#4f46e5' : '#e5e7eb',
                    fontWeight: filterCat === cat ? 600 : 500,
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                {hasFilters ? 'Resultados de búsqueda' : 'Todos los eventos disponibles'}
              </h2>
              {hasFilters && (
                <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                  Filtros activos
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <IconSlidersH />
              <span style={{ fontWeight: 500 }}>{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} onViewDetail={() => onViewEvent?.()} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#eef2ff' }}>
                <span style={{ color: '#6366f1' }}><IconCompass /></span>
              </div>
              <p className="text-gray-700 mb-1" style={{ fontWeight: 600 }}>No se encontraron eventos</p>
              <p className="text-sm text-gray-400 mb-5">Intenta ajustar los filtros o el término de búsqueda.</p>
              <button onClick={resetFilters}
                className="text-sm text-white px-6 py-2.5 rounded-xl"
                style={{ background: '#4f46e5', fontWeight: 600 }}>
                Limpiar filtros
              </button>
            </div>
          )}

          <div className="h-4" />
        </main>
      </div>
    </div>
  )
}
