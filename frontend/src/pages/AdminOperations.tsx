import { useState, useMemo } from 'react'
import { SHARED_RESERVATIONS, SHARED_EVENTS } from '../sharedData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'

interface Props { onLogout: () => void; onNavigate: (key: AdminNavKey) => void; activeNav: AdminNavKey }

type ResStatus  = 'Pendiente' | 'Confirmada' | 'Cancelada'
type EvStatus   = 'Programado' | 'En boletería' | 'En vivo' | 'Finalizado' | 'Cancelado'
type ActType    = 'reserva-nueva' | 'reserva-confirmada' | 'reserva-cancelada' | 'evento-cancelado' | 'evento-nuevo'

interface Reserva {
  cliente: string; correo: string; evento: string; agente: string
  fechaReserva: string; fechaEvento: string; hora: string
  entradas: number; valor: number; estado: ResStatus
  ciudad: string; pais: string
  causaCancelacion?: string; fechaCancelacion?: string
}

interface Evento {
  nombre: string; agente: string; pais: string; departamento: string; ciudad: string
  fechaEvento: string; hora: string; capacidad: number; reservasAfectadas: number
  fechaCancelacion: string; causa: string; estado: EvStatus
}

interface ActRow {
  tipo: ActType; descripcion: string; usuario: string; fecha: string; estado: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESERVAS: Reserva[] = SHARED_RESERVATIONS.map(r => {
  const ev = SHARED_EVENTS.find(e => e.id === r.eventoId)!
  return {
    cliente: r.clienteNombre,
    correo: r.clienteCorreo,
    evento: r.eventoNombre,
    agente: r.agente,
    fechaReserva: r.fechaReserva,
    fechaEvento: ev.fechaLarga.replace(/de (\w)/, (_, c) => 'de ' + c),
    hora: ev.hora,
    entradas: r.entradas,
    valor: r.valorTotal,
    estado: r.estado,
    ciudad: ev.ciudad,
    pais: ev.pais,
    ...(r.causaCancelacion ? { causaCancelacion: r.causaCancelacion } : {}),
    ...(r.fechaCancelacion ? { fechaCancelacion: r.fechaCancelacion } : {}),
  }
})

const CANCELLED_EVENTS: Evento[] = [
  ...SHARED_EVENTS.filter(e => e.estado === 'Cancelado').map(e => ({
    nombre: e.nombre,
    agente: e.agente,
    pais: e.pais,
    departamento: e.departamento,
    ciudad: e.ciudad,
    fechaEvento: e.fechaLarga,
    hora: e.hora,
    capacidad: e.capacidad,
    reservasAfectadas: SHARED_RESERVATIONS.filter(r => r.eventoId === e.id && r.estado === 'Cancelada').length,
    fechaCancelacion: '4 Sep 2026',
    causa: 'Fuerza mayor',
    estado: 'Cancelado' as EvStatus,
  })),
  { nombre: 'Rock Fest Cali 2026',         agente: 'Ana Rodríguez',  pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali',         fechaEvento: '28 ago 2026',  hora: '3:00 PM',  capacidad: 7000,  reservasAfectadas: 148, fechaCancelacion: '2 Ago 2026',  causa: 'Problemas de organización', estado: 'Cancelado' as EvStatus },
  { nombre: 'Feria Tecnológica Bquilla',    agente: 'Javier Nieto',   pais: 'Colombia', departamento: 'Atlántico',       ciudad: 'Barranquilla', fechaEvento: '5 sep 2026',   hora: '9:00 AM',  capacidad: 2500,  reservasAfectadas: 61,  fechaCancelacion: '20 Ago 2026', causa: 'Baja demanda',              estado: 'Cancelado' as EvStatus },
  { nombre: 'Concierto Salsa Clásica',      agente: 'Ana Rodríguez',  pais: 'Colombia', departamento: 'Valle del Cauca', ciudad: 'Cali',         fechaEvento: '17 oct 2026',  hora: '8:00 PM',  capacidad: 3500,  reservasAfectadas: 204, fechaCancelacion: '25 Sep 2026', causa: 'Problemas de ubicación',    estado: 'Cancelado' as EvStatus },
  { nombre: 'Encuentro Folclórico Pacífico',agente: 'NovaStar Events',pais: 'Colombia', departamento: 'Chocó',           ciudad: 'Quibdó',       fechaEvento: '12 sep 2026',  hora: '4:00 PM',  capacidad: 1800,  reservasAfectadas: 37,  fechaCancelacion: '5 Sep 2026',  causa: 'Cambio de fecha',           estado: 'Cancelado' as EvStatus },
  { nombre: 'Maratón Musical Bogotá',       agente: 'Pedro Vanegas',  pais: 'Colombia', departamento: 'Cundinamarca',    ciudad: 'Bogotá',       fechaEvento: '6 nov 2026',   hora: '10:00 AM', capacidad: 5000,  reservasAfectadas: 89,  fechaCancelacion: '15 Oct 2026', causa: 'Otro',                      estado: 'Cancelado' as EvStatus },
]

const ACTIVITY: ActRow[] = [
  { tipo: 'reserva-nueva',      descripcion: 'Liliana Castro reservó 3 entradas para Feria Gastronómica 2026',  usuario: 'Liliana Castro',  fecha: '11 Sep 2026, 10:42', estado: 'Confirmada'  },
  { tipo: 'reserva-cancelada',  descripcion: 'Roberto Varón canceló su reserva para Concierto Talento Local',   usuario: 'Roberto Varón',   fecha: '14 Sep 2026, 09:18', estado: 'Cancelada'   },
  { tipo: 'evento-cancelado',   descripcion: 'Maratón Musical Bogotá cancelado por Pedro Vanegas',              usuario: 'Pedro Vanegas',   fecha: '15 Oct 2026, 08:55', estado: 'Cancelado'   },
  { tipo: 'reserva-confirmada', descripcion: 'Paula Moreno confirmó reserva para Gran Concierto de Diciembre',  usuario: 'Paula Moreno',    fecha: '8 Sep 2026, 11:30',  estado: 'Confirmada'  },
  { tipo: 'reserva-nueva',      descripcion: 'Marcelo Suárez reservó 4 entradas para Festival Electrónico',     usuario: 'Marcelo Suárez',  fecha: '6 Sep 2026, 03:47',  estado: 'Pendiente'   },
  { tipo: 'evento-cancelado',   descripcion: 'Concierto Salsa Clásica cancelado — problemas de ubicación',      usuario: 'Ana Rodríguez',   fecha: '25 Sep 2026, 06:02', estado: 'Cancelado'   },
  { tipo: 'reserva-cancelada',  descripcion: 'Tomás Heredia canceló su reserva para Panama Jazz Festival',      usuario: 'Tomás Heredia',   fecha: '17 Sep 2026, 02:11', estado: 'Cancelada'   },
  { tipo: 'reserva-confirmada', descripcion: 'Isabel Mora confirmó reserva para Quito en Escena',               usuario: 'Isabel Mora',     fecha: '14 Sep 2026, 04:33', estado: 'Confirmada'  },
  { tipo: 'evento-nuevo',       descripcion: 'Festival de Música Urbana registrado por Carlos Martínez',        usuario: 'Carlos Martínez', fecha: '1 Ago 2026, 01:20',  estado: 'Programado'  },
  { tipo: 'reserva-nueva',      descripcion: 'Juan Ospina reservó 2 entradas para Lima Music Week',             usuario: 'Juan Ospina',     fecha: '3 Sep 2026, 09:05',  estado: 'Confirmada'  },
]

const COP = (v: number) => '$ ' + v.toLocaleString('es-CO')

// ─── Icons ────────────────────────────────────────────────────────────────────

const ITicket    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
const ILogOut    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
const IRefresh   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
const IChev      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
const IEye       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
const IX         = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
const IChevLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
const IChevRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
const ITrendDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>
const IDollar    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
const ICalendar  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
const ISlash     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" x2="19.07" y1="4.93" y2="19.07" /></svg>
const IActivity  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV: { key: AdminNavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard',            label: 'Dashboard',            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'reportes-generales',   label: 'Reportes generales',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
  { key: 'reportes-comerciales', label: 'Reportes comerciales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { key: 'cobertura',            label: 'Cobertura y eventos',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { key: 'reservas-operacion',   label: 'Reservas y operación', icon: <IActivity /> },
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
          <span className="text-xl tracking-tight text-gray-900" style={{ fontWeight: 800 }}>Event<span style={{ color: '#4f46e5' }}>Nova</span></span>
        </div>
        <div className="mt-2.5 inline-flex text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
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
              <span className={active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>{item.label}
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

// ─── Status badges ────────────────────────────────────────────────────────────

const RES_STATUS: Record<ResStatus, { bg: string; color: string }> = {
  Pendiente:  { bg: '#fffbeb', color: '#d97706' },
  Confirmada: { bg: '#ecfdf5', color: '#059669' },
  Cancelada:  { bg: '#fef2f2', color: '#dc2626' },
}

function ResBadge({ estado }: { estado: ResStatus }) {
  const s = RES_STATUS[estado]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />{estado}
    </span>
  )
}

const ACT_STYLE: Record<ActType, { bg: string; color: string; label: string }> = {
  'reserva-nueva':      { bg: '#eef2ff', color: '#4f46e5', label: 'Nueva reserva'    },
  'reserva-confirmada': { bg: '#ecfdf5', color: '#059669', label: 'Confirmación'      },
  'reserva-cancelada':  { bg: '#fef2f2', color: '#dc2626', label: 'Reserva cancelada' },
  'evento-cancelado':   { bg: '#fff7f5', color: '#f4845f', label: 'Evento cancelado'  },
  'evento-nuevo':       { bg: '#f5f3ff', color: '#7c3aed', label: 'Nuevo evento'      },
}

const ACT_STATUS: Record<string, { bg: string; text: string }> = {
  Confirmada:  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Pendiente:   { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  Cancelada:   { bg: 'bg-red-50',     text: 'text-red-600'     },
  Cancelado:   { bg: 'bg-red-50',     text: 'text-red-600'     },
  Programado:  { bg: 'bg-indigo-50',  text: 'text-indigo-700'  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 7

function usePager<T>(items: T[]) {
  const [page, setPage] = useState(1)
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safe  = Math.min(page, total)
  const slice = items.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)
  return { page: safe, setPage, totalPages: total, slice }
}

function Pager({ page, total, setPage, count }: { page: number; total: number; setPage: (p: number) => void; count: number }) {
  return (
    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xs text-gray-400">{count} registro{count !== 1 ? 's' : ''}</span>
      <div className="flex items-center gap-1">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <IChevLeft />
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setPage(n)}
            className="w-8 h-8 rounded-lg text-xs transition-colors"
            style={n === page ? { background: '#4f46e5', color: '#fff', fontWeight: 700 } : { color: '#6b7280', fontWeight: 500 }}>
            {n}
          </button>
        ))}
        <button disabled={page === total} onClick={() => setPage(page + 1)}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <IChevRight />
        </button>
      </div>
    </div>
  )
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
        style={{ fontWeight: 500 }}>
        {children}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
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

function Th({ ch }: { ch: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{ch}</th>
  )
}

function KpiCard({ icon, label, value, sub, color, bg, down }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string; bg: string; down?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>{icon}</div>
      <div>
        <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{value}</p>
        <p className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        {down !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
            style={{ background: down ? '#fef2f2' : '#ecfdf5', color: down ? '#dc2626' : '#059669' }}>
            {down && <ITrendDown />}{down ? 'Requiere atención' : 'Normal'}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Reservation modal ────────────────────────────────────────────────────────

function ResModal({ r, onClose }: { r: Reserva; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Detalle de reserva</h3>
            <ResBadge estado={r.estado} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 ml-4 shrink-0 transition-colors"><IX /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: 'Cliente',          v: r.cliente         },
              { l: 'Correo',           v: r.correo          },
              { l: 'Evento',           v: r.evento          },
              { l: 'Agente',           v: r.agente          },
              { l: 'Fecha de reserva', v: r.fechaReserva    },
              { l: 'Fecha del evento', v: r.fechaEvento     },
              { l: 'Hora del evento',  v: r.hora            },
              { l: 'Ciudad',           v: r.ciudad          },
            ].map(({ l, v }) => (
              <div key={l} className="bg-gray-50 rounded-xl px-3.5 py-2.5">
                <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{l}</p>
                <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: 'Entradas', v: r.entradas.toString(), color: '#4f46e5', bg: '#eef2ff' },
              { l: 'Valor total', v: COP(r.valor),       color: '#059669', bg: '#ecfdf5' },
            ].map(({ l, v, color, bg }) => (
              <div key={l} className="rounded-xl px-4 py-3 text-center" style={{ background: bg }}>
                <p className="text-xs mb-0.5" style={{ color, fontWeight: 500 }}>{l}</p>
                <p className="text-xl" style={{ color, fontWeight: 800 }}>{v}</p>
              </div>
            ))}
          </div>
          {r.estado === 'Cancelada' && (
            <div className="rounded-xl p-4 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
              <p className="text-xs mb-1" style={{ color: '#dc2626', fontWeight: 600 }}>Causa de cancelación</p>
              <p className="text-sm" style={{ color: '#991b1b' }}>{r.causaCancelacion}</p>
              {r.fechaCancelacion && <p className="text-xs text-red-400 mt-1">Cancelada el {r.fechaCancelacion}</p>}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-colors"
            style={{ background: '#4f46e5', fontWeight: 600 }}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Event cancellation modal ─────────────────────────────────────────────────

function EvModal({ ev, onClose }: { ev: Evento; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Evento cancelado</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Cancelado
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 ml-4 shrink-0 transition-colors"><IX /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="bg-indigo-50 rounded-xl px-4 py-3">
            <p className="text-xs text-indigo-400" style={{ fontWeight: 500 }}>Nombre del evento</p>
            <p className="text-sm text-indigo-900 mt-0.5" style={{ fontWeight: 700 }}>{ev.nombre}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: 'Agente',             v: ev.agente              },
              { l: 'País',               v: ev.pais                },
              { l: 'Departamento',       v: ev.departamento        },
              { l: 'Ciudad',             v: ev.ciudad              },
              { l: 'Fecha del evento',   v: ev.fechaEvento         },
              { l: 'Hora',               v: ev.hora                },
              { l: 'Fecha cancelación',  v: ev.fechaCancelacion    },
            ].map(({ l, v }) => (
              <div key={l} className="bg-gray-50 rounded-xl px-3.5 py-2.5">
                <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{l}</p>
                <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: 'Capacidad',          v: ev.capacidad.toLocaleString('es-CO'),          color: '#4f46e5', bg: '#eef2ff' },
              { l: 'Reservas afectadas', v: ev.reservasAfectadas.toLocaleString('es-CO'),  color: '#dc2626', bg: '#fef2f2' },
            ].map(({ l, v, color, bg }) => (
              <div key={l} className="rounded-xl px-4 py-3 text-center" style={{ background: bg }}>
                <p className="text-xs mb-0.5" style={{ color, fontWeight: 500 }}>{l}</p>
                <p className="text-2xl" style={{ color, fontWeight: 800 }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <p className="text-xs mb-1" style={{ color: '#dc2626', fontWeight: 600 }}>Causa de cancelación</p>
            <p className="text-sm" style={{ color: '#991b1b' }}>{ev.causa}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-colors"
            style={{ background: '#4f46e5', fontWeight: 600 }}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Chart tooltips ───────────────────────────────────────────────────────────

function PieTip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-900" style={{ fontWeight: 700 }}>{payload[0].name}</p>
      <p className="text-gray-500 mt-0.5">{payload[0].value} cancelación{payload[0].value !== 1 ? 'es' : ''}</p>
    </div>
  )
}

const PIE_COLORS = ['#4f46e5','#f4845f','#d97706','#dc2626','#6b7280']

// ─── Donut label ──────────────────────────────────────────────────────────────

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
}) {
  if (percent < 0.06) return null
  const R = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  return (
    <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── Aggregations ─────────────────────────────────────────────────────────────

function countCausa(items: { causaCancelacion?: string }[]) {
  const map: Record<string, number> = {}
  for (const r of items) {
    const k = r.causaCancelacion?.split(' —')[0] ?? 'Otro'
    map[k] = (map[k] ?? 0) + 1
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

function countCausaEv(items: { causa: string }[]) {
  const map: Record<string, number> = {}
  for (const e of items) map[e.causa] = (map[e.causa] ?? 0) + 1
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminOperations({ onLogout, onNavigate, activeNav }: Props) {
  const [period,  setPeriod]  = useState('2026')
  const [refresh, setRefresh] = useState(false)

  // Global filters
  const [fEvento,  setFEvento]  = useState('Todos')
  const [fAgente,  setFAgente]  = useState('Todos')
  const [fResEst,  setFResEst]  = useState('Todos')
  const [fPais,    setFPais]    = useState('Todos')
  const [fCiudad,  setFCiudad]  = useState('Todos')
  const [fCausa,   setFCausa]   = useState('Todos')

  // Applied
  const [aEvento,  setAEvento]  = useState('Todos')
  const [aAgente,  setAAgente]  = useState('Todos')
  const [aResEst,  setAResEst]  = useState('Todos')
  const [aPais,    setAPais]    = useState('Todos')
  const [aCiudad,  setACiudad]  = useState('Todos')
  const [aCausa,   setACausa]   = useState('Todos')

  const [resModal, setResModal] = useState<Reserva | null>(null)
  const [evModal,  setEvModal]  = useState<Evento  | null>(null)

  const apply = () => {
    setAEvento(fEvento); setAAgente(fAgente)
    setAResEst(fResEst);   setAPais(fPais);     setACiudad(fCiudad)
    setACausa(fCausa)
  }
  const clear = () => {
    setFEvento('Todos'); setFAgente('Todos')
    setFResEst('Todos'); setFPais('Todos'); setFCiudad('Todos'); setFCausa('Todos')
    setAEvento('Todos'); setAAgente('Todos')
    setAResEst('Todos'); setAPais('Todos'); setACiudad('Todos'); setACausa('Todos')
  }
  const hasFilters = aEvento !== 'Todos' || aAgente !== 'Todos' || aResEst !== 'Todos' || aPais !== 'Todos' || aCiudad !== 'Todos'

  // Filtered reservations
  const filtRes = useMemo(() => RESERVAS.filter(r =>
    (aEvento  === 'Todos' || r.evento  === aEvento)  &&
    (aAgente  === 'Todos' || r.agente  === aAgente)  &&
    (aResEst  === 'Todos' || r.estado  === aResEst)  &&
    (aPais    === 'Todos' || r.pais    === aPais)     &&
    (aCiudad  === 'Todos' || r.ciudad  === aCiudad)
  ), [aEvento, aAgente, aResEst, aPais, aCiudad])

  const cancelledRes = filtRes.filter(r => r.estado === 'Cancelada')
  const cancelledEv  = CANCELLED_EVENTS

  // Pagers
  const pagerCanRes  = usePager(cancelledRes)

  // Summary stats
  const totalRes     = RESERVAS.length
  const confirmedRes = RESERVAS.filter(r => r.estado === 'Confirmada').length
  const pendingRes   = RESERVAS.filter(r => r.estado === 'Pendiente').length
  const cancelledCount = RESERVAS.filter(r => r.estado === 'Cancelada').length
  const totalEvAll   = 16 // from previous screens
  const activeEv     = 8
  const finishedEv   = 4

  const causesRes = countCausa(RESERVAS.filter(r => r.estado === 'Cancelada'))
  const causesEv  = countCausaEv(CANCELLED_EVENTS)
  const totalValCancelled = cancelledRes.reduce((s, r) => s + r.valor, 0)
  const topCausaRes = causesRes[0]?.[0] ?? '—'
  const topCausaEv  = causesEv[0]?.[0] ?? '—'
  const resAfected  = CANCELLED_EVENTS.reduce((s, e) => s + e.reservasAfectadas, 0)

  const resumeBarData = [
    { name: 'Confirmadas', value: confirmedRes, fill: '#059669' },
    { name: 'Pendientes',  value: pendingRes,   fill: '#d97706' },
    { name: 'Canceladas',  value: cancelledCount, fill: '#dc2626' },
  ]

  const eventos  = [...new Set(RESERVAS.map(r => r.evento))]
  const agentes  = [...new Set(RESERVAS.map(r => r.agente))]
  const paises   = [...new Set(RESERVAS.map(r => r.pais))]
  const ciudades = [...new Set(RESERVAS.map(r => r.ciudad))]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <Sidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Reservas y operación</h1>
            <p className="text-sm text-gray-400 mt-0.5">Consulta el historial de reservas y los eventos y reservas cancelados.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="relative">
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                style={{ fontWeight: 600 }}>
                <option>2026</option><option>Todo el período</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
            </div>
            <button onClick={() => { setRefresh(true); setTimeout(() => setRefresh(false), 800) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              style={{ fontWeight: 500 }}>
              <span className={refresh ? 'animate-spin' : ''}><IRefresh /></span>Actualizar
            </button>
          </div>
        </div>

        {/* ── Filters bar ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex flex-wrap items-end gap-3">
          {[
            { label: 'Evento',  value: fEvento,  set: setFEvento,  opts: eventos  },
            { label: 'Agente',  value: fAgente,  set: setFAgente,  opts: agentes  },
            { label: 'Estado reserva', value: fResEst, set: setFResEst, opts: ['Pendiente','Confirmada','Cancelada'] },
            { label: 'País',    value: fPais,    set: setFPais,    opts: paises   },
            { label: 'Ciudad',  value: fCiudad,  set: setFCiudad,  opts: ciudades },
          ].map(({ label, value, set, opts }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</label>
              <Sel value={value} onChange={set}>
                <option>Todos</option>
                {opts.map(o => <option key={o}>{o}</option>)}
              </Sel>
            </div>
          ))}
          <div className="flex items-center gap-2 pb-0.5">
            <button onClick={apply} className="px-4 py-1.5 rounded-lg text-xs text-white hover:opacity-90 transition-colors"
              style={{ background: '#4f46e5', fontWeight: 600 }}>Aplicar</button>
            {hasFilters && (
              <button onClick={clear} className="px-3 py-1.5 rounded-lg text-xs border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                style={{ fontWeight: 500 }}>Limpiar</button>
            )}
          </div>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── Sec 2: Cancelled reservations ── */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Reservas canceladas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Análisis de reservas con estado cancelado y sus causas</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={<ISlash />}    label="Reservas canceladas"           value={cancelledCount.toString()}      color="#dc2626" bg="#fef2f2" down />
              <KpiCard icon={<IActivity />} label="Porcentaje canceladas"          value={`${((cancelledCount/totalRes)*100).toFixed(1)}%`} color="#d97706" bg="#fffbeb" />
              <KpiCard icon={<IDollar />}   label="Valor cancelaciones"            value={COP(totalValCancelled)}         color="#4f46e5" bg="#eef2ff" />
              <KpiCard icon={<ICalendar />} label="Causa más frecuente"            value={topCausaRes}                    color="#7c3aed" bg="#f5f3ff" sub="Reservas canceladas" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <SecHead title="Listado de reservas canceladas" subtitle={`${cancelledRes.length} reserva${cancelledRes.length !== 1 ? 's' : ''} cancelada${cancelledRes.length !== 1 ? 's' : ''}`} />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr style={{ background: '#fafafa' }}>
                    {['Cliente','Evento','Fecha reserva','Entradas','Valor total','Fecha cancelación','Causa','Agente',''].map(h => <Th key={h + Math.random()} ch={h} />)}
                  </tr></thead>
                  <tbody>
                    {pagerCanRes.slice.length === 0
                      ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Sin reservas canceladas.</td></tr>
                      : pagerCanRes.slice.map((r, i) => (
                        <tr key={i} className="border-t border-gray-50 hover:bg-red-50/20 transition-colors">
                          <td className="px-4 py-3.5 text-sm text-gray-900 whitespace-nowrap" style={{ fontWeight: 600 }}>{r.cliente}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-700 max-w-xs"><span className="line-clamp-1">{r.evento}</span></td>
                          <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{r.fechaReserva}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-900 text-center" style={{ fontWeight: 700 }}>{r.entradas}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-900 whitespace-nowrap" style={{ fontWeight: 700 }}>{COP(r.valor)}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{r.fechaCancelacion}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block text-xs px-2.5 py-1 rounded-full max-w-40 truncate" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 600 }} title={r.causaCancelacion?.split(' —')[0]}>
                              {r.causaCancelacion?.split(' —')[0]}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.agente}</td>
                          <td className="px-4 py-3.5">
                            <button onClick={() => setResModal(r)}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors whitespace-nowrap"
                              style={{ fontWeight: 500 }}><IEye />Ver detalle</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <Pager page={pagerCanRes.page} total={pagerCanRes.totalPages} setPage={pagerCanRes.setPage} count={cancelledRes.length} />
            </div>
          </div>

          {/* ── Sec 3: Causes chart for cancelled reservations ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SecHead title="Causas de reservas canceladas" subtitle="Distribución de cancelaciones de reservas por causa" />
            <div className="px-6 py-5 grid lg:grid-cols-2 gap-8 items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={causesRes.map(([name, value]) => ({ name, value }))} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value"
                    labelLine={false} label={PieLabel as unknown as boolean}>
                    {causesRes.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<PieTip />} />
                  <Legend iconType="circle" iconSize={10} formatter={v => <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {causesRes.map(([causa, count], i) => (
                  <div key={causa} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-sm text-gray-700 truncate" style={{ fontWeight: 500 }}>{causa}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / cancelledCount) * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                      <span className="text-sm text-gray-900 w-6 text-right" style={{ fontWeight: 700 }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sec 4: Cancelled events ── */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Eventos cancelados</h2>
              <p className="text-xs text-gray-400 mt-0.5">Análisis de eventos cancelados y su impacto en reservas</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={<ISlash />}    label="Eventos cancelados"    value={cancelledEv.length.toString()}                        color="#dc2626" bg="#fef2f2" down />
              <KpiCard icon={<IActivity />} label="% eventos cancelados"  value={`${((cancelledEv.length / totalEvAll) * 100).toFixed(1)}%`} color="#d97706" bg="#fffbeb" />
              <KpiCard icon={<ITicket />}   label="Reservas afectadas"    value={resAfected.toLocaleString('es-CO')}                   color="#4f46e5" bg="#eef2ff" />
              <KpiCard icon={<ICalendar />} label="Causa más frecuente"   value={topCausaEv}                                           color="#7c3aed" bg="#f5f3ff" sub="Eventos cancelados" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <SecHead title="Listado de eventos cancelados" subtitle={`${cancelledEv.length} evento${cancelledEv.length !== 1 ? 's' : ''} cancelado${cancelledEv.length !== 1 ? 's' : ''}`} />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr style={{ background: '#fafafa' }}>
                    {['Evento','Agente','País','Ciudad','Fecha evento','Reservas afect.','Fecha cancelación','Causa',''].map(h => <Th key={h + Math.random()} ch={h} />)}
                  </tr></thead>
                  <tbody>
                    {cancelledEv.map((ev, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-red-50/20 transition-colors">
                        <td className="px-4 py-3.5 text-sm text-gray-900 whitespace-nowrap" style={{ fontWeight: 600 }}>{ev.nombre}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{ev.agente}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{ev.pais}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{ev.ciudad}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{ev.fechaEvento}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block text-sm px-2 py-0.5 rounded-md" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>{ev.reservasAfectadas}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{ev.fechaCancelacion}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block text-xs px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 600 }}>{ev.causa}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => setEvModal(ev)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors whitespace-nowrap"
                            style={{ fontWeight: 500 }}><IEye />Ver detalle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-gray-100 flex justify-between">
                <span className="text-xs text-gray-400">{cancelledEv.length} eventos cancelados</span>
              </div>
            </div>
          </div>

          {/* ── Sec 5: Causes of cancelled events ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SecHead title="Causas de eventos cancelados" subtitle="Distribución de cancelaciones de eventos por causa" />
            <div className="px-6 py-5">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={causesEv.map(([name, value]) => ({ name, value }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip formatter={(v: number) => [v, 'Eventos']} contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {causesEv.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Sec 6: Operational summary ── */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Resumen operativo</h2>
              <p className="text-xs text-gray-400 mt-0.5">Indicadores generales de reservas y eventos en {period}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total reservas',       value: totalRes.toString(),          color: '#4f46e5', bg: '#eef2ff' },
                { label: 'Reservas confirmadas', value: confirmedRes.toString(),       color: '#059669', bg: '#ecfdf5' },
                { label: 'Reservas pendientes',  value: pendingRes.toString(),         color: '#d97706', bg: '#fffbeb' },
                { label: 'Reservas canceladas',  value: cancelledCount.toString(),     color: '#dc2626', bg: '#fef2f2' },
                { label: 'Total eventos',        value: totalEvAll.toString(),         color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'Eventos activos',      value: activeEv.toString(),           color: '#4f46e5', bg: '#eef2ff' },
                { label: 'Eventos finalizados',  value: finishedEv.toString(),         color: '#6b7280', bg: '#f3f4f6' },
                { label: 'Eventos cancelados',   value: cancelledEv.length.toString(), color: '#dc2626', bg: '#fef2f2' },
              ].map((k, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: k.bg }}>
                    <span className="w-4 h-4 rounded-full" style={{ background: k.color }} />
                  </div>
                  <div>
                    <p className="text-xl text-gray-900" style={{ fontWeight: 800, color: k.color }}>{k.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5" style={{ fontWeight: 500 }}>{k.label}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Comparison chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Comparativa de reservas por estado</h3>
              </div>
              <div className="px-6 py-5">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={resumeBarData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip formatter={(v: number, name: string) => [v, name]} contentStyle={{ border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 13 }} />
                    <Bar dataKey="value" name="Reservas" radius={[5, 5, 0, 0]}>
                      {resumeBarData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Sec 7: Recent activity ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SecHead title="Actividad reciente" subtitle="Últimas operaciones relacionadas con reservas y eventos" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['Tipo','Descripción','Usuario','Fecha','Estado'].map(h => <Th key={h} ch={h} />)}
                </tr></thead>
                <tbody>
                  {ACTIVITY.map((a, i) => {
                    const s = ACT_STYLE[a.tipo]
                    const badge = ACT_STATUS[a.estado] ?? { bg: 'bg-gray-100', text: 'text-gray-500' }
                    return (
                      <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ background: s.bg, color: s.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />{s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 max-w-sm">{a.descripcion}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap" style={{ fontWeight: 500 }}>{a.usuario}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{a.fecha}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />{a.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{ACTIVITY.length} operaciones recientes</span>
            </div>
          </div>

          <div className="h-2" />
        </div>
      </main>

      {resModal && <ResModal r={resModal} onClose={() => setResModal(null)} />}
      {evModal  && <EvModal ev={evModal}  onClose={() => setEvModal(null)}  />}
    </div>
  )
}
