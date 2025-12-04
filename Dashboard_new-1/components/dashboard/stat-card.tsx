import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "error"
}

export function StatCard({ title, value, subtitle, trend, icon, variant = "default" }: StatCardProps) {
  const trendIcon = trend ? (
    trend.value > 0 ? (
      <TrendingUp className="h-3 w-3" />
    ) : trend.value < 0 ? (
      <TrendingDown className="h-3 w-3" />
    ) : (
      <Minus className="h-3 w-3" />
    )
  ) : null

  const trendColor = trend
    ? trend.value > 0
      ? "text-success"
      : trend.value < 0
        ? "text-destructive"
        : "text-muted-foreground"
    : ""

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        variant === "success" && "border-success/30",
        variant === "warning" && "border-warning/30",
        variant === "error" && "border-destructive/30",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                {trendIcon}
                <span>
                  {Math.abs(trend.value)}% {trend.label}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                variant === "default" && "bg-primary/10 text-primary",
                variant === "success" && "bg-success/10 text-success",
                variant === "warning" && "bg-warning/10 text-warning",
                variant === "error" && "bg-destructive/10 text-destructive",
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
