import { useState } from 'react'
import {
  Users, Phone, MapPin, Truck, CheckCircle2, Clock,
  Plus, Pencil, X, UserPlus, Radio, MoreVertical
} from 'lucide-react'
import clsx from 'clsx'
import { MOCK_TEAMS, MOCK_ROUTES } from '../data/mockData'

const STATUS_CONFIG = {
  active:  { label: 'Ativo',    badge: 'badge-done',     dot: 'bg-green-500' },
  standby: { label: 'Stand-by', badge: 'badge-pending',  dot: 'bg-amber-500' },
  offline: { label: 'Offline',  badge: 'badge-critical', dot: 'bg-red-500'   },
}

function TeamCard({ team, onSelect, selected }) {
  const route = MOCK_ROUTES.find(r => r.team === team.id)
  const sc = STATUS_CONFIG[team.status] || STATUS_CONFIG.offline

  return (
    <div
      onClick={() => onSelect(team)}
      className={clsx(
        'card cursor-pointer transition-all hover:shadow-card-hover border-2',
        selected ? 'border-brand-400 bg-brand-50/30' : 'border-transparent'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: team.color }}
        >
          {team.name.split(' ')[1]?.charAt(0) || 'T'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900 text-sm">{team.name}</p>
            <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', sc.dot)} />
          </div>
          <p className="text-xs text-slate-500">Líder: {team.leader}</p>
        </div>
        <span className={clsx('badge', sc.badge)}>{sc.label}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 mb-3">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">{team.members.length}</p>
          <p className="text-[10px] text-slate-400">Membros</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-lg font-bold text-slate-900">{team.ordersAssigned}</p>
          <p className="text-[10px] text-slate-400">Atribuídas</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{team.ordersCompleted}</p>
          <p className="text-[10px] text-slate-400">Concluídas</p>
        </div>
      </div>

      {/* Progress */}
      {team.ordersAssigned > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Progresso</span>
            <span>{Math.round((team.ordersCompleted / team.ordersAssigned) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(team.ordersCompleted / team.ordersAssigned) * 100}%`,
                background: team.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Info rows */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>{team.vehicle}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>{team.phone}</span>
        </div>
        {team.currentRoute && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{team.currentRoute}</span>
          </div>
        )}
        {route && (
          <div className="mt-2 bg-blue-50 rounded-lg px-3 py-1.5 text-xs text-blue-700 font-medium">
            Rota: {route.name}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
        <button className="btn-ghost text-xs flex-1 justify-center" onClick={e => e.stopPropagation()}>
          <Pencil className="w-3.5 h-3.5" /> Editar
        </button>
        <button className="btn-ghost text-xs flex-1 justify-center" onClick={e => e.stopPropagation()}>
          <Radio className="w-3.5 h-3.5" /> Rastrear
        </button>
      </div>
    </div>
  )
}

function TeamDetail({ team, onClose }) {
  if (!team) return null
  const route = MOCK_ROUTES.find(r => r.team === team.id)
  const sc = STATUS_CONFIG[team.status] || STATUS_CONFIG.offline

  return (
    <div className="card sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="section-title">Detalhes da Equipe</p>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Team identity */}
      <div className="flex items-center gap-3 mb-4 p-4 bg-slate-50 rounded-xl">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
          style={{ background: team.color }}
        >
          {team.name.charAt(7)}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg">{team.name}</p>
          <span className={clsx('badge', sc.badge)}>{sc.label}</span>
        </div>
      </div>

      {/* Members */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Membros ({team.members.length})</p>
          <button className="btn-ghost text-xs">
            <UserPlus className="w-3 h-3" /> Adicionar
          </button>
        </div>
        <div className="space-y-2">
          {team.members.map((m, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: team.color }}
              >
                {m.split(' ').map(p => p[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-700">{m}</p>
                <p className="text-[10px] text-slate-400">{i === 0 ? 'Líder' : 'Técnico'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle */}
      <div className="mb-4 p-3 bg-slate-50 rounded-xl">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Veículo</p>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-700 font-medium">{team.vehicle}</p>
        </div>
      </div>

      {/* Route assignment */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Rota Atual</p>
        {route ? (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-800">{route.name}</p>
            <p className="text-xs text-blue-600 mt-0.5">{route.orders.length} ordens · {route.totalDistance} · {route.estimatedTime}</p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 text-center">
            Sem rota atribuída
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="btn-primary w-full justify-center text-sm">
          <MapPin className="w-4 h-4" /> Atribuir Rota
        </button>
        <button className="btn-secondary w-full justify-center text-sm">
          <Radio className="w-4 h-4" /> Ver no Mapa
        </button>
      </div>
    </div>
  )
}

export default function Teams() {
  const [selected, setSelected] = useState(null)
  const [showNewTeam, setShowNewTeam] = useState(false)

  const totalOrders = MOCK_TEAMS.reduce((a, t) => a + t.ordersAssigned, 0)
  const totalDone   = MOCK_TEAMS.reduce((a, t) => a + t.ordersCompleted, 0)
  const activeTeams = MOCK_TEAMS.filter(t => t.status === 'active').length

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Equipes Ativas',    value: activeTeams,    icon: Users,         color: 'blue'   },
          { label: 'Ordens Atribuídas', value: totalOrders,    icon: CheckCircle2,  color: 'amber'  },
          { label: 'Concluídas Hoje',   value: totalDone,      icon: CheckCircle2,  color: 'green'  },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="card text-center py-4">
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.label}</p>
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{MOCK_TEAMS.length} equipes cadastradas</p>
        <button onClick={() => setShowNewTeam(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova Equipe
        </button>
      </div>

      {/* Main grid */}
      <div className={clsx('grid gap-5', selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
        {MOCK_TEAMS.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onSelect={t => setSelected(t.id === selected?.id ? null : t)}
            selected={selected?.id === team.id}
          />
        ))}
        {selected && (
          <div className="lg:col-span-1">
            <TeamDetail team={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      {/* New team modal */}
      {showNewTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <p className="font-bold text-slate-900">Nova Equipe</p>
              <button onClick={() => setShowNewTeam(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Nome da equipe</label>
                <input type="text" className="input" placeholder="ex: Equipe Delta" />
              </div>
              <div>
                <label className="label">Líder da equipe</label>
                <select className="input">
                  <option>Selecione um usuário...</option>
                  <option>Roberto Mendes</option>
                  <option>Sandra Oliveira</option>
                  <option>Fernando Costa</option>
                </select>
              </div>
              <div>
                <label className="label">Veículo</label>
                <input type="text" className="input" placeholder="Modelo — Placa" />
              </div>
              <div>
                <label className="label">Telefone de contato</label>
                <input type="tel" className="input" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="label">Cor de identificação</label>
                <input type="color" className="h-10 w-full rounded-lg border border-slate-200 p-1 cursor-pointer" defaultValue="#2563eb" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowNewTeam(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button onClick={() => setShowNewTeam(false)} className="btn-primary flex-1 justify-center">Criar Equipe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
