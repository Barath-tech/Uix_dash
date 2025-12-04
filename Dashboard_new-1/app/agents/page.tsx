"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { AgentCard } from "@/components/agents/agent-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAgents } from "@/lib/mock-data"
import type { Agent } from "@/lib/api"
import { Search, LayoutGrid, List } from "lucide-react"

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(mockAgents)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAgents = agents.filter((agent) => {
    if (search && !agent.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && agent.status !== statusFilter) {
      return false
    }
    if (typeFilter !== "all" && agent.type !== typeFilter) {
      return false
    }
    return true
  })

  const activeCount = agents.filter((a) => a.status === "active").length
  const errorCount = agents.filter((a) => a.status === "error").length

  // Find orchestrator for connection display
  const orchestrator = agents.find((a) => a.type === "orchestrator")

  return (
    <div className="min-h-screen bg-background">
      <Header title="Agents" subtitle="Manage and monitor your AI agents" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="secondary" className="font-mono">
            {agents.length} total agents
          </Badge>
          <Badge variant="outline" className="bg-success/15 text-success border-success/30">
            {activeCount} active
          </Badge>
          {errorCount > 0 && (
            <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
              {errorCount} with errors
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-secondary">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 bg-secondary">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="orchestrator">Orchestrator</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Agent grid/list */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} showOrchestatorConnection={orchestrator?.status === "active"} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agents found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
