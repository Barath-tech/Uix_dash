"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { Bot, Activity, Hash, Coins, Clock, CheckCircle, TrendingUp, DollarSign } from "lucide-react"
import type { MetricsOverview } from "@/lib/api"

interface MetricsGridProps {
  metrics: MetricsOverview
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Agents"
        value={metrics.totalAgents}
        subtitle={`${metrics.activeAgents} active`}
        icon={<Bot className="h-5 w-5" />}
      />
      <StatCard
        title="Total Executions"
        value={metrics.totalExecutions.toLocaleString()}
        subtitle={`${metrics.executionsToday.toLocaleString()} today`}
        icon={<Hash className="h-5 w-5" />}
        trend={{ value: 15, label: "vs yesterday" }}
      />
      <StatCard
        title="Success Rate"
        value={`${metrics.successRate}%`}
        icon={<CheckCircle className="h-5 w-5" />}
        variant={metrics.successRate > 95 ? "success" : "warning"}
      />
      <StatCard
        title="Avg Latency"
        value={`${metrics.avgLatency}ms`}
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: -5, label: "improvement" }}
      />
      <StatCard
        title="Total Tokens"
        value={`${(metrics.totalTokens / 1000000).toFixed(1)}M`}
        icon={<Coins className="h-5 w-5" />}
      />
      <StatCard
        title="Total Cost"
        value={`$${metrics.totalCost.toFixed(2)}`}
        subtitle={`$${metrics.costToday.toFixed(2)} today`}
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatCard title="Active Sessions" value="3" icon={<Activity className="h-5 w-5" />} variant="success" />
      <StatCard
        title="Throughput"
        value="~52/min"
        subtitle="requests processed"
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  )
}
