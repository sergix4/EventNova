import { useState } from 'react'
import { GENERAL_LAST_RECORDS, SHARED_RATINGS, SHARED_EVENTS } from '../sharedData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts'

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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
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

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
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

function IconTrendUp() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

// ─── Nav items (same as AdminDashboard) ───────────────────────────────────────

const NAV_ITEMS: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'reportes-generales', label: 'Reportes generales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
  { key: 'reportes-comerciales', label: 'Reportes comerciales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
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
          <IconLogOut />Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESERVAS_EVENTOS_DATA = [
  { mes: 'Ene', reservas: 201, eventos: 14 },
  { mes: 'Feb', reservas: 258, eventos: 19 },
  { mes: 'Mar', reservas: 364, eventos: 28 },
  { mes: 'Abr', reservas: 295, eventos: 23 },
  { mes: 'May', reservas: 424, eventos: 34 },
  { mes: 'Jun', reservas: 515, eventos: 31 },
  { mes: 'Jul', reservas: 458, eventos: 27 },
  { mes: 'Ago', reservas: 591, eventos: 38 },
  { mes: 'Sep', reservas: 531, eventos: 42 },
  { mes: 'Oct', reservas: 675, eventos: 36 },
  { mes: 'Nov', reservas: 613, eventos: 29 },
  { mes: 'Dic', reservas: 753, eventos: 51 },
]

const DIST_DATA = [
  { name: 'Clientes',         value: 1248, color: '#4f46e5' },
  { name: 'Agentes',          value: 86,   color: '#f4845f' },
  { name: 'Administradores',  value: 4,    color: '#d97706' },
]

const TOTAL_USERS = 1248 + 86 + 4
const TOTAL_ALL   = 1248 + 86 + 4 + 3842 + 326

const RESUMEN_ROWS = [
  { tipo: 'Clientes',        cantidad: 1248, variacion: '+14%', up: true  },
  { tipo: 'Agentes',         cantidad: 86,   variacion: '+8%',  up: true  },
  { tipo: 'Administradores', cantidad: 4,    variacion: '0%',   up: false },
  { tipo: 'Reservas',        cantidad: 3842, variacion: '+22%', up: true  },
  { tipo: 'Eventos',         cantidad: 326,  variacion: '+18%', up: true  },
]

type ActivityType = 'cliente' | 'agente' | 'evento' | 'reserva' | 'admin'

const LAST_RECORDS: { type: ActivityType; descripcion: string; fecha: string; estado: string }[] = GENERAL_LAST_RECORDS

const TYPE_STYLE: Record<ActivityType, { bg: string; color: string; label: string }> = {
  cliente: { bg: '#eef2ff', color: '#4f46e5', label: 'Cliente'  },
  agente:  { bg: '#fffbeb', color: '#d97706', label: 'Agente'   },
  evento:  { bg: '#ecfdf5', color: '#059669', label: 'Evento'   },
  reserva: { bg: '#fff7f5', color: '#f4845f', label: 'Reserva'  },
  admin:   { bg: '#f5f3ff', color: '#7c3aed', label: 'Admin'    },
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  'Activo':      { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Programado':  { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'Confirmada':  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Pendiente':   { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'Cancelada':   { bg: 'bg-red-50',     text: 'text-red-600'     },
}

// ─── Custom label for pie ─────────────────────────────────────────────────────

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; name: string
}) {
  if (percent < 0.03) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function ComboTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const labels: Record<string, string> = { reservas: 'Reservas', eventos: 'Eventos' }
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-600 mb-1.5" style={{ fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{labels[p.name] ?? p.name}:</span>
          <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminGeneralReports({ onLogout, onNavigate, activeNav }: Props) {
  const [period, setPeriod]         = useState('2026')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [statusFilter, setStatus]   = useState('Todos')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900) }
  const clearFilters  = () => { setTypeFilter('Todos'); setStatus('Todos') }
  const hasFilters    = typeFilter !== 'Todos' || statusFilter !== 'Todos'

  const filteredRecords = LAST_RECORDS.filter(r => {
    const matchType   = typeFilter === 'Todos' || TYPE_STYLE[r.type].label === typeFilter
    const matchStatus = statusFilter === 'Todos' || r.estado === statusFilter
    return matchType && matchStatus
  })

  const totalRatings = SHARED_RATINGS.length
  const avgRating = totalRatings > 0 ? SHARED_RATINGS.reduce((s, r) => s + r.estrellas, 0) / totalRatings : 0

  const ratingsByEvent = SHARED_EVENTS.map(ev => {
    const evRatings = SHARED_RATINGS.filter(r => r.eventoId === ev.id)
    return {
      nombre: ev.nombre,
      ciudad: ev.ciudad,
      count: evRatings.length,
      avg: evRatings.length > 0 ? evRatings.reduce((s, r) => s + r.estrellas, 0) / evRatings.length : 0,
    }
  }).filter(e => e.count > 0).sort((a, b) => b.avg - a.avg)

  const kpis = [
    { label: 'Clientes registrados',       sub: 'Usuarios registrados como clientes', value: '1.248', raw: 1248, icon: <IconUsers />,     color: '#4f46e5', bg: '#eef2ff', trend: '+14%', up: true  },
    { label: 'Agentes registrados',         sub: 'Agentes registrados en EventNova',   value: '86',    raw: 86,   icon: <IconBriefcase />, color: '#f4845f', bg: '#fff7f5', trend: '+8%',  up: true  },
    { label: 'Administradores registrados', sub: 'Administradores del sistema',        value: '4',     raw: 4,    icon: <IconShield />,    color: '#d97706', bg: '#fffbeb', trend: '0%',   up: false },
    { label: 'Reservas registradas',        sub: 'Reservas realizadas en el sistema',  value: '3.842', raw: 3842, icon: <IconTicket />,    color: '#059669', bg: '#ecfdf5', trend: '+22%', up: true  },
    { label: 'Eventos registrados',         sub: 'Eventos creados en EventNova',       value: '326',   raw: 326,  icon: <IconCalendar />,  color: '#7c3aed', bg: '#f5f3ff', trend: '+18%', up: true  },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AdminSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Reportes generales</h1>
            <p className="text-sm text-gray-400 mt-0.5">Consulta el estado general de los registros de EventNova.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer transition-all"
                style={{ fontWeight: 600 }}>
                <option value="2026">2026</option>
                <option value="todo">Todo el período</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
            </div>
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              style={{ fontWeight: 500 }}>
              <span className={refreshing ? 'animate-spin' : ''}><IconRefresh /></span>
              Actualizar datos
            </button>
          </div>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: k.bg, color: k.color }}>
                    {k.icon}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: k.up ? '#ecfdf5' : '#f3f4f6', color: k.up ? '#059669' : '#6b7280' }}>
                    {k.up && <IconTrendUp />}{k.trend}
                  </span>
                </div>
                <div>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 800 }}>{k.value}</p>
                  <p className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{k.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>{k.sub}</p>
                </div>
                {/* mini sparkline bar */}
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((k.raw / 3842) * 100))}%`, background: k.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Distribución + Reservas/Eventos ── */}
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Donut — distribución de usuarios */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <SectionHeader title="Distribución de usuarios" subtitle="Clientes · Agentes · Administradores" />
              <div className="px-6 py-5">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={DIST_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={PieLabel as unknown as boolean}
                    >
                      {DIST_DATA.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number, name: string) => [`${v.toLocaleString('es-CO')} (${((v / TOTAL_USERS) * 100).toFixed(1)}%)`, name]}
                      contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 13 }}
                    />
                    <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 12 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-2">
                  {DIST_DATA.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-gray-600" style={{ fontWeight: 500 }}>{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900" style={{ fontWeight: 700 }}>{d.value.toLocaleString('es-CO')}</span>
                        <span className="text-xs text-gray-400 w-12 text-right">{((d.value / TOTAL_USERS) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grouped bar — reservas y eventos */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Reservas y eventos</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Comparativa mensual {period}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {[{ c: '#4f46e5', l: 'Reservas' }, { c: '#f4845f', l: 'Eventos' }].map(({ c, l }) => (
                    <span key={l} className="flex items-center gap-1.5" style={{ color: '#6b7280', fontWeight: 500 }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-5">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={RESERVAS_EVENTOS_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ComboTooltip />} />
                    <Bar dataKey="reservas" name="reservas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="eventos"  name="eventos"  fill="#f4845f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Resumen de registros ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader title="Resumen de registros" subtitle="Distribución porcentual del total del sistema" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Tipo de registro', 'Cantidad', 'Porcentaje del total', 'Variación'].map(col => (
                      <th key={col} className="px-6 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                        style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESUMEN_ROWS.map((row, idx) => {
                    const pct = ((row.cantidad / TOTAL_ALL) * 100).toFixed(1)
                    const style = kpis.find(k => k.label.startsWith(row.tipo))
                    return (
                      <tr key={idx} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: style?.bg ?? '#f3f4f6', color: style?.color ?? '#6b7280' }}>
                              {style?.icon}
                            </div>
                            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{row.tipo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-gray-900" style={{ fontWeight: 700 }}>
                          {row.cantidad.toLocaleString('es-CO')}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-gray-100 max-w-32 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: style?.color ?? '#6b7280' }} />
                            </div>
                            <span className="text-sm text-gray-600" style={{ fontWeight: 600 }}>{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={row.up
                              ? { background: '#ecfdf5', color: '#059669' }
                              : { background: '#f3f4f6', color: '#6b7280' }}>
                            {row.up && <IconTrendUp />}{row.variacion}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Calificaciones de eventos ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fffbeb' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </div>
                <div>
                  <h3 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Calificaciones de eventos</h3>
                  <p className="text-xs text-gray-400">Percepción de los clientes sobre los eventos de la plataforma</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Avg rating */}
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#fffbeb' }}>
                <div>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{avgRating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(avgRating) ? '#f59e0b' : 'none'} stroke={i <= Math.round(avgRating) ? '#f59e0b' : '#e5e7eb'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1" style={{ fontWeight: 500 }}>Calificación promedio</p>
                </div>
              </div>
              {/* Total */}
              <div className="rounded-xl p-4 flex flex-col justify-center" style={{ background: '#f0fdf4' }}>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{totalRatings}</p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontWeight: 500 }}>Total de calificaciones</p>
              </div>
              {/* Events with ratings */}
              <div className="rounded-xl p-4 flex flex-col justify-center" style={{ background: '#eef2ff' }}>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{ratingsByEvent.length}</p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontWeight: 500 }}>Eventos con calificaciones</p>
              </div>
            </div>

            {/* Top rated events */}
            {ratingsByEvent.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Eventos mejor calificados</p>
                <div className="flex flex-col gap-2">
                  {ratingsByEvent.slice(0, 5).map((ev, idx) => (
                    <div key={ev.nombre} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white shrink-0" style={{ background: idx === 0 ? '#f59e0b' : '#d1d5db', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate" style={{ fontWeight: 600 }}>{ev.nombre}</p>
                        <p className="text-xs text-gray-400">{ev.ciudad}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(ev.avg) ? '#f59e0b' : 'none'} stroke={i <= Math.round(ev.avg) ? '#f59e0b' : '#e5e7eb'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-700" style={{ fontWeight: 700 }}>{ev.avg.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({ev.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Últimos registros ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header + filters */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Últimos registros</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''} encontrado{filteredRecords.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 flex items-center gap-1" style={{ fontWeight: 500 }}><IconFilter />Filtros:</span>

                  {/* Tipo */}
                  <div className="relative">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                      style={{ fontWeight: 500 }}>
                      <option value="Todos">Todos los tipos</option>
                      {Object.values(TYPE_STYLE).map(s => <option key={s.label}>{s.label}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>

                  {/* Estado */}
                  <div className="relative">
                    <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                      style={{ fontWeight: 500 }}>
                      <option value="Todos">Todos los estados</option>
                      {['Activo', 'Programado', 'Confirmada', 'Pendiente', 'Cancelada'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>

                  {hasFilters && (
                    <button onClick={clearFilters}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                      style={{ fontWeight: 500 }}>
                      <IconX />Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Tipo', 'Descripción', 'Fecha', 'Estado'].map(col => (
                      <th key={col} className="px-6 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                        style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">No se encontraron registros con los filtros seleccionados.</td></tr>
                  ) : filteredRecords.map((r, idx) => {
                    const s = TYPE_STYLE[r.type]
                    const badge = STATUS_BADGE[r.estado] ?? { bg: 'bg-gray-100', text: 'text-gray-500' }
                    return (
                      <tr key={idx} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ background: s.bg, color: s.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-gray-700 max-w-xs">
                          <span style={{ fontWeight: 500 }}>{r.descripcion}</span>
                        </td>
                        <td className="px-6 py-3.5 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 500 }}>{r.fecha}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Mostrando {filteredRecords.length} de {LAST_RECORDS.length} registros</span>
              <button onClick={() => onNavigate('reportes-generales')} className="text-xs text-indigo-600 hover:underline" style={{ fontWeight: 600 }}>
                Ver historial completo →
              </button>
            </div>
          </div>

          <div className="h-2" />
        </div>
      </main>
    </div>
  )
}
