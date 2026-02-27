import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2">
            {trend && (
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded-md",
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            <p className="text-xs text-muted-foreground">{description || trend?.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}