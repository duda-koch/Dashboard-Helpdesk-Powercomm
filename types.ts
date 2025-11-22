export enum TicketStatus {
  RESOLVED = 'Resolvido',
  BACKLOG = 'Backlog',
  IN_PROGRESS = 'Em atendimento',
  PAUSED = 'Pausado',
  PAUSED_FEM = 'Pausada',
  ANALYSIS = 'Em Análise 24hs',
  ANALYSIS_GENERIC = 'Em Análise'
}

export interface SupportTicket {
  cliente: string;
  prioridade: string;
  nomeTicket: string;
  status: string;
  tag: string;
  dataAbertura: string;
  dataTermino: string;
  nivel: 'N1' | 'N2' | 'N3' | string;
  sla: number;
  tecnico: string;
  descricao: string;
  solicitante: string;
  tipoTicket: string;
}

export interface GlobalMetrics {
  totalTickets: number;
  resolvedTickets: number;
  openTickets: number;
  avgSla: number;
  maxSla: number;
  percentResolved: number;
  backlogCount: number;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface InsightResponse {
  executiveSummary: string;
  bottlenecks: string[];
  risks: string[];
  rootCauses: string[];
  recommendations: string[];
  priorityActions: string[];
}

export enum HealthStatus {
  HEALTHY = 'Healthy',
  WARNING = 'Warning',
  CRITICAL = 'Critical'
}

export interface Customer {
  id: string;
  name: string;
  logo: string;
  plan: string;
  status: HealthStatus;
  healthScore: number;
  arr: number;
  openTickets: number;
  csm: string;
}