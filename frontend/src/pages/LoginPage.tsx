import { useState } from 'react'

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
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

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7M19 12H5" />
    </svg>
  )
}

interface LoginPageProps {
  onBack: () => void
  onRegister?: () => void
  onLogin?: () => void
}

export default function LoginPage({ onBack, onRegister, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin?.() }, 1200)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fc' }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onBack() }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
            <span className="text-white"><IconTicket /></span>
          </div>
          <span className="text-xl tracking-tight text-gray-900" style={{ fontWeight: 800 }}>
            Event<span style={{ color: '#4f46e5' }}>Nova</span>
          </span>
        </a>

        {/* Back link */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <IconArrowLeft />
          Volver al inicio
        </button>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-8">

          {/* Decorative strip accent */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3.5 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Acceso seguro a tu cuenta
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col gap-7">

            {/* Header */}
            <div className="text-center flex flex-col gap-1.5">
              <h1 className="text-2xl text-gray-900" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Bienvenido de nuevo
              </h1>
              <p className="text-sm text-gray-500" style={{ fontWeight: 400 }}>
                Ingresa a tu cuenta para continuar.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                  Correo electrónico
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                  style={{
                    borderColor: emailFocused ? '#4f46e5' : '#e5e7eb',
                    boxShadow: emailFocused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
                    background: emailFocused ? '#fafafe' : '#fff',
                  }}
                >
                  <span style={{ color: emailFocused ? '#4f46e5' : '#9ca3af', flexShrink: 0 }}>
                    <IconMail />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="ejemplo@correo.com"
                    className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400"
                    style={{ fontWeight: 400 }}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                    Contraseña
                  </label>
                  <a
                    href="#"
                    className="text-xs hover:underline transition-colors"
                    style={{ color: '#4f46e5', fontWeight: 500 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                  style={{
                    borderColor: passwordFocused ? '#4f46e5' : '#e5e7eb',
                    boxShadow: passwordFocused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
                    background: passwordFocused ? '#fafafe' : '#fff',
                  }}
                >
                  <span style={{ color: passwordFocused ? '#4f46e5' : '#9ca3af', flexShrink: 0 }}>
                    <IconLock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="••••••••"
                    className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400"
                    style={{ fontWeight: 400 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-indigo-500 transition-colors shrink-0"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: rememberMe ? '#4f46e5' : '#d1d5db',
                    background: rememberMe ? '#4f46e5' : 'white',
                  }}
                >
                  {rememberMe && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors" style={{ fontWeight: 400 }}>
                  Recordarme
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-sm text-white py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: '#f4845f', fontWeight: 700, marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Iniciando sesión…
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>o</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500" style={{ fontWeight: 400 }}>
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="hover:underline transition-colors"
                style={{ color: '#4f46e5', fontWeight: 600 }}
              >
                Crear cuenta
              </button>
            </p>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Conexión segura — tus datos están protegidos</span>
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
