import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'
interface Props { onLogout: () => void; onNavigate: (key: AdminNavKey) => void; activeNav: AdminNavKey }

// ─── Icons ────────────────────────────────────────────────────────────────────

const ITicket  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
const ILogOut  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
const IEdit    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
const IKey     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
const IMail    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
const IShield  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const ILogOutS = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
const ICheck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
const IX       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
const IEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
const IEyeOff  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
const IChev    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
const IGlobe   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
const IBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
const IActivity= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

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

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm"
      style={{ background: '#059669', fontWeight: 600, animation: 'fadeInUp .25s ease' }}>
      <ICheck />{msg}
      <button onClick={onDone} className="ml-2 opacity-70 hover:opacity-100 transition-opacity"><IX /></button>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none shrink-0"
      style={{ background: on ? '#4f46e5' : '#d1d5db' }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  )
}

// ─── Password field ───────────────────────────────────────────────────────────

function PwdField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
          placeholder="••••••••" />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <IEyeOff /> : <IEye />}
        </button>
      </div>
    </div>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({ label, value, onChange, disabled, type = 'text', hint }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean; type?: string; hint?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
          disabled
            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white'
        }`} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ─── Sel field ────────────────────────────────────────────────────────────────

function SelField({ label, value, onChange, opts, disabled }: { label: string; value: string; onChange?: (v: string) => void; opts: string[]; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled}
          className={`w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
            disabled
              ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-200 focus:border-indigo-400 bg-white cursor-pointer'
          }`}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
      </div>
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

// ─── Activity data ────────────────────────────────────────────────────────────

const ACTIVITY = [
  { actividad: 'Inicio de sesión',        fecha: '31 Ago 2026, 08:12', dispositivo: 'Chrome · Windows 11',  estado: 'Exitoso'    },
  { actividad: 'Consulta de reportes',    fecha: '30 Ago 2026, 15:44', dispositivo: 'Chrome · Windows 11',  estado: 'Exitoso'    },
  { actividad: 'Actualización de perfil', fecha: '28 Ago 2026, 11:20', dispositivo: 'Safari · macOS',       estado: 'Exitoso'    },
  { actividad: 'Cambio de contraseña',    fecha: '20 Ago 2026, 09:05', dispositivo: 'Chrome · Windows 11',  estado: 'Exitoso'    },
  { actividad: 'Inicio de sesión',        fecha: '18 Ago 2026, 07:58', dispositivo: 'Firefox · Ubuntu',     estado: 'Fallido'    },
  { actividad: 'Inicio de sesión',        fecha: '18 Ago 2026, 08:01', dispositivo: 'Firefox · Ubuntu',     estado: 'Exitoso'    },
  { actividad: 'Consulta de reportes',    fecha: '15 Ago 2026, 14:30', dispositivo: 'Chrome · Windows 11',  estado: 'Exitoso'    },
  { actividad: 'Cierre de sesión',        fecha: '14 Ago 2026, 17:00', dispositivo: 'Chrome · Windows 11',  estado: 'Exitoso'    },
]

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  Exitoso: { bg: '#ecfdf5', color: '#059669' },
  Fallido: { bg: '#fef2f2', color: '#dc2626' },
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminProfile({ onLogout, onNavigate, activeNav }: Props) {
  // Profile state
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    nombre:       'Alejandro Estrada',
    correo:       'a.estrada@eventnova.co',
    identificacion: '1.098.234.567',
    telefono:     '+57 310 845 2190',
    direccion:    'Cra. 7 #32-16, Oficina 504',
    pais:         'Colombia',
    departamento: 'Cundinamarca',
    ciudad:       'Bogotá',
  })
  const [draft, setDraft] = useState({ ...profile })

  // Password modal
  const [pwdModal, setPwdModal] = useState(false)
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew,     setPwdNew]     = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [pwdError,   setPwdError]   = useState('')

  // Preferences
  const [notifSistema,   setNotifSistema]   = useState(true)
  const [notifReportes,  setNotifReportes]  = useState(true)
  const [notifActividad, setNotifActividad] = useState(false)
  const [idioma,         setIdioma]         = useState('Español')

  // Toast
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  // Handlers
  const handleSaveProfile = () => {
    setProfile({ ...draft })
    setEditing(false)
    showToast('Perfil actualizado correctamente.')
  }

  const handleSavePwd = () => {
    if (!pwdCurrent) { setPwdError('Ingresa tu contraseña actual.'); return }
    if (pwdNew.length < 8) { setPwdError('La nueva contraseña debe tener al menos 8 caracteres.'); return }
    if (pwdNew !== pwdConfirm) { setPwdError('Las contraseñas no coinciden.'); return }
    setPwdModal(false)
    setPwdCurrent(''); setPwdNew(''); setPwdConfirm(''); setPwdError('')
    showToast('Contraseña actualizada correctamente.')
  }

  const setD = (key: keyof typeof draft) => (v: string) => setDraft(d => ({ ...d, [key]: v }))

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>
      <Sidebar activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Mi perfil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Administra tu información personal y la configuración de tu cuenta.</p>
        </div>

        <div className="px-8 py-7 max-w-5xl flex flex-col gap-7">

          {/* ── Sec 1: Personal info ── */}
          <SectionCard
            title="Información personal"
            subtitle="Datos personales asociados a tu cuenta de administrador"
            action={
              !editing
                ? <button onClick={() => { setDraft({ ...profile }); setEditing(true) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    style={{ fontWeight: 500 }}><IEdit />Editar perfil</button>
                : <div className="flex items-center gap-2">
                    <button onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      style={{ fontWeight: 500 }}>Cancelar</button>
                    <button onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 transition-colors"
                      style={{ background: '#4f46e5', fontWeight: 600 }}><ICheck />Guardar cambios</button>
                  </div>
            }>
            <div className="flex flex-col gap-6">
              {/* Avatar row */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl shrink-0 select-none"
                  style={{ background: 'linear-gradient(135deg, #92400e, #d97706)', fontWeight: 800 }}>AE</div>
                <div>
                  <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>{profile.nombre}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{profile.correo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Administrador
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Cuenta activa
                    </span>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nombre completo"    value={editing ? draft.nombre       : profile.nombre}       onChange={setD('nombre')}       disabled={!editing} />
                <Field label="Correo electrónico" value={editing ? draft.correo       : profile.correo}       onChange={setD('correo')}       disabled={!editing} type="email" />
                <Field label="Nº de identificación" value={editing ? draft.identificacion : profile.identificacion} onChange={setD('identificacion')} disabled={!editing} />
                <Field label="Teléfono"           value={editing ? draft.telefono     : profile.telefono}     onChange={setD('telefono')}     disabled={!editing} type="tel" />
                <Field label="Dirección"          value={editing ? draft.direccion    : profile.direccion}    onChange={setD('direccion')}    disabled={!editing} />
                <Field label="Rol"                value="Administrador"               disabled hint="El rol es de solo lectura y no puede modificarse." />
                <SelField label="País"            value={editing ? draft.pais         : profile.pais}         onChange={setD('pais')}         opts={['Colombia','Ecuador','Perú','Panamá']} disabled={!editing} />
                <SelField label="Departamento"    value={editing ? draft.departamento : profile.departamento} onChange={setD('departamento')} opts={['Cundinamarca','Antioquia','Valle del Cauca','Atlántico','Santander']} disabled={!editing} />
                <SelField label="Ciudad"          value={editing ? draft.ciudad       : profile.ciudad}       onChange={setD('ciudad')}       opts={['Bogotá','Medellín','Cali','Barranquilla','Bucaramanga']} disabled={!editing} />
              </div>
            </div>
          </SectionCard>

          {/* ── Sec 2: Account info ── */}
          <SectionCard title="Información de la cuenta" subtitle="Detalles del estado y acceso de tu cuenta administrativa">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Rol',                  value: 'Administrador',          badge: true  },
                { label: 'Estado de la cuenta',  value: 'Activo',                 green: true  },
                { label: 'Fecha de registro',    value: '15 de enero de 2026'                  },
                { label: 'Último acceso',        value: '31 Ago 2026, 08:12 AM'               },
                { label: 'Correo de la cuenta',  value: profile.correo                        },
              ].map(({ label, value, badge, green }) => (
                <div key={label} className="flex flex-col gap-1.5 bg-gray-50 rounded-xl px-4 py-3.5">
                  <p className="text-xs text-gray-400" style={{ fontWeight: 600 }}>{label}</p>
                  {badge
                    ? <span className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full self-start" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>{value}</span>
                    : green
                    ? <span className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full self-start" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 700 }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{value}
                      </span>
                    : <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{value}</p>}
                </div>
              ))}
              <div className="flex flex-col gap-1.5 bg-indigo-50 rounded-xl px-4 py-3.5 border border-indigo-100">
                <p className="text-xs text-indigo-400" style={{ fontWeight: 600 }}>Tipo de cuenta</p>
                <span className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full self-start" style={{ background: '#4f46e5', color: 'white', fontWeight: 700 }}>
                  <IShield />Cuenta administrativa
                </span>
              </div>
            </div>
          </SectionCard>

          {/* ── Sec 3: Security ── */}
          <SectionCard title="Seguridad" subtitle="Administra las opciones de seguridad y acceso de tu cuenta">
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <IKey />, label: 'Cambiar contraseña',
                  sub:  'Actualiza tu contraseña de acceso al panel.',
                  color: '#4f46e5', bg: '#eef2ff',
                  action: <button onClick={() => setPwdModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    style={{ fontWeight: 500 }}><IKey />Cambiar</button>,
                },
                {
                  icon: <IMail />, label: 'Cambiar correo electrónico',
                  sub:  'Actualiza el correo asociado a tu cuenta.',
                  color: '#d97706', bg: '#fffbeb',
                  action: <button onClick={() => showToast('Para cambiar el correo contacta al soporte técnico.')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
                    style={{ fontWeight: 500 }}><IMail />Cambiar</button>,
                },
                {
                  icon: <ILogOutS />, label: 'Cerrar sesiones activas',
                  sub:  'Finaliza todas las sesiones abiertas en otros dispositivos.',
                  color: '#dc2626', bg: '#fef2f2',
                  action: <button onClick={() => showToast('Sesiones activas cerradas correctamente.')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    style={{ fontWeight: 500 }}><ILogOutS />Cerrar sesiones</button>,
                },
              ].map(({ icon, label, sub, color, bg, action }) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>{icon}</div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                  {action}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Sec 4: Preferences ── */}
          <SectionCard title="Preferencias" subtitle="Configura las notificaciones y el idioma del panel">
            <div className="flex flex-col gap-4">
              {[
                { icon: <IBell />, label: 'Recibir notificaciones del sistema', sub: 'Alertas generales de la plataforma', on: notifSistema,   toggle: () => setNotifSistema(v => !v)   },
                { icon: <IActivity />, label: 'Recibir alertas de reportes',    sub: 'Notificaciones sobre reportes y estadísticas', on: notifReportes,  toggle: () => setNotifReportes(v => !v)  },
                { icon: <IBell />, label: 'Recibir alertas de actividad',        sub: 'Actividad de usuarios, eventos y reservas', on: notifActividad, toggle: () => setNotifActividad(v => !v) },
              ].map(({ icon, label, sub, on, toggle }) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: on ? '#eef2ff' : '#f3f4f6', color: on ? '#4f46e5' : '#9ca3af' }}>{icon}</div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                  <Toggle on={on} onToggle={toggle} />
                </div>
              ))}
              {/* Language */}
              <div className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eef2ff', color: '#4f46e5' }}><IGlobe /></div>
                  <div>
                    <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Idioma del panel</p>
                    <p className="text-xs text-gray-400 mt-0.5">Selecciona el idioma de la interfaz</p>
                  </div>
                </div>
                <div className="relative">
                  <select value={idioma} onChange={e => setIdioma(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                    style={{ fontWeight: 500 }}>
                    <option>Español</option>
                    <option>English</option>
                    <option>Português</option>
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><IChev /></span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Sec 5: Account activity ── */}
          <SectionCard title="Actividad de la cuenta" subtitle="Historial de accesos y acciones recientes">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead><tr style={{ background: '#fafafa' }}>
                  {['Actividad','Fecha','Dispositivo','Estado'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs text-gray-500 whitespace-nowrap"
                      style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ACTIVITY.map((a, i) => {
                    const s = STATUS_BADGE[a.estado]
                    return (
                      <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/20 transition-colors">
                        <td className="px-6 py-3.5 text-sm text-gray-800" style={{ fontWeight: 600 }}>{a.actividad}</td>
                        <td className="px-6 py-3.5 text-xs text-gray-500 whitespace-nowrap">{a.fecha}</td>
                        <td className="px-6 py-3.5 text-xs text-gray-500 whitespace-nowrap">{a.dispositivo}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: s.bg, color: s.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />{a.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="h-2" />
        </div>
      </main>

      {/* ── Password modal ── */}
      {pwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Cambiar contraseña</h3>
                <p className="text-xs text-gray-400 mt-0.5">La nueva contraseña debe tener al menos 8 caracteres.</p>
              </div>
              <button onClick={() => { setPwdModal(false); setPwdError('') }} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors ml-4 shrink-0"><IX /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              {pwdError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <IX />{pwdError}
                </div>
              )}
              <PwdField label="Contraseña actual"       value={pwdCurrent} onChange={setPwdCurrent} />
              <PwdField label="Nueva contraseña"        value={pwdNew}     onChange={setPwdNew}     />
              <PwdField label="Confirmar nueva contraseña" value={pwdConfirm} onChange={setPwdConfirm} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => { setPwdModal(false); setPwdError('') }}
                className="flex-1 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}>Cancelar</button>
              <button onClick={handleSavePwd}
                className="flex-1 py-2.5 rounded-xl text-sm text-white hover:opacity-90 transition-colors"
                style={{ background: '#4f46e5', fontWeight: 600 }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  )
}
