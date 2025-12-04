// Modify BASE_URL and endpoints here to connect to your Python backend

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
  ENDPOINTS: {
    // Agents
    AGENTS: "/api/agents",
    AGENT_DETAIL: (id: string) => `/api/agents/${id}`,
    AGENT_METRICS: (id: string) => `/api/agents/${id}/metrics`,
    AGENT_LOGS: (id: string) => `/api/agents/${id}/logs`,

    // Logs
    LOGS: "/api/logs",
    LOG_DETAIL: (id: string) => `/api/logs/${id}`,
    LOGS_STREAM: "/ws/logs",

    // Traces
    TRACES: "/api/traces",
    TRACE_DETAIL: (id: string) => `/api/traces/${id}`,

    // Metrics
    METRICS_OVERVIEW: "/api/metrics/overview",
    METRICS_TOKENS: "/api/metrics/tokens",
    METRICS_COSTS: "/api/metrics/costs",
    METRICS_LATENCY: "/api/metrics/latency",

    // Sessions
    SESSIONS: "/api/sessions",
    SESSION_DETAIL: (id: string) => `/api/sessions/${id}`,

    // Health
    HEALTH: "/api/health",
  },
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`[API] Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Agent API functions
export const agentAPI = {
  getAll: () => fetchAPI<Agent[]>(API_CONFIG.ENDPOINTS.AGENTS),
  getById: (id: string) => fetchAPI<Agent>(API_CONFIG.ENDPOINTS.AGENT_DETAIL(id)),
  getMetrics: (id: string) => fetchAPI<AgentMetrics>(API_CONFIG.ENDPOINTS.AGENT_METRICS(id)),
  getLogs: (id: string) => fetchAPI<LogEntry[]>(API_CONFIG.ENDPOINTS.AGENT_LOGS(id)),
}

// Logs API functions
export const logsAPI = {
  getAll: (params?: LogsQueryParams) => {
    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
    return fetchAPI<LogsResponse>(`${API_CONFIG.ENDPOINTS.LOGS}${queryString}`)
  },
  getById: (id: string) => fetchAPI<LogEntry>(API_CONFIG.ENDPOINTS.LOG_DETAIL(id)),
}

// Traces API functions
export const tracesAPI = {
  getAll: () => fetchAPI<Trace[]>(API_CONFIG.ENDPOINTS.TRACES),
  getById: (id: string) => fetchAPI<Trace>(API_CONFIG.ENDPOINTS.TRACE_DETAIL(id)),
}

// Metrics API functions
export const metricsAPI = {
  getOverview: () => fetchAPI<MetricsOverview>(API_CONFIG.ENDPOINTS.METRICS_OVERVIEW),
  getTokens: () => fetchAPI<TokenMetrics>(API_CONFIG.ENDPOINTS.METRICS_TOKENS),
  getCosts: () => fetchAPI<CostMetrics>(API_CONFIG.ENDPOINTS.METRICS_COSTS),
  getLatency: () => fetchAPI<LatencyMetrics>(API_CONFIG.ENDPOINTS.METRICS_LATENCY),
}

// Sessions API functions
export const sessionsAPI = {
  getAll: () => fetchAPI<Session[]>(API_CONFIG.ENDPOINTS.SESSIONS),
  getById: (id: string) => fetchAPI<Session>(API_CONFIG.ENDPOINTS.SESSION_DETAIL(id)),
}

// Health check
export const healthAPI = {
  check: () => fetchAPI<HealthStatus>(API_CONFIG.ENDPOINTS.HEALTH),
}

// WebSocket connection for real-time logs
export function createLogsWebSocket(
  onMessage: (log: LogEntry) => void,
  onError?: (error: Event) => void,
  onClose?: () => void,
): WebSocket {
  const ws = new WebSocket(`${API_CONFIG.WS_URL}${API_CONFIG.ENDPOINTS.LOGS_STREAM}`)

  ws.onmessage = (event) => {
    try {
      const log = JSON.parse(event.data) as LogEntry
      onMessage(log)
    } catch (error) {
      console.error("[WebSocket] Error parsing message:", error)
    }
  }

  ws.onerror = (error) => {
    console.error("[WebSocket] Error:", error)
    onError?.(error)
  }

  ws.onclose = () => {
    console.log("[WebSocket] Connection closed")
    onClose?.()
  }

  return ws
}

// Types
export interface Agent {
  id: string
  name: string
  type: "orchestrator" | "worker" | "specialist"
  status: "active" | "idle" | "error" | "offline"
  description: string
  model: string
  lastActive: string
  totalExecutions: number
  successRate: number
  avgLatency: number
  totalTokens: number
  totalCost: number
  tools: string[]
  capabilities: string[]
}

export interface AgentMetrics {
  agentId: string
  executionsOverTime: { timestamp: string; count: number }[]
  tokensOverTime: { timestamp: string; input: number; output: number }[]
  latencyOverTime: { timestamp: string; value: number }[]
  costOverTime: { timestamp: string; value: number }[]
  errorRate: number
  avgResponseTime: number
}

export interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "debug"
  agentId: string
  agentName: string
  sessionId: string
  traceId: string
  spanId: string
  message: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  latency: number
  cost: number
  status: "success" | "error" | "pending"
  model: string
  input?: string
  output?: string
  metadata?: Record<string, unknown>
}

export interface LogsQueryParams {
  agentId?: string
  level?: string
  status?: string
  startDate?: string
  endDate?: string
  limit?: string
  offset?: string
}

export interface LogsResponse {
  logs: LogEntry[]
  total: number
  hasMore: boolean
}

export interface Trace {
  id: string
  sessionId: string
  startTime: string
  endTime: string
  duration: number
  status: "success" | "error" | "pending"
  spans: Span[]
}

export interface Span {
  id: string
  traceId: string
  parentId?: string
  agentId: string
  agentName: string
  operation: string
  startTime: string
  endTime: string
  duration: number
  status: "success" | "error"
  inputTokens: number
  outputTokens: number
  cost: number
}

export interface MetricsOverview {
  totalAgents: number
  activeAgents: number
  totalExecutions: number
  totalTokens: number
  totalCost: number
  avgLatency: number
  successRate: number
  executionsToday: number
  costToday: number
}

export interface TokenMetrics {
  total: number
  input: number
  output: number
  byAgent: { agentId: string; agentName: string; tokens: number }[]
  overTime: { timestamp: string; input: number; output: number }[]
}

export interface CostMetrics {
  total: number
  byAgent: { agentId: string; agentName: string; cost: number }[]
  byModel: { model: string; cost: number }[]
  overTime: { timestamp: string; cost: number }[]
}

export interface LatencyMetrics {
  avg: number
  p50: number
  p95: number
  p99: number
  overTime: { timestamp: string; avg: number; p95: number }[]
}

export interface Session {
  id: string
  startTime: string
  endTime?: string
  status: "active" | "completed" | "error"
  agentsInvolved: string[]
  totalTokens: number
  totalCost: number
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  agents: { id: string; status: string }[]
  lastCheck: string
}
