"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { mockAgents } from "@/lib/mock-data"

const generateTimeSeriesData = (hours: number) => {
  return Array.from({ length: hours }, (_, i) => ({
    timestamp: new Date(Date.now() - (hours - 1 - i) * 3600000).toISOString(),
    tokens: Math.floor(Math.random() * 100000) + 20000,
    cost: Number.parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
    executions: Math.floor(Math.random() * 200) + 50,
    latency: Math.floor(Math.random() * 1000) + 500,
    errors: Math.floor(Math.random() * 10),
  }))
}

const COLORS = [
  "oklch(0.7 0.14 165)",
  "oklch(0.75 0.15 85)",
  "oklch(0.6 0.2 25)",
  "oklch(0.65 0.12 200)",
  "oklch(0.55 0.15 300)",
]

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState("24h")
  const hours = timeRange === "1h" ? 1 : timeRange === "6h" ? 6 : timeRange === "24h" ? 24 : 168
  const [data] = useState(generateTimeSeriesData(hours))

  const chartTheme = {
    primary: "oklch(0.7 0.14 165)",
    secondary: "oklch(0.75 0.15 85)",
    error: "oklch(0.6 0.2 25)",
    grid: "oklch(0.25 0.005 270)",
    text: "oklch(0.6 0.01 90)",
  }

  const tokensByAgent = mockAgents.map((agent) => ({
    name: agent.name,
    tokens: agent.totalTokens,
    cost: agent.totalCost,
  }))

  const costByModel = [
    { name: "GPT-4 Turbo", value: 102.1 },
    { name: "Claude 3 Opus", value: 96.0 },
    { name: "Claude 3 Sonnet", value: 12.0 },
    { name: "Other", value: 10.0 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Metrics" subtitle="Performance and usage analytics" />

      <div className="p-6 space-y-6">
        {/* Time range selector */}
        <div className="flex justify-end">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="latency">Latency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Executions & Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="execGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="errGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartTheme.error} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartTheme.error} stopOpacity={0} />
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
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="executions"
                          name="Executions"
                          stroke={chartTheme.primary}
                          fill="url(#execGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="errors"
                          name="Errors"
                          stroke={chartTheme.error}
                          fill="url(#errGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
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
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Cost"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          stroke={chartTheme.secondary}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Token Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
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
                        />
                        <Area type="monotone" dataKey="tokens" stroke={chartTheme.primary} fill="url(#tokenGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tokens by Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tokensByAgent} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                        <XAxis type="number" stroke={chartTheme.text} fontSize={11} />
                        <YAxis type="category" dataKey="name" stroke={chartTheme.text} fontSize={11} width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(0.16 0.005 270)",
                            border: "1px solid oklch(0.25 0.005 270)",
                            borderRadius: "6px",
                            color: "oklch(0.93 0.005 90)",
                          }}
                          formatter={(value: number) => [value.toLocaleString(), "Tokens"]}
                        />
                        <Bar dataKey="tokens" fill={chartTheme.primary} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost by Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tokensByAgent} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                        <XAxis type="number" stroke={chartTheme.text} fontSize={11} unit="$" />
                        <YAxis type="category" dataKey="name" stroke={chartTheme.text} fontSize={11} width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(0.16 0.005 270)",
                            border: "1px solid oklch(0.25 0.005 270)",
                            borderRadius: "6px",
                            color: "oklch(0.93 0.005 90)",
                          }}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Cost"]}
                        />
                        <Bar dataKey="cost" fill={chartTheme.secondary} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost by Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costByModel}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {costByModel.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(0.16 0.005 270)",
                            border: "1px solid oklch(0.25 0.005 270)",
                            borderRadius: "6px",
                            color: "oklch(0.93 0.005 90)",
                          }}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Cost"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="latency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latency Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
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
                        formatter={(value: number) => [`${value}ms`, "Latency"]}
                      />
                      <Line type="monotone" dataKey="latency" stroke={chartTheme.primary} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
