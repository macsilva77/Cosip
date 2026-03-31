import { useState, useMemo } from 'react'
import {
  Search, Filter, Plus, ChevronDown, Eye, Pencil, Trash2,
  ZapOff, Lightbulb, Sun, Wrench, AlertTriangle, Clock,
  CheckCircle2, Circle, Loader2, X, MapPin, User, CalendarDays
} from 'lucide-react'
import clsx from 'clsx'
import { MOCK_ORDERS, ORDER_TYPES, ORDER_STATUS } from '../data/mockData'

const TYPE_ICONS = {
  BURNED_LAMP: ZapOff,
  LED_REQUEST: Lightbulb,
  DAY_ON:      Sun,
  MAINTENANCE: Wrench,
  VANDALISM:   AlertTriangle,
}

const PRIORITY_BADGE = {
  alta:  'badge-critical',
  média: 'badge-progress',
  baixa: 'badge-done',
}

const STATUS_ICON = {
  PENDING:     { icon: Circle,       cls: 'text-amber-500' },
  IN_PROGRESS: { icon: Loader2,      cls: 'text-blue-500 animate-spin' },
  DONE:        { icon: CheckCircle2, cls: 'text-green-500' },
  CANCELLED:   { icon: X,            cls: 'text-slate-400' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null
  const TypeIcon = TYPE_ICONS[order.type] || ZapOff
  const { icon: SIcon, cls } = STATUS_ICON[order.status]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900">{order.id}</p>
            <p className="text-xs text-slate-400">Ordem de Serviço</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center',
              order.type === 'BURNED_LAMP' ? 'bg-red-50'    :
              order.type === 'LED_REQUEST' ? 'bg-blue-50'   :
              order.type === 'DAY_ON'      ? 'bg-amber-50'  :
              order.type === 'MAINTENANCE' ? 'bg-purple-50' : 'bg-orange-50'
            )}>
              <TypeIcon className={clsx('w-5 h-5',
                order.type === 'BURNED_LAMP' ? 'text-red-500'    :
                order.type === 'LED_REQUEST' ? 'text-blue-500'   :
                order.type === 'DAY_ON'      ? 'text-amber-500'  :
                order.type === 'MAINTENANCE' ? 'text-purple-500' : 'text-orange-500'
              )} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{ORDER_TYPES[order.type]?.label}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <SIcon className={clsx('w-3 h-3', cls)} />
                <span className="text-xs text-slate-500">{ORDER_STATUS[order.status]?.label}</span>
              </div>
            </div>
            <span className={clsx('badge ml-auto', PRIORITY_BADGE[order.priority])}>
              Prioridade {order.priority}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Endereço</p>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-xs">{order.address}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Poste</p>
              <p className="text-slate-700 text-xs font-mono">{order.poleId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Reportado por</p>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-slate-700 text-xs">{order.reportedBy}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Técnico</p>
              <p className="text-slate-700 text-xs">{order.assignedTo || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Aberto em</p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-slate-700 text-xs">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Última atualização</p>
              <p className="text-slate-700 text-xs">{formatDate(order.updatedAt)}</p>
            </div>
          </div>
          {order.notes && (
            <div className="bg-slate-50 rounded-lg px-4 py-3">
              <p className="text-xs font-medium text-slate-500 mb-1">Observações</p>
              <p className="text-xs text-slate-700">{order.notes}</p>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-100">
          <button className="btn-secondary flex-1 justify-center text-xs">
            <Pencil className="w-3.5 h-3.5" /> Editar
          </button>
          {order.status === 'PENDING' && (
            <button className="btn-primary flex-1 justify-center text-xs">
              <Loader2 className="w-3.5 h-3.5" /> Iniciar Atendimento
            </button>
          )}
          {order.status === 'IN_PROGRESS' && (
            <button className="btn-primary flex-1 justify-center text-xs bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MaintenanceOrders() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [page, setPage] = useState(1)
  const [showNewModal, setShowNewModal] = useState(false)
  const PER_PAGE = 8

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter(o => {
      const matchSearch = !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.address.toLowerCase().includes(search.toLowerCase()) ||
        o.district.toLowerCase().includes(search.toLowerCase())
      const matchStatus   = filterStatus   === 'ALL' || o.status   === filterStatus
      const matchType     = filterType     === 'ALL' || o.type     === filterType
      const matchPriority = filterPriority === 'ALL' || o.priority === filterPriority
      return matchSearch && matchStatus && matchType && matchPriority
    })
  }, [search, filterStatus, filterType, filterPriority])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const counts = {
    ALL:         MOCK_ORDERS.length,
    PENDING:     MOCK_ORDERS.filter(o => o.status === 'PENDING').length,
    IN_PROGRESS: MOCK_ORDERS.filter(o => o.status === 'IN_PROGRESS').length,
    DONE:        MOCK_ORDERS.filter(o => o.status === 'DONE').length,
  }

  return (
    <div className="space-y-5">
      {/* Quick stats tabs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'ALL',         label: 'Todos',         cls: 'bg-slate-100 text-slate-700',   active: 'bg-slate-800 text-white' },
          { key: 'PENDING',     label: 'Pendentes',     cls: 'bg-amber-50 text-amber-700',    active: 'bg-amber-500 text-white' },
          { key: 'IN_PROGRESS', label: 'Em Andamento',  cls: 'bg-blue-50 text-blue-700',      active: 'bg-blue-600 text-white'  },
          { key: 'DONE',        label: 'Concluídos',    cls: 'bg-green-50 text-green-700',    active: 'bg-green-600 text-white' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilterStatus(tab.key); setPage(1) }}
            className={clsx(
              'rounded-xl p-3 text-left transition-all',
              filterStatus === tab.key ? tab.active : tab.cls
            )}
          >
            <p className={clsx('text-xl font-bold', filterStatus === tab.key ? 'text-white' : '')}>
              {counts[tab.key]}
            </p>
            <p className={clsx('text-xs mt-0.5 font-medium', filterStatus === tab.key ? 'text-white/80' : '')}>
              {tab.label}
            </p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por número, endereço ou bairro..."
              className="input pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setPage(1) }}
              className="input w-auto text-sm pr-8 py-2"
            >
              <option value="ALL">Todos os tipos</option>
              <option value="BURNED_LAMP">Lâmpada Queimada</option>
              <option value="LED_REQUEST">Solicitação LED</option>
              <option value="DAY_ON">Acesa de Dia</option>
              <option value="MAINTENANCE">Manutenção</option>
              <option value="VANDALISM">Vandalismo</option>
            </select>
            <select
              value={filterPriority}
              onChange={e => { setFilterPriority(e.target.value); setPage(1) }}
              className="input w-auto text-sm pr-8 py-2"
            >
              <option value="ALL">Toda prioridade</option>
              <option value="alta">Alta</option>
              <option value="média">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <button
              onClick={() => setShowNewModal(true)}
              className="btn-primary whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Nova OS
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pl-5 pr-4">Nº OS</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4">Tipo</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden md:table-cell">Endereço</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4">Status</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden sm:table-cell">Prioridade</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden lg:table-cell">Técnico</th>
                <th className="text-left text-xs font-medium text-slate-400 py-3 pr-4 hidden lg:table-cell">Data</th>
                <th className="text-right text-xs font-medium text-slate-400 py-3 pr-5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    Nenhuma ordem encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : paginated.map(order => {
                const TypeIcon = TYPE_ICONS[order.type] || ZapOff
                const { icon: SIcon, cls } = STATUS_ICON[order.status]
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-3.5 pl-5 pr-4 font-mono text-xs text-slate-600 font-medium">{order.id}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-700 whitespace-nowrap">
                          {ORDER_TYPES[order.type]?.label || order.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 hidden md:table-cell">
                      <p className="text-xs text-slate-600 max-w-[200px] truncate">{order.address}</p>
                      <p className="text-[10px] text-slate-400">{order.district}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <SIcon className={clsx('w-3 h-3', cls)} />
                        <span className="text-xs text-slate-600">{ORDER_STATUS[order.status]?.label}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 hidden sm:table-cell">
                      <span className={clsx('badge', PRIORITY_BADGE[order.priority])}>{order.priority}</span>
                    </td>
                    <td className="py-3.5 pr-4 hidden lg:table-cell">
                      <p className="text-xs text-slate-600">{order.assignedTo || <span className="text-slate-300">—</span>}</p>
                    </td>
                    <td className="py-3.5 pr-4 hidden lg:table-cell">
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 hover:bg-brand-50 hover:text-brand-600 text-slate-400 rounded-md transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={clsx(
                    'px-3 py-1.5 text-xs border rounded-lg transition-colors',
                    page === p
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* New OS Modal (simplified) */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <p className="font-bold text-slate-900">Nova Ordem de Serviço</p>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Tipo de ocorrência</label>
                <select className="input">
                  <option>Lâmpada Queimada</option>
                  <option>Solicitação de LED</option>
                  <option>Acesa Durante o Dia</option>
                  <option>Manutenção Preventiva</option>
                  <option>Vandalismo</option>
                </select>
              </div>
              <div>
                <label className="label">Endereço</label>
                <input type="text" className="input" placeholder="Rua, número — Bairro" />
              </div>
              <div>
                <label className="label">ID do Poste</label>
                <input type="text" className="input" placeholder="P-0000" />
              </div>
              <div>
                <label className="label">Prioridade</label>
                <select className="input">
                  <option>baixa</option>
                  <option>média</option>
                  <option>alta</option>
                </select>
              </div>
              <div>
                <label className="label">Observações</label>
                <textarea className="input h-20 resize-none" placeholder="Descreva o problema..." />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowNewModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button onClick={() => setShowNewModal(false)} className="btn-primary flex-1 justify-center">Criar OS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
