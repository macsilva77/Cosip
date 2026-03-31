import { useState } from 'react'
import {
  Users, Shield, Settings, Activity, Trash2, Pencil,
  Plus, Search, CheckCircle2, XCircle, AlertTriangle,
  Key, Bell, Database, Globe, Lock, ChevronRight, X,
  ToggleLeft, ToggleRight, Download
} from 'lucide-react'
import clsx from 'clsx'
import { MOCK_USERS, ROLES } from '../data/mockData'

const TABS = [
  { id: 'users',    label: 'Usuários',    icon: Users    },
  { id: 'roles',    label: 'Permissões',  icon: Shield   },
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'audit',    label: 'Auditoria',   icon: Activity },
]

const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrador',
    desc: 'Acesso total ao sistema',
    permissions: ['Visualizar tudo', 'Criar/editar ordens', 'Gerenciar usuários', 'Configurações do sistema', 'Relatórios completos', 'Gerenciar equipes', 'Roteirização', 'Validação de contas'],
  },
  supervisor: {
    label: 'Supervisor',
    desc: 'Gestão operacional',
    permissions: ['Visualizar ordens', 'Criar/editar ordens', 'Gerenciar equipes', 'Roteirização', 'Validação de contas', 'Relatórios operacionais'],
  },
  technician: {
    label: 'Técnico',
    desc: 'Execução de ordens em campo',
    permissions: ['Ver suas ordens', 'Atualizar status das ordens', 'Ver mapa', 'Registrar ocorrências'],
  },
  citizen: {
    label: 'Cidadão',
    desc: 'Reporte de ocorrências',
    permissions: ['Reportar ocorrências', 'Ver mapa público', 'Acompanhar chamados próprios'],
  },
}

const MOCK_AUDIT = [
  { id: 1, user: 'Carlos Eduardo Silva', action: 'Login realizado',               module: 'Auth',     time: '15:42:03', date: '05/06/2024', type: 'info'    },
  { id: 2, user: 'Ana Paula Ferreira',   action: 'OS-2024-007 criada',             module: 'Ordens',   time: '14:21:18', date: '05/06/2024', type: 'create'  },
  { id: 3, user: 'Roberto Mendes',       action: 'OS-2024-002 status → Em Andamento', module: 'Ordens',time: '13:55:40', date: '05/06/2024', type: 'update'  },
  { id: 4, user: 'Carlos Eduardo Silva', action: 'Usuário Marcos Souza desativado', module: 'Usuários', time: '11:30:22', date: '05/06/2024', type: 'warning' },
  { id: 5, user: 'Ana Paula Ferreira',   action: 'Rota Centro-Paulista otimizada', module: 'Rotas',    time: '10:15:07', date: '05/06/2024', type: 'create'  },
  { id: 6, user: 'Carlos Eduardo Silva', action: 'Conta Energia Maio/2024 validada', module: 'Energia',time: '09:04:55', date: '05/06/2024', type: 'info'    },
  { id: 7, user: 'Sandra Oliveira',      action: 'OS-2024-004 concluída',           module: 'Ordens',  time: '16:30:00', date: '04/06/2024', type: 'success' },
  { id: 8, user: 'Sistema',              action: 'Backup automático realizado',     module: 'Sistema',  time: '02:00:00', date: '05/06/2024', type: 'info'    },
]

const AUDIT_TYPE_STYLE = {
  info:    'bg-blue-50 text-blue-700',
  create:  'bg-green-50 text-green-700',
  update:  'bg-amber-50 text-amber-700',
  warning: 'bg-orange-50 text-orange-700',
  success: 'bg-emerald-50 text-emerald-700',
  error:   'bg-red-50 text-red-700',
}

const SYSTEM_SETTINGS = [
  {
    group: 'Notificações',
    icon: Bell,
    items: [
      { key: 's1', label: 'E-mail ao criar nova OS',          enabled: true  },
      { key: 's2', label: 'SMS para equipe ao atribuir rota', enabled: true  },
      { key: 's3', label: 'Alerta de prazo vencido',          enabled: true  },
      { key: 's4', label: 'Relatório diário automático',      enabled: false },
    ],
  },
  {
    group: 'Integrações',
    icon: Globe,
    items: [
      { key: 's5', label: 'API pública habilitada',    enabled: false },
      { key: 's6', label: 'Integração ANEEL (tarifas)',enabled: true  },
      { key: 's7', label: 'Webhook de eventos',        enabled: false },
    ],
  },
  {
    group: 'Segurança',
    icon: Lock,
    items: [
      { key: 's8',  label: 'Autenticação 2 fatores (2FA)', enabled: true  },
      { key: 's9',  label: 'Log de auditoria ativo',       enabled: true  },
      { key: 's10', label: 'Bloqueio após 5 tentativas',   enabled: true  },
    ],
  },
  {
    group: 'Dados',
    icon: Database,
    items: [
      { key: 's11', label: 'Backup automático (diário)',   enabled: true  },
      { key: 's12', label: 'Exportação LGPD habilitada',   enabled: true  },
      { key: 's13', label: 'Anonimização de logs antigos', enabled: false },
    ],
  },
]

function UserRow({ user, onEdit, onDelete }) {
  const role = ROLES[user.role]
  const roleColor = {
    purple: 'bg-purple-100 text-purple-800',
    blue:   'bg-blue-100 text-blue-800',
    green:  'bg-green-100 text-green-800',
    slate:  'bg-slate-100 text-slate-600',
  }[role?.color || 'slate']

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 pl-5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4">
        <span className={clsx('badge', roleColor)}>{role?.label}</span>
      </td>
      <td className="py-3 pr-4 hidden md:table-cell">
        <p className="text-xs text-slate-600">{user.phone}</p>
      </td>
      <td className="py-3 pr-4 hidden lg:table-cell">
        <p className="text-xs text-slate-500">{user.createdAt}</p>
      </td>
      <td className="py-3 pr-4">
        <span className={clsx('badge', user.status === 'active' ? 'badge-done' : 'badge-pending')}>
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="py-3 pr-5">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(user)} className="p-1.5 hover:bg-brand-50 hover:text-brand-600 text-slate-400 rounded-md transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(user)} className="p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-md transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('users')
  const [search, setSearch] = useState('')
  const [settings, setSettings] = useState(() => {
    const obj = {}
    SYSTEM_SETTINGS.forEach(g => g.items.forEach(i => { obj[i.key] = i.enabled }))
    return obj
  })
  const [showNewUser, setShowNewUser] = useState(false)

  const filteredUsers = MOCK_USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSetting(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  return (
    <div className="space-y-5">
      {/* System health banner */}
      <div className="card bg-gradient-to-r from-brand-600 to-brand-800 border-0 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-bold text-base">Painel Administrativo</p>
            <p className="text-brand-200 text-sm">Controle total do sistema COSIP</p>
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Usuários',    value: MOCK_USERS.length },
              { label: 'Módulos',     value: 7 },
              { label: 'Status API',  value: '✓ Online' },
              { label: 'Uptime',      value: '99.9%' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-brand-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar usuários..."
                className="input pl-9"
              />
            </div>
            <button onClick={() => setShowNewUser(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Novo Usuário
            </button>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 pl-5 pr-4">Usuário</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4">Perfil</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden md:table-cell">Telefone</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden lg:table-cell">Cadastrado em</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4">Status</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 pr-5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <UserRow key={u.id} user={u} onEdit={() => {}} onDelete={() => {}} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Roles tab */}
      {tab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(ROLE_PERMISSIONS).map(([key, role]) => {
            const roleColor = { admin: 'purple', supervisor: 'blue', technician: 'green', citizen: 'slate' }[key]
            const badgeCls = {
              purple: 'bg-purple-100 text-purple-800 border-purple-200',
              blue:   'bg-blue-100   text-blue-800   border-blue-200',
              green:  'bg-green-100  text-green-800  border-green-200',
              slate:  'bg-slate-100  text-slate-700  border-slate-200',
            }[roleColor]

            return (
              <div key={key} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className={clsx('badge border text-sm', badgeCls)}>{role.label}</span>
                  <p className="text-xs text-slate-400">{role.desc}</p>
                </div>
                <div className="space-y-1.5">
                  {role.permissions.map(p => (
                    <div key={p} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{p}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary mt-4 text-xs">
                  <Pencil className="w-3 h-3" /> Editar permissões
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Settings tab */}
      {tab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SYSTEM_SETTINGS.map(group => {
            const GIcon = group.icon
            return (
              <div key={group.group} className="card">
                <div className="flex items-center gap-2 mb-4">
                  <GIcon className="w-4 h-4 text-brand-500" />
                  <p className="section-title">{group.group}</p>
                </div>
                <div className="space-y-3">
                  {group.items.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-700">{item.label}</p>
                      <button
                        onClick={() => toggleSetting(item.key)}
                        className={clsx(
                          'flex-shrink-0 w-11 h-6 rounded-full transition-colors relative',
                          settings[item.key] ? 'bg-brand-600' : 'bg-slate-200'
                        )}
                      >
                        <div className={clsx(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                          settings[item.key] ? 'left-5' : 'left-0.5'
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Danger zone */}
          <div className="card border-red-200 bg-red-50 md:col-span-2">
            <p className="section-title text-red-800 mb-1">Zona de Perigo</p>
            <p className="text-xs text-red-600 mb-4">Ações irreversíveis. Utilize com extremo cuidado.</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary text-xs border-red-200 text-red-600 hover:bg-red-100">
                <Download className="w-3.5 h-3.5" /> Exportar Dados Completos (LGPD)
              </button>
              <button className="btn-secondary text-xs border-red-200 text-red-600 hover:bg-red-100">
                <Database className="w-3.5 h-3.5" /> Backup Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit tab */}
      {tab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Log de auditoria — exibindo últimas 8 entradas</p>
            <button className="btn-secondary text-xs">
              <Download className="w-3.5 h-3.5" /> Exportar CSV
            </button>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-400 py-3 pl-5 pr-4">Usuário</th>
                  <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4">Ação</th>
                  <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden sm:table-cell">Módulo</th>
                  <th className="text-left text-xs font-medium text-slate-400 py-3 pr-5 hidden md:table-cell">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_AUDIT.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="py-3 pl-5 pr-4">
                      <p className="text-xs font-medium text-slate-700">{entry.user}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={clsx('badge text-[10px]', AUDIT_TYPE_STYLE[entry.type])}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="badge badge-progress text-[10px]">{entry.module}</span>
                    </td>
                    <td className="py-3 pr-5 hidden md:table-cell">
                      <p className="text-[10px] text-slate-500">{entry.date} às {entry.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New user modal */}
      {showNewUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <p className="font-bold text-slate-900">Novo Usuário</p>
              <button onClick={() => setShowNewUser(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nome completo</label>
                  <input type="text" className="input" placeholder="Nome do usuário" />
                </div>
                <div className="col-span-2">
                  <label className="label">E-mail institucional</label>
                  <input type="email" className="input" placeholder="email@prefeitura.gov.br" />
                </div>
                <div>
                  <label className="label">Perfil de acesso</label>
                  <select className="input">
                    <option value="technician">Técnico</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Administrador</option>
                    <option value="citizen">Cidadão</option>
                  </select>
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input type="tel" className="input" placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                <p className="font-medium mb-1">Senha temporária</p>
                <p>Uma senha de primeiro acesso será enviada por e-mail ao usuário criado.</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowNewUser(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button onClick={() => setShowNewUser(false)} className="btn-primary flex-1 justify-center">
                <Plus className="w-4 h-4" /> Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
