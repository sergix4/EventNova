import { useState, useMemo } from 'react'
import { SHARED_AGENTS } from '../sharedData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AdminNavKey) => void
  activeNav: AdminNavKey
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const COP = (v: number) =>
  '$ ' + Math.round(v).toLocaleString('es-CO')

const NUM = (v: number) => v.toLocaleString('es-CO')

// ─── Icons ────────────────────────────────────────────────────────────────────

const ITicket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2M13 17v2M13 11v2" />
  </svg>
)

const ILogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const IRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

const IDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

const IChevDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const IFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const IX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const ITrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const IDollar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IBriefcase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const ICalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

// ─── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'reportes-generales', label: 'Reportes generales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
  { key: 'reportes-comerciales', label: 'Reportes comerciales', icon: <IDollar /> },
  { key: 'cobertura', label: 'Cobertura y eventos', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { key: 'reservas-operacion', label: 'Reservas y operación', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg> },
  { key: 'perfil', label: 'Perfil', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg> },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AdminSidebar({ activeNav, onNavigate, onLogout }: Props) {
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
        <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
          Panel Administrador
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.key
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${isActive ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              style={isActive ? { background: '#4f46e5', fontWeight: 600 } : { fontWeight: 500 }}>
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { mes: 'Ene', ingresos: 42_800_000 },
  { mes: 'Feb', ingresos: 58_300_000 },
  { mes: 'Mar', ingresos: 74_100_000 },
  { mes: 'Abr', ingresos: 63_500_000 },
  { mes: 'May', ingresos: 89_700_000 },
  { mes: 'Jun', ingresos: 112_400_000 },
  { mes: 'Jul', ingresos: 98_200_000 },
  { mes: 'Ago', ingresos: 127_600_000 },
  { mes: 'Sep', ingresos: 118_900_000 },
  { mes: 'Oct', ingresos: 143_300_000 },
  { mes: 'Nov', ingresos: 135_800_000 },
  { mes: 'Dic', ingresos: 162_400_000 },
]

const AGENTS = SHARED_AGENTS.map(a => ({
  nombre: a.nombre,
  ciudad: a.ciudad,
  eventos: a.eventos,
  reservas: a.reservas,
  ingresos: a.ingresos,
}))

const EVENTS_MONTHLY: { evento: string; data: number[] }[] = [
  { evento: 'Maluma · World Tour',         data: [58, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]    },
  { evento: 'Festival Estéreo Picnic',     data: [0, 0, 143, 128, 0, 0, 0, 0, 0, 0, 0, 0]  },
  { evento: 'Gran Concierto Diciembre',    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 318]    },
  { evento: 'Feria Gastronómica Cali',     data: [0, 0, 0, 0, 88, 102, 0, 0, 0, 0, 0, 0]   },
  { evento: 'Teatro · Obra Contemporánea', data: [0, 0, 0, 0, 0, 0, 74, 89, 81, 0, 0, 0]   },
  { evento: 'Festival Electrónico Bogotá', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 201, 187, 0]  },
  { evento: 'Stand-Up Comedy Night',       data: [31, 28, 35, 0, 0, 0, 0, 0, 0, 0, 0, 42]  },
]

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

const _deptoByCity: Record<string, string> = {
  'Medellín': 'Antioquia', 'Bogotá': 'Cundinamarca', 'Cali': 'Valle del Cauca',
  'Barranquilla': 'Atlántico', 'Bucaramanga': 'Santander', 'Cartagena': 'Bolívar', 'Pereira': 'Risaralda',
}

const AGENT_EVENTS_CITY = SHARED_AGENTS.map(a => {
  const total = a.eventos
  const cancelados = Math.max(1, Math.round(total * 0.12))
  const finalizados = Math.round(total * 0.55)
  const activos = total - finalizados - cancelados
  return {
    agente: a.nombre,
    ciudad: a.ciudad,
    depto: _deptoByCity[a.ciudad] ?? a.ciudad,
    creados: total,
    activos: Math.max(1, activos),
    finalizados,
    cancelados,
  }
})

const TOTAL_REVENUE = MONTHLY_REVENUE.reduce((s, m) => s + m.ingresos, 0)
const TOTAL_RESERVAS = EVENTS_MONTHLY.reduce((s, e) => s + e.data.reduce((a, b) => a + b, 0), 0)
const AVG_AGENT   = AGENTS.reduce((s, a) => s + a.ingresos, 0) / AGENTS.length

// ─── Custom tooltips ──────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-600 mb-1" style={{ fontWeight: 600 }}>{label}</p>
      <p className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4f46e5' }} />
        <span className="text-gray-500">Ingresos:</span>
        <span style={{ fontWeight: 700, color: '#4f46e5' }}>{COP(payload[0].value)}</span>
      </p>
    </div>
  )
}

function ReservasTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-600 mb-1" style={{ fontWeight: 600 }}>{label}</p>
      <p className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f4845f' }} />
        <span className="text-gray-500">Reservas:</span>
        <span style={{ fontWeight: 700, color: '#f4845f' }}>{payload[0].value}</span>
      </p>
    </div>
  )
}

// ─── Helper: Section card ─────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function SecHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
      {children}
    </th>
  )
}

function Select({
  value, onChange, children,
}: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer transition-all"
        style={{ fontWeight: 500 }}>
        {children}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChevDown /></span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminCommercialReports({ onLogout, onNavigate, activeNav }: Props) {
  // Header controls
  const [period, setPeriod]       = useState('2026')
  const [month, setMonth]         = useState('Todos los meses')
  const [refreshing, setRefresh]  = useState(false)

  // General filters
  const [fAgente,   setFAgente]   = useState('Todos')
  const [fCiudad,   setFCiudad]   = useState('Todos')
  const [fEstado,   setFEstado]   = useState('Todos')

  // Section 4 filter
  const [fEvento, setFEvento] = useState('Todos')

  // Section 5 filters
  const [f5Agente, setF5Agente] = useState('Todos')
  const [f5Ciudad, setF5Ciudad] = useState('Todos')
  const [f5Depto,  setF5Depto]  = useState('Todos')

  const handleRefresh = () => { setRefresh(true); setTimeout(() => setRefresh(false), 800) }
  const clearFilters  = () => { setFAgente('Todos'); setFCiudad('Todos'); setFEstado('Todos') }
  const hasFilters    = fAgente !== 'Todos' || fCiudad !== 'Todos' || fEstado !== 'Todos'

  // Monthly revenue filtered
  const revenueData = useMemo(() => {
    if (month === 'Todos los meses') return MONTHLY_REVENUE
    const idx = MESES.indexOf(month.slice(0, 3))
    return idx >= 0 ? [MONTHLY_REVENUE[idx]] : MONTHLY_REVENUE
  }, [month])

  // Agents filtered
  const agentsFiltered = useMemo(() =>
    AGENTS.filter(a =>
      (fAgente  === 'Todos' || a.nombre === fAgente) &&
      (fCiudad  === 'Todos' || a.ciudad === fCiudad)
    ), [fAgente, fCiudad])

  // Sec 4: events filtered
  const eventsFiltered = useMemo(() =>
    EVENTS_MONTHLY.filter(e => fEvento === 'Todos' || e.evento === fEvento)
  , [fEvento])

  // Totals row sec 4
  const monthTotals = MESES.map((_, mi) =>
    eventsFiltered.reduce((s, e) => s + e.data[mi], 0)
  )

  // Sec 4 line chart data
  const sec4LineData = MESES.map((m, mi) => ({
    mes: m,
    reservas: eventsFiltered.reduce((s, e) => s + e.data[mi], 0),
  }))

  // Sec 5 filtered
  const sec5Filtered = useMemo(() =>
    AGENT_EVENTS_CITY.filter(r =>
      (f5Agente === 'Todos' || r.agente === f5Agente) &&
      (f5Ciudad === 'Todos' || r.ciudad === f5Ciudad) &&
      (f5Depto  === 'Todos' || r.depto  === f5Depto)
    ), [f5Agente, f5Ciudad, f5Depto])

  const ciudades   = [...new Set(AGENTS.map(a => a.ciudad))]
  const deptos     = [...new Set(AGENT_EVENTS_CITY.map(r => r.depto))]

  const NOW = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AdminSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Reportes comerciales</h1>
            <p className="text-sm text-gray-400 mt-0.5">Analiza los ingresos, reservas y actividad comercial de EventNova.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Period */}
            <div className="relative">
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer transition-all"
                style={{ fontWeight: 600 }}>
                <option>2026</option>
                <option>Todo el período</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChevDown /></span>
            </div>
            {/* Month */}
            <div className="relative">
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer transition-all"
                style={{ fontWeight: 500 }}>
                <option>Todos los meses</option>
                {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChevDown /></span>
            </div>
            {/* Buttons */}
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              style={{ fontWeight: 500 }}>
              <span className={refreshing ? 'animate-spin' : ''}><IRefresh /></span>
              Actualizar datos
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-colors hover:opacity-90"
              style={{ background: '#f4845f', fontWeight: 600 }}>
              <IDownload />Exportar reporte
            </button>
          </div>
        </div>

        {/* ── General filters bar ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0" style={{ fontWeight: 500 }}><IFilter />Filtros:</span>
          <Select value={fAgente}  onChange={setFAgente}>
            <option>Todos</option>
            {AGENTS.map(a => <option key={a.nombre}>{a.nombre}</option>)}
          </Select>
          <Select value={fCiudad}  onChange={setFCiudad}>
            <option>Todos</option>
            {ciudades.map(c => <option key={c}>{c}</option>)}
          </Select>
          <Select value={fEstado}  onChange={setFEstado}>
            <option>Todos</option>
            {['Activo','Finalizado','Cancelado'].map(s => <option key={s}>{s}</option>)}
          </Select>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
              style={{ fontWeight: 500 }}>
              <IX />Limpiar filtros
            </button>
          )}
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Ingresos totales 2026',         sub: 'Suma de todos los eventos',          value: COP(TOTAL_REVENUE),       icon: <IDollar />,    color: '#4f46e5', bg: '#eef2ff', trend: '+19%', up: true  },
              { label: 'Promedio por agente',            sub: 'Ingreso promedio por agente activo', value: COP(AVG_AGENT),           icon: <IBriefcase />, color: '#f4845f', bg: '#fff7f5', trend: '+11%', up: true  },
              { label: 'Total de reservas 2026',         sub: 'Reservas registradas en el año',     value: NUM(TOTAL_RESERVAS),      icon: <ICalendar />,  color: '#7c3aed', bg: '#f5f3ff', trend: '+22%', up: true  },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: k.bg, color: k.color }}>
                    {k.icon}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: k.up ? '#ecfdf5' : '#f3f4f6', color: k.up ? '#059669' : '#6b7280' }}>
                    {k.up && <ITrendUp />}{k.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl text-gray-900 leading-tight" style={{ fontWeight: 800 }}>{k.value}</p>
                  <p className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{k.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sec 1: Ingresos totales por mes ── */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Ingresos totales por mes en {period}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Ingresos de todos los eventos · en pesos colombianos (COP)</p>
              </div>
            </div>
            <div className="px-6 pt-5 pb-2">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData} margin={{ top: 4, right: 8, left: 10, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={72}
                    tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="px-6 pb-5 flex items-center justify-between border-t border-gray-50 pt-4">
              <div>
                <p className="text-xs text-gray-400">Ingreso total del año {period}</p>
                <p className="text-2xl text-gray-900 mt-0.5" style={{ fontWeight: 800, color: '#4f46e5' }}>{COP(TOTAL_REVENUE)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Mejor mes</p>
                <p className="text-sm text-gray-900 mt-0.5" style={{ fontWeight: 700 }}>
                  Diciembre · {COP(MONTHLY_REVENUE[11].ingresos)}
                </p>
              </div>
            </div>
          </Card>

          {/* ── Sec 2: Promedio por agente ── */}
          <Card>
            <SecHead title="Promedio de ingresos por agente" subtitle="Ingresos, reservas y eventos por cada agente registrado" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['Agente','Ciudad principal','Eventos creados','Reservas','Ingresos totales','Promedio de ingresos'].map(h => <Th key={h}>{h}</Th>)}
                </tr></thead>
                <tbody>
                  {agentsFiltered.map((a, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white shrink-0"
                            style={{ background: '#4f46e5', fontWeight: 700 }}>{a.nombre[0]}</div>
                          <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{a.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{a.ciudad}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-900 text-center" style={{ fontWeight: 600 }}>{a.eventos}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-900 text-center" style={{ fontWeight: 600 }}>{NUM(a.reservas)}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 700 }}>{COP(a.ingresos)}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block text-sm px-2.5 py-1 rounded-lg" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
                          {COP(a.ingresos / a.eventos)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {agentsFiltered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Sin resultados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Horizontal bar chart */}
            <div className="px-6 pt-5 pb-6 border-t border-gray-100">
              <p className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Comparación de promedio de ingresos por agente</p>
              <ResponsiveContainer width="100%" height={Math.max(220, agentsFiltered.length * 42)}>
                <BarChart layout="vertical"
                  data={agentsFiltered.map(a => ({ name: a.nombre.length > 18 ? a.nombre.slice(0, 18) + '…' : a.nombre, promedio: Math.round(a.ingresos / a.eventos) }))}
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [COP(v), 'Promedio']}
                    contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="promedio" fill="#4f46e5" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ── Reservas por evento y mes ── */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Reservas por evento y por mes en {period}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Número de reservas realizadas para cada evento en cada mes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>Evento:</span>
                <Select value={fEvento} onChange={setFEvento}>
                  <option>Todos</option>
                  {EVENTS_MONTHLY.map(e => <option key={e.evento}>{e.evento}</option>)}
                </Select>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr style={{ background: '#fafafa' }}>
                  <th className="px-4 py-3 text-left text-gray-500 whitespace-nowrap sticky left-0 bg-gray-50 z-10" style={{ fontWeight: 600, minWidth: 200 }}>Evento</th>
                  {MESES.map(m => (
                    <th key={m} className="px-3 py-3 text-center text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{m}</th>
                  ))}
                  <th className="px-4 py-3 text-center text-gray-500 whitespace-nowrap" style={{ fontWeight: 700 }}>Total</th>
                </tr></thead>
                <tbody>
                  {eventsFiltered.map((e, i) => {
                    const total = e.data.reduce((s, v) => s + v, 0)
                    return (
                      <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-4 py-3 sticky left-0 bg-white" style={{ fontWeight: 600, color: '#374151', minWidth: 200 }}>{e.evento}</td>
                        {e.data.map((v, mi) => (
                          <td key={mi} className="px-3 py-3 text-center">
                            {v > 0
                              ? <span className="inline-block px-2 py-0.5 rounded-md" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>{v}</span>
                              : <span className="text-gray-300">—</span>
                            }
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md" style={{ background: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}>{total}</span>
                        </td>
                      </tr>
                    )
                  })}
                  {/* Totals row */}
                  <tr className="border-t-2 border-gray-200" style={{ background: '#fafafa' }}>
                    <td className="px-4 py-3 sticky left-0 bg-gray-50" style={{ fontWeight: 700, color: '#111827' }}>Total de reservas por mes</td>
                    {monthTotals.map((t, i) => (
                      <td key={i} className="px-3 py-3 text-center" style={{ fontWeight: 700, color: '#111827' }}>{t > 0 ? t : '—'}</td>
                    ))}
                    <td className="px-4 py-3 text-center" style={{ fontWeight: 800, color: '#4f46e5' }}>
                      {monthTotals.reduce((s, v) => s + v, 0)}
                    </td>
                  </tr>
                  {eventsFiltered.length === 0 && (
                    <tr><td colSpan={14} className="px-4 py-8 text-center text-sm text-gray-400">Sin resultados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Line chart */}
            <div className="px-6 pt-5 pb-6 border-t border-gray-100">
              <p className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Evolución de reservas durante {period}</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={sec4LineData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<ReservasTooltip />} />
                  <Line type="monotone" dataKey="reservas" stroke="#f4845f" strokeWidth={2.5} dot={{ r: 4, fill: '#f4845f' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ── Sec 5: Eventos por agente y ciudad ── */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos creados por agente y ciudad</h2>
                <p className="text-xs text-gray-400 mt-0.5">Desglose de eventos activos, finalizados y cancelados por agente</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 flex items-center gap-1" style={{ fontWeight: 500 }}><IFilter /></span>
                <Select value={f5Agente} onChange={setF5Agente}>
                  <option>Todos</option>
                  {AGENT_EVENTS_CITY.map(r => <option key={r.agente}>{r.agente}</option>)}
                </Select>
                <Select value={f5Ciudad} onChange={setF5Ciudad}>
                  <option>Todos</option>
                  {[...new Set(AGENT_EVENTS_CITY.map(r => r.ciudad))].map(c => <option key={c}>{c}</option>)}
                </Select>
                <Select value={f5Depto} onChange={setF5Depto}>
                  <option>Todos</option>
                  {deptos.map(d => <option key={d}>{d}</option>)}
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['Agente','Ciudad','Departamento','Eventos creados','Eventos activos','Eventos finalizados','Eventos cancelados'].map(h => <Th key={h}>{h}</Th>)}
                </tr></thead>
                <tbody>
                  {sec5Filtered.map((r, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white shrink-0"
                            style={{ background: '#7c3aed', fontWeight: 700 }}>{r.agente[0]}</div>
                          <span className="text-sm text-gray-800 whitespace-nowrap" style={{ fontWeight: 600 }}>{r.agente}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{r.ciudad}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{r.depto}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-sm" style={{ background: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}>{r.creados}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-sm" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 700 }}>{r.activos}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-sm" style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>{r.finalizados}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-sm" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>{r.cancelados}</span>
                      </td>
                    </tr>
                  ))}
                  {sec5Filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Sin resultados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Bar chart sec 5 */}
            <div className="px-6 pt-5 pb-6 border-t border-gray-100">
              <p className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Comparación de eventos creados por agente</p>
              <ResponsiveContainer width="100%" height={Math.max(200, sec5Filtered.length * 40)}>
                <BarChart layout="vertical"
                  data={sec5Filtered.map(r => ({ name: r.agente.length > 18 ? r.agente.slice(0, 18) + '…' : r.agente, creados: r.creados, activos: r.activos, finalizados: r.finalizados, cancelados: r.cancelados }))}
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 13 }} />
                  <Legend iconType="circle" iconSize={9} formatter={(v) => <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 12, textTransform: 'capitalize' }}>{v}</span>} />
                  <Bar dataKey="creados"    fill="#7c3aed" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="activos"    fill="#059669" radius={[0, 0, 0, 0]} stackId="b" />
                  <Bar dataKey="finalizados" fill="#4f46e5" radius={[0, 0, 0, 0]} stackId="b" />
                  <Bar dataKey="cancelados" fill="#dc2626" radius={[0, 3, 3, 0]} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ── Resumen comercial ── */}
          <div className="rounded-2xl border border-indigo-100 shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)' }}>
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base text-white" style={{ fontWeight: 700 }}>Resumen comercial</h2>
                <p className="text-xs text-indigo-200 mt-0.5">Consolidado del período · {period}</p>
              </div>
              <span className="text-xs text-indigo-200 bg-white/10 px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>
                Última actualización: {NOW}
              </span>
            </div>
            <div className="px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: 'Ingresos totales',   value: COP(TOTAL_REVENUE)  },
                { label: 'Promedio por agente', value: COP(AVG_AGENT)     },
                { label: 'Total de reservas',   value: NUM(TOTAL_RESERVAS) },
                { label: 'Total de eventos',    value: NUM(AGENT_EVENTS_CITY.reduce((s, r) => s + r.creados, 0)) },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <p className="text-xs text-indigo-200" style={{ fontWeight: 500 }}>{item.label}</p>
                  <p className="text-xl text-white leading-tight" style={{ fontWeight: 800 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2" />
        </div>
      </main>
    </div>
  )
}
