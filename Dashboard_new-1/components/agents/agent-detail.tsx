"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Zap, Clock, DollarSign, Hash, Wrench, Sparkles } from "lucide-react"
import type { Agent, AgentMetrics } from "@/lib/api"
import { mockAgentMetrics } from "@/lib/mock-data"

interface AgentDetailProps {
  agent: Agent
}

export function AgentDetail({ agent }: AgentDetailProps) {
  const [metrics] = useState<AgentMetrics>(mockAgentMetrics)

  const chartTheme = {
    primary: "oklch(0.7 0.14 165)",
    secondary: "oklch(0.75 0.15 85)",
    error: "oklch(0.6 0.2 25)",
    grid: "oklch(0.25 0.005 270)",
    text: "oklch(0.6 0.01 90)",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{agent.name}</h2>
            <StatusBadge status={agent.status} />
          </div>
          <p className="text-muted-foreground mt-1">{agent.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="font-mono text-xs">
              {agent.model}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {agent.type}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Executions"
          value={agent.totalExecutions.toLocaleString()}
          icon={<Hash className="h-5 w-5" />}
          trend={{ value: 12, label: "vs last week" }}
        />
        <StatCard
          title="Success Rate"
          value={`${agent.successRate}%`}
          icon={<Zap className="h-5 w-5" />}
          variant={agent.successRate > 95 ? "success" : agent.successRate > 90 ? "warning" : "error"}
        />
        <StatCard
          title="Avg Latency"
          value={`${agent.avgLatency}ms`}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: -8, label: "improvement" }}
        />
        <StatCard
          title="Total Cost"
          value={`$${agent.totalCost.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="tools">Tools & Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Executions Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.executionsOverTime}>
                      <defs>
                        <linearGradient id="executionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit" })}
                        stroke={chartTheme.text}
                        fontSize={11}
                      />
                      <YAxis stroke={chartTheme.text} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.005 270)",
                          border: "1px solid oklch(0.25 0.005 270)",
                          borderRadius: "6px",
                          color: "oklch(0.93 0.005 90)",
                        }}
                        labelFormatter={(t) => new Date(t).toLocaleString()}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={chartTheme.primary}
                        fill="url(#executionsGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latency Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.latencyOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit" })}
                        stroke={chartTheme.text}
                        fontSize={11}
                      />
                      <YAxis stroke={chartTheme.text} fontSize={11} unit="ms" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.005 270)",
                          border: "1px solid oklch(0.25 0.005 270)",
                          borderRadius: "6px",
                          color: "oklch(0.93 0.005 90)",
                        }}
                        labelFormatter={(t) => new Date(t).toLocaleString()}
                      />
                      <Line type="monotone" dataKey="value" stroke={chartTheme.secondary} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Token Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.tokensOverTime}>
                    <defs>
                      <linearGradient id="inputGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outputGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartTheme.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit" })}
                      stroke={chartTheme.text}
                      fontSize={11}
                    />
                    <YAxis stroke={chartTheme.text} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.005 270)",
                        border: "1px solid oklch(0.25 0.005 270)",
                        borderRadius: "6px",
                        color: "oklch(0.93 0.005 90)",
                      }}
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="input"
                      name="Input Tokens"
                      stroke={chartTheme.primary}
                      fill="url(#inputGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="output"
                      name="Output Tokens"
                      stroke={chartTheme.secondary}
                      fill="url(#outputGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold text-foreground">{agent.totalTokens.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Avg per Execution</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(agent.totalTokens / agent.totalExecutions).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Cost per 1K Tokens</p>
                <p className="text-2xl font-bold text-foreground">
                  ${((agent.totalCost / agent.totalTokens) * 1000).toFixed(4)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.costOverTime}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartTheme.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit" })}
                      stroke={chartTheme.text}
                      fontSize={11}
                    />
                    <YAxis stroke={chartTheme.text} fontSize={11} unit="$" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.005 270)",
                        border: "1px solid oklch(0.25 0.005 270)",
                        borderRadius: "6px",
                        color: "oklch(0.93 0.005 90)",
                      }}
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                      formatter={(value: number) => [`$${value.toFixed(4)}`, "Cost"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartTheme.secondary}
                      fill="url(#costGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="font-mono text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="text-xs">
                      {cap.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
