import { useState } from 'react'
import { SHARED_EVENTS } from './sharedData'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ClientDashboard from './pages/ClientDashboard'
import EventDetailPage from './pages/EventDetailPage'
import MyReservationsPage from './pages/MyReservationsPage'
import ClientProfilePage from './pages/ClientProfilePage'
import ExploreEventsPage from './pages/ExploreEventsPage'
import AgentDashboard from './pages/AgentDashboard'
import RegisterEventPage from './pages/RegisterEventPage'
import AgentReservationsPage from './pages/AgentReservationsPage'
import AgentProfilePage from './pages/AgentProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminGeneralReports from './pages/AdminGeneralReports'
import AdminCommercialReports from './pages/AdminCommercialReports'
import AdminCoverageEvents from './pages/AdminCoverageEvents'
import AdminOperations from './pages/AdminOperations'
import AdminProfile from './pages/AdminProfile'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconTicket() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
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

function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
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

function IconLayers() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.6-8.57 3.9a2 2 0 0 1-1.66 0L3 12.6" />
      <path d="m22 17.6-8.57 3.9a2 2 0 0 1-1.66 0L3 17.6" />
    </svg>
  )
}

function IconZap() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconSmile() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 13s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const _statusMap: Record<string, { status: string; statusColor: string }> = {
  'Programado':   { status: 'Disponible',       statusColor: 'green' },
  'En boletería': { status: 'Últimas entradas',  statusColor: 'amber' },
  'En vivo':      { status: 'Disponible',        statusColor: 'green' },
  'Finalizado':   { status: 'Agotado',           statusColor: 'red'   },
  'Cancelado':    { status: 'Agotado',           statusColor: 'red'   },
}

const events = SHARED_EVENTS.slice(0, 4).map((e, i) => ({
  id: i + 1,
  name: e.nombre,
  city: e.ciudad,
  date: e.fecha.replace(/^(\d+) (\w+) (\d+)$/, (_, d, m, y) =>
    `${d} ${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`),
  time: e.hora,
  price: e.precioStr,
  status: (_statusMap[e.estado] ?? { status: 'Disponible', statusColor: 'green' }).status,
  statusColor: (_statusMap[e.estado] ?? { status: 'Disponible', statusColor: 'green' }).statusColor,
  category: e.categoria,
  image: e.image,
}))

const steps = [
  {
    number: "01",
    icon: <IconSearch />,
    title: "Explora eventos",
    description: "Navega por una amplia selección de conciertos, obras de teatro, festivales y más eventos cerca de ti.",
  },
  {
    number: "02",
    icon: <IconTicket />,
    title: "Reserva tus entradas",
    description: "Selecciona la cantidad de entradas, elige tu ubicación preferida y completa tu reserva en segundos.",
  },
  {
    number: "03",
    icon: <IconSmile />,
    title: "Disfruta el evento",
    description: "Recibe tu entrada digital, consulta el estado de tu reserva en cualquier momento y vive la experiencia.",
  },
]

const benefits = [
  {
    icon: <IconLayers />,
    title: "Eventos en un solo lugar",
    description: "Conciertos, teatro, festivales, comedia y más — toda la cultura colombiana reunida en una sola plataforma.",
  },
  {
    icon: <IconZap />,
    title: "Reservas fáciles y rápidas",
    description: "Proceso de reserva simplificado en pocos pasos. Sin complicaciones, sin filas, sin demoras.",
  },
  {
    icon: <IconClipboard />,
    title: "Consulta el estado de tus reservas",
    description: "Accede a todas tus reservas activas, historial y entradas digitales desde tu perfil en cualquier momento.",
  },
  {
    icon: <IconInfo />,
    title: "Información clara de cada evento",
    description: "Fechas, horarios, ubicación, precios y disponibilidad siempre actualizados y fáciles de entender.",
  },
]

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBadge({ status, color }: { status: string; color: string }) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-red-50 text-red-600 border border-red-200",
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[color]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
      {status}
    </span>
  )
}

function EventCard({ event }: { event: typeof events[0] }) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-48 bg-indigo-100 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-indigo-700 px-2.5 py-1 rounded-full">
            {event.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <StatusBadge status={event.status} color={event.statusColor} />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-700 text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.name}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400"><IconMapPin /></span>
            <span>{event.city}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400"><IconCalendar /></span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-400"><IconClock /></span>
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Desde</span>
            <span className="font-700 text-gray-900 text-base">{event.price}</span>
          </div>
          <button
            className="text-sm font-600 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 flex items-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            Ver evento
            <IconArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  type Page = 'home' | 'login' | 'register' | 'dashboard' | 'explore-events' | 'event-detail' | 'my-reservations' | 'profile' | 'agent-dashboard' | 'agent-register-event' | 'agent-reservations' | 'agent-profile' | 'admin-dashboard' | 'admin-general-reports' | 'admin-commercial-reports' | 'admin-coverage' | 'admin-operations' | 'admin-profile'
  type AdminNavKey = 'dashboard' | 'reportes-generales' | 'reportes-comerciales' | 'cobertura' | 'reservas-operacion' | 'perfil'
  type NavKey = 'inicio' | 'explorar' | 'reservas' | 'perfil'
  type AgentNavKey = 'mis-eventos' | 'registrar-evento' | 'reservas' | 'perfil'

  const [page, setPage] = useState<Page>('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Map sidebar nav key → page
  const handleClientNav = (key: NavKey) => {
    const map: Record<NavKey, Page> = {
      inicio:   'dashboard',
      explorar: 'explore-events',
      reservas: 'my-reservations',
      perfil:   'profile',
    }
    setPage(map[key])
  }

  // Derive active sidebar item from current page
  const activeNavFromPage = (p: Page): NavKey => {
    if (p === 'explore-events' || p === 'event-detail') return 'explorar'
    if (p === 'my-reservations') return 'reservas'
    if (p === 'profile') return 'perfil'
    return 'inicio'
  }

  const sharedDashboardProps = {
    onLogout:    () => setPage('home'),
    onNavigate:  handleClientNav,
    activeNav:   activeNavFromPage(page),
    onViewEvent: () => setPage('event-detail'),
  }

  if (page === 'dashboard')
    return <ClientDashboard {...sharedDashboardProps} />
  if (page === 'explore-events')
    return <ExploreEventsPage onLogout={() => setPage('home')} onNavigate={handleClientNav} activeNav="explorar" onViewEvent={() => setPage('event-detail')} />
  if (page === 'event-detail')
    return <EventDetailPage onBack={() => setPage('explore-events')} onLogout={() => setPage('home')} onNavigate={handleClientNav} activeNav={activeNavFromPage(page)} />
  if (page === 'my-reservations')
    return <MyReservationsPage onLogout={() => setPage('home')} onViewEvent={() => setPage('event-detail')} onNavigate={handleClientNav} activeNav="reservas" />
  if (page === 'profile')
    return <ClientProfilePage onLogout={() => setPage('home')} onNavigate={handleClientNav} activeNav="perfil" />
  const handleAgentNav = (key: AgentNavKey) => {
    const agentMap: Record<AgentNavKey, Page> = {
      'mis-eventos':      'agent-dashboard',
      'registrar-evento': 'agent-register-event',
      'reservas':         'agent-reservations',
      'perfil':           'agent-profile',
    }
    setPage(agentMap[key])
  }

  const agentActiveNav = (p: Page): AgentNavKey => {
    if (p === 'agent-register-event') return 'registrar-evento'
    if (p === 'agent-reservations') return 'reservas'
    if (p === 'agent-profile') return 'perfil'
    return 'mis-eventos'
  }

  if (page === 'agent-dashboard')
    return (
      <AgentDashboard
        activeNav={agentActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAgentNav}
      />
    )
  if (page === 'agent-register-event')
    return (
      <RegisterEventPage
        activeNav={agentActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAgentNav}
      />
    )
  if (page === 'agent-reservations')
    return (
      <AgentReservationsPage
        activeNav={agentActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAgentNav}
      />
    )
  if (page === 'agent-profile')
    return (
      <AgentProfilePage
        activeNav={agentActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAgentNav}
      />
    )

  const handleAdminNav = (key: AdminNavKey) => {
    const adminMap: Record<AdminNavKey, Page> = {
      'dashboard':            'admin-dashboard',
      'reportes-generales':   'admin-general-reports',
      'reportes-comerciales': 'admin-commercial-reports',
      'cobertura':            'admin-coverage',
      'reservas-operacion':   'admin-operations',
      'perfil':               'admin-profile',
    }
    setPage(adminMap[key])
  }

  const adminActiveNav = (p: Page): AdminNavKey => {
    if (p === 'admin-general-reports')    return 'reportes-generales'
    if (p === 'admin-commercial-reports') return 'reportes-comerciales'
    if (p === 'admin-coverage')           return 'cobertura'
    if (p === 'admin-operations')         return 'reservas-operacion'
    if (p === 'admin-profile')            return 'perfil'
    return 'dashboard'
  }

  if (page === 'admin-dashboard')
    return (
      <AdminDashboard
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'admin-general-reports')
    return (
      <AdminGeneralReports
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'admin-commercial-reports')
    return (
      <AdminCommercialReports
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'admin-coverage')
    return (
      <AdminCoverageEvents
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'admin-operations')
    return (
      <AdminOperations
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'admin-profile')
    return (
      <AdminProfile
        activeNav={adminActiveNav(page)}
        onLogout={() => setPage('home')}
        onNavigate={handleAdminNav}
      />
    )
  if (page === 'login') return <LoginPage onBack={() => setPage('home')} onRegister={() => setPage('register')} onLogin={() => setPage('dashboard')} />
  if (page === 'register') return <RegisterPage onBack={() => setPage('home')} onLogin={() => setPage('login')} onAgentRegister={() => setPage('agent-dashboard')} />

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
              <span className="text-white text-sm"><IconTicket /></span>
            </div>
            <span className="text-xl font-800 tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
              Event<span style={{ color: '#4f46e5' }}>Nova</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {['Inicio', 'Eventos', '¿Cómo funciona?'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-500 text-gray-600 hover:text-indigo-600 transition-colors"
                style={{ fontWeight: 500 }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setPage('admin-dashboard')}
              className="text-sm font-500 text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              style={{ fontWeight: 500 }}
            >
              Panel Admin
            </button>
            <button
              onClick={() => setPage('agent-dashboard')}
              className="text-sm font-500 text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              style={{ fontWeight: 500 }}
            >
              Panel Agente
            </button>
            <button
              onClick={() => setPage('login')}
              className="text-sm font-500 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              style={{ fontWeight: 500 }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setPage('register')}
              className="text-sm font-600 text-white px-5 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#f4845f', fontWeight: 600 }}
            >
              Registrarse
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
            {['Inicio', 'Eventos', '¿Cómo funciona?'].map((item) => (
              <a key={item} href="#" className="text-sm font-500 text-gray-700 py-1" style={{ fontWeight: 500 }}>
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => { setPage('login'); setMobileOpen(false) }}
                className="w-full text-sm font-500 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 text-center"
                style={{ fontWeight: 500 }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { setPage('register'); setMobileOpen(false) }}
                className="w-full text-sm font-600 text-white px-4 py-2.5 rounded-xl text-center"
                style={{ background: '#f4845f', fontWeight: 600 }}
              >
                Registrarse
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left: copy */}
        <div className="flex flex-col gap-7">
          <div className="inline-flex items-center gap-2 self-start bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-600 px-3.5 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Plataforma de eventos en Colombia
          </div>

          <div className="flex flex-col gap-4">
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl leading-tight text-gray-900"
              style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Vive el evento.<br />
              <span style={{ color: '#4f46e5' }}>Nosotros hacemos</span>{' '}
              <span style={{ color: '#f4845f' }}>la reserva.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md" style={{ fontWeight: 400 }}>
              Descubre conciertos, teatro, festivales y más en una sola plataforma. Reserva tus entradas en segundos y vive experiencias únicas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 text-sm font-600 text-white px-6 py-3.5 rounded-xl shadow-md hover:opacity-90 transition-all active:scale-95"
              style={{ background: '#4f46e5', fontWeight: 600 }}
            >
              <IconSearch />
              Explorar eventos
            </button>
            <button
              className="flex items-center gap-2 text-sm font-600 px-6 py-3.5 rounded-xl border-2 hover:bg-gray-50 transition-all"
              style={{ color: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600 }}
            >
              Crear una cuenta
              <IconArrowRight />
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {['#6366f1','#8b5cf6','#f4845f','#10b981'].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-700" style={{ background: c, fontWeight: 700, zIndex: 4 - i }}>
                  {['JM','AR','CV','LH'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#f59e0b' }}><IconStar /></span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">+12,000 usuarios satisfechos</p>
            </div>
          </div>
        </div>

        {/* Right: visual */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Main image */}
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop&auto=format"
              alt="Concierto en vivo con luces de escenario"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(79,70,229,0.5) 0%, transparent 60%)' }} />
          </div>

          {/* Floating ticket card */}
          <div className="absolute -left-8 top-16 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100" style={{ maxWidth: 220 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eef2ff' }}>
              <span style={{ color: '#4f46e5' }}><IconTicket /></span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Entrada confirmada</p>
              <p className="text-sm font-700 text-gray-900" style={{ fontWeight: 700 }}>Maluma · Bogotá</p>
              <p className="text-xs" style={{ color: '#f4845f', fontWeight: 600 }}>15 Sep 2025 · 8:00 PM</p>
            </div>
          </div>

          {/* Floating stats card */}
          <div className="absolute -right-4 bottom-20 bg-white rounded-2xl shadow-xl p-4 border border-gray-100" style={{ minWidth: 160 }}>
            <p className="text-xs text-gray-500 mb-2">Eventos este mes</p>
            <p className="text-3xl font-800 text-gray-900" style={{ fontWeight: 800 }}>840+</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-emerald-500 text-xs font-600" style={{ fontWeight: 600 }}>↑ 24%</span>
              <span className="text-xs text-gray-400">vs. mes anterior</span>
            </div>
          </div>

          {/* Decorative dot */}
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
          <div className="absolute -bottom-6 -left-4 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f4845f, transparent)' }} />
        </div>
      </section>

      {/* ── Discover Events ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-600 mb-3" style={{ color: '#4f46e5', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Catálogo de eventos
            </p>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
              Encuentra tu próximo evento
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              De Bogotá a Cartagena, explora los mejores espectáculos del país con disponibilidad en tiempo real.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              className="inline-flex items-center gap-2 text-sm font-600 px-7 py-3.5 rounded-xl border-2 hover:bg-indigo-50 transition-all"
              style={{ color: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600 }}
            >
              Ver todos los eventos
              <IconArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-600 mb-3" style={{ color: '#f4845f', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Simple y rápido
            </p>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Tres pasos y listo — tu entrada digital lista para disfrutar el mejor evento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px" style={{ background: 'repeating-linear-gradient(90deg, #c7d2fe 0, #c7d2fe 6px, transparent 6px, transparent 14px)' }} />

            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-800 px-2.5 py-1 rounded-full text-white" style={{ background: '#4f46e5', fontWeight: 800 }}>
                  {step.number}
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mt-2" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 700 }}>{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: image */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop&auto=format"
                  alt="Concierto multitudinario"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 opacity-20 rounded-3xl" style={{ background: 'linear-gradient(135deg, #4f46e5, #f4845f)' }} />
              </div>
              {/* floating benefit badge */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg px-5 py-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: '#10b981' }}><IconCheck /></span>
                  <span className="text-sm font-700 text-gray-900" style={{ fontWeight: 700 }}>Pago 100% seguro</span>
                </div>
                <p className="text-xs text-gray-400">Transacciones protegidas siempre</p>
              </div>
            </div>

            {/* Right: benefits */}
            <div>
              <p className="text-sm font-600 mb-3" style={{ color: '#4f46e5', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Por qué EventNova
              </p>
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                Todo lo que necesitas<br />en una sola plataforma
              </h2>
              <p className="text-gray-500 mb-10">
                Diseñada para hacer que descubrir y reservar eventos sea la parte más fácil de tu plan.
              </p>

              <div className="flex flex-col gap-6">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: i % 2 === 0 ? '#eef2ff' : '#fff7f5', color: i % 2 === 0 ? '#4f46e5' : '#f4845f' }}>
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="text-base text-gray-900 mb-1" style={{ fontWeight: 700 }}>{b.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden px-8 md:px-16 py-16 md:py-20 text-center"
            style={{ background: '#4f46e5' }}
          >
            {/* decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full opacity-10 bg-white" />
            <div className="absolute top-8 left-12 w-3 h-3 rounded-full opacity-30 bg-white" />
            <div className="absolute bottom-10 right-20 w-5 h-5 rounded-full opacity-20 bg-white" />

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <span className="text-white"><IconTicket /></span>
              </div>
              <h2 className="text-3xl md:text-4xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                Tu próximo evento está aquí.
              </h2>
              <p className="text-indigo-200 text-base leading-relaxed">
                Únete a miles de colombianos que ya descubren y reservan los mejores eventos con EventNova. Gratis, fácil y en minutos.
              </p>
              <button
                className="flex items-center gap-2 text-sm font-700 px-8 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                style={{ background: '#f4845f', color: 'white', fontWeight: 700 }}
              >
                <IconSearch />
                Explorar eventos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
                <span className="text-white" style={{ transform: 'scale(0.8)', display: 'block' }}><IconTicket /></span>
              </div>
              <span className="text-lg font-800 tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
                Event<span style={{ color: '#4f46e5' }}>Nova</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6">
              {['Inicio', 'Eventos', 'Iniciar sesión', 'Registrarse'].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={item === 'Iniciar sesión' ? (e) => { e.preventDefault(); setPage('login') } : undefined}
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  style={{ fontWeight: 400 }}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © 2025 EventNova. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
