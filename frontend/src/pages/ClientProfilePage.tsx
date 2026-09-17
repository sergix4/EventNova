import { useState } from 'react'

type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'

// ─── Icons (identical subset used across dashboard pages) ─────────────────────

function IconTicket({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}
function IconHome() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> }
function IconCompass() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg> }
function IconClipboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg> }
function IconUser() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function IconLogOut() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg> }
function IconBell() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg> }
function IconMenu() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg> }
function IconEdit() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> }
function IconMail() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> }
function IconPhone() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg> }
function IconMapPin() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> }
function IconShield() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> }
function IconToggle() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="6" /><circle cx="16" cy="12" r="3" /></svg> }

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio',   label: 'Inicio',          icon: <IconHome /> },
  { key: 'explorar', label: 'Explorar eventos', icon: <IconCompass /> },
  { key: 'reservas', label: 'Mis reservas',     icon: <IconClipboard /> },
  { key: 'perfil',   label: 'Mi perfil',        icon: <IconUser /> },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeNav, onNav, onLogout }: { activeNav: NavKey; onNav: (k: NavKey) => void; onLogout: () => void }) {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 220, flexShrink: 0 }}>
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-gray-100" style={{ height: 64 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4f46e5' }}>
          <span className="text-white"><IconTicket size={18} /></span>
        </div>
        <span className="text-base tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
          Event<span style={{ color: '#4f46e5' }}>Nova</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-xs text-gray-400 px-2 mb-2 uppercase" style={{ fontWeight: 600, letterSpacing: '0.08em' }}>Menú</p>
        {navItems.map(({ key, label, icon }) => {
          const active = activeNav === key
          return (
            <button key={key} onClick={() => onNav(key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left w-full"
              style={{ background: active ? '#eef2ff' : 'transparent', color: active ? '#4338ca' : '#6b7280', fontWeight: active ? 700 : 500 }}>
              <span className="shrink-0" style={{ color: active ? '#4f46e5' : '#9ca3af' }}>{icon}</span>
              <span className="truncate">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#4f46e5' }} />}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>LG</div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>Laura García</p>
            <p className="text-xs text-gray-400">Cliente</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-2 py-2 mt-1 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <IconLogOut /><span style={{ fontWeight: 500 }}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <span className="shrink-0" style={{ color: '#6366f1' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  )
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-all shrink-0 mt-0.5"
        style={{ background: checked ? '#4f46e5' : '#d1d5db' }}
      >
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: checked ? '22px' : '2px' }} />
      </button>
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, accent, children, action }: { title: string; accent: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base text-gray-900 flex items-center gap-2" style={{ fontWeight: 700 }}>
          <span className="w-1 h-5 rounded-full inline-block" style={{ background: accent }} />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ClientProfilePageProps {
  onLogout: () => void
  onNavigate?: (key: NavKey) => void
  activeNav?: NavKey
}

export default function ClientProfilePage({ onLogout, onNavigate, activeNav = 'perfil' }: ClientProfilePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [publicidad, setPublicidad] = useState(true)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifReservas, setNotifReservas] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col h-full shrink-0" style={{ width: 220 }}>
        <Sidebar activeNav={activeNav} onNav={(k) => onNavigate?.(k)} onLogout={onLogout} />
      </div>

      {/* Sidebar mobile */}
      <div className="fixed left-0 top-0 h-full z-40 md:hidden flex flex-col transition-transform duration-200"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', width: 220 }}>
        <Sidebar activeNav={activeNav} onNav={(k) => { onNavigate?.(k); setSidebarOpen(false) }} onLogout={onLogout} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0" style={{ height: 64 }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}><IconMenu /></button>
            <div>
              <h1 className="text-lg text-gray-900 leading-tight" style={{ fontWeight: 700 }}>Mi perfil</h1>
              <p className="text-xs text-gray-400 leading-none">Gestiona tu información personal y preferencias.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              <IconBell />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 700 }}>LG</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl flex flex-col gap-6">

            {/* Avatar + name */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', fontWeight: 800 }}>
                  LG
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-sm">
                  <IconEdit />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl text-gray-900" style={{ fontWeight: 800 }}>Laura García</p>
                <p className="text-sm text-gray-400 mt-0.5">Cliente · Desde agosto 2025</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                    Cuenta activa
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    ID: CLI-2025-0042
                  </span>
                </div>
              </div>
              {saved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-xl" style={{ fontWeight: 600 }}>
                  ✓ Guardado
                </div>
              )}
            </div>

            {/* Personal info */}
            <SectionCard
              title="Información personal"
              accent="#4f46e5"
              action={
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
                  style={editing
                    ? { background: '#4f46e5', color: 'white', borderColor: '#4f46e5', fontWeight: 600 }
                    : { borderColor: '#e5e7eb', color: '#6b7280', fontWeight: 600 }}
                >
                  <IconEdit />
                  {editing ? 'Guardar cambios' : 'Editar'}
                </button>
              }
            >
              <FieldRow icon={<IconUser />}   label="Nombre completo"       value="Laura García Romero" />
              <FieldRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M16 10h2M16 14h2M7 10h2a2 2 0 1 1 0 4H7z" /></svg>} label="N.° de identificación" value="1.023.456.789" />
              <FieldRow icon={<IconMail />}   label="Correo electrónico"    value="laura.garcia@correo.com" />
              <FieldRow icon={<IconPhone />}  label="Teléfono"              value="+57 312 456 7890" />
              <FieldRow icon={<IconMapPin />} label="Ciudad"                value="Bogotá, Cundinamarca" />
              <FieldRow icon={<IconMapPin />} label="Dirección"             value="Cra. 15 #85-42, Chapinero" />
            </SectionCard>

            {/* Preferences */}
            <SectionCard title="Preferencias" accent="#f4845f">
              <ToggleRow
                label="Publicidad personalizada"
                description="Recibe sugerencias de eventos según tus intereses."
                checked={publicidad}
                onChange={setPublicidad}
              />
              <ToggleRow
                label="Notificaciones por correo"
                description="Recibe confirmaciones y actualizaciones de tus reservas."
                checked={notifEmail}
                onChange={setNotifEmail}
              />
              <ToggleRow
                label="Notificaciones de reservas"
                description="Alertas cuando el estado de tu reserva cambie."
                checked={notifReservas}
                onChange={setNotifReservas}
              />
            </SectionCard>

            {/* Security */}
            <SectionCard title="Seguridad" accent="#6366f1">
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
                  <span style={{ color: '#6366f1' }}><IconShield /></span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Cambiar contraseña</p>
                    <p className="text-xs text-gray-400">Última actualización: hace 3 meses</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </SectionCard>

            {/* Danger zone */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-red-800 mb-1" style={{ fontWeight: 700 }}>Cerrar sesión</p>
                <p className="text-xs text-red-500">Saldrás de tu cuenta en este dispositivo.</p>
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                style={{ fontWeight: 600 }}
              >
                Cerrar sesión
              </button>
            </div>

            <div className="h-4" />
          </div>
        </main>
      </div>
    </div>
  )
}
