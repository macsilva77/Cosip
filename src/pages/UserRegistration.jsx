import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lightbulb, User, Phone, Mail, Lock, MapPin,
  Camera, ChevronRight, CheckCircle2, ArrowLeft, Eye, EyeOff, Building2
} from 'lucide-react'
import { MUNICIPALITIES } from '../data/mockData'
import { useAuth } from '../App'
import clsx from 'clsx'

const STEPS = [
  { id: 1, label: 'Dados Pessoais'  },
  { id: 2, label: 'Contato'         },
  { id: 3, label: 'Endereço'        },
  { id: 4, label: 'Confirmação'     },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
            current > s.id
              ? 'bg-green-500 text-white'
              : current === s.id
                ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                : 'bg-slate-100 text-slate-400'
          )}>
            {current > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
          </div>
          {i < STEPS.length - 1 && (
            <div className={clsx('w-8 h-0.5 transition-colors', current > s.id ? 'bg-green-400' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function UserRegistration() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    name: '', cpf: '', birthdate: '', gender: '', municipalityId: 'sp',
    email: '', phone: '', password: '', confirmPassword: '',
    cep: '', street: '', number: '', complement: '', district: '', city: 'São Paulo', state: 'SP',
  })
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function formatCPF(v) {
    return v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14)
  }

  function formatPhone(v) {
    return v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15)
  }

  function formatCEP(v) {
    return v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9)
  }

  function validateStep1() {
    const e = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (form.cpf.replace(/\D/g, '').length !== 11) e.cpf = 'CPF inválido'
    if (!form.birthdate) e.birthdate = 'Data de nascimento obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(form.email)) e.email = 'E-mail inválido'
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone inválido'
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Senhas não conferem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3() {
    const e = {}
    if (form.cep.replace(/\D/g, '').length !== 8) e.cep = 'CEP inválido'
    if (!form.street.trim()) e.street = 'Endereço obrigatório'
    if (!form.number.trim()) e.number = 'Número obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    let valid = true
    if (step === 1) valid = validateStep1()
    if (step === 2) valid = validateStep2()
    if (step === 3) valid = validateStep3()
    if (valid) setStep(s => s + 1)
  }

  function submitForm() {
    // Auto-login as citizen and go to portal
    const municipality = MUNICIPALITIES.find(m => m.id === form.municipalityId) || MUNICIPALITIES[0]
    const newUser = {
      id: `u-new-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: 'citizen',
      avatar: form.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(),
      municipalityId: form.municipalityId,
      municipalityName: municipality.name,
    }
    login(newUser)
    setStep(5)
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Cadastro realizado!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Sua conta foi criada com sucesso. Você pode agora entrar no sistema e reportar ocorrências na sua cidade.
          </p>
          <button onClick={() => navigate('/portal')} className="btn-primary w-full justify-center">
            Acessar Portal do Cidadão
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 shadow-xl mb-3">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <p className="text-slate-400 text-sm mt-1">Cidadão — COSIP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <StepIndicator current={step} />
          <p className="text-center text-xs text-slate-400 mb-5 -mt-4">
            Passo {step} de 4 — <span className="font-medium text-slate-600">{STEPS[step - 1]?.label}</span>
          </p>

          {/* Step 1: Personal data */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Photo upload */}
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="w-7 h-7 text-slate-400" />
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 whitespace-nowrap">Foto (opcional)</span>
                </div>
              </div>
              <FormField label="Nome completo" required error={errors.name}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Seu nome completo"
                    className={clsx('input pl-10', errors.name && 'border-red-300 focus:ring-red-400')}
                  />
                </div>
              </FormField>
              <FormField label="CPF" required error={errors.cpf}>
                <input
                  type="text"
                  value={form.cpf}
                  inputMode="numeric"
                  onChange={e => set('cpf', formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className={clsx('input', errors.cpf && 'border-red-300')}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Data de nascimento" required error={errors.birthdate}>
                  <input
                    type="date"
                    value={form.birthdate}
                    onChange={e => set('birthdate', e.target.value)}
                    className={clsx('input', errors.birthdate && 'border-red-300')}
                  />
                </FormField>
                <FormField label="Gênero">
                  <select value={form.gender} onChange={e => set('gender', e.target.value)} className="input">
                    <option value="">Prefiro não dizer</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Município" required>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={form.municipalityId}
                    onChange={e => set('municipalityId', e.target.value)}
                    className="input pl-10"
                  >
                    {MUNICIPALITIES.map(m => (
                      <option key={m.id} value={m.id}>{m.name} — {m.state}</option>
                    ))}
                  </select>
                </div>
              </FormField>
            </div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <FormField label="E-mail" required error={errors.email}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="seuemail@email.com"
                    className={clsx('input pl-10', errors.email && 'border-red-300')}
                    autoComplete="email"
                  />
                </div>
              </FormField>
              <FormField label="Celular" required error={errors.phone}>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={e => set('phone', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={clsx('input pl-10', errors.phone && 'border-red-300')}
                  />
                </div>
              </FormField>
              <FormField label="Senha" required error={errors.password}>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={clsx('input pl-10 pr-10', errors.password && 'border-red-300')}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>
              <FormField label="Confirmar senha" required error={errors.confirmPassword}>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repita sua senha"
                    className={clsx('input pl-10', errors.confirmPassword && 'border-red-300')}
                  />
                </div>
              </FormField>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="space-y-4">
              <FormField label="CEP" required error={errors.cep}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cep}
                    onChange={e => set('cep', formatCEP(e.target.value))}
                    placeholder="00000-000"
                    className={clsx('input pl-10', errors.cep && 'border-red-300')}
                  />
                </div>
              </FormField>
              <FormField label="Logradouro" required error={errors.street}>
                <input
                  type="text"
                  value={form.street}
                  onChange={e => set('street', e.target.value)}
                  placeholder="Rua, Avenida..."
                  className={clsx('input', errors.street && 'border-red-300')}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Número" required error={errors.number}>
                  <input
                    type="text"
                    value={form.number}
                    onChange={e => set('number', e.target.value)}
                    placeholder="N°"
                    className={clsx('input', errors.number && 'border-red-300')}
                  />
                </FormField>
                <FormField label="Complemento">
                  <input
                    type="text"
                    value={form.complement}
                    onChange={e => set('complement', e.target.value)}
                    placeholder="Apto, bloco..."
                    className="input"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Bairro">
                  <input type="text" value={form.district} onChange={e => set('district', e.target.value)} className="input" placeholder="Bairro" />
                </FormField>
                <FormField label="Cidade">
                  <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className="input" />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <ReviewRow label="Nome" value={form.name} />
                <ReviewRow label="CPF" value={form.cpf} />
                <ReviewRow label="Nascimento" value={form.birthdate} />
                <ReviewRow label="E-mail" value={form.email} />
                <ReviewRow label="Celular" value={form.phone} />
                <ReviewRow label="Município" value={MUNICIPALITIES.find(m => m.id === form.municipalityId)?.name || '—'} />
                <ReviewRow label="Endereço" value={`${form.street}, ${form.number}${form.complement ? ` - ${form.complement}` : ''}`} />
                <ReviewRow label="Bairro/Cidade" value={`${form.district} — ${form.city}/${form.state}`} />
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 accent-brand-600" />
                <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                  Li e aceito os <span className="text-brand-600 underline">Termos de Uso</span> e a{' '}
                  <span className="text-brand-600 underline">Política de Privacidade</span> (LGPD).
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1 justify-center">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            ) : (
              <Link to="/login" className="btn-secondary flex-1 justify-center">
                <ArrowLeft className="w-4 h-4" /> Login
              </Link>
            )}
            {step < 4 ? (
              <button onClick={next} className="btn-primary flex-1 justify-center">
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submitForm} className="btn-primary flex-1 justify-center">
                <CheckCircle2 className="w-4 h-4" /> Criar Conta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between text-xs gap-3">
      <span className="text-slate-400 flex-shrink-0">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value || '—'}</span>
    </div>
  )
}
