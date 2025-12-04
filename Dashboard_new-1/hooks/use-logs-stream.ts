"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createLogsWebSocket, type LogEntry } from "@/lib/api"
import { mockLogs } from "@/lib/mock-data"

const MAX_LOGS = 500

export function useLogsStream(useMockData = true) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const addLog = useCallback((log: LogEntry) => {
    setLogs((prev) => {
      const newLogs = [log, ...prev]
      return newLogs.slice(0, MAX_LOGS)
    })
  }, [])

  const connect = useCallback(() => {
    if (useMockData) {
      // Simulate WebSocket with mock data
      setLogs(mockLogs.slice(0, 50))
      setIsConnected(true)

      let mockIndex = 0
      mockIntervalRef.current = setInterval(() => {
        const newLog: LogEntry = {
          ...mockLogs[mockIndex % mockLogs.length],
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        addLog(newLog)
        mockIndex++
      }, 3000)

      return
    }

    try {
      wsRef.current = createLogsWebSocket(
        (log) => {
          addLog(log)
        },
        () => {
          setIsConnected(false)
          setError("WebSocket connection error")
        },
        () => {
          setIsConnected(false)
        },
      )

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setError(null)
      }
    } catch (err) {
      setError("Failed to connect to WebSocket")
      setIsConnected(false)
    }
  }, [addLog, useMockData])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current)
      mockIntervalRef.current = null
    }
    setIsConnected(false)
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    logs,
    isConnected,
    error,
    connect,
    disconnect,
    clearLogs,
  }
}
