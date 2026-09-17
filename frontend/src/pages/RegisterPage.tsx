import { useState } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7M19 12H5" />
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

function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconID() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M16 10h2M16 14h2M7 10h2a2 2 0 1 1 0 4H7z" />
    </svg>
  )
}

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const paises = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Venezuela', 'España']

const departamentos: Record<string, string[]> = {
  Colombia: ['Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Cundinamarca', 'Nariño', 'Santander', 'Valle del Cauca'],
  México: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
  Argentina: ['Buenos Aires', 'Córdoba', 'Mendoza', 'Rosario'],
  Chile: ['Metropolitana', 'Valparaíso', 'Biobío'],
  Perú: ['Lima', 'Arequipa', 'Cusco'],
  Ecuador: ['Pichincha', 'Guayas', 'Azuay'],
  Venezuela: ['Caracas', 'Zulia', 'Carabobo'],
  España: ['Madrid', 'Cataluña', 'Andalucía'],
}

const ciudades: Record<string, string[]> = {
  Antioquia: ['Medellín', 'Bello', 'Envigado', 'Itagüí'],
  Atlántico: ['Barranquilla', 'Soledad', 'Malambo'],
  'Bogotá D.C.': ['Bogotá'],
  Bolívar: ['Cartagena', 'Magangué'],
  Boyacá: ['Tunja', 'Duitama', 'Sogamoso'],
  Caldas: ['Manizales', 'La Dorada'],
  Cundinamarca: ['Soacha', 'Zipaquirá', 'Facatativá'],
  Nariño: ['Pasto', 'Ipiales'],
  Santander: ['Bucaramanga', 'Floridablanca', 'Girón'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
  'Ciudad de México': ['CDMX Centro', 'Tlalpan', 'Coyoacán'],
  Jalisco: ['Guadalajara', 'Zapopan'],
  'Buenos Aires': ['CABA', 'La Plata', 'Mar del Plata'],
  Lima: ['Lima Centro', 'Miraflores', 'San Isidro'],
  Pichincha: ['Quito', 'Cayambe'],
  Madrid: ['Madrid', 'Alcalá de Henares'],
}

// ─── Field Components ──────────────────────────────────────────────────────────

type FieldState = 'idle' | 'valid' | 'invalid'

function getFieldStyles(state: FieldState, focused: boolean) {
  if (state === 'valid') return { border: '#10b981', shadow: focused ? '0 0 0 3px rgba(16,185,129,0.12)' : 'none', bg: '#f0fdf4' }
  if (state === 'invalid') return { border: '#ef4444', shadow: focused ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none', bg: '#fff5f5' }
  return { border: focused ? '#4f46e5' : '#e5e7eb', shadow: focused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none', bg: focused ? '#fafafe' : '#fff' }
}

interface InputFieldProps {
  label: string
  icon: React.ReactNode
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  state?: FieldState
  errorMsg?: string
  required?: boolean
  rightElement?: React.ReactNode
}

function InputField({ label, icon, type = 'text', placeholder, value, onChange, state = 'idle', errorMsg, required, rightElement }: InputFieldProps) {
  const [focused, setFocused] = useState(false)
  const styles = getFieldStyles(state, focused)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-700 flex items-center gap-1" style={{ fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: '#f4845f' }}>*</span>}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
        style={{ borderColor: styles.border, boxShadow: styles.shadow, background: styles.bg }}
      >
        <span style={{ color: state === 'valid' ? '#10b981' : state === 'invalid' ? '#ef4444' : focused ? '#4f46e5' : '#9ca3af', flexShrink: 0 }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400"
          style={{ fontWeight: 400 }}
        />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
        {!rightElement && state === 'valid' && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#10b981' }}>
            <IconCheck />
          </div>
        )}
        {!rightElement && state === 'invalid' && (
          <span style={{ color: '#ef4444', flexShrink: 0 }}><IconAlertCircle /></span>
        )}
      </div>
      {state === 'invalid' && errorMsg && (
        <p className="text-xs flex items-center gap-1" style={{ color: '#ef4444', fontWeight: 500 }}>
          <IconAlertCircle /> {errorMsg}
        </p>
      )}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  icon: React.ReactNode
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  state?: FieldState
  required?: boolean
  disabled?: boolean
}

function SelectField({ label, icon, value, onChange, options, placeholder, state = 'idle', required, disabled }: SelectFieldProps) {
  const [focused, setFocused] = useState(false)
  const styles = getFieldStyles(state, focused)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-700 flex items-center gap-1" style={{ fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: '#f4845f' }}>*</span>}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all relative"
        style={{ borderColor: styles.border, boxShadow: styles.shadow, background: disabled ? '#f9fafb' : styles.bg }}
      >
        <span style={{ color: disabled ? '#d1d5db' : state === 'valid' ? '#10b981' : focused ? '#4f46e5' : '#9ca3af', flexShrink: 0 }}>
          {icon}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="flex-1 text-sm outline-none bg-transparent appearance-none cursor-pointer disabled:cursor-not-allowed"
          style={{ fontWeight: 400, color: value ? '#111827' : '#9ca3af' }}
        >
          <option value="" disabled>{placeholder || 'Seleccionar...'}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ color: '#9ca3af', flexShrink: 0, pointerEvents: 'none' }}><IconChevronDown /></span>
      </div>
    </div>
  )
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-700 uppercase tracking-widest" style={{ color: '#4f46e5', fontWeight: 700, letterSpacing: '0.08em' }}>
          {title}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  )
}

// ─── Custom checkbox ───────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group select-none">
      <div
        onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
        style={{ borderColor: checked ? '#4f46e5' : '#d1d5db', background: checked ? '#4f46e5' : 'white' }}
      >
        {checked && <IconCheck />}
      </div>
      <span className="text-sm text-gray-600 leading-relaxed" style={{ fontWeight: 400 }}>{label}</span>
    </label>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
      <div>
        <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-all shrink-0 mt-0.5"
        style={{ background: checked ? '#4f46e5' : '#d1d5db' }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </button>
    </div>
  )
}

// ─── Additional icons for agent flow ─────────────────────────────────────────

function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  )
}

function IconFileText() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l6.58-6.58a1 1 0 0 0 0-1.41z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// ─── Plan data ────────────────────────────────────────────────────────────────

type PlanKey = 'basico' | 'profesional' | 'empresa'

const AGENT_PLANS: { key: PlanKey; name: string; price: string; priceNum: string; features: string[]; recommended?: boolean }[] = [
  {
    key: 'basico',
    name: 'Plan Básico',
    price: '$29.900 COP',
    priceNum: '$29.900',
    features: ['Hasta 5 eventos activos', 'Gestión de reservas', 'Panel de eventos', 'Soporte básico'],
  },
  {
    key: 'profesional',
    name: 'Plan Profesional',
    price: '$49.900 COP',
    priceNum: '$49.900',
    recommended: true,
    features: ['Hasta 20 eventos activos', 'Gestión de reservas', 'Panel de eventos', 'Estadísticas básicas', 'Soporte prioritario'],
  },
  {
    key: 'empresa',
    name: 'Plan Empresa',
    price: '$89.900 COP',
    priceNum: '$89.900',
    features: ['Eventos activos ilimitados', 'Gestión avanzada de reservas', 'Reportes avanzados', 'Múltiples usuarios', 'Soporte prioritario'],
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────

interface RegisterPageProps {
  onBack: () => void
  onLogin: () => void
  onAgentRegister?: () => void
}

type Role = 'cliente' | 'agente'

interface FormData {
  identificacion: string
  nombre: string
  correo: string
  password: string
  confirmar: string
  direccion: string
  pais: string
  departamento: string
  ciudad: string
  telefono: string
  publicidad: boolean
  experiencia: string
  terminos: boolean
  // agent-specific
  empresa: string
  descripcionNegocio: string
  ciudadOperacion: string
  tipoEventos: string
}

function validate(field: keyof FormData, value: string | boolean, form: FormData): FieldState {
  if (typeof value === 'boolean') return 'idle'
  if (!value) return 'idle'
  switch (field) {
    case 'correo': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'valid' : 'invalid'
    case 'password': return value.length >= 8 ? 'valid' : 'invalid'
    case 'confirmar': return value === form.password && value.length > 0 ? 'valid' : 'invalid'
    case 'identificacion': return value.length >= 6 ? 'valid' : 'invalid'
    case 'telefono': return /^\+?[\d\s\-]{7,}$/.test(value) ? 'valid' : 'invalid'
    default: return value.length > 1 ? 'valid' : 'idle'
  }
}

export default function RegisterPage({ onBack, onLogin, onAgentRegister }: RegisterPageProps) {
  const [role, setRole] = useState<Role>('cliente')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null)
  const [planError, setPlanError] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState<FormData>({
    identificacion: '', nombre: '', correo: '', password: '', confirmar: '',
    direccion: '', pais: 'Colombia', departamento: '', ciudad: '', telefono: '',
    publicidad: true, experiencia: '', terminos: false,
    empresa: '', descripcionNegocio: '', ciudadOperacion: '', tipoEventos: '',
  })

  const set = (field: keyof FormData) => (v: string | boolean) => {
    setForm((f) => ({ ...f, [field]: v }))
    if (typeof v === 'string' && v) setTouched((t) => ({ ...t, [field]: true }))
  }

  const fieldState = (field: keyof FormData): FieldState =>
    touched[field] ? validate(field, form[field] as string, form) : 'idle'

  const depts = form.pais ? (departamentos[form.pais] || []) : []
  const cities = form.departamento ? (ciudades[form.departamento] || []) : []

  const selectedPlanData = AGENT_PLANS.find(p => p.key === selectedPlan)

  // ── Client submit (unchanged logic) ───────────────────────────────────────
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allFields: (keyof FormData)[] = ['identificacion','nombre','correo','password','confirmar','direccion','pais','departamento','ciudad','telefono']
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])))
    setLoading(true)
    setTimeout(() => setLoading(false), 1800)
  }

  // ── Agent submit ───────────────────────────────────────────────────────────
  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allFields: (keyof FormData)[] = ['identificacion','nombre','correo','password','confirmar','direccion','pais','departamento','ciudad','telefono','empresa','descripcionNegocio','ciudadOperacion','tipoEventos']
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])))

    if (!selectedPlan) { setPlanError(true); return }
    if (!form.terminos) return

    const hasErrors = allFields.some(f => validate(f, form[f] as string, form) === 'invalid')
    const missing = allFields.some(f => !(form[f] as string))
    if (hasErrors || missing) return

    setPlanError(false)
    setLoading(true)
    setSuccess(true)
    setTimeout(() => {
      setLoading(false)
      onAgentRegister?.()
    }, 1800)
  }

  // ── Shared form sections ───────────────────────────────────────────────────
  const personalSection = (
    <Section title="Datos personales">
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="Número de identificación" icon={<IconID />} placeholder="Cédula o pasaporte"
          value={form.identificacion} onChange={set('identificacion')} state={fieldState('identificacion')} errorMsg="Mínimo 6 caracteres" required />
        <InputField label="Nombre completo" icon={<IconUser />} placeholder="Tu nombre completo"
          value={form.nombre} onChange={set('nombre')} state={fieldState('nombre')} required />
        <InputField label="Correo electrónico" icon={<IconMail />} type="email" placeholder="ejemplo@correo.com"
          value={form.correo} onChange={set('correo')} state={fieldState('correo')} errorMsg="Ingresa un correo válido" required />
        <InputField label="Número de teléfono" icon={<IconPhone />} type="tel" placeholder="+57 300 000 0000"
          value={form.telefono} onChange={set('telefono')} state={fieldState('telefono')} errorMsg="Número inválido" required />
      </div>
    </Section>
  )

  const passwordSection = (
    <Section title="Seguridad">
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="Contraseña" icon={<IconLock />} type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
          value={form.password} onChange={set('password')} state={fieldState('password')} errorMsg="Mínimo 8 caracteres" required
          rightElement={<button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-indigo-500 transition-colors" tabIndex={-1}>{showPass ? <IconEyeOff /> : <IconEye />}</button>} />
        <InputField label="Confirmar contraseña" icon={<IconLock />} type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña"
          value={form.confirmar} onChange={set('confirmar')} state={fieldState('confirmar')} errorMsg="Las contraseñas no coinciden" required
          rightElement={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-indigo-500 transition-colors" tabIndex={-1}>{showConfirm ? <IconEyeOff /> : <IconEye />}</button>} />
      </div>
      {form.password && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => {
              const score = Math.min(4, [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^a-zA-Z0-9]/.test(form.password)].filter(Boolean).length)
              const colors = ['#ef4444', '#f59e0b', '#10b981', '#10b981']
              return <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= score ? colors[score - 1] : '#e5e7eb' }} />
            })}
          </div>
          <p className="text-xs text-gray-400">
            {(() => {
              const score = [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^a-zA-Z0-9]/.test(form.password)].filter(Boolean).length
              return ['', 'Contraseña débil', 'Contraseña regular', 'Contraseña fuerte', 'Contraseña muy fuerte'][score]
            })()}
          </p>
        </div>
      )}
    </Section>
  )

  const locationSection = (
    <Section title="Ubicación">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField label="Dirección" icon={<IconMapPin />} placeholder="Calle, número, barrio"
            value={form.direccion} onChange={set('direccion')} state={fieldState('direccion')} required />
        </div>
        <SelectField label="País" icon={<IconMapPin />} value={form.pais}
          onChange={(v) => { set('pais')(v); set('departamento')(''); set('ciudad')('') }}
          options={paises} placeholder="Selecciona un país" required />
        <SelectField label="Departamento / Estado" icon={<IconMapPin />} value={form.departamento}
          onChange={(v) => { set('departamento')(v); set('ciudad')('') }}
          options={depts} placeholder={form.pais ? 'Selecciona...' : 'Primero selecciona un país'} disabled={!form.pais} required />
        <SelectField label="Ciudad" icon={<IconMapPin />} value={form.ciudad} onChange={set('ciudad')}
          options={cities} placeholder={form.departamento ? 'Selecciona...' : 'Primero selecciona departamento'} disabled={!form.departamento} required />
      </div>
    </Section>
  )

  const termsRow = (submitLabel: string, disabled: boolean) => (
    <div className="flex flex-col gap-5 pt-1">
      <Checkbox
        checked={form.terminos}
        onChange={(v) => set('terminos')(v)}
        label={
          <span>
            Acepto los{' '}
            <a href="#" className="underline hover:opacity-70 transition-opacity" style={{ color: '#4f46e5', fontWeight: 600 }}>términos y condiciones</a>{' '}
            y la{' '}
            <a href="#" className="underline hover:opacity-70 transition-opacity" style={{ color: '#4f46e5', fontWeight: 600 }}>política de privacidad</a>{' '}
            de EventNova.
          </span>
        }
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: '#f4845f', fontWeight: 700 }}
      >
        {loading ? (
          <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Creando cuenta…</>
        ) : submitLabel}
      </button>
      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{' '}
        <button type="button" onClick={onLogin} className="hover:underline transition-colors" style={{ color: '#4f46e5', fontWeight: 600 }}>Iniciar sesión</button>
      </p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>

      {/* Success toast */}
      {success && (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-1 px-5 py-4 rounded-2xl shadow-xl text-white text-sm" style={{ background: '#059669', fontWeight: 600, maxWidth: 320 }}>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            Cuenta de Agente creada correctamente.
          </span>
          <span className="text-emerald-100 text-xs pl-8" style={{ fontWeight: 400 }}>Plan {selectedPlanData?.name} seleccionado correctamente.</span>
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
            <span className="text-white"><IconTicket /></span>
          </div>
          <span className="text-xl tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
            Event<span style={{ color: '#4f46e5' }}>Nova</span>
          </span>
        </button>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors" style={{ fontWeight: 500 }}>
          <IconArrowLeft />
          Volver al inicio
        </button>
      </div>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-6 py-8 pb-16">
        <div className="w-full max-w-2xl flex flex-col gap-7">

          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3.5 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Registro gratuito — sin tarjeta de crédito
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-7 py-9 sm:px-10 flex flex-col gap-8">

            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl text-gray-900 mb-1.5" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Crea tu cuenta
              </h1>
              <p className="text-sm text-gray-500">
                Únete a EventNova y comienza a gestionar o reservar eventos.
              </p>
            </div>

            {/* Role selector */}
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-700 text-center" style={{ fontWeight: 600 }}>
                ¿Cómo deseas registrarte?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'cliente', label: 'Cliente', desc: 'Reserva y descubre eventos', icon: <IconUser /> },
                  { key: 'agente', label: 'Agente', desc: 'Gestiona y publica eventos', icon: <IconBriefcase /> },
                ] as const).map(({ key, label, desc, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center"
                    style={{ borderColor: role === key ? '#4f46e5' : '#e5e7eb', background: role === key ? '#eef2ff' : '#fff' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: role === key ? '#4f46e5' : '#f3f4f6', color: role === key ? 'white' : '#9ca3af' }}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 700, color: role === key ? '#4f46e5' : '#374151' }}>{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    {role === key && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#4f46e5' }}>
                        <IconCheck />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                CLIENTE form — unchanged
                ════════════════════════════════════════════════════════════════ */}
            {role === 'cliente' && (
              <form onSubmit={handleClientSubmit} className="flex flex-col gap-8" noValidate>
                {personalSection}
                {passwordSection}
                {locationSection}
                <Section title="Preferencias">
                  <Toggle
                    checked={form.publicidad}
                    onChange={(v) => set('publicidad')(v)}
                    label="Mostrar publicidad personalizada"
                    description="Recibe sugerencias de eventos según tus intereses. Puedes cambiar esto en cualquier momento."
                  />
                </Section>
                {termsRow('Crear cuenta', loading || !form.terminos)}
              </form>
            )}

            {/* ════════════════════════════════════════════════════════════════
                AGENTE form — extended flow
                ════════════════════════════════════════════════════════════════ */}
            {role === 'agente' && (
              <form onSubmit={handleAgentSubmit} className="flex flex-col gap-8" noValidate>
                {personalSection}
                {passwordSection}
                {locationSection}

                {/* ── Datos del agente ─────────────────────────────────────── */}
                <Section title="Datos del agente">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <InputField label="Nombre de la empresa o negocio" icon={<IconBuilding />}
                        placeholder="Ej. CM Eventos & Producción"
                        value={form.empresa} onChange={set('empresa')} state={fieldState('empresa')} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-gray-700 flex items-center gap-1 mb-1.5" style={{ fontWeight: 600 }}>
                        Descripción del negocio <span style={{ color: '#f4845f' }}>*</span>
                      </label>
                      <div className="rounded-xl border px-4 py-3 transition-all" style={{ borderColor: '#e5e7eb' }}>
                        <span className="text-gray-400 mb-1 block" style={{ fontSize: 0 }}><IconFileText /></span>
                        <textarea
                          rows={3}
                          placeholder="Describe brevemente tu empresa o actividad de organización de eventos…"
                          value={form.descripcionNegocio}
                          onChange={e => set('descripcionNegocio')(e.target.value)}
                          className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400 resize-none"
                          style={{ fontWeight: 400 }}
                        />
                      </div>
                    </div>
                    <InputField label="Ciudad principal de operación" icon={<IconMapPin />}
                      placeholder="Ej. Bogotá"
                      value={form.ciudadOperacion} onChange={set('ciudadOperacion')} state={fieldState('ciudadOperacion')} required />
                    <SelectField label="Tipo de eventos que organiza" icon={<IconTag />}
                      value={form.tipoEventos} onChange={set('tipoEventos')} required
                      options={['Conciertos y música', 'Teatro y artes escénicas', 'Festivales', 'Gastronomía', 'Deportes', 'Conferencias y foros', 'Entretenimiento familiar', 'Otro']}
                      placeholder="Selecciona una categoría" />
                  </div>
                </Section>

                {/* ── Plan ─────────────────────────────────────────────────── */}
                <Section title="Elige tu plan de EventNova">
                  <div className="grid sm:grid-cols-3 gap-4">
                    {AGENT_PLANS.map(plan => {
                      const isSelected = selectedPlan === plan.key
                      return (
                        <div
                          key={plan.key}
                          onClick={() => { setSelectedPlan(plan.key); setPlanError(false) }}
                          className="relative flex flex-col rounded-2xl p-5 border-2 cursor-pointer transition-all hover:shadow-md"
                          style={isSelected
                            ? { borderColor: '#4f46e5', background: '#fafafe', boxShadow: '0 0 0 3px rgba(79,70,229,0.12)' }
                            : { borderColor: '#e5e7eb', background: 'white' }}
                        >
                          {plan.recommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full text-white whitespace-nowrap" style={{ background: '#f4845f', fontWeight: 700 }}>
                                <IconStar />
                                Recomendado
                              </span>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-1 mt-1">
                            <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{plan.name}</p>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                              style={{ borderColor: isSelected ? '#4f46e5' : '#d1d5db', background: isSelected ? '#4f46e5' : 'white' }}>
                              {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                            </div>
                          </div>
                          <p className="text-xl text-gray-900 mt-1 mb-0.5" style={{ fontWeight: 800 }}>{plan.priceNum}</p>
                          <p className="text-xs text-gray-400 mb-4">COP por mes</p>
                          <ul className="flex flex-col gap-1.5 flex-1 mb-4">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                  style={{ background: isSelected ? '#eef2ff' : '#f3f4f6', color: isSelected ? '#4f46e5' : '#9ca3af' }}>
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={() => { setSelectedPlan(plan.key); setPlanError(false) }}
                            className="w-full py-2 rounded-xl text-xs border-2 transition-all"
                            style={isSelected
                              ? { background: '#4f46e5', borderColor: '#4f46e5', color: 'white', fontWeight: 700 }
                              : { borderColor: '#e5e7eb', color: '#374151', fontWeight: 600 }}
                          >
                            {isSelected ? '✓ Seleccionado' : 'Elegir plan'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  {planError && (
                    <p className="flex items-center gap-1 text-xs mt-2" style={{ color: '#ef4444', fontWeight: 500 }}>
                      <IconAlertCircle />
                      Debes seleccionar un plan para continuar.
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Puedes cambiar tu plan posteriormente desde tu perfil.
                  </p>
                </Section>

                {/* ── Resumen ──────────────────────────────────────────────── */}
                {selectedPlan && form.nombre && (
                  <div className="rounded-2xl border border-indigo-100 overflow-hidden" style={{ background: '#fafafe' }}>
                    <div className="px-5 py-3 border-b border-indigo-100">
                      <p className="text-xs text-indigo-600 uppercase tracking-widest" style={{ fontWeight: 700, letterSpacing: '0.08em' }}>Resumen de registro</p>
                    </div>
                    <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                      {[
                        ['Tipo de cuenta', 'Agente'],
                        ['Nombre', form.nombre || '—'],
                        ['Plan seleccionado', selectedPlanData?.name ?? '—'],
                        ['Precio', (selectedPlanData?.price ?? '—') + ' / mes'],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>{label}</p>
                          <p className="text-sm text-gray-800 mt-0.5" style={{ fontWeight: 600 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Terms + Submit ────────────────────────────────────────── */}
                <div className="flex flex-col gap-5 pt-1">
                  <Checkbox
                    checked={form.terminos}
                    onChange={(v) => set('terminos')(v)}
                    label={
                      <span>
                        Acepto los{' '}
                        <a href="#" className="underline hover:opacity-70 transition-opacity" style={{ color: '#4f46e5', fontWeight: 600 }}>términos y condiciones</a>{' '}
                        y la{' '}
                        <a href="#" className="underline hover:opacity-70 transition-opacity" style={{ color: '#4f46e5', fontWeight: 600 }}>política de privacidad</a>{' '}
                        de EventNova.
                      </span>
                    }
                  />
                  <button
                    type="submit"
                    disabled={loading || !form.terminos}
                    className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: '#f4845f', fontWeight: 700 }}
                  >
                    {loading ? (
                      <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Creando cuenta…</>
                    ) : 'Crear cuenta de Agente'}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta?{' '}
                    <button type="button" onClick={onLogin} className="hover:underline transition-colors" style={{ color: '#4f46e5', fontWeight: 600 }}>Iniciar sesión</button>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Tus datos están protegidos con cifrado de extremo a extremo</span>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2025 EventNova. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">Términos</a>
            <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">Privacidad</a>
            <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </div>
  )
}
