import { useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentNavKey = 'mis-eventos' | 'registrar-evento' | 'reservas' | 'perfil'

interface Props {
  onLogout: () => void
  onNavigate: (key: AgentNavKey) => void
  activeNav: AgentNavKey
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

function IconUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
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

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconAlertCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AgentSidebar({ activeNav, onNavigate, onLogout }: Props) {
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
        <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: '#eef2ff', color: '#4f46e5' }}>
          Panel Agente
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <span className="flex items-center gap-1 text-xs text-red-500 mt-1" style={{ fontWeight: 500 }}>
      <IconAlertCircle />
      {message}
    </span>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

const inputClass = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white text-gray-800 placeholder-gray-400 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
  }`

const selectClass = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white text-gray-800 appearance-none cursor-pointer ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
  }`

// ─── Data ─────────────────────────────────────────────────────────────────────

const COUNTRIES = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador']

const DEPARTMENTS: Record<string, string[]> = {
  Colombia: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Caldas', 'Cundinamarca', 'Santander'],
  México: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
  Argentina: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza'],
  Chile: ['Región Metropolitana', 'Valparaíso', 'Biobío'],
  Perú: ['Lima', 'Arequipa', 'Cusco'],
  Ecuador: ['Pichincha', 'Guayas', 'Azuay'],
}

const CITIES: Record<string, string[]> = {
  'Bogotá D.C.': ['Bogotá'],
  Antioquia: ['Medellín', 'Envigado', 'Bello', 'Itagüí'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
  Atlántico: ['Barranquilla', 'Soledad'],
  Caldas: ['Manizales', 'Chinchiná'],
  Cundinamarca: ['Chía', 'Zipaquirá', 'Fusagasugá'],
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

const EVENT_STATUSES = ['Programado', 'En boletería', 'En vivo', 'Finalizado', 'Cancelado']

type FormFields = {
  name: string
  description: string
  image: File | null
  country: string
  department: string
  city: string
  address: string
  date: string
  time: string
  capacity: string
  price: string
  status: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const REQUIRED_FIELDS: (keyof FormFields)[] = [
  'name', 'description', 'country', 'department', 'city', 'address',
  'date', 'time', 'capacity', 'price',
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RegisterEventPage({ onLogout, onNavigate, activeNav }: Props) {
  const [form, setForm] = useState<FormFields>({
    name: '',
    description: '',
    image: null,
    country: '',
    department: '',
    city: '',
    address: '',
    date: '',
    time: '',
    capacity: '',
    price: '',
    status: 'Programado',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormFields, value: string | File | null) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Reset cascade on location change
      if (field === 'country') { next.department = ''; next.city = '' }
      if (field === 'department') { next.city = '' }
      return next
    })
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleImage = (file: File | null) => {
    if (!file) return
    set('image', file)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const formatPrice = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    return '$ ' + Number(digits).toLocaleString('es-CO')
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    REQUIRED_FIELDS.forEach(field => {
      if (!form[field] || String(form[field]).trim() === '') {
        next[field] = 'Este campo es obligatorio.'
      }
    })
    if (form.capacity && isNaN(Number(form.capacity.replace(/\D/g, '')))) {
      next.capacity = 'Ingresa un número válido.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onNavigate('mis-eventos')
    }, 1800)
  }

  const departments = form.country ? (DEPARTMENTS[form.country] ?? []) : []
  const cities = form.department ? (CITIES[form.department] ?? []) : []

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AgentSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Registrar evento</h1>
          <p className="text-sm text-gray-400 mt-0.5">Crea un nuevo evento y completa toda la información necesaria.</p>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm"
            style={{ background: '#059669', fontWeight: 600 }}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <IconCheck />
            </span>
            Evento creado correctamente.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-8 py-7 flex flex-col gap-6 max-w-3xl">

            {/* ── Sección 1: Información del evento ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>1</span>
                  Información del evento
                </h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-5">

                {/* Nombre */}
                <div>
                  <Label required>Nombre del evento</Label>
                  <input
                    type="text"
                    placeholder="Ej. Festival de Música Urbana 2026"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inputClass(!!errors.name)}
                  />
                  <FieldError message={errors.name} />
                </div>

                {/* Descripción */}
                <div>
                  <Label required>Descripción</Label>
                  <textarea
                    placeholder="Describe el evento: artistas, actividades, público objetivo, experiencia…"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={4}
                    className={inputClass(!!errors.description) + ' resize-none leading-relaxed'}
                  />
                  <FieldError message={errors.description} />
                </div>

                {/* Imagen */}
                <div>
                  <Label>Imagen del evento</Label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleImage(e.dataTransfer.files[0] ?? null) }}
                    className="relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden group"
                    style={{ borderColor: imagePreview ? '#4f46e5' : '#e2e8f0', minHeight: 160 }}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Vista previa" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Cambiar imagen</span>
                        </div>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setImagePreview(null); set('image', null) }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow"
                        >
                          <IconX />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                          <IconUpload />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Arrastra una imagen o haz clic para seleccionar</p>
                          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · Máx. 5 MB</p>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                          Seleccionar archivo
                        </span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImage(e.target.files?.[0] ?? null)} />
                  </div>
                  {!imagePreview && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <IconImage />
                      Opcional. Si no cargas una imagen se usará una imagen por defecto.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ── Sección 2: Ubicación ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>2</span>
                  Ubicación
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* País */}
                <div>
                  <Label required>País</Label>
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={e => set('country', e.target.value)}
                      className={selectClass(!!errors.country)}
                    >
                      <option value="">Seleccionar país</option>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronIcon />
                  </div>
                  <FieldError message={errors.country} />
                </div>

                {/* Departamento */}
                <div>
                  <Label required>Departamento / Estado</Label>
                  <div className="relative">
                    <select
                      value={form.department}
                      onChange={e => set('department', e.target.value)}
                      disabled={!form.country}
                      className={selectClass(!!errors.department) + (form.country ? '' : ' opacity-50 cursor-not-allowed')}
                    >
                      <option value="">Seleccionar departamento</option>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronIcon />
                  </div>
                  <FieldError message={errors.department} />
                </div>

                {/* Ciudad */}
                <div>
                  <Label required>Ciudad</Label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      disabled={!form.department}
                      className={selectClass(!!errors.city) + (form.department ? '' : ' opacity-50 cursor-not-allowed')}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronIcon />
                  </div>
                  <FieldError message={errors.city} />
                </div>

                {/* Dirección */}
                <div>
                  <Label required>Dirección</Label>
                  <input
                    type="text"
                    placeholder="Ej. Cra 7 # 32-16, Parque de la 93"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    className={inputClass(!!errors.address)}
                  />
                  <FieldError message={errors.address} />
                </div>
              </div>
            </section>

            {/* ── Sección 3: Fecha y hora ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>3</span>
                  Fecha y hora
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label required>Fecha del evento</Label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    className={inputClass(!!errors.date)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <FieldError message={errors.date} />
                </div>
                <div>
                  <Label required>Hora del evento</Label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => set('time', e.target.value)}
                    className={inputClass(!!errors.time)}
                  />
                  <FieldError message={errors.time} />
                </div>
              </div>
            </section>

            {/* ── Sección 4: Capacidad y precio ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>4</span>
                  Capacidad y precio
                </h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label required>Capacidad</Label>
                  <input
                    type="number"
                    placeholder="Ej. 500"
                    min={1}
                    value={form.capacity}
                    onChange={e => set('capacity', e.target.value)}
                    className={inputClass(!!errors.capacity)}
                  />
                  <FieldError message={errors.capacity} />
                  <p className="text-xs text-gray-400 mt-1">Número máximo de asistentes.</p>
                </div>
                <div>
                  <Label required>Precio por entrada</Label>
                  <input
                    type="text"
                    placeholder="Ej. $ 85.000"
                    value={form.price}
                    onChange={e => set('price', formatPrice(e.target.value))}
                    className={inputClass(!!errors.price)}
                  />
                  <FieldError message={errors.price} />
                  <p className="text-xs text-gray-400 mt-1">En pesos colombianos (COP).</p>
                </div>
              </div>
            </section>

            {/* ── Sección 5: Estado ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-white text-xs mr-2" style={{ background: '#4f46e5', fontWeight: 700 }}>5</span>
                  Estado del evento
                </h2>
              </div>
              <div className="px-6 py-5">
                <Label>Estado</Label>
                <div className="flex flex-wrap gap-2.5 mt-1">
                  {EVENT_STATUSES.map(s => {
                    const isSelected = form.status === s
                    const colors: Record<string, { bg: string; text: string; border: string; activeBg: string; activeText: string }> = {
                      'Programado':   { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200',  activeBg: '#eef2ff',  activeText: '#4f46e5' },
                      'En boletería': { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200', activeBg: '#fffbeb',  activeText: '#d97706' },
                      'En vivo':      { bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-200',activeBg: '#ecfdf5', activeText: '#059669' },
                      'Finalizado':   { bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200',  activeBg: '#f3f4f6',  activeText: '#374151' },
                      'Cancelado':    { bg: 'bg-red-50',    text: 'text-red-500',    border: 'border-red-200',   activeBg: '#fef2f2',  activeText: '#dc2626' },
                    }
                    const c = colors[s]
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set('status', s)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 transition-all`}
                        style={
                          isSelected
                            ? { background: c.activeBg, color: c.activeText, borderColor: c.activeText, fontWeight: 700 }
                            : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280', fontWeight: 500 }
                        }
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: isSelected ? c.activeText : '#d1d5db' }}
                        />
                        {s}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-3">El estado inicial recomendado para un evento nuevo es <strong>Programado</strong>.</p>
              </div>
            </section>

            {/* ── Botones ── */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={() => onNavigate('mis-eventos')}
                className="px-6 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 text-sm text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: '#f4845f', fontWeight: 600 }}
              >
                Guardar evento
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

// small helper to avoid repeating the chevron SVG in selects
function ChevronIcon() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}
