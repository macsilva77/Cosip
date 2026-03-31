import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Map, Zap, Route,
  Users, ShieldCheck, LogOut, Lightbulb, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../App'
import { useState } from 'react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'            },
  { to: '/ordens',       icon: ClipboardList,   label: 'Ord. de Manutenção'   },
  { to: '/mapa',         icon: Map,             label: 'Mapa Interativo'       },
  { to: '/conta-energia',icon: Zap,             label: 'Conta de Energia'      },
  { to: '/roteirizacao', icon: Route,           label: 'Roteirização'          },
  { to: '/equipes',      icon: Users,           label: 'Equipes'               },
  { to: '/admin',        icon: ShieldCheck,     label: 'Administração'         },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">COSIP</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Iluminação Pública</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto sidebar-scroll">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Menu</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              clsx('sidebar-link', isActive && 'active')
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-[10px] truncate capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar flex-shrink-0 h-screen sticky top-0">
        {inner}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative flex flex-col w-72 max-w-[85vw] bg-sidebar h-full z-10 shadow-2xl">
            {inner}
          </aside>
        </div>
      )}
    </>
  )
}
