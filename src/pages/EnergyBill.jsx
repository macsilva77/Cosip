import { useState, useRef } from 'react'
import {
  Upload, FileText, CheckCircle2, AlertTriangle, XCircle,
  Eye, RefreshCw, Zap, TrendingDown, Calendar, Building2,
  ChevronDown, ChevronUp, X, Info
} from 'lucide-react'
import clsx from 'clsx'

const MOCK_EXTRACTED = {
  concessionaria: 'Enel Distribuição São Paulo',
  cnpj: '11.277.813/0001-76',
  uc: '7001234567',
  instalacao: 'IP-00512',
  endereco: 'Av. Paulista, 1578 — Bela Vista, São Paulo/SP',
  referencia: 'Maio/2024',
  vencimento: '15/06/2024',
  leituraAnterior: 24850,
  leituraAtual: 26720,
  consumo: 1870,
  consumoUltimoAno: [1420, 1510, 1680, 1790, 1840, 1870, 1720, 1650, 1580, 1490, 1420, 1390],
  tarifaKwh: 0.857,
  totalEnergia: 1602.59,
  totalImpostos: 487.32,
  totalConta: 2089.91,
  modalidade: 'Convencional',
  tensao: '220V',
  numPostes: 48,
  potenciaMedia: '250W',
}

const VALIDATIONS = [
  { id: 'v1', label: 'Formato do arquivo',        status: 'ok',      msg: 'PDF válido, leitura completa'         },
  { id: 'v2', label: 'CNPJ da concessionária',    status: 'ok',      msg: 'CNPJ verificado na base Receita Federal' },
  { id: 'v3', label: 'Número da Unidade Consumidora', status: 'ok',  msg: 'UC ativa e cadastrada'                 },
  { id: 'v4', label: 'Consumo vs. histórico',     status: 'warning', msg: 'Consumo 12% acima da média dos últimos 12 meses' },
  { id: 'v5', label: 'Custo por ponto de luz',    status: 'ok',      msg: 'R$ 43,54/luminária — dentro do esperado' },
  { id: 'v6', label: 'Tarifa aplicada',           status: 'ok',      msg: 'Tarifa convencional vigente (ANEEL 2024)' },
  { id: 'v7', label: 'Inconsistência de leitura', status: 'error',   msg: 'Leitura atual inferior ao histórico de 6 meses' },
  { id: 'v8', label: 'Prazo de vencimento',       status: 'ok',      msg: 'Conta dentro do prazo'                 },
]

const STATUS_ICON = {
  ok:      <CheckCircle2 className="w-4 h-4 text-green-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  error:   <XCircle className="w-4 h-4 text-red-500" />,
}
const STATUS_BG = {
  ok:      'bg-green-50 border-green-100',
  warning: 'bg-amber-50 border-amber-100',
  error:   'bg-red-50 border-red-100',
}

const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function EnergyBill() {
  const [phase, setPhase] = useState('upload') // upload | processing | result
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(null)
  const fileRef = useRef()

  function startUpload(name) {
    setFileName(name)
    setPhase('processing')
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 18
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setTimeout(() => setPhase('result'), 400)
      }
      setProgress(Math.min(100, Math.round(p)))
    }, 200)
  }

  function handleFile(file) {
    if (!file) return
    if (!['application/pdf', 'text/xml', 'application/xml'].includes(file.type) && !file.name.endsWith('.xml')) {
      alert('Formato não suportado. Use PDF ou XML.')
      return
    }
    startUpload(file.name)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const maxConsumo = Math.max(...MOCK_EXTRACTED.consumoUltimoAno)
  const errors   = VALIDATIONS.filter(v => v.status === 'error').length
  const warnings = VALIDATIONS.filter(v => v.status === 'warning').length

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Upload area */}
      {phase === 'upload' && (
        <div className="card">
          <h2 className="section-title mb-1">Validação de Conta de Energia</h2>
          <p className="text-sm text-slate-500 mb-5">
            Faça o upload da conta de energia (PDF ou XML) para extração automática e validação de inconsistências.
          </p>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={clsx(
              'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
              dragOver ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
            )}
          >
            <input ref={fileRef} type="file" accept=".pdf,.xml" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-brand-500" />
            </div>
            <p className="text-slate-700 font-semibold text-base">
              {dragOver ? 'Solte o arquivo aqui' : 'Arraste a conta ou clique para selecionar'}
            </p>
            <p className="text-slate-400 text-sm mt-1">PDF ou XML — máx. 10 MB</p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl flex gap-3">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-semibold mb-0.5">O que é analisado automaticamente:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Extração de dados da fatura (UC, leituras, consumo, valores)</li>
                <li>Verificação de tarifas contra tabela ANEEL vigente</li>
                <li>Detecção de anomalias no consumo vs. histórico</li>
                <li>Validação de CNPJ da concessionária</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Processing */}
      {phase === 'processing' && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
            <FileText className="w-8 h-8 text-brand-500" />
            <div className="absolute inset-0 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Processando fatura</h3>
          <p className="text-slate-500 text-sm mb-1">{fileName}</p>
          <p className="text-slate-400 text-xs mb-6">Extração e validação automática em andamento...</p>

          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 space-y-1 text-left">
              {[
                { label: 'Lendo arquivo PDF', done: progress > 20 },
                { label: 'Extraindo dados da fatura', done: progress > 45 },
                { label: 'Validando tarifas ANEEL', done: progress > 65 },
                { label: 'Verificando histórico de consumo', done: progress > 82 },
                { label: 'Gerando relatório', done: progress === 100 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {s.done
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  }
                  <span className={s.done ? 'text-slate-800' : 'text-slate-400'}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <>
          {/* Summary banner */}
          <div className={clsx(
            'card flex items-center gap-4',
            errors > 0 ? 'border-red-200 bg-red-50' : warnings > 0 ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'
          )}>
            <div className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              errors > 0 ? 'bg-red-100' : warnings > 0 ? 'bg-amber-100' : 'bg-green-100'
            )}>
              {errors > 0
                ? <XCircle className="w-6 h-6 text-red-500" />
                : warnings > 0
                  ? <AlertTriangle className="w-6 h-6 text-amber-500" />
                  : <CheckCircle2 className="w-6 h-6 text-green-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-base">
                {errors > 0 ? `${errors} inconsistência(s) crítica(s) encontrada(s)` :
                 warnings > 0 ? `${warnings} alerta(s) detectado(s)` :
                 'Fatura validada com sucesso'}
              </p>
              <p className="text-sm text-slate-600">{fileName}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setPhase('upload')} className="btn-ghost text-xs">
                <RefreshCw className="w-3.5 h-3.5" /> Nova
              </button>
              <button className="btn-primary text-xs">
                <Eye className="w-3.5 h-3.5" /> Exportar PDF
              </button>
            </div>
          </div>

          {/* Extracted data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-brand-500" />
                <p className="section-title">Dados da Fatura</p>
              </div>
              <div className="space-y-2.5">
                {[
                  ['Concessionária', MOCK_EXTRACTED.concessionaria],
                  ['Unidade Consumidora', MOCK_EXTRACTED.uc],
                  ['Instalação IP', MOCK_EXTRACTED.instalacao],
                  ['Endereço', MOCK_EXTRACTED.endereco],
                  ['Referência', MOCK_EXTRACTED.referencia],
                  ['Vencimento', MOCK_EXTRACTED.vencimento],
                  ['Modalidade', MOCK_EXTRACTED.modalidade],
                  ['Tensão', MOCK_EXTRACTED.tensao],
                  ['Qtd. Postes', MOCK_EXTRACTED.numPostes],
                  ['Potência Média', MOCK_EXTRACTED.potenciaMedia],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-start gap-3 text-xs">
                    <span className="text-slate-400 flex-shrink-0">{l}</span>
                    <span className="text-slate-800 font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-500" />
                <p className="section-title">Consumo e Valores</p>
              </div>
              <div className="space-y-2.5 mb-5">
                {[
                  ['Leitura Anterior', `${MOCK_EXTRACTED.leituraAnterior.toLocaleString()} kWh`],
                  ['Leitura Atual',    `${MOCK_EXTRACTED.leituraAtual.toLocaleString()} kWh`],
                  ['Consumo no Mês',   `${MOCK_EXTRACTED.consumo.toLocaleString()} kWh`],
                  ['Tarifa kWh',       `R$ ${MOCK_EXTRACTED.tarifaKwh.toFixed(3)}`],
                  ['Energia',          `R$ ${MOCK_EXTRACTED.totalEnergia.toFixed(2)}`],
                  ['Impostos',         `R$ ${MOCK_EXTRACTED.totalImpostos.toFixed(2)}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-xs gap-3">
                    <span className="text-slate-400">{l}</span>
                    <span className="text-slate-800 font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
                  <span className="text-slate-700">Total a pagar</span>
                  <span className="text-slate-900">R$ {MOCK_EXTRACTED.totalConta.toFixed(2)}</span>
                </div>
              </div>

              {/* Mini bar chart of consumption */}
              <p className="text-xs font-medium text-slate-500 mb-2">Consumo Últimos 12 Meses (kWh)</p>
              <div className="flex items-end gap-1 h-16">
                {MOCK_EXTRACTED.consumoUltimoAno.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={clsx('w-full rounded-sm transition-all', i === 4 ? 'bg-brand-500' : 'bg-slate-200')}
                      style={{ height: `${(v / maxConsumo) * 100}%` }}
                      title={`${MONTHS_PT[i]}: ${v} kWh`}
                    />
                    <span className="text-[8px] text-slate-400">{MONTHS_PT[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Validations */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <p className="section-title">Resultado das Validações</p>
              <div className="ml-auto flex gap-2">
                <span className="badge badge-done">{VALIDATIONS.filter(v => v.status === 'ok').length} OK</span>
                {warnings > 0 && <span className="badge badge-pending">{warnings} alerta</span>}
                {errors > 0   && <span className="badge badge-critical">{errors} erro</span>}
              </div>
            </div>
            <div className="space-y-2">
              {VALIDATIONS.map(v => (
                <div key={v.id} className={clsx('flex items-start gap-3 p-3 rounded-lg border text-sm', STATUS_BG[v.status])}>
                  <div className="flex-shrink-0 mt-0.5">{STATUS_ICON[v.status]}</div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-xs">{v.label}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{v.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LED Savings Projection */}
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <p className="section-title text-green-800">Projeção de Economia com LED</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Redução de consumo estimada', value: '≈ 65%', sub: 'trocando lâmpadas convencionais' },
                { label: 'Economia mensal projetada',   value: 'R$ 1.358', sub: 'nas luminárias elegíveis' },
                { label: 'Payback do investimento',     value: '≈ 24 meses', sub: 'com financiamento municipal' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-2xl font-bold text-green-700">{item.value}</p>
                  <p className="text-xs font-medium text-green-800 mt-0.5">{item.label}</p>
                  <p className="text-[10px] text-green-600 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary mt-4 w-full justify-center bg-green-600 hover:bg-green-700 text-sm">
              Gerar Solicitação de Troca para LED
            </button>
          </div>
        </>
      )}
    </div>
  )
}
