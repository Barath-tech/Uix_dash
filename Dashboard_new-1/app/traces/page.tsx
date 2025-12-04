"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { cn } from "@/lib/utils"
import { mockSessions, mockAgents } from "@/lib/mock-data"
import { ChevronRight, Clock, Coins, Bot, Activity } from "lucide-react"

export default function TracesPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    const duration = endTime - startTime

    if (duration < 1000) return `${duration}ms`
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`
    return `${(duration / 60000).toFixed(1)}m`
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Traces" subtitle="Session and trace explorer" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-xl font-bold text-foreground">
                    {mockSessions.filter((s) => s.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-foreground">
                    {mockSessions.filter((s) => s.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-xl font-bold text-foreground">
                    {mockSessions.filter((s) => s.status === "error").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold text-foreground">
                    ${mockSessions.reduce((acc, s) => acc + s.totalCost, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockSessions.map((session) => {
              const involvedAgents = session.agentsInvolved
                .map((id) => mockAgents.find((a) => a.id === id))
                .filter(Boolean)

              return (
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer",
                    selectedSession === session.id && "border-primary bg-muted/30",
                    session.status === "error" && "border-destructive/30",
                  )}
                  onClick={() => setSelectedSession(session.id === selectedSession ? null : session.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-medium text-foreground">{session.id}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(session.startTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1">
                      {involvedAgents.slice(0, 3).map((agent) => (
                        <Badge key={agent?.id} variant="secondary" className="text-xs">
                          {agent?.name}
                        </Badge>
                      ))}
                      {involvedAgents.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{involvedAgents.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-mono text-foreground">
                        {formatDuration(session.startTime, session.endTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">duration</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-mono text-foreground">{session.totalTokens.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">tokens</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-mono text-foreground">${session.totalCost.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">cost</p>
                    </div>

                    <StatusBadge status={session.status === "completed" ? "success" : session.status} />

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        selectedSession === session.id && "rotate-90",
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
