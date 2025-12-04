"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/dashboard/header"
import { LogTable } from "@/components/logs/log-table"
import { LogFilters, type LogFilters as LogFiltersType } from "@/components/logs/log-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLogsStream } from "@/hooks/use-logs-stream"
import { mockAgents } from "@/lib/mock-data"
import { Pause, Play, Trash2, Download } from "lucide-react"

export default function LogsPage() {
  const { logs, isConnected, clearLogs, connect, disconnect } = useLogsStream(true)
  const [filters, setFilters] = useState<LogFiltersType>({
    search: "",
    level: "all",
    agent: "all",
    status: "all",
  })
  const [isPaused, setIsPaused] = useState(false)

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.level !== "all" && log.level !== filters.level) {
        return false
      }
      if (filters.agent !== "all" && log.agentId !== filters.agent) {
        return false
      }
      if (filters.status !== "all" && log.status !== filters.status) {
        return false
      }
      return true
    })
  }, [logs, filters])

  const handlePauseToggle = () => {
    if (isPaused) {
      connect()
    } else {
      disconnect()
    }
    setIsPaused(!isPaused)
  }

  const handleExport = () => {
    const data = JSON.stringify(filteredLogs, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `logs-${new Date().toISOString()}.json`
    a.click()
  }

  // Calculate stats
  const errorCount = filteredLogs.filter((l) => l.level === "error").length
  const warningCount = filteredLogs.filter((l) => l.level === "warning").length
  const totalTokens = filteredLogs.reduce((acc, l) => acc + l.totalTokens, 0)
  const totalCost = filteredLogs.reduce((acc, l) => acc + l.cost, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header title="Logs" subtitle="Real-time log monitoring" />

      <div className="p-6 space-y-6">
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${isConnected && !isPaused ? "bg-success animate-pulse" : "bg-muted-foreground"}`}
            />
            <span className="text-sm text-muted-foreground">{isConnected && !isPaused ? "Live" : "Paused"}</span>
          </div>
          <Badge variant="secondary" className="font-mono">
            {filteredLogs.length} logs
          </Badge>
          {errorCount > 0 && (
            <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
              {errorCount} errors
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30">
              {warningCount} warnings
            </Badge>
          )}
          <Badge variant="secondary" className="font-mono">
            {totalTokens.toLocaleString()} tokens
          </Badge>
          <Badge variant="secondary" className="font-mono">
            ${totalCost.toFixed(4)} cost
          </Badge>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePauseToggle} className="gap-2 bg-transparent">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs} className="gap-2 bg-transparent">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <LogFilters agents={mockAgents} onFilterChange={setFilters} />
          </CardContent>
        </Card>

        {/* Log table */}
        <LogTable logs={filteredLogs} />
      </div>
    </div>
  )
}
