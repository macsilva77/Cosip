import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lightbulb, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../App'
import { MOCK_USERS } from '../data/mockData'

const DEMO_ACCOUNTS = [
  { label: 'Administrador', email: 'carlos.silva@prefeitura.gov.br',  role: 'admin'      },
  { label: 'Supervisor',    email: 'ana.ferreira@prefeitura.gov.br',  role: 'supervisor' },
  { label: 'Técnico',       email: 'roberto.mendes@prefeitura.gov.br',role: 'technician' },
  { label: 'Cidadão',       email: 'cidadao@email.com',               role: 'citizen'    },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    // Simulate async auth
    await new Promise(r => setTimeout(r, 800))
    const user = MOCK_USERS.find(u => u.email === email)
    if (user && password === 'cosip2024') {
      login(user)
      navigate(user.role === 'citizen' ? '/portal' : '/', { replace: true })
    } else {
      setError('E-mail ou senha incorretos.')
    }
    setLoading(false)
  }

  function fillDemo(acc) {
    setEmail(acc.email)
    setPassword('cosip2024')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 shadow-xl mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">COSIP</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema de Gestão de Iluminação Pública</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Bem-vindo de volta</h2>
          <p className="text-slate-500 text-sm mb-6">Acesse sua conta para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="voce@prefeitura.gov.br"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center h-11 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/cadastro" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Criar conta de cidadão
            </Link>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-3">Contas demo (senha: <code className="bg-slate-100 px-1.5 py-0.5 rounded">cosip2024</code>)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-2 px-3 rounded-lg border border-slate-200 transition-colors"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © 2024 COSIP — Prefeitura Municipal · v1.0.0
        </p>
      </div>
    </div>
  )
}
