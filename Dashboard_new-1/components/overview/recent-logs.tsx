"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import type { LogEntry } from "@/lib/api"
import Link from "next/link"

interface RecentLogsProps {
  logs: LogEntry[]
}

export function RecentLogs({ logs }: RecentLogsProps) {
  const recentLogs = logs.slice(0, 8)

  const levelColors: Record<string, string> = {
    info: "bg-info/15 text-info border-info/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    error: "bg-destructive/15 text-destructive border-destructive/30",
    debug: "bg-muted text-muted-foreground border-muted",
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Logs</CardTitle>
        <Link href="/logs" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentLogs.map((log) => (
          <div
            key={log.id}
            className={cn(
              "flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors",
              log.level === "error" && "bg-destructive/5",
            )}
          >
            <Badge variant="outline" className={cn("text-xs shrink-0 capitalize", levelColors[log.level])}>
              {log.level}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-1">{log.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{log.agentName}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-mono text-muted-foreground">{formatTime(log.timestamp)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-mono text-foreground">{log.totalTokens}</p>
              <p className="text-xs text-muted-foreground">tokens</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
