"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { cn } from "@/lib/utils"
import { Bot, Cpu, Zap, Clock, DollarSign, Hash, ChevronRight, Sparkles } from "lucide-react"
import type { Agent } from "@/lib/api"
import Link from "next/link"

interface AgentCardProps {
  agent: Agent
  isSelected?: boolean
  showOrchestatorConnection?: boolean
}

const typeIcons: Record<string, React.ReactNode> = {
  orchestrator: <Sparkles className="h-4 w-4" />,
  worker: <Bot className="h-4 w-4" />,
  specialist: <Cpu className="h-4 w-4" />,
}

const typeColors: Record<string, string> = {
  orchestrator: "bg-primary/10 text-primary border-primary/30",
  worker: "bg-info/10 text-info border-info/30",
  specialist: "bg-warning/10 text-warning border-warning/30",
}

export function AgentCard({ agent, isSelected, showOrchestatorConnection }: AgentCardProps) {
  const lastActiveTime = new Date(agent.lastActive)
  const timeSinceActive = Date.now() - lastActiveTime.getTime()
  const lastActiveLabel =
    timeSinceActive < 60000
      ? "Just now"
      : timeSinceActive < 3600000
        ? `${Math.floor(timeSinceActive / 60000)}m ago`
        : timeSinceActive < 86400000
          ? `${Math.floor(timeSinceActive / 3600000)}h ago`
          : `${Math.floor(timeSinceActive / 86400000)}d ago`

  return (
    <Card
      className={cn(
        "transition-all hover:border-primary/50 cursor-pointer",
        isSelected && "border-primary ring-1 ring-primary/20",
        agent.status === "error" && "border-destructive/50",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                agent.status === "active"
                  ? "bg-success/10"
                  : agent.status === "error"
                    ? "bg-destructive/10"
                    : "bg-muted",
              )}
            >
              {typeIcons[agent.type]}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className={cn("text-xs", typeColors[agent.type])}>
                  {agent.type}
                </Badge>
                <StatusBadge status={agent.status} />
              </div>
            </div>
          </div>
          {showOrchestatorConnection && agent.status === "active" && agent.type !== "orchestrator" && (
            <div className="flex items-center gap-1 text-xs text-success">
              <Zap className="h-3 w-3" />
              <span>Connected</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Executions:</span>
            <span className="font-medium text-foreground">{agent.totalExecutions.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Success:</span>
            <span className="font-medium text-foreground">{agent.successRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Latency:</span>
            <span className="font-medium text-foreground">{agent.avgLatency}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Cost:</span>
            <span className="font-medium text-foreground">${agent.totalCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Last active: {lastActiveLabel}</span>
          <Link href={`/agents/${agent.id}`}>
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
              Details
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
