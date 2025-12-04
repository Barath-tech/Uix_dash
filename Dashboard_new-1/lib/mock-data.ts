import type { Agent, LogEntry, MetricsOverview, AgentMetrics, Session } from "./api"

export const mockAgents: Agent[] = [
  {
    id: "orchestrator-1",
    name: "Orchestrator",
    type: "orchestrator",
    status: "active",
    description: "Main orchestrator agent that coordinates all worker agents",
    model: "gpt-4-turbo",
    lastActive: new Date().toISOString(),
    totalExecutions: 15420,
    successRate: 98.5,
    avgLatency: 1250,
    totalTokens: 2450000,
    totalCost: 48.9,
    tools: ["task_router", "agent_selector", "result_aggregator"],
    capabilities: ["task_decomposition", "agent_coordination", "error_handling"],
  },
  {
    id: "researcher-1",
    name: "Research Agent",
    type: "worker",
    status: "active",
    description: "Performs web research and information gathering",
    model: "gpt-4-turbo",
    lastActive: new Date(Date.now() - 30000).toISOString(),
    totalExecutions: 8234,
    successRate: 96.2,
    avgLatency: 2100,
    totalTokens: 1820000,
    totalCost: 36.4,
    tools: ["web_search", "document_reader", "summarizer"],
    capabilities: ["web_research", "document_analysis", "fact_checking"],
  },
  {
    id: "coder-1",
    name: "Code Agent",
    type: "worker",
    status: "idle",
    description: "Writes, reviews, and debugs code",
    model: "claude-3-opus",
    lastActive: new Date(Date.now() - 120000).toISOString(),
    totalExecutions: 5621,
    successRate: 94.8,
    avgLatency: 3200,
    totalTokens: 3200000,
    totalCost: 96.0,
    tools: ["code_executor", "linter", "test_runner"],
    capabilities: ["code_generation", "code_review", "debugging"],
  },
  {
    id: "analyst-1",
    name: "Data Analyst",
    type: "specialist",
    status: "active",
    description: "Analyzes data and generates insights",
    model: "gpt-4-turbo",
    lastActive: new Date(Date.now() - 60000).toISOString(),
    totalExecutions: 3412,
    successRate: 97.1,
    avgLatency: 1800,
    totalTokens: 890000,
    totalCost: 17.8,
    tools: ["data_processor", "chart_generator", "statistics"],
    capabilities: ["data_analysis", "visualization", "reporting"],
  },
  {
    id: "writer-1",
    name: "Content Writer",
    type: "worker",
    status: "offline",
    description: "Creates and edits written content",
    model: "claude-3-sonnet",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    totalExecutions: 2156,
    successRate: 99.1,
    avgLatency: 1500,
    totalTokens: 1200000,
    totalCost: 12.0,
    tools: ["text_editor", "grammar_checker", "tone_analyzer"],
    capabilities: ["content_creation", "editing", "proofreading"],
  },
  {
    id: "planner-1",
    name: "Task Planner",
    type: "specialist",
    status: "error",
    description: "Plans and schedules complex tasks",
    model: "gpt-4-turbo",
    lastActive: new Date(Date.now() - 300000).toISOString(),
    totalExecutions: 1823,
    successRate: 89.2,
    avgLatency: 900,
    totalTokens: 450000,
    totalCost: 9.0,
    tools: ["scheduler", "dependency_resolver", "timeline_generator"],
    capabilities: ["task_planning", "scheduling", "resource_allocation"],
  },
]

export const mockLogs: LogEntry[] = Array.from({ length: 100 }, (_, i) => {
  const agents = mockAgents
  const agent = agents[Math.floor(Math.random() * agents.length)]
  const levels: LogEntry["level"][] = ["info", "warning", "error", "debug"]
  const statuses: LogEntry["status"][] = ["success", "error", "pending"]
  const level = levels[Math.floor(Math.random() * (i % 10 === 0 ? 3 : 2))]
  const status = level === "error" ? "error" : statuses[Math.floor(Math.random() * 2)]

  const inputTokens = Math.floor(Math.random() * 2000) + 100
  const outputTokens = Math.floor(Math.random() * 3000) + 200

  return {
    id: `log-${100 - i}`,
    timestamp: new Date(Date.now() - i * 30000).toISOString(),
    level,
    agentId: agent.id,
    agentName: agent.name,
    sessionId: `session-${Math.floor(i / 10) + 1}`,
    traceId: `trace-${Math.floor(i / 5) + 1}`,
    spanId: `span-${i + 1}`,
    message: getRandomMessage(level, agent.name),
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    latency: Math.floor(Math.random() * 3000) + 200,
    cost: Number.parseFloat((inputTokens * 0.00001 + outputTokens * 0.00003).toFixed(4)),
    status,
    model: agent.model,
    input: "Sample input prompt...",
    output: "Sample output response...",
    metadata: {
      tool_calls: Math.floor(Math.random() * 3),
      retries: Math.floor(Math.random() * 2),
    },
  }
})

function getRandomMessage(level: LogEntry["level"], agentName: string): string {
  const messages = {
    info: [
      `${agentName} completed task successfully`,
      `${agentName} processed request`,
      `${agentName} received new task from orchestrator`,
      `${agentName} tool execution completed`,
      `${agentName} generated response`,
    ],
    warning: [
      `${agentName} response time exceeded threshold`,
      `${agentName} retry attempt 1 of 3`,
      `${agentName} rate limit approaching`,
      `${agentName} high token usage detected`,
    ],
    error: [
      `${agentName} failed to complete task`,
      `${agentName} API connection timeout`,
      `${agentName} invalid response format`,
      `${agentName} tool execution failed`,
    ],
    debug: [
      `${agentName} internal state updated`,
      `${agentName} cache hit for query`,
      `${agentName} memory usage: 245MB`,
    ],
  }

  const options = messages[level]
  return options[Math.floor(Math.random() * options.length)]
}

export const mockMetricsOverview: MetricsOverview = {
  totalAgents: 6,
  activeAgents: 3,
  totalExecutions: 36666,
  totalTokens: 10010000,
  totalCost: 220.1,
  avgLatency: 1792,
  successRate: 95.8,
  executionsToday: 1245,
  costToday: 12.45,
}

export const mockAgentMetrics: AgentMetrics = {
  agentId: "orchestrator-1",
  executionsOverTime: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    count: Math.floor(Math.random() * 100) + 20,
  })),
  tokensOverTime: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    input: Math.floor(Math.random() * 50000) + 10000,
    output: Math.floor(Math.random() * 80000) + 15000,
  })),
  latencyOverTime: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 1500) + 500,
  })),
  costOverTime: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Number.parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
  })),
  errorRate: 1.5,
  avgResponseTime: 1250,
}

export const mockSessions: Session[] = Array.from({ length: 10 }, (_, i) => ({
  id: `session-${i + 1}`,
  startTime: new Date(Date.now() - i * 1800000).toISOString(),
  endTime: i > 0 ? new Date(Date.now() - i * 1800000 + 900000).toISOString() : undefined,
  status: i === 0 ? "active" : i % 5 === 0 ? "error" : "completed",
  agentsInvolved: mockAgents.slice(0, Math.floor(Math.random() * 4) + 2).map((a) => a.id),
  totalTokens: Math.floor(Math.random() * 100000) + 10000,
  totalCost: Number.parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
}))
