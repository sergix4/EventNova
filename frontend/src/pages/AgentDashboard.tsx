import { useState } from 'react'
import { AGENT_CARLOS_EVENTS, SHARED_RATINGS } from '../sharedData'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}

function IconCalendarDays() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  )
}

function IconAlertTriangle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
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

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentNavKey = 'mis-eventos' | 'registrar-evento' | 'reservas' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AgentNavKey) => void
  activeNav: AgentNavKey
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type EventStatus = 'Programado' | 'En boletería' | 'En vivo' | 'Finalizado' | 'Cancelado'

interface AgentEvent {
  id: number
  name: string
  city: string
  date: string
  capacity: number
  price: string
  reservations: number
  status: EventStatus
}

const AGENT_EVENTS: AgentEvent[] = AGENT_CARLOS_EVENTS.map((e, i) => ({
  id: i + 1,
  name: e.nombre,
  city: e.ciudad,
  date: e.fecha.replace(/^(\d+) (\w+) (\d+)$/, (_, d, m, y) =>
    `${d} ${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`),
  capacity: e.capacidad,
  price: e.precioStr,
  reservations: e.reservas,
  status: e.estado as EventStatus,
}))

const CITIES = ['Todas las ciudades', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Manizales']
const STATUSES: ('Todos' | EventStatus)[] = ['Todos', 'Programado', 'En boletería', 'En vivo', 'Finalizado', 'Cancelado']
const PAGE_SIZE = 6

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: EventStatus) {
  const map: Record<EventStatus, { bg: string; text: string; dot: string }> = {
    'Programado':   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
    'En boletería': { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
    'En vivo':      { bg: 'bg-emerald-50',text: 'text-emerald-700',dot: 'bg-emerald-500' },
    'Finalizado':   { bg: 'bg-gray-100',  text: 'text-gray-500',   dot: 'bg-gray-400' },
    'Cancelado':    { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400' },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'En vivo' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

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
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

function StarDisplay({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(value) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(value) ? '#f59e0b' : '#e5e7eb'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

// ─── Edit form types & helpers ────────────────────────────────────────────────

type EditFormFields = {
  name: string
  description: string
  category: string
  country: string
  department: string
  city: string
  address: string
  date: string
  time: string
  capacity: string
  price: string
  additionalInfo: string
  status: string
}

const MONTH_MAP: Record<string, string> = {
  ene:'01',feb:'02',mar:'03',abr:'04',may:'05',jun:'06',
  jul:'07',ago:'08',sep:'09',oct:'10',nov:'11',dic:'12',
  enero:'01',febrero:'02',marzo:'03',abril:'04',mayo:'05',junio:'06',
  julio:'07',agosto:'08',septiembre:'09',octubre:'10',noviembre:'11',diciembre:'12',
}

function parseEventDate(dateStr: string): string {
  const parts = dateStr.toLowerCase().trim().split(/\s+/)
  if (parts.length < 3) return ''
  const [d, m, y] = parts
  const month = MONTH_MAP[m] ?? '01'
  return `${y}-${month}-${d.padStart(2, '0')}`
}

const EDIT_COUNTRIES = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador']

const EDIT_DEPARTMENTS: Record<string, string[]> = {
  Colombia: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Caldas', 'Cundinamarca', 'Santander'],
  México: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
  Argentina: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza'],
  Chile: ['Región Metropolitana', 'Valparaíso', 'Biobío'],
  Perú: ['Lima', 'Arequipa', 'Cusco'],
  Ecuador: ['Pichincha', 'Guayas', 'Azuay'],
}

const EDIT_CITIES: Record<string, string[]> = {
  'Bogotá D.C.': ['Bogotá'],
  Antioquia: ['Medellín', 'Envigado', 'Bello', 'Itagüí'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
  Atlántico: ['Barranquilla', 'Soledad'],
  Caldas: ['Manizales', 'Chinchiná'],
  Cundinamarca: ['Chía', 'Zipaquirá', 'Bogotá'],
  Santander: ['Bucaramanga', 'Floridablanca'],
  'Ciudad de México': ['Ciudad de México'],
  Jalisco: ['Guadalajara', 'Zapopan'],
  'Nuevo León': ['Monterrey', 'San Nicolás'],
  Puebla: ['Puebla de Zaragoza'],
  'Buenos Aires': ['Buenos Aires', 'Mar del Plata'],
  Córdoba: ['Córdoba'],
  'Santa Fe': ['Rosario', 'Santa Fe'],
  Mendoza: ['Mendoza'],
  'Región Metropolitana': ['Santiago'],
  Valparaíso: ['Valparaíso', 'Viña del Mar'],
  Biobío: ['Concepción'],
  Lima: ['Lima'],
  Arequipa: ['Arequipa'],
  Cusco: ['Cusco'],
  Pichincha: ['Quito'],
  Guayas: ['Guayaquil'],
  Azuay: ['Cuenca'],
}

const EDIT_STATUSES = ['Programado', 'En boletería', 'En vivo', 'Finalizado', 'Cancelado']
const EDIT_CATEGORIES = ['Concierto', 'Festival', 'Teatro', 'Deporte', 'Comedia', 'Conferencia', 'Exposición', 'Otro']

const editInputClass = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
const editSelectClass = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none transition-all bg-white text-gray-800 appearance-none cursor-pointer focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'

function EditLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function EditChevron() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
    </span>
  )
}

// ─── Edit Event View ──────────────────────────────────────────────────────────

interface EditEventViewProps {
  event: AgentEvent
  onCancel: () => void
  onSave: (updated: AgentEvent) => void
  activeNav: AgentNavKey
  onNavigate: (key: AgentNavKey) => void
  onLogout: () => void
}

function EditEventView({ event, onCancel, onSave, activeNav, onNavigate, onLogout }: EditEventViewProps) {
  const sharedEv = AGENT_CARLOS_EVENTS.find(e => e.nombre === event.name)

  const [form, setForm] = useState<EditFormFields>({
    name:           event.name,
    description:    sharedEv?.descripcion ?? '',
    category:       sharedEv?.categoria ?? '',
    country:        sharedEv?.pais ?? 'Colombia',
    department:     sharedEv?.departamento ?? '',
    city:           event.city,
    address:        sharedEv?.direccion ?? '',
    date:           parseEventDate(sharedEv?.fecha ?? ''),
    time:           sharedEv?.hora ?? '',
    capacity:       String(event.capacity),
    price:          event.price,
    additionalInfo: '',
    status:         event.status,
  })

  const [saved, setSaved] = useState(false)

  const set = (field: keyof EditFormFields, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'country') { next.department = ''; next.city = '' }
      if (field === 'department') { next.city = '' }
      return next
    })
  }

  const formatPrice = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    return '$ ' + Number(digits).toLocaleString('es-CO')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedEvent: AgentEvent = {
      ...event,
      name:     form.name,
      city:     form.city,
      capacity: Number(form.capacity) || event.capacity,
      price:    form.price,
      status:   form.status as EventStatus,
      date:     form.date
        ? new Date(form.date + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
        : event.date,
    }
    setSaved(true)
    setTimeout(() => {
      onSave(updatedEvent)
    }, 1600)
  }

  const departments = form.country ? (EDIT_DEPARTMENTS[form.country] ?? []) : []
  const cities = form.department ? (EDIT_CITIES[form.department] ?? []) : []

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AgentSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Editar evento</h1>
          <p className="text-sm text-gray-400 mt-0.5">Modifica la información del evento seleccionado.</p>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm"
            style={{ background: '#059669', fontWeight: 600 }}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            Evento actualizado correctamente.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-8 py-7 flex flex-col gap-6 max-w-3xl">

            {/* Sección 1: Información */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>1</span>
                  Información del evento
                </h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-5">
                <div>
                  <EditLabel required>Nombre del evento</EditLabel>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className={editInputClass} required />
                </div>
                <div>
                  <EditLabel>Descripción</EditLabel>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                    placeholder="Describe el evento…" className={editInputClass + ' resize-none leading-relaxed'} />
                </div>
                <div>
                  <EditLabel>Categoría</EditLabel>
                  <div className="relative">
                    <select value={form.category} onChange={e => set('category', e.target.value)} className={editSelectClass}>
                      <option value="">Seleccionar categoría</option>
                      {EDIT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <EditChevron />
                  </div>
                </div>
                <div>
                  <EditLabel>Información adicional</EditLabel>
                  <textarea value={form.additionalInfo} onChange={e => set('additionalInfo', e.target.value)} rows={2}
                    placeholder="Indicaciones especiales, requisitos, restricciones…" className={editInputClass + ' resize-none leading-relaxed'} />
                </div>
              </div>
            </section>

            {/* Sección 2: Ubicación */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>2</span>
                  Ubicación
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <EditLabel required>País</EditLabel>
                  <div className="relative">
                    <select value={form.country} onChange={e => set('country', e.target.value)} className={editSelectClass}>
                      <option value="">Seleccionar país</option>
                      {EDIT_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <EditChevron />
                  </div>
                </div>
                <div>
                  <EditLabel required>Departamento / Estado</EditLabel>
                  <div className="relative">
                    <select value={form.department} onChange={e => set('department', e.target.value)}
                      disabled={!form.country} className={editSelectClass + (!form.country ? ' opacity-50 cursor-not-allowed' : '')}>
                      <option value="">Seleccionar departamento</option>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <EditChevron />
                  </div>
                </div>
                <div>
                  <EditLabel required>Ciudad</EditLabel>
                  <div className="relative">
                    <select value={form.city} onChange={e => set('city', e.target.value)}
                      disabled={!form.department} className={editSelectClass + (!form.department ? ' opacity-50 cursor-not-allowed' : '')}>
                      <option value="">Seleccionar ciudad</option>
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <EditChevron />
                  </div>
                </div>
                <div>
                  <EditLabel>Lugar / Dirección</EditLabel>
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="Ej. Parque Norte, Cl. 73 #52-36" className={editInputClass} />
                </div>
              </div>
            </section>

            {/* Sección 3: Fecha y hora */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>3</span>
                  Fecha y hora
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <EditLabel required>Fecha del evento</EditLabel>
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={editInputClass} />
                </div>
                <div>
                  <EditLabel>Hora del evento</EditLabel>
                  <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={editInputClass} />
                </div>
              </div>
            </section>

            {/* Sección 4: Capacidad y precio */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>4</span>
                  Capacidad y precio
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <EditLabel required>Capacidad</EditLabel>
                  <input type="number" min={1} value={form.capacity} onChange={e => set('capacity', e.target.value)} className={editInputClass} />
                  <p className="text-xs text-gray-400 mt-1">Número máximo de asistentes.</p>
                </div>
                <div>
                  <EditLabel required>Precio por entrada</EditLabel>
                  <input type="text" value={form.price} onChange={e => set('price', formatPrice(e.target.value))} className={editInputClass} />
                  <p className="text-xs text-gray-400 mt-1">En pesos colombianos (COP).</p>
                </div>
              </div>
            </section>

            {/* Sección 5: Estado */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>5</span>
                  Estado del evento
                </h2>
              </div>
              <div className="px-6 py-5">
                <EditLabel>Estado</EditLabel>
                <div className="flex flex-wrap gap-2.5 mt-1">
                  {EDIT_STATUSES.map(s => {
                    const isSelected = form.status === s
                    const colors: Record<string, { activeBg: string; activeText: string }> = {
                      'Programado':   { activeBg: '#eef2ff',  activeText: '#4f46e5' },
                      'En boletería': { activeBg: '#fffbeb',  activeText: '#d97706' },
                      'En vivo':      { activeBg: '#ecfdf5',  activeText: '#059669' },
                      'Finalizado':   { activeBg: '#f3f4f6',  activeText: '#374151' },
                      'Cancelado':    { activeBg: '#fef2f2',  activeText: '#dc2626' },
                    }
                    const c = colors[s]
                    return (
                      <button key={s} type="button" onClick={() => set('status', s)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 transition-all"
                        style={isSelected
                          ? { background: c.activeBg, color: c.activeText, borderColor: c.activeText, fontWeight: 700 }
                          : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280', fontWeight: 500 }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: isSelected ? c.activeText : '#d1d5db' }} />
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button type="button" onClick={onCancel}
                className="px-6 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}>
                Cancelar
              </button>
              <button type="submit"
                className="px-7 py-2.5 text-sm text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: '#f4845f', fontWeight: 600 }}>
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

function AgentSidebar({ activeNav, onNavigate, onLogout }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={isActive ? { background: '#4f46e5', fontWeight: 600 } : { fontWeight: 500 }}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Agent profile */}
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

// ─── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({ eventName, onCancel, onConfirm }: { eventName: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <IconAlertTriangle />
          </div>
          <div>
            <h3 className="text-base text-gray-900 mb-1" style={{ fontWeight: 700 }}>Eliminar evento</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro de que deseas eliminar <span className="font-semibold text-gray-700">"{eventName}"</span>?
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
            style={{ background: '#dc2626', fontWeight: 600 }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────

function EventDetailModal({ event, onClose }: { event: AgentEvent; onClose: () => void }) {
  const sharedEv = AGENT_CARLOS_EVENTS.find(e => e.nombre === event.name)
  const evId = sharedEv?.id ?? ''
  const ratings = SHARED_RATINGS.filter(r => r.eventoId === evId)
  const total = ratings.length
  const avg = total > 0 ? ratings.reduce((s, r) => s + r.estrellas, 0) / total : 0
  const dist = [5,4,3,2,1].map(s => ({ stars: s, count: ratings.filter(r => r.estrellas === s).length }))
  const commentsWithText = ratings.filter(r => r.comentario)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,30,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.22s ease' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Detalle del evento</h3>
            <p className="text-xs text-gray-400 mt-0.5">{event.name}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Event info */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Ciudad', value: event.city },
              { label: 'Fecha', value: event.date },
              { label: 'Capacidad', value: event.capacity.toLocaleString('es-CO') },
              { label: 'Precio', value: event.price },
              { label: 'Reservas', value: event.reservations.toLocaleString('es-CO') },
              { label: 'Estado', value: event.status },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5" style={{ fontWeight: 500 }}>{label}</p>
                <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings section */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <h4 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Calificaciones de clientes</h4>
          </div>

          {total === 0 ? (
            <div className="text-center py-8 rounded-xl" style={{ background: '#f8f9fc' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              <p className="text-sm text-gray-400" style={{ fontWeight: 500 }}>Este evento aún no tiene calificaciones</p>
              <p className="text-xs text-gray-300 mt-0.5">Las calificaciones aparecerán una vez finalice el evento.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Summary */}
              <div className="flex items-center gap-6 p-4 rounded-xl" style={{ background: '#fffbeb' }}>
                <div className="text-center">
                  <p className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{avg.toFixed(1)}</p>
                  <StarDisplay value={avg} size={16} />
                  <p className="text-xs text-gray-500 mt-1">{total} calificacion{total !== 1 ? 'es' : ''}</p>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  {dist.map(({ stars, count }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-4 text-right" style={{ fontWeight: 500 }}>{stars}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                        <div className="h-full rounded-full" style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%', background: '#f59e0b', transition: 'width 0.3s ease' }} />
                      </div>
                      <span className="text-xs text-gray-400 w-3" style={{ fontWeight: 500 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              {commentsWithText.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2.5" style={{ fontWeight: 600 }}>Comentarios</p>
                  <div className="flex flex-col gap-2.5">
                    {commentsWithText.map(r => (
                      <div key={r.id} className="rounded-xl p-3 border border-gray-100" style={{ background: '#fafafa' }}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#4f46e5', fontWeight: 700 }}>
                              {r.clienteNombre.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>{r.clienteNombre}</span>
                          </div>
                          <StarDisplay value={r.estrellas} size={11} />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed ml-8">{r.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function AgentDashboard({ onLogout, onNavigate, activeNav }: Props) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('Todas las ciudades')
  const [statusFilter, setStatusFilter] = useState<'Todos' | EventStatus>('Todos')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<AgentEvent | null>(null)
  const [events, setEvents] = useState<AgentEvent[]>(AGENT_EVENTS)
  const [detailEvent, setDetailEvent] = useState<AgentEvent | null>(null)
  const [editTarget, setEditTarget] = useState<AgentEvent | null>(null)
  const [editSuccessMsg, setEditSuccessMsg] = useState(false)

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalRegistered = events.length
  const totalActive = events.filter(e => e.status === 'Programado' || e.status === 'En boletería' || e.status === 'En vivo').length
  const totalReservations = events.reduce((acc, e) => acc + e.reservations, 0)
  const totalPending = events.filter(e => e.status === 'Programado').reduce((acc, e) => acc + e.reservations, 0)

  // ── Filters ────────────────────────────────────────────────────────────────
  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase())
    const matchCity = cityFilter === 'Todas las ciudades' || e.city === cityFilter
    const matchStatus = statusFilter === 'Todos' || e.status === statusFilter
    const matchDate = !dateFilter || e.date.includes(dateFilter)
    return matchSearch && matchCity && matchStatus && matchDate
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleDelete = (event: AgentEvent) => setDeleteTarget(event)
  const confirmDelete = () => {
    if (deleteTarget) setEvents(prev => prev.filter(e => e.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleSaveEdit = (updated: AgentEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))
    setEditTarget(null)
    setEditSuccessMsg(true)
    setTimeout(() => setEditSuccessMsg(false), 3000)
  }

  if (editTarget) {
    return (
      <EditEventView
        event={editTarget}
        onCancel={() => setEditTarget(null)}
        onSave={handleSaveEdit}
        activeNav={activeNav}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    )
  }

  const stats = [
    {
      label: 'Eventos registrados',
      value: totalRegistered,
      icon: <IconCalendarDays />,
      color: '#4f46e5',
      bg: '#eef2ff',
      trend: '+2 este mes',
      trendUp: true,
    },
    {
      label: 'Eventos activos',
      value: totalActive,
      icon: <IconCheckCircle />,
      color: '#059669',
      bg: '#ecfdf5',
      trend: 'En progreso',
      trendUp: true,
    },
    {
      label: 'Reservas recibidas',
      value: totalReservations.toLocaleString('es-CO'),
      icon: <IconUsers />,
      color: '#f4845f',
      bg: '#fff7f5',
      trend: '+18% vs. mes anterior',
      trendUp: true,
    },
    {
      label: 'Reservas pendientes',
      value: totalPending.toLocaleString('es-CO'),
      icon: <IconClock />,
      color: '#d97706',
      bg: '#fffbeb',
      trend: 'Por confirmar',
      trendUp: false,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AgentSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      {/* ── Edit success toast ── */}
      {editSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm"
          style={{ background: '#059669', fontWeight: 600 }}>
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          Evento actualizado correctamente.
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Panel del agente</h1>
            <p className="text-sm text-gray-400 mt-0.5">Administra tus eventos y reservas.</p>
          </div>
          <button
            onClick={() => onNavigate('registrar-evento')}
            className="flex items-center gap-2 text-sm text-white px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition-all active:scale-95"
            style={{ background: '#f4845f', fontWeight: 600 }}
          >
            <IconPlus />
            Crear evento
          </button>
        </div>

        <div className="px-8 py-7 flex flex-col gap-7">

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.trendUp ? '↑' : '·'} {s.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{s.value}</p>
                  <p className="text-sm text-gray-400 mt-0.5" style={{ fontWeight: 500 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Events Section ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Mis eventos</h2>
                <p className="text-xs text-gray-400 mt-0.5">{filtered.length} evento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Buscar evento o ciudad…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all"
                  style={{ fontWeight: 400 }}
                />
              </div>

              {/* Estado */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value as typeof statusFilter); setCurrentPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : s}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
              </div>

              {/* Ciudad */}
              <div className="relative">
                <select
                  value={cityFilter}
                  onChange={e => { setCityFilter(e.target.value); setCurrentPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
              </div>

              {/* Fecha */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por fecha…"
                  value={dateFilter}
                  onChange={e => { setDateFilter(e.target.value); setCurrentPage(1) }}
                  className="pl-3 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 transition-all placeholder-gray-400"
                  style={{ fontWeight: 400, minWidth: 160 }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100" style={{ background: '#fafafa' }}>
                    {['Evento', 'Ciudad', 'Fecha', 'Capacidad', 'Precio', 'Reservas', 'Estado', 'Acciones'].map(col => (
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
                        No se encontraron eventos con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : paged.map((event, idx) => (
                    <tr
                      key={event.id}
                      className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                      style={{ background: idx % 2 === 0 ? 'white' : 'transparent' }}
                    >
                      {/* Evento */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 700 }}
                          >
                            {event.name.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 font-medium line-clamp-1 max-w-48" style={{ fontWeight: 600 }}>
                            {event.name}
                          </span>
                        </div>
                      </td>
                      {/* Ciudad */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span className="text-gray-400"><IconMapPin /></span>
                          {event.city}
                        </div>
                      </td>
                      {/* Fecha */}
                      <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{event.date}</td>
                      {/* Capacidad */}
                      <td className="px-5 py-3.5 text-sm text-gray-600">{event.capacity.toLocaleString('es-CO')}</td>
                      {/* Precio */}
                      <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap" style={{ fontWeight: 600 }}>{event.price}</td>
                      {/* Reservas */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 max-w-20 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round((event.reservations / event.capacity) * 100))}%`,
                                background: event.reservations >= event.capacity ? '#10b981' : '#4f46e5',
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                            {event.reservations.toLocaleString('es-CO')}
                          </span>
                        </div>
                      </td>
                      {/* Estado */}
                      <td className="px-5 py-3.5 whitespace-nowrap">{statusBadge(event.status)}</td>
                      {/* Acciones */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            title="Ver"
                            onClick={() => setDetailEvent(event)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <IconEye />
                          </button>
                          <button
                            title="Editar"
                            onClick={() => setEditTarget(event)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <IconEdit />
                          </button>
                          <button
                            title="Eliminar"
                            onClick={() => handleDelete(event)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <IconTrash />
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
                  Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length} eventos
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
                      style={
                        p === currentPage
                          ? { background: '#4f46e5', color: 'white', fontWeight: 600 }
                          : { color: '#6b7280', fontWeight: 500 }
                      }
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
        </div>
      </main>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          eventName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {detailEvent && (
        <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
