"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { getOperationalDashboardSummary, AiOperationalDashboardSummaryOutput } from "@/ai/flows/ai-operational-dashboard-summary"
import { MOCK_EQUIPMENT, MOCK_MATERIALS, MOCK_WORK_ORDERS, MOCK_LOGISTICS } from "@/lib/erp-data"

export function AiSummaryCard() {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const input = {
          equipmentSummary: {
            available: MOCK_EQUIPMENT.filter(e => e.status === 'available').length,
            inMaintenance: MOCK_EQUIPMENT.filter(e => e.status === 'maintenance').length,
            decommissioned: MOCK_EQUIPMENT.filter(e => e.status === 'decommissioned').length,
          },
          stockAlerts: MOCK_MATERIALS.filter(m => m.stock < m.minStock).map(m => ({
            sku: m.sku,
            description: m.description,
            currentStock: m.stock,
            minStock: m.minStock,
          })),
          workOrderSummary: {
            open: MOCK_WORK_ORDERS.filter(wo => wo.status === 'Open').length,
            inProgress: MOCK_WORK_ORDERS.filter(wo => wo.status === 'In Progress').length,
            overdue: 0, // Mocked
          },
          logisticsAlerts: MOCK_LOGISTICS.map(l => ({
            documentId: l.id,
            type: l.type,
            status: "Warning", // Mocked
            description: `Scheduled for ${l.date}`
          })),
          generalKpis: {
            inventoryValue: MOCK_MATERIALS.reduce((acc, curr) => acc + (curr.stock * curr.price), 0),
            equipmentDowntimeRate: 15.5,
            activeOrders: 12,
          }
        }
        const result = await getOperationalDashboardSummary(input)
        setSummary(result.summary)
      } catch (error) {
        console.error("Failed to fetch AI summary", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-none">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-lg">AI Operational Insights</CardTitle>
          <CardDescription>Daily summary and focus areas</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
            <p className="text-sm text-muted-foreground animate-pulse">Analyzing enterprise data...</p>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Summary could not be generated.</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}