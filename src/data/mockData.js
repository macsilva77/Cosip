// ─── Mock Data — COSIP ────────────────────────────────────────────────────────

// Municipalities served by the system (expandable per SaaS tenant)
export const MUNICIPALITIES = [
  { id: 'sp',  name: 'São Paulo',        state: 'SP', lat: -23.5505, lng: -46.6333, zoom: 13 },
  { id: 'abc', name: 'Santo André',      state: 'SP', lat: -23.6637, lng: -46.5380, zoom: 13 },
  { id: 'cam', name: 'Campinas',         state: 'SP', lat: -22.9099, lng: -47.0626, zoom: 13 },
  { id: 'rib', name: 'Ribeirão Preto',   state: 'SP', lat: -21.1767, lng: -47.8208, zoom: 13 },
  { id: 'gua', name: 'Guarulhos',        state: 'SP', lat: -23.4545, lng: -46.5333, zoom: 13 },
  { id: 'osasco', name: 'Osasco',        state: 'SP', lat: -23.5324, lng: -46.7920, zoom: 13 },
]

export const MOCK_USERS = [
  { id: 'u1', name: 'Carlos Eduardo Silva', email: 'carlos.silva@prefeitura.gov.br',   role: 'admin',      avatar: 'CS', phone: '(11) 98765-4321', cpf: '123.456.789-00', status: 'active',   createdAt: '2024-01-15', municipalityId: 'sp' },
  { id: 'u2', name: 'Ana Paula Ferreira',   email: 'ana.ferreira@prefeitura.gov.br',   role: 'supervisor', avatar: 'AF', phone: '(11) 97654-3210', cpf: '234.567.890-11', status: 'active',   createdAt: '2024-02-20', municipalityId: 'sp' },
  { id: 'u3', name: 'Roberto Mendes',       email: 'roberto.mendes@prefeitura.gov.br', role: 'technician', avatar: 'RM', phone: '(11) 96543-2109', cpf: '345.678.901-22', status: 'active',   createdAt: '2024-03-05', municipalityId: 'sp' },
  { id: 'u4', name: 'Sandra Oliveira',      email: 'sandra.oliveira@prefeitura.gov.br',role: 'technician', avatar: 'SO', phone: '(11) 95432-1098', cpf: '456.789.012-33', status: 'active',   createdAt: '2024-03-18', municipalityId: 'sp' },
  { id: 'u5', name: 'Marcos Souza',         email: 'cidadao@email.com',                role: 'citizen',    avatar: 'MS', phone: '(11) 94321-0987', cpf: '567.890.123-44', status: 'active',   createdAt: '2024-04-01', municipalityId: 'sp' },
  { id: 'u6', name: 'Lucia Costa',          email: 'lucia.costa@prefeitura.gov.br',    role: 'supervisor', avatar: 'LC', phone: '(11) 93210-9876', cpf: '678.901.234-55', status: 'active',   createdAt: '2024-05-10', municipalityId: 'sp' },
]

// Citizen's own occurrences with status timeline
export const MOCK_CITIZEN_ORDERS = [
  {
    id: 'OS-C-001',
    type: 'BURNED_LAMP',
    status: 'DONE',
    priority: 'alta',
    address: 'Rua das Flores, 245 — Vila Mariana',
    district: 'Vila Mariana',
    lat: -23.5873, lng: -46.6321,
    poleId: 'P-1122',
    notes: 'Lâmpada apagada em frente à escola.',
    createdAt: '2024-05-10T09:00:00',
    timeline: [
      { status: 'PENDING',     label: 'Ocorrência registrada',       date: '2024-05-10T09:00:00', actor: 'Sistema' },
      { status: 'IN_PROGRESS', label: 'Equipe Alpha designada',       date: '2024-05-11T08:30:00', actor: 'Supervisor Ana Ferreira' },
      { status: 'IN_PROGRESS', label: 'Técnico em deslocamento',      date: '2024-05-11T14:10:00', actor: 'Roberto Mendes' },
      { status: 'DONE',        label: 'Lâmpada substituída — OK',     date: '2024-05-11T16:45:00', actor: 'Roberto Mendes' },
    ],
  },
  {
    id: 'OS-C-002',
    type: 'DAY_ON',
    status: 'IN_PROGRESS',
    priority: 'baixa',
    address: 'Av. Domingos de Moraes, 800 — Vila Mariana',
    district: 'Vila Mariana',
    lat: -23.5921, lng: -46.6389,
    poleId: 'P-1190',
    notes: 'Lâmpada acesa desde as 8h da manhã.',
    createdAt: '2024-06-03T10:15:00',
    timeline: [
      { status: 'PENDING',     label: 'Ocorrência registrada',       date: '2024-06-03T10:15:00', actor: 'Sistema' },
      { status: 'IN_PROGRESS', label: 'Equipe Beta verificando',      date: '2024-06-04T09:00:00', actor: 'Sandra Oliveira' },
    ],
  },
  {
    id: 'OS-C-003',
    type: 'LED_REQUEST',
    status: 'PENDING',
    priority: 'baixa',
    address: 'Rua Vergueiro, 3200 — Mirandópolis',
    district: 'Mirandópolis',
    lat: -23.5980, lng: -46.6350,
    poleId: 'P-1245',
    notes: 'Solicito troca por LED no poste em frente ao condomínio.',
    createdAt: '2024-06-05T07:30:00',
    timeline: [
      { status: 'PENDING', label: 'Solicitação recebida — aguardando triagem', date: '2024-06-05T07:30:00', actor: 'Sistema' },
    ],
  },
]

export const CURRENT_USER = MOCK_USERS[0]

export const ORDER_TYPES = {
  BURNED_LAMP:  { label: 'Lâmpada Queimada',        color: 'red',    icon: 'ZapOff'    },
  LED_REQUEST:  { label: 'Solicitação de LED',       color: 'blue',   icon: 'Lightbulb' },
  DAY_ON:       { label: 'Acesa Durante o Dia',      color: 'amber',  icon: 'Sun'       },
  MAINTENANCE:  { label: 'Manutenção Preventiva',    color: 'purple', icon: 'Wrench'    },
  VANDALISM:    { label: 'Vandalismo',               color: 'orange', icon: 'AlertTriangle' },
}

export const ORDER_STATUS = {
  PENDING:    { label: 'Pendente',     color: 'amber' },
  IN_PROGRESS:{ label: 'Em Andamento', color: 'blue'  },
  DONE:       { label: 'Concluído',    color: 'green' },
  CANCELLED:  { label: 'Cancelado',   color: 'slate' },
}

export const MOCK_ORDERS = [
  { id: 'OS-2024-001', type: 'BURNED_LAMP',  status: 'PENDING',     priority: 'alta',   address: 'Av. Paulista, 1578 — Bela Vista',        district: 'Bela Vista',    lat: -23.5614, lng: -46.6561, reportedBy: 'Marcos Souza',    assignedTo: null,           createdAt: '2024-06-01T08:30:00', updatedAt: '2024-06-01T08:30:00', poleId: 'P-0042', notes: 'Lâmpada apagada há 3 dias.' },
  { id: 'OS-2024-002', type: 'LED_REQUEST',  status: 'IN_PROGRESS', priority: 'média',  address: 'Rua Augusta, 800 — Consolação',          district: 'Consolação',    lat: -23.5534, lng: -46.6572, reportedBy: 'Ana Paula Ferreira', assignedTo: 'Roberto Mendes', createdAt: '2024-06-02T10:15:00', updatedAt: '2024-06-03T09:00:00', poleId: 'P-0087', notes: '' },
  { id: 'OS-2024-003', type: 'DAY_ON',       status: 'PENDING',     priority: 'baixa',  address: 'Rua Oscar Freire, 110 — Jardins',        district: 'Jardins',       lat: -23.5618, lng: -46.6688, reportedBy: 'Marcos Souza',    assignedTo: null,           createdAt: '2024-06-02T14:00:00', updatedAt: '2024-06-02T14:00:00', poleId: 'P-0134', notes: 'Acesa desde ontem de manhã.' },
  { id: 'OS-2024-004', type: 'BURNED_LAMP',  status: 'DONE',        priority: 'alta',   address: 'Av. Brigadeiro Faria Lima, 2000 — Itaim',district: 'Itaim Bibi',    lat: -23.5763, lng: -46.6853, reportedBy: 'Lucia Costa',     assignedTo: 'Sandra Oliveira', createdAt: '2024-05-28T07:45:00', updatedAt: '2024-06-01T16:30:00', poleId: 'P-0218', notes: 'Substituída com sucesso.' },
  { id: 'OS-2024-005', type: 'MAINTENANCE',  status: 'PENDING',     priority: 'média',  address: 'Rua da Consolação, 400 — República',    district: 'República',     lat: -23.5453, lng: -46.6466, reportedBy: 'Carlos Eduardo',  assignedTo: null,           createdAt: '2024-06-03T09:00:00', updatedAt: '2024-06-03T09:00:00', poleId: 'P-0315', notes: 'Poste com estrutura danificada.' },
  { id: 'OS-2024-006', type: 'LED_REQUEST',  status: 'IN_PROGRESS', priority: 'alta',   address: 'Av. Rebouças, 1200 — Pinheiros',         district: 'Pinheiros',     lat: -23.5671, lng: -46.6841, reportedBy: 'Sandra Oliveira', assignedTo: 'Roberto Mendes', createdAt: '2024-06-03T11:30:00', updatedAt: '2024-06-04T08:00:00', poleId: 'P-0423', notes: '' },
  { id: 'OS-2024-007', type: 'BURNED_LAMP',  status: 'PENDING',     priority: 'alta',   address: 'Rua Haddock Lobo, 595 — Cerqueira César',district: 'Cerqueira César',lat: -23.5596, lng: -46.6656, reportedBy: 'Ana Paula Ferreira', assignedTo: null,          createdAt: '2024-06-04T07:00:00', updatedAt: '2024-06-04T07:00:00', poleId: 'P-0501', notes: '' },
  { id: 'OS-2024-008', type: 'VANDALISM',    status: 'DONE',        priority: 'alta',   address: 'Praça da Sé, s/n — Sé',                 district: 'Sé',            lat: -23.5503, lng: -46.6316, reportedBy: 'Roberto Mendes',  assignedTo: 'Sandra Oliveira', createdAt: '2024-05-30T15:20:00', updatedAt: '2024-06-02T14:00:00', poleId: 'P-0607', notes: 'Luminária quebrada por vândalos.' },
  { id: 'OS-2024-009', type: 'DAY_ON',       status: 'IN_PROGRESS', priority: 'baixa',  address: 'Av. Ipiranga, 344 — República',          district: 'República',     lat: -23.5431, lng: -46.6374, reportedBy: 'Marcos Souza',    assignedTo: 'Roberto Mendes', createdAt: '2024-06-04T13:00:00', updatedAt: '2024-06-04T15:00:00', poleId: 'P-0712', notes: '' },
  { id: 'OS-2024-010', type: 'BURNED_LAMP',  status: 'PENDING',     priority: 'média',  address: 'Rua Vergueiro, 1800 — Paraíso',          district: 'Paraíso',       lat: -23.5786, lng: -46.6351, reportedBy: 'Lucia Costa',     assignedTo: null,           createdAt: '2024-06-05T08:20:00', updatedAt: '2024-06-05T08:20:00', poleId: 'P-0821', notes: '' },
  { id: 'OS-2024-011', type: 'LED_REQUEST',  status: 'PENDING',     priority: 'baixa',  address: 'Rua da Liberdade, 200',                  district: 'Liberdade',     lat: -23.5598, lng: -46.6334, reportedBy: 'Ana Paula Ferreira', assignedTo: null,          createdAt: '2024-06-05T09:45:00', updatedAt: '2024-06-05T09:45:00', poleId: 'P-0932', notes: '' },
  { id: 'OS-2024-012', type: 'MAINTENANCE',  status: 'DONE',        priority: 'alta',   address: 'Av. 23 de Maio, 500 — Cambuci',          district: 'Cambuci',       lat: -23.5631, lng: -46.6197, reportedBy: 'Carlos Eduardo',  assignedTo: 'Sandra Oliveira', createdAt: '2024-05-25T08:00:00', updatedAt: '2024-06-01T12:00:00', poleId: 'P-1045', notes: 'Manutenção completa realizada.' },
]

export const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'Equipe Alpha',
    leader: 'Roberto Mendes',
    members: ['Roberto Mendes', 'João Carvalho', 'Paulo Lima'],
    vehicle: 'Caminhão-Cesto — FKR-5890',
    status: 'active',
    currentRoute: 'Rota Centro-Paulista',
    ordersAssigned: 4,
    ordersCompleted: 2,
    lat: -23.5540,
    lng: -46.6536,
    phone: '(11) 94321-5678',
    color: '#2563EB',
  },
  {
    id: 't2',
    name: 'Equipe Beta',
    leader: 'Sandra Oliveira',
    members: ['Sandra Oliveira', 'Maria Santos', 'Thiago Alves'],
    vehicle: 'Caminhão-Cesto — GHT-2341',
    status: 'active',
    currentRoute: 'Rota Pinheiros-Itaim',
    ordersAssigned: 5,
    ordersCompleted: 3,
    lat: -23.5700,
    lng: -46.6800,
    phone: '(11) 93210-4567',
    color: '#059669',
  },
  {
    id: 't3',
    name: 'Equipe Gamma',
    leader: 'Fernando Costa',
    members: ['Fernando Costa', 'Diego Rocha'],
    vehicle: 'Van — HJK-7823',
    status: 'standby',
    currentRoute: null,
    ordersAssigned: 0,
    ordersCompleted: 0,
    lat: -23.5480,
    lng: -46.6200,
    phone: '(11) 92109-3456',
    color: '#D97706',
  },
]

export const MOCK_ROUTES = [
  {
    id: 'r1',
    name: 'Rota Centro-Paulista',
    team: 't1',
    status: 'in_progress',
    orders: ['OS-2024-001', 'OS-2024-003', 'OS-2024-007', 'OS-2024-011'],
    totalDistance: '12.4 km',
    estimatedTime: '3h 20min',
    waypoints: [
      { lat: -23.5614, lng: -46.6561, order: 'OS-2024-001' },
      { lat: -23.5618, lng: -46.6688, order: 'OS-2024-003' },
      { lat: -23.5596, lng: -46.6656, order: 'OS-2024-007' },
      { lat: -23.5598, lng: -46.6334, order: 'OS-2024-011' },
    ],
  },
  {
    id: 'r2',
    name: 'Rota Pinheiros-Itaim',
    team: 't2',
    status: 'in_progress',
    orders: ['OS-2024-002', 'OS-2024-006', 'OS-2024-010'],
    totalDistance: '9.8 km',
    estimatedTime: '2h 45min',
    waypoints: [
      { lat: -23.5534, lng: -46.6572, order: 'OS-2024-002' },
      { lat: -23.5671, lng: -46.6841, order: 'OS-2024-006' },
      { lat: -23.5786, lng: -46.6351, order: 'OS-2024-010' },
    ],
  },
]

export const MOCK_KPI = {
  totalOrders: 128,
  ordersThisMonth: 34,
  ordersGrowth: +12.5,
  pendingOrders: 47,
  inProgressOrders: 28,
  doneOrders: 53,
  avgServiceTime: 18.4,          // hours
  avgServiceTimeChange: -2.1,    // hours improvement
  criticalDistricts: 3,
  ledInstalled: 1842,
  ledSavingsMonth: 14320,        // R$
  ledSavingsTotal: 187400,       // R$
  co2Avoided: 42.6,              // tons
  activeTeams: 2,
  totalPoles: 8750,
  polesWithIssues: 214,
}

export const MONTHLY_CHART_DATA = [
  { month: 'Jan', chamados: 42, concluidos: 38, led: 120 },
  { month: 'Fev', chamados: 38, concluidos: 35, led: 95  },
  { month: 'Mar', chamados: 55, concluidos: 48, led: 210 },
  { month: 'Abr', chamados: 49, concluidos: 44, led: 175 },
  { month: 'Mai', chamados: 62, concluidos: 55, led: 290 },
  { month: 'Jun', chamados: 34, concluidos: 22, led: 108 },
]

export const DISTRICT_CHART_DATA = [
  { district: 'Bela Vista',  chamados: 22 },
  { district: 'Pinheiros',   chamados: 18 },
  { district: 'República',   chamados: 16 },
  { district: 'Consolação',  chamados: 14 },
  { district: 'Itaim Bibi',  chamados: 12 },
  { district: 'Jardins',     chamados: 9  },
  { district: 'Sé',          chamados: 8  },
  { district: 'Outros',      chamados: 29 },
]

export const STATUS_CHART_DATA = [
  { name: 'Pendente',     value: 47, color: '#f59e0b' },
  { name: 'Em Andamento', value: 28, color: '#3b82f6' },
  { name: 'Concluído',    value: 53, color: '#10b981' },
]

export const LED_SAVINGS_DATA = [
  { month: 'Jan', economia: 8500  },
  { month: 'Fev', economia: 9200  },
  { month: 'Mar', economia: 11400 },
  { month: 'Abr', economia: 12100 },
  { month: 'Mai', economia: 13800 },
  { month: 'Jun', economia: 14320 },
]

export const ROLES = {
  admin:      { label: 'Administrador', color: 'purple' },
  supervisor: { label: 'Supervisor',    color: 'blue'   },
  technician: { label: 'Técnico',       color: 'green'  },
  citizen:    { label: 'Cidadão',       color: 'slate'  },
}
