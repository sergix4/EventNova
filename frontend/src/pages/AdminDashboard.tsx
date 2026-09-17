import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { SHARED_PAYMENTS } from '../sharedData'

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AdminNavKey) => void
  activeNav: AdminNavKey
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

function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconChevronDown() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'reportes-generales',
    label: 'Reportes generales',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    key: 'reportes-comerciales',
    label: 'Reportes comerciales',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: 'cobertura',
    label: 'Cobertura y eventos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    key: 'reservas-operacion',
    label: 'Reservas y operación',
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

function AdminSidebar({ activeNav, onNavigate, onLogout }: Props) {
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
        <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
          Panel Administrador
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
            style={{ background: 'linear-gradient(135deg, #92400e, #d97706)', fontWeight: 700 }}
          >
            AE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Administrador EventNova</p>
            <p className="text-xs text-gray-400">Administrador</p>
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const INGRESOS_DATA = [
  { mes: 'Ene', ingresos: 18_400_000 },
  { mes: 'Feb', ingresos: 22_150_000 },
  { mes: 'Mar', ingresos: 31_800_000 },
  { mes: 'Abr', ingresos: 27_600_000 },
  { mes: 'May', ingresos: 38_200_000 },
  { mes: 'Jun', ingresos: 45_750_000 },
  { mes: 'Jul', ingresos: 41_300_000 },
  { mes: 'Ago', ingresos: 53_900_000 },
  { mes: 'Sep', ingresos: 49_100_000 },
  { mes: 'Oct', ingresos: 62_400_000 },
  { mes: 'Nov', ingresos: 58_800_000 },
  { mes: 'Dic', ingresos: 74_200_000 },
]

const RESERVAS_DATA = [
  { mes: 'Ene', confirmadas: 142, pendientes: 38, canceladas: 21 },
  { mes: 'Feb', confirmadas: 189, pendientes: 52, canceladas: 17 },
  { mes: 'Mar', confirmadas: 264, pendientes: 71, canceladas: 29 },
  { mes: 'Abr', confirmadas: 218, pendientes: 44, canceladas: 33 },
  { mes: 'May', confirmadas: 312, pendientes: 88, canceladas: 24 },
  { mes: 'Jun', confirmadas: 378, pendientes: 96, canceladas: 41 },
  { mes: 'Jul', confirmadas: 341, pendientes: 79, canceladas: 38 },
  { mes: 'Ago', confirmadas: 427, pendientes: 112, canceladas: 52 },
  { mes: 'Sep', confirmadas: 394, pendientes: 93, canceladas: 44 },
  { mes: 'Oct', confirmadas: 486, pendientes: 128, canceladas: 61 },
  { mes: 'Nov', confirmadas: 452, pendientes: 104, canceladas: 57 },
  { mes: 'Dic', confirmadas: 538, pendientes: 147, canceladas: 68 },
]

const EVENTOS_DATA = [
  { mes: 'Ene', eventos: 14 },
  { mes: 'Feb', eventos: 19 },
  { mes: 'Mar', eventos: 28 },
  { mes: 'Abr', eventos: 23 },
  { mes: 'May', eventos: 34 },
  { mes: 'Jun', eventos: 31 },
  { mes: 'Jul', eventos: 27 },
  { mes: 'Ago', eventos: 38 },
  { mes: 'Sep', eventos: 42 },
  { mes: 'Oct', eventos: 36 },
  { mes: 'Nov', eventos: 29 },
  { mes: 'Dic', eventos: 51 },
]

const COBERTURA_DATA = [
  { pais: 'Colombia', departamento: 'Bogotá D.C.',    ciudad: 'Bogotá',        eventos: 112 },
  { pais: 'Colombia', departamento: 'Antioquia',      ciudad: 'Medellín',       eventos: 78 },
  { pais: 'Colombia', departamento: 'Valle del Cauca',ciudad: 'Cali',           eventos: 54 },
  { pais: 'Colombia', departamento: 'Atlántico',      ciudad: 'Barranquilla',   eventos: 31 },
  { pais: 'Colombia', departamento: 'Caldas',          ciudad: 'Manizales',      eventos: 18 },
  { pais: 'Colombia', departamento: 'Santander',      ciudad: 'Bucaramanga',    eventos: 14 },
  { pais: 'México',   departamento: 'Jalisco',        ciudad: 'Guadalajara',    eventos: 9 },
  { pais: 'Argentina',departamento: 'Buenos Aires',   ciudad: 'Buenos Aires',   eventos: 10 },
]

const ACTIVITY_FEED = [
  { type: 'cliente',  label: 'Nuevo cliente registrado',   detail: 'María López',                   time: 'Hoy, 10:42 AM' },
  { type: 'agente',   label: 'Nuevo agente registrado',    detail: 'SonidosPro S.A.S.',             time: 'Hoy, 09:18 AM' },
  { type: 'evento',   label: 'Nuevo evento creado',        detail: 'Festival Electrónico Bogotá',   time: 'Hoy, 08:55 AM' },
  { type: 'reserva',  label: 'Nueva reserva registrada',   detail: 'Concierto Talento Local · 3 entradas', time: 'Ayer, 11:30 PM' },
  { type: 'cancelada',label: 'Reserva cancelada',          detail: 'Noche de Comedia Stand Up · Causa: cambio de planes', time: 'Ayer, 09:14 PM' },
  { type: 'evento',   label: 'Nuevo evento creado',        detail: 'Feria Gastronómica Cali 2026',  time: 'Ayer, 06:02 PM' },
  { type: 'cliente',  label: 'Nuevo cliente registrado',   detail: 'Sebastián Ruiz',                time: 'Ayer, 03:47 PM' },
  { type: 'reserva',  label: 'Nueva reserva registrada',   detail: 'Gran Concierto de Diciembre · 5 entradas', time: 'Ayer, 02:11 PM' },
]

const ACTIVITY_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  cliente:   { bg: '#eef2ff', color: '#4f46e5', dot: 'bg-indigo-500' },
  agente:    { bg: '#fffbeb', color: '#d97706', dot: 'bg-amber-500' },
  evento:    { bg: '#ecfdf5', color: '#059669', dot: 'bg-emerald-500' },
  reserva:   { bg: '#fff7f5', color: '#f4845f', dot: 'bg-orange-400' },
  cancelada: { bg: '#fef2f2', color: '#dc2626', dot: 'bg-red-500' },
}

// ─── Tooltip customizado ──────────────────────────────────────────────────────

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1" style={{ fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name === 'ingresos' ? `$ ${(p.value / 1_000_000).toFixed(1)}M COP` : p.value.toLocaleString('es-CO')}
        </p>
      ))}
    </div>
  )
}

function ReservasTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const labels: Record<string, string> = { confirmadas: 'Confirmadas', pendientes: 'Pendientes', canceladas: 'Canceladas' }
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{labels[p.name] ?? p.name}:</span>
          <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ onLogout, onNavigate, activeNav }: Props) {
  const [period, setPeriod] = useState('2026')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 900)
  }

  const paises = Array.from(new Set(COBERTURA_DATA.map(d => d.pais)))
  const departamentos = Array.from(new Set(COBERTURA_DATA.map(d => d.departamento)))
  const ciudades = Array.from(new Set(COBERTURA_DATA.map(d => d.ciudad)))
  const totalEventos = COBERTURA_DATA.reduce((a, d) => a + d.eventos, 0)

  const kpis = [
    { label: 'Clientes registrados',       value: '1.248', icon: <IconUsers />,     color: '#4f46e5', bg: '#eef2ff', trend: '+14%', up: true },
    { label: 'Agentes registrados',         value: '86',    icon: <IconBriefcase />, color: '#f4845f', bg: '#fff7f5', trend: '+8%',  up: true },
    { label: 'Administradores registrados', value: '4',     icon: <IconShield />,    color: '#d97706', bg: '#fffbeb', trend: '0%',   up: false },
    { label: 'Reservas registradas',        value: '3.842', icon: <IconTicket />,    color: '#059669', bg: '#ecfdf5', trend: '+22%', up: true },
    { label: 'Eventos registrados',         value: '326',   icon: <IconCalendar />,  color: '#7c3aed', bg: '#f5f3ff', trend: '+18%', up: true },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AdminSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Dashboard del administrador</h1>
            <p className="text-sm text-gray-400 mt-0.5">Consulta el estado general y los principales indicadores de EventNova.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Period selector */}
            <div className="relative">
              <select
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer transition-all"
                style={{ fontWeight: 600 }}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
            </div>
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <span className={refreshing ? 'animate-spin' : ''}><IconRefresh /></span>
              Actualizar datos
            </button>
          </div>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.bg, color: k.color }}>
                    {k.icon}
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: k.up ? '#ecfdf5' : '#f3f4f6', color: k.up ? '#059669' : '#6b7280' }}
                  >
                    {k.up ? '↑' : '→'} {k.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontWeight: 500 }}>{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Ingresos + Reservas row ── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Ingresos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Ingresos totales en {period}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">En millones de pesos COP</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-gray-900" style={{ fontWeight: 800 }}>
                    $ {(INGRESOS_DATA.reduce((a, d) => a + d.ingresos, 0) / 1_000_000).toFixed(0)}M
                  </p>
                  <p className="text-xs text-emerald-600" style={{ fontWeight: 600 }}>↑ 31% vs. año anterior</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={INGRESOS_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Area type="monotone" dataKey="ingresos" name="ingresos" stroke="#4f46e5" strokeWidth={2.5} fill="url(#ingGrad)" dot={false} activeDot={{ r: 5, fill: '#4f46e5' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Reservas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Reservas por mes en {period}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Confirmadas · Pendientes · Canceladas</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {[{ c: '#4f46e5', l: 'Confirmadas' }, { c: '#f4845f', l: 'Pendientes' }, { c: '#dc2626', l: 'Canceladas' }].map(({ c, l }) => (
                    <span key={l} className="flex items-center gap-1" style={{ color: '#6b7280', fontWeight: 500 }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={RESERVAS_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ReservasTooltip />} />
                  <Bar dataKey="confirmadas" name="confirmadas" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pendientes"  name="pendientes"  fill="#f4845f" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="canceladas"  name="canceladas"  fill="#fca5a5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Eventos creados ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos creados en {period}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Total por mes</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-gray-900" style={{ fontWeight: 800 }}>
                  {EVENTOS_DATA.reduce((a, d) => a + d.eventos, 0)} eventos
                </p>
                <p className="text-xs text-emerald-600" style={{ fontWeight: 600 }}>↑ 18% vs. año anterior</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={EVENTOS_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(v: number) => [`${v} eventos`, 'Creados']}
                  labelStyle={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}
                />
                <Bar dataKey="eventos" fill="#7c3aed" radius={[4, 4, 0, 0]}
                  background={{ fill: '#f9fafb', radius: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Cobertura + Actividad row ── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Cobertura */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Cobertura de eventos</h2>
                <p className="text-xs text-gray-400 mt-0.5">Distribución geográfica del sistema</p>
              </div>

              {/* Mini KPIs */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
                  { label: 'Países', value: paises.length, icon: <IconMapPin /> },
                  { label: 'Departamentos', value: departamentos.length, icon: <IconMapPin /> },
                  { label: 'Ciudades', value: ciudades.length, icon: <IconMapPin /> },
                ].map((item, i) => (
                  <div key={i} className="px-4 py-3 text-center">
                    <p className="text-xl text-gray-900" style={{ fontWeight: 800 }}>{item.value}</p>
                    <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['País', 'Departamento', 'Ciudad', 'Eventos'].map(col => (
                        <th key={col} className="px-5 py-2.5 text-left text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COBERTURA_DATA.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-50 hover:bg-indigo-50/30 transition-colors">
                        <td className="px-5 py-2.5 text-xs text-gray-700" style={{ fontWeight: 500 }}>{row.pais}</td>
                        <td className="px-5 py-2.5 text-xs text-gray-600">{row.departamento}</td>
                        <td className="px-5 py-2.5 text-xs text-gray-600">{row.ciudad}</td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 max-w-16 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${Math.round((row.eventos / 112) * 100)}%`, background: '#4f46e5' }} />
                            </div>
                            <span className="text-xs text-gray-700" style={{ fontWeight: 700 }}>{row.eventos}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Total registrado</span>
                <span className="text-sm text-indigo-600" style={{ fontWeight: 700 }}>{totalEventos} eventos</span>
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Actividad reciente</h2>
                <p className="text-xs text-gray-400 mt-0.5">Últimas acciones en el sistema</p>
              </div>
              <div className="divide-y divide-gray-50">
                {ACTIVITY_FEED.map((item, idx) => {
                  const s = ACTIVITY_STYLE[item.type]
                  return (
                    <div key={idx} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: s.bg, color: s.color }}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.detail}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0" style={{ fontWeight: 500 }}>{item.time}</span>
                    </div>
                  )
                })}
              </div>
              <div className="px-5 py-3 border-t border-gray-100">
                <button
                  onClick={() => onNavigate('reportes-generales')}
                  className="text-xs text-indigo-600 hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Ver reporte completo →
                </button>
              </div>
            </div>
          </div>

          {/* ── Resumen de pagos ── */}
          <AdminPaymentSummary />

          <div className="h-2" />
        </div>
      </main>
    </div>
  )
}

// ─── Admin payment summary ────────────────────────────────────────────────────

const MONTHLY_PAYMENTS = [
  { mes: 'Ene', ingresos: 600000  },
  { mes: 'Feb', ingresos: 450000  },
  { mes: 'Mar', ingresos: 780000  },
  { mes: 'Abr', ingresos: 520000  },
  { mes: 'May', ingresos: 860000  },
  { mes: 'Jun', ingresos: 1100000 },
  { mes: 'Jul', ingresos: 950000  },
  { mes: 'Ago', ingresos: SHARED_PAYMENTS.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.valor, 0) },
  { mes: 'Sep', ingresos: 0 },
  { mes: 'Oct', ingresos: 0 },
  { mes: 'Nov', ingresos: 0 },
  { mes: 'Dic', ingresos: 0 },
].filter(m => m.ingresos > 0)

function AdminPaymentSummary() {
  const all = SHARED_PAYMENTS
  const totalIngresos  = all.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.valor, 0)
  const countPagados   = all.filter(p => p.estado === 'Pagado').length
  const countPendientes= all.filter(p => p.estado === 'Pendiente').length
  const countCancelados= all.filter(p => p.estado === 'Cancelado' || p.estado === 'Reembolsado').length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Pagos de reservas — Plataforma</h2>
        <p className="text-xs text-gray-400 mt-0.5">Resumen consolidado de pagos realizados por clientes en 2026.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total ingresos',    value: `$ ${(totalIngresos/1000000).toFixed(1)}M`, sub: 'COP pagado confirmado', color: '#4f46e5', bg: '#eef2ff',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
          { label: 'Pagos realizados',  value: String(countPagados),    sub: 'Transacciones completadas', color: '#059669', bg: '#ecfdf5',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          { label: 'Pagos pendientes',  value: String(countPendientes), sub: 'Esperando confirmación',  color: '#d97706', bg: '#fffbeb',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label: 'Cancelados',        value: String(countCancelados), sub: 'Cancelados o reembolsados', color: '#dc2626', bg: '#fef2f2',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg> },
        ].map(({ label, value, sub, color, bg, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>{icon}</div>
            <div>
              <p className="text-xl text-gray-900" style={{ fontWeight: 800 }}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
              <p className="text-xs text-gray-300 mt-0.5" style={{ fontWeight: 400 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Ingresos por mes — 2026</h3>
            <p className="text-xs text-gray-400 mt-0.5">Pagos confirmados en pesos COP</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>
            ↑ En curso
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_PAYMENTS} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} width={56} />
            <Tooltip formatter={(v: number) => [`$ ${v.toLocaleString('es-CO')}`, 'Ingresos']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Bar dataKey="ingresos" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
