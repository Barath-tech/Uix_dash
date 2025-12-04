"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { MetricsGrid } from "@/components/overview/metrics-grid"
import { ActivityChart } from "@/components/overview/activity-chart"
import { AgentStatusList } from "@/components/overview/agent-status-list"
import { RecentLogs } from "@/components/overview/recent-logs"
import { mockAgents, mockLogs, mockMetricsOverview } from "@/lib/mock-data"
import type { Agent, LogEntry, MetricsOverview } from "@/lib/api"

export default function OverviewPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [agents] = useState<Agent[]>(mockAgents)
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [metrics] = useState<MetricsOverview>(mockMetricsOverview)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Overview"
        subtitle="Multi-Agent System Dashboard"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="p-6 space-y-6">
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <div>
            <AgentStatusList agents={agents} />
          </div>
        </div>

        <RecentLogs logs={logs} />
      </div>
    </div>
  )
}
