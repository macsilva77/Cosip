import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../App'

const PAGE_TITLES = {
  '/':              'Dashboard',
  '/ordens':        'Ordens de Manutenção',
  '/mapa':          'Mapa Interativo',
  '/conta-energia': 'Validação de Conta de Energia',
  '/roteirizacao':  'Roteirização Inteligente',
  '/equipes':       'Gestão de Equipes',
  '/admin':         'Painel Administrativo',
}

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Nova OS gerada: lâmpada queimada — Av. Paulista',   time: '2min',  read: false },
  { id: 2, text: 'Equipe Alpha concluiu 2 atendimentos',              time: '15min', read: false },
  { id: 3, text: 'Conta de energia: inconsistência detectada',        time: '1h',    read: true  },
  { id: 4, text: 'Rota Centro-Paulista otimizada automaticamente',    time: '2h',    read: true  },
]

export default function Header({ onMenuToggle }) {
  const location = useLocation()
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const title = PAGE_TITLES[location.pathname] || 'COSIP'
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 px-4 lg:px-6 h-14 flex items-center gap-4">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <h1 className="font-semibold text-slate-900 text-base lg:text-lg flex-1 truncate">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-sm text-slate-900">Notificações</p>
                {unread > 0 && (
                  <span className="badge badge-progress">{unread} novas</span>
                )}
              </div>
              <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map(n => (
                  <li key={n.id} className={`px-4 py-3 flex gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-brand-500' : 'bg-slate-200'}`} />
                    <div>
                      <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">há {n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                  onClick={() => setNotifOpen(false)}
                >
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
          {user?.avatar || 'U'}
        </div>
      </div>
    </header>
  )
}
