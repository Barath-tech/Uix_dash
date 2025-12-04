import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "active" | "idle" | "error" | "offline" | "success" | "warning" | "pending"

interface StatusBadgeProps {
  status: Status
  showDot?: boolean
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
  idle: { label: "Idle", className: "bg-warning/15 text-warning border-warning/30" },
  error: { label: "Error", className: "bg-destructive/15 text-destructive border-destructive/30" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground border-muted" },
  success: { label: "Success", className: "bg-success/15 text-success border-success/30" },
  warning: { label: "Warning", className: "bg-warning/15 text-warning border-warning/30" },
  pending: { label: "Pending", className: "bg-info/15 text-info border-info/30" },
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.className, className)}>
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === "active" && "bg-success animate-pulse",
            status === "idle" && "bg-warning",
            status === "error" && "bg-destructive",
            status === "offline" && "bg-muted-foreground",
            status === "success" && "bg-success",
            status === "warning" && "bg-warning",
            status === "pending" && "bg-info animate-pulse",
          )}
        />
      )}
      {config.label}
    </Badge>
  )
}
