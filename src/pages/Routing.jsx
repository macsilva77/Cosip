import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import {
  Route, Play, RefreshCw, Clock, Navigation2, CheckCircle2,
  Truck, MapPin, Zap, ChevronDown, ChevronUp, Users, AlertCircle
} from 'lucide-react'
import clsx from 'clsx'
import { MOCK_ROUTES, MOCK_ORDERS, MOCK_TEAMS } from '../data/mockData'

function numIcon(n, color) {
  return L.divIcon({
    html: `<div style="background:${color};color:white;font-size:11px;font-weight:700;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25)">${n}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function truckIcon(color) {
  return L.divIcon({
    html: `<div style="background:${color};padding:5px;border-radius:8px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M1 3h15v13H1zM16 8h4l3 4v4h-7V8zM5.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const ROUTE_COLORS = ['#2563eb', '#059669', '#d97706']

export default function Routing() {
  const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0].id)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [expandedRoute, setExpandedRoute] = useState(MOCK_ROUTES[0].id)

  const route = MOCK_ROUTES.find(r => r.id === selectedRoute)
  const team  = route ? MOCK_TEAMS.find(t => t.id === route.team) : null
  const orders = route ? route.orders.map(id => MOCK_ORDERS.find(o => o.id === id)).filter(Boolean) : []
  const polyline = route ? route.waypoints.map(w => [w.lat, w.lng]) : []
  const teamPos  = team ? [team.lat, team.lng] : null

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(false)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 3000)
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1">
          <p className="text-sm text-slate-500">
            {MOCK_ROUTES.length} rotas ativas · {MOCK_ROUTES.reduce((a, r) => a + r.orders.length, 0)} ordens alocadas
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Otimizando...
            </span>
          ) : generated ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Rotas Otimizadas!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Otimizar Rotas (IA)
            </span>
          )}
        </button>
        <button className="btn-secondary">
          <Route className="w-4 h-4" /> Nova Rota
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-[520px]">
        {/* Routes panel */}
        <div className="lg:col-span-2 space-y-3">
          {MOCK_ROUTES.map((r, ri) => {
            const rteam = MOCK_TEAMS.find(t => t.id === r.team)
            const rOrders = r.orders.map(id => MOCK_ORDERS.find(o => o.id === id)).filter(Boolean)
            const pending = rOrders.filter(o => o.status === 'PENDING').length
            const done    = rOrders.filter(o => o.status === 'DONE').length
            const color   = ROUTE_COLORS[ri % ROUTE_COLORS.length]
            const isOpen  = expandedRoute === r.id

            return (
              <div
                key={r.id}
                className={clsx('card cursor-pointer border-2 transition-all', selectedRoute === r.id ? 'border-brand-400' : 'border-transparent')}
                onClick={() => setSelectedRoute(r.id)}
              >
                {/* Route header */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{r.name}</p>
                    <p className="text-xs text-slate-400">{rteam?.name} · {rteam?.vehicle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={clsx('badge text-[10px]',
                      r.status === 'in_progress' ? 'badge-progress' : 'badge-done'
                    )}>
                      {r.status === 'in_progress' ? 'Em andamento' : 'Concluída'}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); setExpandedRoute(isOpen ? null : r.id) }}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-3 pb-3 border-b border-slate-100">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">{r.orders.length}</p>
                    <p className="text-[10px] text-slate-400">Ordens</p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <p className="text-sm font-bold text-slate-800">{r.totalDistance}</p>
                    <p className="text-[10px] text-slate-400">Distância</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">{r.estimatedTime}</p>
                    <p className="text-[10px] text-slate-400">Tempo est.</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>{done} concluídas</span>
                    <span>{Math.round((done / r.orders.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(done / r.orders.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Expanded: waypoints list */}
                {isOpen && (
                  <div className="mt-3 space-y-2">
                    {rOrders.map((o, oi) => (
                      <div key={o.id} className="flex items-center gap-2.5 text-xs">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: color }}
                        >
                          {oi + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 truncate">{o.address}</p>
                          <p className="text-slate-400 text-[10px]">{o.id} · {o.type === 'BURNED_LAMP' ? 'Queimada' : o.type === 'LED_REQUEST' ? 'LED' : 'Acesa de Dia'}</p>
                        </div>
                        <span className={clsx('badge text-[10px]',
                          o.status === 'PENDING'     ? 'badge-pending'  :
                          o.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-done'
                        )}>
                          {o.status === 'PENDING' ? 'Pend.' : o.status === 'IN_PROGRESS' ? 'And.' : 'OK'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Team info */}
                {rteam && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium">{rteam.name}</span>
                    <span>·</span>
                    <span>{rteam.members.length} membros</span>
                    <span>·</span>
                    <span>{rteam.phone}</span>
                  </div>
                )}
              </div>
            )
          })}

          {/* Unallocated orders info */}
          <div className="card bg-amber-50 border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-semibold text-amber-800">Ordens não alocadas</p>
            </div>
            <p className="text-xs text-amber-700">
              {MOCK_ORDERS.filter(o => o.status === 'PENDING' && !MOCK_ROUTES.some(r => r.orders.includes(o.id))).length} ordens pendentes ainda sem rota atribuída.
            </p>
            <button className="btn-primary mt-3 text-xs bg-amber-500 hover:bg-amber-600 w-full justify-center">
              Alocar automaticamente (IA)
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-slate-200 shadow-card" style={{ minHeight: 420 }}>
          <MapContainer
            center={[-23.5614, -46.6561]}
            zoom={13}
            style={{ height: '100%', width: '100%', minHeight: 420 }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw each route */}
            {MOCK_ROUTES.map((r, ri) => {
              const rColor  = ROUTE_COLORS[ri % ROUTE_COLORS.length]
              const rTeam   = MOCK_TEAMS.find(t => t.id === r.team)
              const rOrders = r.orders.map(id => MOCK_ORDERS.find(o => o.id === id)).filter(Boolean)
              const pts     = r.waypoints.map(w => [w.lat, w.lng])

              return (
                <div key={r.id}>
                  <Polyline
                    positions={pts}
                    pathOptions={{
                      color: rColor,
                      weight: selectedRoute === r.id ? 4 : 2,
                      opacity: selectedRoute === r.id ? 0.9 : 0.4,
                      dashArray: selectedRoute === r.id ? null : '6,8',
                    }}
                  />
                  {rOrders.map((o, oi) => (
                    <Marker
                      key={o.id}
                      position={[o.lat, o.lng]}
                      icon={numIcon(oi + 1, rColor)}
                    >
                      <Popup>
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 mb-1">{oi + 1}. {o.address}</p>
                          <p className="text-slate-500 font-mono">{o.id}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {rTeam && (
                    <Marker position={[rTeam.lat, rTeam.lng]} icon={truckIcon(rColor)}>
                      <Popup>
                        <p className="text-xs font-semibold">{rTeam.name}</p>
                        <p className="text-[10px] text-slate-500">{rTeam.vehicle}</p>
                      </Popup>
                    </Marker>
                  )}
                </div>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
