"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const mockActivityData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
  executions: Math.floor(Math.random() * 150) + 50,
  errors: Math.floor(Math.random() * 10),
  latency: Math.floor(Math.random() * 800) + 400,
}))

export function ActivityChart() {
  const chartTheme = {
    primary: "oklch(0.7 0.14 165)",
    secondary: "oklch(0.75 0.15 85)",
    error: "oklch(0.6 0.2 25)",
    grid: "oklch(0.25 0.005 270)",
    text: "oklch(0.6 0.01 90)",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Activity (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockActivityData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartTheme.error} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartTheme.error} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit" })}
                stroke={chartTheme.text}
                fontSize={11}
              />
              <YAxis stroke={chartTheme.text} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.005 270)",
                  border: "1px solid oklch(0.25 0.005 270)",
                  borderRadius: "6px",
                  color: "oklch(0.93 0.005 90)",
                }}
                labelFormatter={(t) => new Date(t).toLocaleString()}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="executions"
                name="Executions"
                stroke={chartTheme.primary}
                fill="url(#activityGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="errors"
                name="Errors"
                stroke={chartTheme.error}
                fill="url(#errorGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
