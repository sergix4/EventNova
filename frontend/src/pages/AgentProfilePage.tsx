import { useState } from 'react'

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

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

function IconAlertTriangle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}

function IconMonitor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
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
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 700 }}>
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

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>{title}</h2>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 sm:w-44 shrink-0" style={{ fontWeight: 500 }}>{label}</span>
      <span className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function inputCls(err?: boolean) {
  return `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white text-gray-800 placeholder-gray-400 ${
    err ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
  }`
}

function selectCls() {
  return 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white text-gray-800 appearance-none cursor-pointer transition-all'
}

function Toast({ message, color = '#059669' }: { message: string; color?: string }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm"
      style={{ background: color, fontWeight: 600 }}>
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><IconCheck /></span>
      {message}
    </div>
  )
}

// ─── Plan data ────────────────────────────────────────────────────────────────

type PlanKey = 'basico' | 'profesional' | 'empresa'

const PLANS: { key: PlanKey; name: string; price: string; priceNum: string; features: string[]; recommended?: boolean }[] = [
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

// ─── Personal info edit form ──────────────────────────────────────────────────

interface PersonalInfo {
  name: string
  email: string
  idNumber: string
  phone: string
  address: string
  country: string
  department: string
  city: string
}

function EditPersonalModal({ info, onClose, onSave }: {
  info: PersonalInfo
  onClose: () => void
  onSave: (next: PersonalInfo) => void
}) {
  const [form, setForm] = useState<PersonalInfo>(info)
  const set = (k: keyof PersonalInfo, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Editar perfil</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><IconX /></button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Nombre completo</label>
              <input className={inputCls()} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Tipo de usuario</label>
              <input className={inputCls() + ' bg-gray-50 cursor-not-allowed text-gray-400'} value="Agente" readOnly />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Correo electrónico</label>
              <input className={inputCls()} value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Número de identificación</label>
              <input className={inputCls()} value={form.idNumber} onChange={e => set('idNumber', e.target.value)} placeholder="CC / NIT" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Teléfono</label>
              <input className={inputCls()} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+57 300 000 0000" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Dirección</label>
              <input className={inputCls()} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Calle, número, barrio" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>País</label>
              <div className="relative">
                <select className={selectCls()} value={form.country} onChange={e => set('country', e.target.value)}>
                  {['Colombia', 'México', 'Argentina', 'Chile', 'Perú'].map(c => <option key={c}>{c}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Departamento</label>
              <input className={inputCls()} value={form.department} onChange={e => set('department', e.target.value)} placeholder="Departamento / Estado" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Ciudad</label>
              <input className={inputCls()} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Ciudad" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>Cancelar</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-all" style={{ background: '#f4845f', fontWeight: 600 }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  )
}

// ─── Agent info edit modal ────────────────────────────────────────────────────

interface AgentInfo {
  agentName: string
  businessName: string
  businessDesc: string
  mainCity: string
}

function EditAgentModal({ info, onClose, onSave }: {
  info: AgentInfo
  onClose: () => void
  onSave: (next: AgentInfo) => void
}) {
  const [form, setForm] = useState<AgentInfo>(info)
  const set = (k: keyof AgentInfo, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Editar información de agente</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><IconX /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Nombre del agente</label>
            <input className={inputCls()} value={form.agentName} onChange={e => set('agentName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Empresa o negocio</label>
            <input className={inputCls()} value={form.businessName} onChange={e => set('businessName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Descripción del negocio</label>
            <textarea rows={3} className={inputCls() + ' resize-none'} value={form.businessDesc} onChange={e => set('businessDesc', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>Ciudad principal de operación</label>
            <input className={inputCls()} value={form.mainCity} onChange={e => set('mainCity', e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>Cancelar</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-all" style={{ background: '#f4845f', fontWeight: 600 }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  )
}

// ─── Plan change modal ────────────────────────────────────────────────────────

function PlanChangeModal({ plan, onCancel, onConfirm }: {
  plan: typeof PLANS[0]
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <IconTicket />
          </div>
          <div>
            <h3 className="text-base text-gray-900 mb-1" style={{ fontWeight: 700 }}>Cambiar plan</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro de que deseas cambiar tu plan de EventNova a{' '}
              <span className="font-semibold text-gray-700">{plan.name}</span>?
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
          <span className="text-sm text-indigo-700" style={{ fontWeight: 600 }}>{plan.name}</span>
          <span className="text-sm text-indigo-600" style={{ fontWeight: 700 }}>{plan.priceNum} / mes</span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>Cancelar</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-all" style={{ background: '#f4845f', fontWeight: 600 }}>Confirmar cambio</button>
        </div>
      </div>
    </div>
  )
}

// ─── Cancel subscription modal ────────────────────────────────────────────────

function CancelSubModal({ onKeep, onCancel }: { onKeep: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <IconAlertTriangle />
          </div>
          <div>
            <h3 className="text-base text-gray-900 mb-1" style={{ fontWeight: 700 }}>Cancelar suscripción</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro de que deseas cancelar tu suscripción a EventNova? Perderás el acceso a las funciones de tu plan al final del período de facturación.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={onKeep} className="w-full py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-all" style={{ background: '#4f46e5', fontWeight: 600 }}>
            Continuar con mi plan
          </button>
          <button onClick={onCancel} className="w-full py-2.5 rounded-xl text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>
            Cancelar suscripción
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Change password modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handle = () => {
    if (!form.current || !form.next || !form.confirm) { setError('Todos los campos son obligatorios.'); return }
    if (form.next !== form.confirm) { setError('Las contraseñas nuevas no coinciden.'); return }
    if (form.next.length < 8) { setError('La nueva contraseña debe tener al menos 8 caracteres.'); return }
    setDone(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Cambiar contraseña</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><IconX /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {['current', 'next', 'confirm'].map((k) => (
            <div key={k}>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>
                {k === 'current' ? 'Contraseña actual' : k === 'next' ? 'Nueva contraseña' : 'Confirmar nueva contraseña'}
              </label>
              <input
                type="password"
                className={inputCls(!!error)}
                value={form[k as keyof typeof form]}
                onChange={e => { setForm(p => ({ ...p, [k]: e.target.value })); setError('') }}
                placeholder="••••••••"
              />
            </div>
          ))}
          {error && <p className="text-xs text-red-500" style={{ fontWeight: 500 }}>{error}</p>}
          {done && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>
              <IconCheck />
              Contraseña actualizada correctamente.
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>Cancelar</button>
          <button onClick={handle} disabled={done} className="px-6 py-2.5 rounded-xl text-sm text-white hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: '#f4845f', fontWeight: 600 }}>Guardar cambio</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AgentProfilePage({ onLogout, onNavigate, activeNav }: Props) {
  // Personal info state
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: 'Carlos Martínez',
    email: 'carlos.martinez@eventnova.co',
    idNumber: 'CC 1.023.456.789',
    phone: '+57 310 456 7890',
    address: 'Cra 15 # 93-47, Apto 302',
    country: 'Colombia',
    department: 'Bogotá D.C.',
    city: 'Bogotá',
  })
  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    agentName: 'Carlos Martínez',
    businessName: 'CM Eventos & Producción',
    businessDesc: 'Empresa de producción y organización de eventos culturales, musicales y gastronómicos en Colombia.',
    mainCity: 'Bogotá',
  })
  const [currentPlan, setCurrentPlan] = useState<PlanKey>('profesional')

  // Modal states
  const [editPersonal, setEditPersonal] = useState(false)
  const [editAgent, setEditAgent] = useState(false)
  const [planTarget, setPlanTarget] = useState<typeof PLANS[0] | null>(null)
  const [showCancelSub, setShowCancelSub] = useState(false)
  const [showChangePwd, setShowChangePwd] = useState(false)

  // Toasts
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSavePersonal = (next: PersonalInfo) => {
    setPersonal(next)
    setEditPersonal(false)
    showToast('Perfil actualizado correctamente.')
  }

  const handleSaveAgent = (next: AgentInfo) => {
    setAgentInfo(next)
    setEditAgent(false)
    showToast('Información de agente actualizada correctamente.')
  }

  const handlePlanChange = () => {
    if (planTarget) { setCurrentPlan(planTarget.key); setPlanTarget(null); showToast('Plan actualizado correctamente.') }
  }

  const currentPlanData = PLANS.find(p => p.key === currentPlan)!

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <AgentSidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Mi perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Administra tu información personal, información como agente y tu plan de EventNova.</p>
        </div>

        <div className="px-8 py-7 flex flex-col gap-6 max-w-3xl">

          {/* ── Sección 1: Información personal ── */}
          <SectionCard
            title="Información personal"
            action={
              <button
                onClick={() => setEditPersonal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <IconEdit />
                Editar perfil
              </button>
            }
          >
            {/* Avatar row */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', fontWeight: 800 }}>
                {personal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>{personal.name}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                  Agente
                </span>
              </div>
            </div>
            <div>
              <InfoRow label="Nombre completo"        value={personal.name} />
              <InfoRow label="Tipo de usuario"        value="Agente" />
              <InfoRow label="Correo electrónico"     value={personal.email} />
              <InfoRow label="Número de identificación" value={personal.idNumber} />
              <InfoRow label="Teléfono"               value={personal.phone} />
              <InfoRow label="Dirección"              value={personal.address} />
              <InfoRow label="País"                   value={personal.country} />
              <InfoRow label="Departamento"           value={personal.department} />
              <InfoRow label="Ciudad"                 value={personal.city} />
            </div>
          </SectionCard>

          {/* ── Sección 2: Información como agente ── */}
          <SectionCard
            title="Información como agente"
            action={
              <button
                onClick={() => setEditAgent(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <IconEdit />
                Editar información
              </button>
            }
          >
            <InfoRow label="Nombre del agente"          value={agentInfo.agentName} />
            <InfoRow label="Empresa o negocio"          value={agentInfo.businessName} />
            <InfoRow label="Descripción del negocio"    value={agentInfo.businessDesc} />
            <InfoRow label="Ciudad de operación"        value={agentInfo.mainCity} />
            <InfoRow label="Eventos registrados"        value="12" />
            <InfoRow label="Eventos activos"            value="9" />
            <InfoRow label="Reservas recibidas"         value="7.156" />
            <InfoRow label="Agente desde"               value="15 de enero de 2025" />
          </SectionCard>

          {/* ── Sección 3: Mi plan ── */}
          <section className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}>
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-indigo-200 mb-1" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Plan activo</p>
                  <h2 className="text-2xl text-white mb-1" style={{ fontWeight: 800 }}>{currentPlanData.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Activo
                    </span>
                    <span className="text-indigo-200 text-xs">Próximo cobro: 30 de septiembre de 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl text-white" style={{ fontWeight: 800 }}>{currentPlanData.priceNum}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">por mes</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentPlanData.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0"><IconCheck /></span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 hover:opacity-90 transition-all"
                  style={{ background: 'white', fontWeight: 600 }}
                >
                  Administrar plan
                </button>
                <button
                  onClick={() => {
                    const other = PLANS.find(p => p.key !== currentPlan)
                    if (other) setPlanTarget(other)
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Cambiar plan
                </button>
              </div>
            </div>
          </section>

          {/* ── Sección 4: Planes disponibles ── */}
          <SectionCard title="Planes disponibles">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLANS.map(plan => {
                const isCurrent = plan.key === currentPlan
                const isRecommended = plan.recommended
                return (
                  <div
                    key={plan.key}
                    className={`relative flex flex-col rounded-2xl p-5 border-2 transition-all ${
                      isCurrent ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                    style={isCurrent ? { borderColor: '#4f46e5', background: '#fafafe' } : { borderColor: '#e5e7eb', background: 'white' }}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white whitespace-nowrap" style={{ background: '#f4845f', fontWeight: 700 }}>
                          <IconStar />
                          Recomendado
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-900 mt-1" style={{ fontWeight: 700 }}>{plan.name}</p>
                    <p className="text-2xl text-gray-900 mt-2 mb-0.5" style={{ fontWeight: 800 }}>{plan.priceNum}</p>
                    <p className="text-xs text-gray-400 mb-4">COP por mes</p>
                    <ul className="flex flex-col gap-2 flex-1 mb-5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: isCurrent ? '#eef2ff' : '#f3f4f6', color: isCurrent ? '#4f46e5' : '#6b7280' }}>
                            <IconCheck />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <button
                        className="w-full py-2.5 rounded-xl text-sm text-white"
                        style={{ background: '#4f46e5', fontWeight: 600, cursor: 'default' }}
                        disabled
                      >
                        Plan actual
                      </button>
                    ) : (
                      <button
                        onClick={() => setPlanTarget(plan)}
                        className="w-full py-2.5 rounded-xl text-sm border-2 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all"
                        style={{ borderColor: '#e5e7eb', color: '#374151', fontWeight: 600 }}
                      >
                        Elegir plan
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </SectionCard>

          {/* ── Sección 5: Facturación ── */}
          <SectionCard title="Información de facturación">
            <div className="flex flex-col gap-0">
              <InfoRow label="Plan actual"             value={currentPlanData.name} />
              <InfoRow label="Precio mensual"          value={currentPlanData.price + ' por mes'} />
              <InfoRow label="Método de pago"          value="Tarjeta Visa •••• 4821" />
              <InfoRow label="Próxima fecha de cobro"  value="30 de septiembre de 2026" />
              <InfoRow label="Estado de suscripción"   value="Activo" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-gray-100">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <IconCreditCard />
                Actualizar método de pago
              </button>
              <button
                onClick={() => setShowCancelSub(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancelar suscripción
              </button>
            </div>
          </SectionCard>

          {/* ── Seguridad ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-gray-400"><IconShield /></span>
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Seguridad de la cuenta</h2>
            </div>
            <div className="divide-y divide-gray-50">
              <button
                onClick={() => setShowChangePwd(true)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#eef2ff', color: '#4f46e5' }}><IconKey /></div>
                  <div className="text-left">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Cambiar contraseña</p>
                    <p className="text-xs text-gray-400 mt-0.5">Actualiza tu contraseña de acceso</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-indigo-500 transition-colors" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>

              <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fffbeb', color: '#d97706' }}><IconMonitor /></div>
                  <div className="text-left">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Cerrar sesiones activas</p>
                    <p className="text-xs text-gray-400 mt-0.5">Cierra sesión en todos los dispositivos</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-amber-400 transition-colors" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fef2f2', color: '#dc2626' }}><IconLogOut /></div>
                  <div className="text-left">
                    <p className="text-sm text-red-600" style={{ fontWeight: 600 }}>Cerrar sesión</p>
                    <p className="text-xs text-gray-400 mt-0.5">Salir de tu cuenta de EventNova</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-red-400 transition-colors" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </section>

          {/* bottom spacing */}
          <div className="h-4" />
        </div>
      </main>

      {/* ── Modals ── */}
      {editPersonal && <EditPersonalModal info={personal} onClose={() => setEditPersonal(false)} onSave={handleSavePersonal} />}
      {editAgent    && <EditAgentModal   info={agentInfo} onClose={() => setEditAgent(false)}   onSave={handleSaveAgent} />}
      {planTarget   && <PlanChangeModal  plan={planTarget} onCancel={() => setPlanTarget(null)} onConfirm={handlePlanChange} />}
      {showCancelSub && <CancelSubModal  onKeep={() => setShowCancelSub(false)} onCancel={() => { setShowCancelSub(false); showToast('Tu suscripción será cancelada al final del período.') }} />}
      {showChangePwd && <ChangePasswordModal onClose={() => setShowChangePwd(false)} />}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} />}
    </div>
  )
}
