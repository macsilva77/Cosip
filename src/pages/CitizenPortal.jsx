import { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import {
  ZapOff, Lightbulb, Sun, Plus, X, CheckCircle2, Clock,
  MapPin, LogOut, Navigation2,
  ChevronRight, ChevronDown, AlertCircle, ClipboardList,
  Map as MapIcon, Loader2, Camera, PenLine, Building2
} from 'lucide-react'
const LampIcon = Lightbulb
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { MOCK_CITIZEN_ORDERS, MUNICIPALITIES } from '../data/mockData'

// ─── Constants ────────────────────────────────────────────────────────────────

const REPORT_TYPES = [
  {
    key: 'BURNED_LAMP',
    label: 'Lâmpada Queimada',
    desc: 'Luminária apagada ou com defeito',
    icon: ZapOff,
    color: '#ef4444',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  {
    key: 'LED_REQUEST',
    label: 'Solicitar Troca por LED',
    desc: 'Pedir substituição por lâmpada LED',
    icon: Lightbulb,
    color: '#3b82f6',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    key: 'DAY_ON',
    label: 'Acesa Durante o Dia',
    desc: 'Lâmpada ligada fora do horário noturno',
    icon: Sun,
    color: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
]

const STATUS_CONFIG = {
  PENDING:     { label: 'Aguardando',   color: '#f59e0b', bg: 'bg-amber-100',  text: 'text-amber-800',  icon: Clock        },
  IN_PROGRESS: { label: 'Em andamento', color: '#3b82f6', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: Loader2      },
  DONE:        { label: 'Concluído',    color: '#10b981', bg: 'bg-green-100',  text: 'text-green-800',  icon: CheckCircle2 },
  CANCELLED:   { label: 'Cancelado',   color: '#94a3b8', bg: 'bg-slate-100',  text: 'text-slate-600',  icon: X            },
}

// ─── Marker helpers ───────────────────────────────────────────────────────────

function pinIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.876 14 26 16 26s16-16.124 16-26C32 7.163 24.837 0 16 0z"
          fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.92"/>
  </svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -44] })
}

function userLocationIcon() {
  const svg = `<div style="width:18px;height:18px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`
  return L.divIcon({ html: svg, className: '', iconSize: [18, 18], iconAnchor: [9, 9] })
}

function newPinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="36" height="48">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.876 14 26 16 26s16-16.124 16-26C32 7.163 24.837 0 16 0z"
          fill="#2563eb" stroke="white" stroke-width="2"/>
    <path d="M11 15h10M16 10v10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [36, 48], iconAnchor: [18, 48], popupAnchor: [0, -50] })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Flies the map to given coords */
function FlyTo({ lat, lng, zoom = 15 }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [lat, lng, zoom])
  return null
}

/** Draggable new-occurrence marker */
function DraggableMarker({ position, onChange }) {
  const markerRef = useRef(null)
  const icon = newPinIcon()

  const eventHandlers = {
    dragend() {
      const m = markerRef.current
      if (m) {
        const { lat, lng } = m.getLatLng()
        onChange({ lat, lng })
      }
    },
  }

  return position ? (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={[position.lat, position.lng]}
      icon={icon}
      ref={markerRef}
    >
      <Popup>Arraste para ajustar a posição</Popup>
    </Marker>
  ) : null
}

/** Capture click on map to place marker */
function MapClickCapture({ active, onPlace }) {
  const map = useMap()
  useEffect(() => {
    if (!active) return
    function onClick(e) { onPlace({ lat: e.latlng.lat, lng: e.latlng.lng }) }
    map.on('click', onClick)
    map.getContainer().style.cursor = active ? 'crosshair' : ''
    return () => {
      map.off('click', onClick)
      map.getContainer().style.cursor = ''
    }
  }, [active, map, onPlace])
  return null
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium rounded-full',
      cfg.bg, cfg.text,
      size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
    )}>
      <Icon className={clsx('flex-shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
        status === 'IN_PROGRESS' && 'animate-spin'
      )} />
      {cfg.label}
    </span>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ steps }) {
  return (
    <div className="relative pl-5">
      {/* vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
      <div className="space-y-4">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.PENDING
          const Icon = cfg.icon
          return (
            <div key={i} className="flex gap-3">
              {/* dot */}
              <div className={clsx(
                'w-3.5 h-3.5 rounded-full border-2 border-white flex-shrink-0 mt-1 ring-1 z-10',
                isLast ? 'ring-current' : 'ring-slate-200',
                { [cfg.bg]: true }
              )} style={{ boxShadow: isLast ? `0 0 0 2px ${cfg.color}40` : undefined }}>
                <div className="w-full h-full rounded-full" style={{ background: cfg.color, opacity: isLast ? 1 : 0.6 }} />
              </div>
              <div className="flex-1 min-w-0 -mt-0.5">
                <p className={clsx('text-sm font-medium', isLast ? 'text-slate-900' : 'text-slate-600')}>
                  {step.label}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  <p className="text-xs text-slate-400">
                    {new Date(step.date).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-slate-400">{step.actor}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Occurrence Card ──────────────────────────────────────────────────────────

function OccurrenceCard({ order, onLocate, isOpen, onToggle }) {
  const t = REPORT_TYPES.find(r => r.key === order.type) || REPORT_TYPES[0]
  const Icon = t.icon
  const lastStep = order.timeline[order.timeline.length - 1]

  return (
    <div className="card p-0 overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', t.bg)}>
          <Icon className={clsx('w-5 h-5', t.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 text-sm">{t.label}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{order.address}</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{order.id}</p>
        </div>
        <div className={clsx('transition-transform flex-shrink-0', isOpen && 'rotate-180')}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {/* Expandable body */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400 font-medium mb-0.5">Poste</p>
              <p className="text-slate-700 font-mono">{order.poleId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium mb-0.5">Registrado em</p>
              <p className="text-slate-700">
                {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </p>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <p className="text-slate-400 font-medium mb-0.5">Observação</p>
                <p className="text-slate-700 leading-snug">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Última atualização */}
          <div className={clsx('rounded-lg px-3 py-2.5 text-xs font-medium flex items-center gap-2',
            STATUS_CONFIG[order.status]?.bg, STATUS_CONFIG[order.status]?.text
          )}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {lastStep?.label}
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Histórico</p>
            <Timeline steps={order.timeline} />
          </div>

          {/* Locate on map */}
          <button
            onClick={() => onLocate(order)}
            className="btn-secondary w-full justify-center text-xs"
          >
            <MapPin className="w-3.5 h-3.5" /> Ver no mapa
          </button>
        </div>
      )}
    </div>
  )
}

// ─── New Occurrence Modal ──────────────────────────────────────────────────────

function NewOccurrenceModal({ onClose, onSubmit, defaultPosition }) {
  const [step, setStep] = useState(1) // 1: type | 2: location | 3: details
  const [type, setType] = useState(null)
  const [position, setPosition] = useState(defaultPosition || null)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [pinMode, setPinMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handlePlace = useCallback((pos) => {
    setPosition(pos)
    setPinMode(false)
  }, [])

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitting(false)
    setDone(true)
    await new Promise(r => setTimeout(r, 1000))
    onSubmit({ type, position, address, notes })
    onClose()
  }

  const canStep2 = !!type
  const canStep3 = !!position && !!address.trim()

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 flex-shrink-0">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-base">Nova Ocorrência</p>
          <p className="text-xs text-slate-400">Passo {step} de 3</p>
        </div>
        {/* Step dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={clsx('w-2 h-2 rounded-full transition-all',
              step === s ? 'bg-brand-600 w-5' : s < step ? 'bg-green-400' : 'bg-slate-200'
            )} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Step 1: Choose type ── */}
        {step === 1 && (
          <div className="p-4 space-y-3">
            <p className="text-sm text-slate-600 font-medium">Qual problema você quer reportar?</p>
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.key}
                onClick={() => setType(rt.key)}
                className={clsx(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                  type === rt.key
                    ? `border-current ${rt.text} ${rt.bg}`
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                )}
              >
                <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', rt.bg)}>
                  <rt.icon className={clsx('w-6 h-6', rt.text)} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{rt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rt.desc}</p>
                </div>
                {type === rt.key && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-current" />}
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-4 pb-2">
              <p className="text-sm text-slate-600 font-medium mb-1">
                Onde está o problema?
              </p>
              <p className="text-xs text-slate-400">
                {pinMode
                  ? 'Toque no mapa para marcar o local.'
                  : position
                    ? 'Arraste o marcador azul para ajustar.'
                    : 'Toque em "Marcar no mapa" ou use sua localização.'
                }
              </p>
            </div>

            {/* Mini map */}
            <div className="mx-4 rounded-2xl overflow-hidden border border-slate-200" style={{ height: 260 }}>
              <MapContainer
                center={position ? [position.lat, position.lng] : [-23.5505, -46.6333]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <MapClickCapture active={pinMode} onPlace={handlePlace} />
                <DraggableMarker position={position} onChange={setPosition} />
              </MapContainer>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPinMode(true)}
                  className={clsx('btn-secondary justify-center text-xs', pinMode && 'ring-2 ring-brand-500')}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {pinMode ? 'Toque no mapa…' : 'Marcar no mapa'}
                </button>
                <button
                  onClick={() => {
                    navigator.geolocation?.getCurrentPosition(
                      p => setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }),
                      () => alert('Geolocalização não disponível.')
                    )
                  }}
                  className="btn-secondary justify-center text-xs"
                >
                  <Navigation2 className="w-3.5 h-3.5" /> Minha localização
                </button>
              </div>

              <div>
                <label className="label">Endereço / referência <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="ex: Rua das Flores, 245, em frente à escola"
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Details ── */}
        {step === 3 && (
          <div className="p-4 space-y-4">
            {/* Summary card */}
            {type && (() => {
              const rt = REPORT_TYPES.find(r => r.key === type)
              return (
                <div className={clsx('flex items-center gap-3 p-3 rounded-xl', rt.bg)}>
                  <rt.icon className={clsx('w-5 h-5 flex-shrink-0', rt.text)} />
                  <div>
                    <p className={clsx('font-semibold text-sm', rt.text)}>{rt.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{address}</p>
                  </div>
                </div>
              )
            })()}

            <div>
              <label className="label">Observações (opcional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Descreva detalhes adicionais, referências, horário que notou o problema…"
                className="input h-28 resize-none"
              />
            </div>

            {/* Photo upload placeholder */}
            <div>
              <label className="label">Foto (opcional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Toque para tirar foto ou escolher da galeria</p>
              </div>
            </div>

            {/* Confirmation notice */}
            <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700">
              <p className="font-semibold mb-1">O que acontece depois?</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Uma Ordem de Serviço é gerada automaticamente</li>
                <li>Você acompanha o status em tempo real</li>
                <li>Prazo médio de atendimento: 72 horas</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        {done ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl text-green-700 font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Ocorrência registrada!
          </div>
        ) : (
          <button
            onClick={() => {
              if (step < 3) {
                if (step === 1 && !canStep2) return
                if (step === 2 && !canStep3) return
                setStep(s => s + 1)
              } else {
                handleSubmit()
              }
            }}
            disabled={
              (step === 1 && !canStep2) ||
              (step === 2 && !canStep3) ||
              submitting
            }
            className="btn-primary w-full justify-center h-12 text-base"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Enviando…
              </span>
            ) : step < 3 ? (
              <span className="flex items-center gap-2">
                Continuar <ChevronRight className="w-5 h-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Registrar Ocorrência
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main CitizenPortal ───────────────────────────────────────────────────────

export default function CitizenPortal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // View state: 'map' | 'history'
  const [view, setView] = useState('map')
  const [showNewModal, setShowNewModal] = useState(false)
  const [openCard, setOpenCard] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(true)
  const [municipality, setMunicipality] = useState(null)
  const [orders, setOrders] = useState(MOCK_CITIZEN_ORDERS)

  // On mount: try to get real geolocation, fallback to registered municipality
  useEffect(() => {
    setLocating(true)
    const mId = user?.municipalityId || 'sp'

    function applyMunicipality() {
      const found = MUNICIPALITIES.find(x => x.id === mId) || MUNICIPALITIES[0]
      setMunicipality(found)
      setFlyTarget({ lat: found.lat, lng: found.lng, zoom: found.zoom })
      setLocating(false)
    }

    if (!navigator.geolocation) {
      applyMunicipality()
      return
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setFlyTarget({ ...loc, zoom: 15 })
        setLocating(false)
        setMunicipality(MUNICIPALITIES.find(x => x.id === mId) || MUNICIPALITIES[0])
      },
      () => applyMunicipality(),
      { timeout: 6000, maximumAge: 60000 }
    )
  }, [user])

  function handleLocateOrder(order) {
    setFlyTarget({ lat: order.lat, lng: order.lng, zoom: 17 })
    setView('map')
  }

  function handleNewSubmit(data) {
    const newOrder = {
      id: `OS-C-00${orders.length + 1}`,
      type: data.type,
      status: 'PENDING',
      priority: 'baixa',
      address: data.address,
      district: municipality?.name || '—',
      lat: data.position?.lat || (flyTarget?.lat || -23.5505),
      lng: data.position?.lng || (flyTarget?.lng || -46.6333),
      poleId: `P-${Math.floor(Math.random() * 9000) + 1000}`,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'PENDING',
          label: 'Ocorrência registrada — aguardando triagem',
          date: new Date().toISOString(),
          actor: 'Sistema',
        },
      ],
    }
    setOrders(prev => [newOrder, ...prev])
    setOpenCard(newOrder.id)
    setView('history')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const mapCenter = flyTarget
    ? [flyTarget.lat, flyTarget.lng]
    : [-23.5505, -46.6333]
  const mapZoom = flyTarget?.zoom || 13

  return (
    <div className="fixed inset-0 flex flex-col bg-surface overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-shrink-0 z-30">
        {/* Logo + municipality */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <LampIcon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-none">COSIP</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 truncate">
                {locating ? 'Localizando…' : municipality ? `${municipality.name} — ${municipality.state}` : 'Município'}
              </p>
            </div>
          </div>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
            {user?.avatar || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-400">Cidadão</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── View toggle tabs ── */}
      <div className="bg-white border-b border-slate-100 px-4 flex gap-1 flex-shrink-0">
        {[
          { id: 'map',     icon: MapIcon,      label: 'Mapa'       },
          { id: 'history', icon: ClipboardList,  label: 'Minhas Ocorrências' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-all',
              view === tab.id
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'history' && orders.length > 0 && (
              <span className="bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Map View ── */}
      {view === 'map' && (
        <div className="flex-1 relative min-h-0">
          {/* Loading overlay */}
          {locating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Localizando seu município…</p>
            </div>
          )}

          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />

            {/* Fly to location when it changes */}
            {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom || 15} />}

            {/* User's GPS position */}
            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon()}>
                  <Popup>Você está aqui</Popup>
                </Marker>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={80}
                  pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.08, weight: 1 }}
                />
              </>
            )}

            {/* Citizen's own occurrences on map */}
            {orders.map(order => {
              const rt = REPORT_TYPES.find(r => r.key === order.type) || REPORT_TYPES[0]
              return (
                <Marker
                  key={order.id}
                  position={[order.lat, order.lng]}
                  icon={pinIcon(rt.color)}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="font-semibold text-xs text-slate-800 mb-1">{rt.label}</p>
                      <p className="text-[10px] text-slate-500 font-mono mb-1.5">{order.id}</p>
                      <p className="text-xs text-slate-600 mb-2 leading-snug">{order.address}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          {/* Floating: My location button */}
          <button
            onClick={() => {
              navigator.geolocation?.getCurrentPosition(
                p => {
                  const loc = { lat: p.coords.latitude, lng: p.coords.longitude }
                  setUserLocation(loc)
                  setFlyTarget({ ...loc, zoom: 16 })
                },
                () => {}
              )
            }}
            className="absolute bottom-24 right-4 z-10 w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-600 hover:bg-brand-50 border border-slate-200 transition-colors"
          >
            <Navigation2 className="w-5 h-5" />
          </button>

          {/* Map legend (minimal) */}
          <div className="absolute top-3 right-3 z-10 bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-[10px] font-medium text-slate-600 space-y-1.5">
            {REPORT_TYPES.map(rt => (
              <div key={rt.key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: rt.color }} />
                <span>{rt.label.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── History View ── */}
      {view === 'history' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <PenLine className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="font-semibold text-slate-500">Nenhuma ocorrência registrada</p>
              <p className="text-xs text-slate-400 mt-1">Toque no botão abaixo para reportar um problema.</p>
            </div>
          ) : (
            orders.map(order => (
              <OccurrenceCard
                key={order.id}
                order={order}
                onLocate={handleLocateOrder}
                isOpen={openCard === order.id}
                onToggle={() => setOpenCard(prev => prev === order.id ? null : order.id)}
              />
            ))
          )}
        </div>
      )}

      {/* ── FAB: New Occurrence ── */}
      {!showNewModal && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-xl shadow-brand-900/25 transition-all active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" /> Reportar Ocorrência
          </button>
        </div>
      )}

      {/* ── New Occurrence full-screen modal ── */}
      {showNewModal && (
        <NewOccurrenceModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleNewSubmit}
          defaultPosition={userLocation}
        />
      )}
    </div>
  )
}
