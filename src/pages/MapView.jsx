import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  ZapOff, Lightbulb, Sun, Wrench, AlertTriangle,
  Plus, Layers, Filter, X, CheckCircle2, Navigation2
} from 'lucide-react'
import clsx from 'clsx'
import { MOCK_ORDERS } from '../data/mockData'

// Custom SVG markers
function createMarkerIcon(color, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.876 14 26 16 26s16-16.124 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.9"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  })
}

const MARKER_COLORS = {
  BURNED_LAMP:  '#ef4444',
  LED_REQUEST:  '#3b82f6',
  DAY_ON:       '#f59e0b',
  MAINTENANCE:  '#8b5cf6',
  VANDALISM:    '#f97316',
}

const TYPE_LABELS = {
  BURNED_LAMP: 'Lâmpada Queimada',
  LED_REQUEST: 'Solicitação de LED',
  DAY_ON:      'Acesa Durante o Dia',
  MAINTENANCE: 'Manutenção',
  VANDALISM:   'Vandalismo',
}

const TYPE_ICONS = {
  BURNED_LAMP: ZapOff,
  LED_REQUEST: Lightbulb,
  DAY_ON:      Sun,
  MAINTENANCE: Wrench,
  VANDALISM:   AlertTriangle,
}

const STATUS_BADGE = {
  PENDING:     'badge-pending',
  IN_PROGRESS: 'badge-progress',
  DONE:        'badge-done',
}
const STATUS_LABEL = {
  PENDING:     'Pendente',
  IN_PROGRESS: 'Em Andamento',
  DONE:        'Concluído',
}

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 14) }, [lat, lng])
  return null
}

export default function MapView() {
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [reportModal, setReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState('BURNED_LAMP')
  const [submitted, setSubmitted] = useState(false)
  const [showLegend, setShowLegend] = useState(true)

  const CENTER = [-23.5614, -46.6561]

  const filtered = MOCK_ORDERS.filter(o => {
    const matchType   = filterType   === 'ALL' || o.type   === filterType
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus
    return matchType && matchStatus
  })

  async function handleReport() {
    setSubmitted(true)
    await new Promise(r => setTimeout(r, 1500))
    setReportModal(false)
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Toolbar */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-1 flex-wrap">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="input w-auto text-xs py-2 pr-8"
          >
            <option value="ALL">Todos os tipos</option>
            <option value="BURNED_LAMP">Lâmpada Queimada</option>
            <option value="LED_REQUEST">Solicitar LED</option>
            <option value="DAY_ON">Acesa de Dia</option>
            <option value="MAINTENANCE">Manutenção</option>
            <option value="VANDALISM">Vandalismo</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input w-auto text-xs py-2 pr-8"
          >
            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Andamento</option>
            <option value="DONE">Concluído</option>
          </select>
          <span className="flex items-center text-xs text-slate-500 font-medium">
            {filtered.length} marcador{filtered.length !== 1 ? 'es' : ''}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={clsx('btn-ghost text-xs', showLegend && 'bg-slate-100')}
          >
            <Layers className="w-4 h-4" /> Legenda
          </button>
          <button
            onClick={() => setReportModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Reportar Ocorrência
          </button>
        </div>
      </div>

      {/* Map + legend */}
      <div className="relative flex gap-4 flex-1 min-h-0">
        {/* Legend panel */}
        {showLegend && (
          <div className="card flex-shrink-0 w-44 p-4 hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 mb-3">Legenda</p>
            <div className="space-y-2">
              {Object.entries(MARKER_COLORS).map(([type, color]) => {
                const Icon = TYPE_ICONS[type]
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                    <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-[10px] text-slate-600 leading-tight">{TYPE_LABELS[type]}</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 mt-3 pt-3">
              <p className="text-xs font-semibold text-slate-700 mb-2">Status</p>
              {[['Pendente', '#f59e0b'], ['Em Andamento', '#3b82f6'], ['Concluído', '#10b981']].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
                  <span className="text-[10px] text-slate-600">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-card min-h-0 relative">
          <MapContainer
            center={CENTER}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(order => (
              <Marker
                key={order.id}
                position={[order.lat, order.lng]}
                icon={createMarkerIcon(MARKER_COLORS[order.type], order.type)}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: MARKER_COLORS[order.type] }}
                      />
                      <span className="font-semibold text-xs text-slate-800">{TYPE_LABELS[order.type]}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mb-1">{order.id}</p>
                    <p className="text-xs text-slate-700 mb-2 leading-snug">{order.address}</p>
                    <div className="flex items-center justify-between">
                      <span className={clsx('badge text-[10px]', STATUS_BADGE[order.status])}>
                        {STATUS_LABEL[order.status]}
                      </span>
                      <span className="text-[10px] text-slate-400">{order.poleId}</span>
                    </div>
                    {order.assignedTo && (
                      <p className="text-[10px] text-slate-500 mt-1.5">
                        Técnico: {order.assignedTo}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating location button */}
          <button
            className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
            title="Minha localização"
          >
            <Navigation2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Report modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="font-bold text-slate-900">Reportar Ocorrência</p>
              <button onClick={() => setReportModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500">Selecione o tipo de ocorrência a reportar. Uma Ordem de Serviço será gerada automaticamente.</p>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'BURNED_LAMP', label: 'Lâmpada Queimada',      desc: 'Luminária apagada ou com defeito',  icon: ZapOff    },
                  { key: 'LED_REQUEST', label: 'Solicitar Troca por LED',desc: 'Solicitar substituição por LED',     icon: Lightbulb },
                  { key: 'DAY_ON',      label: 'Acesa Durante o Dia',    desc: 'Lâmpada acesa fora do horário',     icon: Sun       },
                ].map(opt => {
                  const Icon = opt.icon
                  const color = MARKER_COLORS[opt.key]
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedReport(opt.key)}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                        selectedReport === opt.key
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-transparent bg-slate-50 hover:bg-slate-100'
                      )}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                      {selectedReport === opt.key && (
                        <CheckCircle2 className="w-5 h-5 text-brand-600 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div>
                <label className="label">Endereço da ocorrência</label>
                <input type="text" className="input" placeholder="Rua, número ou ponto de referência" />
              </div>
              <div>
                <label className="label">Observações (opcional)</label>
                <textarea className="input h-16 resize-none" placeholder="Descreva detalhes adicionais..." />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setReportModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button
                onClick={handleReport}
                disabled={submitted}
                className="btn-primary flex-1 justify-center"
              >
                {submitted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Enviado!
                  </span>
                ) : 'Reportar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
