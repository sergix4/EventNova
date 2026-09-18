import { useState, useMemo } from 'react'
import { SHARED_EVENTS } from '../sharedData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AdminNavKey) => void
  activeNav: AdminNavKey
}

type EventStatus = 'Programado' | 'En boletería' | 'En vivo' | 'Finalizado' | 'Cancelado'

interface EventRow {
  nombre: string
  descripcion: string
  pais: string
  departamento: string
  ciudad: string
  direccion: string
  fecha: string
  hora: string
  agente: string
  capacidad: number
  reservas: number
  precio: string
  estado: EventStatus
  causaCancelacion?: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ITicket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2M13 17v2M13 11v2" />
  </svg>
)
const ILogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)
const IRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)
const IChev = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const IGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const IMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" />
  </svg>
)
const IMapPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const ICalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)
const IEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
const IChevLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const IChevRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard',            label: 'Dashboard',          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'reportes-generales',   label: 'Reportes generales',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
  { key: 'reportes-comerciales', label: 'Reportes comerciales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { key: 'cobertura',            label: 'Cobertura y eventos',  icon: <IGlobe /> },
  { key: 'reservas-operacion',   label: 'Reservas y operación', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg> },
  { key: 'perfil',               label: 'Perfil',               icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg> },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeNav, onNavigate, onLogout }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
            <span className="text-white"><ITicket /></span>
          </div>
          <span className="text-xl tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
            Event<span style={{ color: '#4f46e5' }}>Nova</span>
          </span>
        </div>
        <div className="mt-2.5 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
          Panel Administrador
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = activeNav === item.key
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${active ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              style={active ? { background: '#4f46e5', fontWeight: 600 } : { fontWeight: 500 }}>
              <span className={active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #92400e, #d97706)', fontWeight: 700 }}>AE</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Administrador EventNova</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" style={{ fontWeight: 500 }}>
          <ILogOut />Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

// ─── Geography data ────────────────────────────────────────────────────────────

const GEO: Record<string, Record<string, string[]>> = {
  'Colombia': {
    'Antioquia':       ['Medellín', 'Bello', 'Envigado'],
    'Cundinamarca':    ['Bogotá', 'Soacha', 'Chía'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira'],
    'Atlántico':       ['Barranquilla', 'Soledad'],
    'Santander':       ['Bucaramanga', 'Floridablanca'],
    'Bolívar':         ['Cartagena', 'Magangué'],
    'Risaralda':       ['Pereira', 'Dosquebradas'],
  },
  'Ecuador': {
    'Pichincha': ['Quito', 'Cayambe'],
    'Guayas':    ['Guayaquil', 'Samborondón'],
  },
  'Perú': {
    'Lima':  ['Lima', 'Miraflores'],
    'Cusco': ['Cusco', 'Urubamba'],
  },
  'Panamá': {
    'Panamá':  ['Ciudad de Panamá', 'San Miguelito'],
    'Colón':   ['Colón'],
  },
}

// ─── Events data ──────────────────────────────────────────────────────────────

const ALL_EVENTS: EventRow[] = SHARED_EVENTS.map(e => ({
  nombre: e.nombre,
  descripcion: e.descripcion,
  pais: e.pais,
  departamento: e.departamento,
  ciudad: e.ciudad,
  direccion: e.direccion,
  fecha: e.fecha,
  hora: e.hora,
  agente: e.agente,
  capacidad: e.capacidad,
  reservas: e.reservas,
  precio: e.precioStr,
  estado: e.estado as EventStatus,
  ...(e.causaCancelacion ? { causaCancelacion: e.causaCancelacion } : {}),
}))

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<EventStatus, { bg: string; color: string }> = {
  'Programado':   { bg: '#eef2ff', color: '#4f46e5' },
  'En boletería': { bg: '#fffbeb', color: '#d97706' },
  'En vivo':      { bg: '#ecfdf5', color: '#059669' },
  'Finalizado':   { bg: '#f3f4f6', color: '#6b7280' },
  'Cancelado':    { bg: '#fef2f2', color: '#dc2626' },
}

function StatusBadge({ estado }: { estado: EventStatus }) {
  const s = STATUS_MAP[estado]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {estado}
    </span>
  )
}

// ─── Select widget ─────────────────────────────────────────────────────────────

function Sel({ value, onChange, children, wide }: { value: string; onChange: (v: string) => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`appearance-none pl-3 pr-7 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer transition-all ${wide ? 'w-48' : ''}`}
        style={{ fontWeight: 500 }}>
        {children}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
    </div>
  )
}

// ─── Geo aggregations ─────────────────────────────────────────────────────────

function countBy<K extends keyof EventRow>(events: EventRow[], key: K) {
  const map: Record<string, number> = {}
  for (const e of events) {
    const v = e[key] as string
    map[v] = (map[v] ?? 0) + 1
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function DetailModal({ ev, onClose }: { ev: EventRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>{ev.nombre}</h3>
            <StatusBadge estado={ev.estado} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors ml-4 shrink-0"><IX /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-gray-600 leading-relaxed">{ev.descripcion}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'País',        value: ev.pais },
              { label: 'Departamento', value: ev.departamento },
              { label: 'Ciudad',      value: ev.ciudad },
              { label: 'Dirección',   value: ev.direccion },
              { label: 'Fecha',       value: ev.fecha },
              { label: 'Hora',        value: ev.hora },
              { label: 'Agente',      value: ev.agente },
              { label: 'Precio',      value: ev.precio },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3.5 py-2.5">
                <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</p>
                <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 600 }}>{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Capacidad',  value: ev.capacidad.toLocaleString('es-CO'), color: '#4f46e5', bg: '#eef2ff' },
              { label: 'Reservas',   value: ev.reservas.toLocaleString('es-CO'),  color: '#f4845f', bg: '#fff7f5' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: bg }}>
                <p className="text-xs mb-0.5" style={{ color, fontWeight: 500 }}>{label}</p>
                <p className="text-2xl" style={{ color, fontWeight: 800 }}>{value}</p>
              </div>
            ))}
          </div>
          {ev.estado === 'Cancelado' && ev.causaCancelacion && (
            <div className="rounded-xl p-4 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
              <p className="text-xs mb-1" style={{ color: '#dc2626', fontWeight: 600 }}>Causa de cancelación</p>
              <p className="text-sm" style={{ color: '#991b1b' }}>{ev.causaCancelacion}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm text-white transition-colors hover:opacity-90"
            style={{ background: '#4f46e5', fontWeight: 600 }}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function BarTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-600 mb-1" style={{ fontWeight: 600 }}>{label}</p>
      <p className="text-gray-900" style={{ fontWeight: 700 }}>{payload[0].value} evento{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  )
}

const CHART_COLORS = ['#4f46e5', '#f4845f', '#059669', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#84cc16']

const PAGE_SIZE = 6

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminCoverageEvents({ onLogout, onNavigate, activeNav }: Props) {
  const [period,   setPeriod]   = useState('2026')
  const [refresh,  setRefresh]  = useState(false)

  // Hierarchical filters
  const [fPais,   setFPais]   = useState('Todos')
  const [fDepto,  setFDepto]  = useState('Todos')
  const [fCiudad, setFCiudad] = useState('Todos')
  const [fEstado, setFEstado] = useState('Todos')

  // Applied filters (separate from staged)
  const [aPais,   setAPais]   = useState('Todos')
  const [aDepto,  setADepto]  = useState('Todos')
  const [aCiudad, setACiudad] = useState('Todos')
  const [aEstado, setAEstado] = useState('Todos')

  const [detailEv, setDetailEv] = useState<EventRow | null>(null)
  const [page, setPage]         = useState(1)

  const handleRefresh  = () => { setRefresh(true); setTimeout(() => setRefresh(false), 800) }
  const clearAll       = () => {
    setFPais('Todos'); setFDepto('Todos'); setFCiudad('Todos'); setFEstado('Todos')
    setAPais('Todos'); setADepto('Todos'); setACiudad('Todos'); setAEstado('Todos')
    setPage(1)
  }
  const applyFilters   = () => {
    setAPais(fPais); setADepto(fDepto); setACiudad(fCiudad); setAEstado(fEstado)
    setPage(1)
  }

  // Cascading options
  const deptos = fPais === 'Todos'
    ? [...new Set(ALL_EVENTS.map(e => e.departamento))]
    : Object.keys(GEO[fPais] ?? {})

  const ciudades = fDepto === 'Todos'
    ? (fPais === 'Todos'
      ? [...new Set(ALL_EVENTS.map(e => e.ciudad))]
      : Object.values(GEO[fPais] ?? {}).flat())
    : (GEO[fPais]?.[fDepto] ?? [...new Set(ALL_EVENTS.filter(e => e.departamento === fDepto).map(e => e.ciudad))])

  // Filtered events (applied)
  const filtered = useMemo(() => ALL_EVENTS.filter(e =>
    (aPais   === 'Todos' || e.pais          === aPais)   &&
    (aDepto  === 'Todos' || e.departamento  === aDepto)  &&
    (aCiudad === 'Todos' || e.ciudad        === aCiudad) &&
    (aEstado === 'Todos' || e.estado        === aEstado)
  ), [aPais, aDepto, aCiudad, aEstado])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Aggregations for charts
  const byPais  = countBy(ALL_EVENTS, 'pais')
  const byDepto = countBy(ALL_EVENTS, 'departamento')
  const byCity  = countBy(ALL_EVENTS, 'ciudad')

  // KPIs
  const paises  = new Set(ALL_EVENTS.map(e => e.pais)).size
  const depAgg  = new Set(ALL_EVENTS.map(e => e.departamento)).size
  const cityAgg = new Set(ALL_EVENTS.map(e => e.ciudad)).size
  const totalEv = ALL_EVENTS.length

  // Summary hierarchy: pais → depto → ciudad
  type HierRow = { pais: string; departamento: string; ciudad: string; eventos: number; reservas: number; activos: number; cancelados: number }
  const summaryRows: HierRow[] = useMemo(() => {
    const map: Record<string, HierRow> = {}
    for (const e of ALL_EVENTS) {
      const key = `${e.pais}|${e.departamento}|${e.ciudad}`
      if (!map[key]) map[key] = { pais: e.pais, departamento: e.departamento, ciudad: e.ciudad, eventos: 0, reservas: 0, activos: 0, cancelados: 0 }
      map[key].eventos++
      map[key].reservas += e.reservas
      if (e.estado === 'Cancelado') map[key].cancelados++
      else if (e.estado !== 'Finalizado') map[key].activos++
    }
    return Object.values(map).sort((a, b) => b.eventos - a.eventos)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <Sidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Cobertura y eventos</h1>
            <p className="text-sm text-gray-400 mt-0.5">Consulta la distribución de eventos por país, departamento y ciudad.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="relative">
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                style={{ fontWeight: 600 }}>
                <option>2026</option>
                <option>Todo el período</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
            </div>
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              style={{ fontWeight: 500 }}>
              <span className={refresh ? 'animate-spin' : ''}><IRefresh /></span>
              Actualizar datos
            </button>
            <button onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              style={{ fontWeight: 500 }}>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Países con eventos',      sub: 'Países donde EventNova opera',            value: paises,  icon: <IGlobe />,   color: '#4f46e5', bg: '#eef2ff' },
              { label: 'Departamentos con eventos', sub: 'Departamentos registrados con actividad', value: depAgg,  icon: <IMap />,     color: '#d97706', bg: '#fffbeb' },
              { label: 'Ciudades con eventos',    sub: 'Ciudades cubiertas por la plataforma',    value: cityAgg, icon: <IMapPin />,  color: '#059669', bg: '#ecfdf5' },
              { label: 'Total de eventos',        sub: 'Eventos registrados en EventNova',        value: totalEv, icon: <ICalendar />,color: '#7c3aed', bg: '#f5f3ff' },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: k.bg, color: k.color }}>
                  {k.icon}
                </div>
                <div>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 800 }}>{k.value}</p>
                  <p className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{k.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sec 1: Filters ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos por ubicación</h2>
              <p className="text-xs text-gray-400 mt-0.5">Selecciona los filtros para consultar eventos por área geográfica.</p>
            </div>
            <div className="px-6 py-5 flex flex-wrap items-end gap-4">
              {/* País */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500" style={{ fontWeight: 600 }}>País</label>
                <Sel value={fPais} onChange={v => { setFPais(v); setFDepto('Todos'); setFCiudad('Todos') }} wide>
                  <option>Todos</option>
                  {Object.keys(GEO).map(p => <option key={p}>{p}</option>)}
                </Sel>
              </div>
              {/* Departamento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500" style={{ fontWeight: 600 }}>
                  Departamento {fPais !== 'Todos' && <span style={{ color: '#4f46e5' }}>· {fPais}</span>}
                </label>
                <Sel value={fDepto} onChange={v => { setFDepto(v); setFCiudad('Todos') }} wide>
                  <option>Todos</option>
                  {deptos.map(d => <option key={d}>{d}</option>)}
                </Sel>
              </div>
              {/* Ciudad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500" style={{ fontWeight: 600 }}>
                  Ciudad {fDepto !== 'Todos' && <span style={{ color: '#4f46e5' }}>· {fDepto}</span>}
                </label>
                <Sel value={fCiudad} onChange={setFCiudad} wide>
                  <option>Todos</option>
                  {ciudades.map(c => <option key={c}>{c}</option>)}
                </Sel>
              </div>
              {/* Estado */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500" style={{ fontWeight: 600 }}>Estado del evento</label>
                <Sel value={fEstado} onChange={setFEstado}>
                  <option>Todos</option>
                  {(['Programado','En boletería','En vivo','Finalizado','Cancelado'] as EventStatus[]).map(s => <option key={s}>{s}</option>)}
                </Sel>
              </div>
              <div className="flex items-center gap-2 pb-0.5">
                <button onClick={applyFilters}
                  className="px-5 py-2 rounded-xl text-sm text-white transition-colors hover:opacity-90"
                  style={{ background: '#4f46e5', fontWeight: 600 }}>
                  Aplicar filtros
                </button>
                <button onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  style={{ fontWeight: 500 }}>
                  Limpiar
                </button>
              </div>
            </div>
            {(aPais !== 'Todos' || aDepto !== 'Todos' || aCiudad !== 'Todos' || aEstado !== 'Todos') && (
              <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Filtros activos:</span>
                {aPais   !== 'Todos' && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>{aPais}</span>}
                {aDepto  !== 'Todos' && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>{aDepto}</span>}
                {aCiudad !== 'Todos' && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>{aCiudad}</span>}
                {aEstado !== 'Todos' && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>{aEstado}</span>}
              </div>
            )}
          </div>

          {/* ── Sec 2: Events table ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Listado de eventos por ubicación</h2>
                <p className="text-xs text-gray-400 mt-0.5">{filtered.length} evento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['Evento','País','Departamento','Ciudad','Fecha','Agente','Estado','Reservas',''].map(h => (
                    <th key={h + Math.random()} className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">No se encontraron eventos con los filtros seleccionados.</td></tr>
                  ) : paged.map((ev, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="text-sm text-gray-900 font-semibold leading-snug">{ev.nombre}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{ev.pais}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{ev.departamento}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{ev.ciudad}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{ev.fecha}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{ev.agente}</td>
                      <td className="px-4 py-3.5"><StatusBadge estado={ev.estado} /></td>
                      <td className="px-4 py-3.5 text-sm text-gray-900 text-center" style={{ fontWeight: 700 }}>{ev.reservas.toLocaleString('es-CO')}</td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => setDetailEv(ev)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                          style={{ fontWeight: 500 }}>
                          <IEye />Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Mostrando {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button disabled={safePage === 1} onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <IChevLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className="w-8 h-8 rounded-lg text-xs transition-colors"
                    style={n === safePage
                      ? { background: '#4f46e5', color: '#fff', fontWeight: 700 }
                      : { color: '#6b7280', fontWeight: 500 }}>
                    {n}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <IChevRight />
                </button>
              </div>
            </div>
          </div>

          {/* ── Sec 3 + 4: Country & Department charts ── */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* By country */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Distribución de eventos por país</h2>
                <p className="text-xs text-gray-400 mt-0.5">Total de eventos registrados por país</p>
              </div>
              <div className="px-6 py-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byPais.map(([name, value]) => ({ name, value }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip content={<BarTip />} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {byPais.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 flex flex-wrap gap-2">
                  {byPais.map(([name, value], idx) => (
                    <div key={name} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span style={{ fontWeight: 500 }}>{name}</span>
                      <span className="text-gray-400">({value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By department */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos por departamento</h2>
                <p className="text-xs text-gray-400 mt-0.5">Departamentos con mayor concentración de eventos</p>
              </div>
              <div className="px-6 py-5">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart layout="vertical"
                    data={byDepto.slice(0, 8).map(([name, value]) => ({ name: name.length > 16 ? name.slice(0, 16) + '…' : name, value }))}
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BarTip />} />
                    <Bar dataKey="value" fill="#4f46e5" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Sec 5: By city ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos por ciudad</h2>
              <p className="text-xs text-gray-400 mt-0.5">Ordenado de mayor a menor número de eventos</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['#','Ciudad','Departamento','País','Nº de eventos','Porcentaje del total'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {byCity.map(([ciudad, count], idx) => {
                    const ev = ALL_EVENTS.find(e => e.ciudad === ciudad)
                    const pct = ((count / totalEv) * 100).toFixed(1)
                    return (
                      <tr key={ciudad} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-400 w-10" style={{ fontWeight: 600 }}>{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{ciudad}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ev?.departamento ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ev?.pais ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block text-sm px-2.5 py-0.5 rounded-lg" style={{ background: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}>{count}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-gray-100 max-w-28 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#4f46e5' }} />
                            </div>
                            <span className="text-sm text-gray-600" style={{ fontWeight: 600 }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Sec 6: Hierarchical summary ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Resumen de cobertura</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribución completa de eventos por país, departamento y ciudad</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['País','Departamento','Ciudad','Eventos','Reservas','Eventos activos','Eventos cancelados'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {summaryRows.map((r, i) => {
                    const isNewPais  = i === 0 || summaryRows[i - 1].pais !== r.pais
                    const isNewDepto = i === 0 || summaryRows[i - 1].pais !== r.pais || summaryRows[i - 1].departamento !== r.departamento
                    return (
                      <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-4 py-3">
                          {isNewPais
                            ? <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}><IGlobe />{r.pais}</span>
                            : <span className="text-gray-300 text-sm pl-2">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {isNewDepto
                            ? <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>{r.departamento}</span>
                            : <span className="text-gray-300 text-sm pl-2">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#4f46e5' }} />
                            <span className="text-sm text-gray-700">{r.ciudad}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block text-sm px-2 py-0.5 rounded-md" style={{ background: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}>{r.eventos}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900" style={{ fontWeight: 600 }}>{r.reservas.toLocaleString('es-CO')}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block text-sm px-2 py-0.5 rounded-md" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 700 }}>{r.activos}</span>
                        </td>
                        <td className="px-4 py-3">
                          {r.cancelados > 0
                            ? <span className="inline-block text-sm px-2 py-0.5 rounded-md" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>{r.cancelados}</span>
                            : <span className="text-gray-300 text-sm">0</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-2" />
        </div>
      </main>

      {/* ── Detail modal ── */}
      {detailEv && <DetailModal ev={detailEv} onClose={() => setDetailEv(null)} />}
    </div>
  )
}
