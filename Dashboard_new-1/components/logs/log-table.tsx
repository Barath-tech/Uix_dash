"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Copy } from "lucide-react"
import type { LogEntry } from "@/lib/api"

interface LogTableProps {
  logs: LogEntry[]
  isLoading?: boolean
}

export function LogTable({ logs, isLoading }: LogTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const levelColors: Record<string, string> = {
    info: "bg-info/15 text-info border-info/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    error: "bg-destructive/15 text-destructive border-destructive/30",
    debug: "bg-muted text-muted-foreground border-muted",
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-24">Time</TableHead>
            <TableHead className="w-20">Level</TableHead>
            <TableHead className="w-32">Agent</TableHead>
            <TableHead className="min-w-[200px]">Message</TableHead>
            <TableHead className="w-28 text-right">Tokens</TableHead>
            <TableHead className="w-24 text-right">Latency</TableHead>
            <TableHead className="w-20 text-right">Cost</TableHead>
            <TableHead className="w-24">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const isExpanded = expandedRows.has(log.id)
            return (
              <>
                <TableRow
                  key={log.id}
                  className={cn("cursor-pointer transition-colors", isExpanded && "bg-muted/30")}
                  onClick={() => toggleRow(log.id)}
                >
                  <TableCell className="p-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="text-foreground">{formatTime(log.timestamp)}</span>
                      <span className="text-muted-foreground">{formatDate(log.timestamp)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize text-xs", levelColors[log.level])}>
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{log.agentName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground line-clamp-1">{log.message}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-foreground">{log.totalTokens.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        {log.inputTokens.toLocaleString()} / {log.outputTokens.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">{log.latency}ms</TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">${log.cost.toFixed(4)}</TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow key={`${log.id}-expanded`} className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={9} className="p-0">
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Session ID</p>
                            <p className="font-mono text-foreground">{log.sessionId}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Trace ID</p>
                            <p className="font-mono text-foreground">{log.traceId}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Span ID</p>
                            <p className="font-mono text-foreground">{log.spanId}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Model</p>
                            <p className="font-mono text-foreground">{log.model}</p>
                          </div>
                        </div>
                        {log.input && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-muted-foreground">Input</p>
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="p-3 rounded-md bg-background border border-border text-xs font-mono text-foreground overflow-x-auto">
                              {log.input}
                            </pre>
                          </div>
                        )}
                        {log.output && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-muted-foreground">Output</p>
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="p-3 rounded-md bg-background border border-border text-xs font-mono text-foreground overflow-x-auto">
                              {log.output}
                            </pre>
                          </div>
                        )}
                        {log.metadata && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                            <pre className="p-3 rounded-md bg-background border border-border text-xs font-mono text-foreground overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
