"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { cn } from "@/lib/utils"
import { Bot, Sparkles, Cpu, ArrowRight } from "lucide-react"
import type { Agent } from "@/lib/api"
import Link from "next/link"

interface AgentStatusListProps {
  agents: Agent[]
}

const typeIcons: Record<string, React.ReactNode> = {
  orchestrator: <Sparkles className="h-3.5 w-3.5" />,
  worker: <Bot className="h-3.5 w-3.5" />,
  specialist: <Cpu className="h-3.5 w-3.5" />,
}

export function AgentStatusList({ agents }: AgentStatusListProps) {
  const sortedAgents = [...agents].sort((a, b) => {
    const statusOrder = { active: 0, idle: 1, error: 2, offline: 3 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Agent Status</CardTitle>
        <Link href="/agents" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAgents.map((agent) => (
          <Link key={agent.id} href={`/agents/${agent.id}`}>
            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer",
                agent.status === "error" && "border-destructive/30",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    agent.status === "active"
                      ? "bg-success/10 text-success"
                      : agent.status === "error"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {typeIcons[agent.type]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.model}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Latency</p>
                  <p className="text-sm font-mono text-foreground">{agent.avgLatency}ms</p>
                </div>
                <StatusBadge status={agent.status} />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
