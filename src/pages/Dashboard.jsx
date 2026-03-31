import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  ClipboardList, Clock, MapPin, Leaf, Zap, TrendingDown,
  TrendingUp, Users, ArrowRight, Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import {
  MOCK_KPI, MONTHLY_CHART_DATA, DISTRICT_CHART_DATA,
  STATUS_CHART_DATA, LED_SAVINGS_DATA, MOCK_ORDERS
} from '../data/mockData'

function KpiCard({ icon: Icon, label, value, sub, trend, trendLabel, color = 'blue' }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',  badge: 'bg-blue-100 text-blue-700' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',   badge: 'bg-red-100 text-red-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600',badge: 'bg-purple-100 text-purple-700' },
  }
  const c = colorMap[color]

  return (
    <div className="card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
          <Icon className={clsx('w-5 h-5', c.icon)} />
        </div>
        {trend !== undefined && (
          <span className={clsx('flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', c.badge)}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {trendLabel && <p className="text-xs text-slate-400 mt-0.5">{trendLabel}</p>}
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  PENDING:     'badge-pending',
  IN_PROGRESS: 'badge-progress',
  DONE:        'badge-done',
}
const STATUS_LABELS = {
  PENDING:     'Pendente',
  IN_PROGRESS: 'Em Andamento',
  DONE:        'Concluído',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="flex gap-2">
            <span>{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const recentOrders = MOCK_ORDERS.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={ClipboardList}
          label="Chamados no Mês"
          value={MOCK_KPI.ordersThisMonth}
          trend={MOCK_KPI.ordersGrowth}
          trendLabel="vs. mês anterior"
          color="blue"
        />
        <KpiCard
          icon={Clock}
          label="Tempo Médio (h)"
          value={`${MOCK_KPI.avgServiceTime}h`}
          trend={-11.4}
          trendLabel="melhoria vs. anterior"
          color="green"
        />
        <KpiCard
          icon={MapPin}
          label="Regiões Críticas"
          value={MOCK_KPI.criticalDistricts}
          sub="distritos monitorados"
          color="red"
        />
        <KpiCard
          icon={Zap}
          label="Economia LED/mês"
          value={`R$ ${MOCK_KPI.ledSavingsMonth.toLocaleString('pt-BR')}`}
          sub={`${MOCK_KPI.ledInstalled} luminárias LED`}
          trend={3.9}
          color="green"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Activity}  label="Pendentes"        value={MOCK_KPI.pendingOrders}    color="amber"  />
        <KpiCard icon={ClipboardList} label="Em Andamento" value={MOCK_KPI.inProgressOrders} color="blue"   />
        <KpiCard icon={Users}     label="Equipes Ativas"   value={MOCK_KPI.activeTeams}       color="purple" />
        <KpiCard icon={Leaf}      label="CO₂ Evitado (t)"  value={MOCK_KPI.co2Avoided}        color="green"  />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly evolution */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Evolução Mensal de Chamados</p>
            <span className="text-xs text-slate-400">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChamados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Area type="monotone" dataKey="chamados"   name="Abertos"    stroke="#3b82f6" fill="url(#colorChamados)"   strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="concluidos" name="Concluídos"  stroke="#10b981" fill="url(#colorConcluidos)" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="card">
          <p className="section-title mb-4">Status dos Chamados</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={STATUS_CHART_DATA}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {STATUS_CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {STATUS_CHART_DATA.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Districts */}
        <div className="card">
          <p className="section-title mb-4">Chamados por Distrito</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DISTRICT_CHART_DATA} layout="vertical" margin={{ left: 5, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="chamados" name="Chamados" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LED savings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Economia com LED (R$)</p>
            <span className="badge badge-done">+{((14320 - 8500) / 8500 * 100).toFixed(0)}% YTD</span>
          </div>
          <div className="mb-3">
            <p className="text-2xl font-bold text-green-600">R$ {MOCK_KPI.ledSavingsTotal.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-400">Economia acumulada · {MOCK_KPI.co2Avoided}t CO₂ evitado</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={LED_SAVINGS_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="economia" name="Economia" stroke="#10b981" fill="url(#colorSavings)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title">Chamados Recentes</p>
          <Link to="/ordens" className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-400 pb-2.5 pr-4">Nº OS</th>
                <th className="text-left text-xs font-medium text-slate-400 pb-2.5 pr-4">Tipo</th>
                <th className="text-left text-xs font-medium text-slate-400 pb-2.5 pr-4 hidden sm:table-cell">Endereço</th>
                <th className="text-left text-xs font-medium text-slate-400 pb-2.5 pr-4">Status</th>
                <th className="text-left text-xs font-medium text-slate-400 pb-2.5 hidden md:table-cell">Prioridade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-600">{o.id}</td>
                  <td className="py-3 pr-4 text-xs text-slate-700 whitespace-nowrap">
                    {o.type === 'BURNED_LAMP' ? 'Lâmpada Queimada' :
                     o.type === 'LED_REQUEST' ? 'Troca LED' :
                     o.type === 'DAY_ON'      ? 'Acesa de Dia' :
                     o.type === 'MAINTENANCE' ? 'Manutenção' : 'Vandalismo'}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500 hidden sm:table-cell max-w-[180px] truncate">{o.address}</td>
                  <td className="py-3 pr-4">
                    <span className={clsx('badge', STATUS_COLORS[o.status])}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className={clsx('badge',
                      o.priority === 'alta'  ? 'badge-critical' :
                      o.priority === 'média' ? 'badge-progress' : 'badge-done'
                    )}>
                      {o.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
