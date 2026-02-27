"use client"

import { useState } from "react"
import { MOCK_WORK_ORDERS, WorkOrder, MOCK_EQUIPMENT } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Clock, Calendar, AlertCircle, Plus, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MaintenancePage() {
  const [search, setSearch] = useState("")

  const statusMap = {
    'Draft': 'bg-gray-100 text-gray-600',
    'Open': 'bg-blue-100 text-blue-600',
    'In Progress': 'bg-orange-100 text-orange-600',
    'Closed': 'bg-green-100 text-green-600',
    'Archived': 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Maintenance Management</h1>
          <p className="text-muted-foreground mt-1">Schedule and execute equipment service protocols.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" /> Scheduler
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> New Work Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Active Orders", value: 12, icon: Wrench },
          { label: "Overdue Tasks", value: 3, icon: AlertCircle, color: "text-destructive" },
          { label: "Avg. Resolution", value: "4.2d", icon: Clock },
          { label: "Planned (Next 7d)", value: 8, icon: Calendar },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-secondary rounded-lg">
                  <stat.icon className={`h-4 w-4 ${stat.color || 'text-primary'}`} />
                </div>
                <div className="text-xl font-extrabold">{stat.value}</div>
              </div>
              <div className="mt-3 text-xs font-semibold text-muted-foreground uppercase">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search orders, equipment or technician..." 
                className="pl-10 bg-white" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_WORK_ORDERS.map((order) => {
              const eq = MOCK_EQUIPMENT.find(e => e.id === order.equipmentId)
              return (
                <Card key={order.id} className="transition-all hover:shadow-md border-none shadow-sm cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{order.id}</span>
                            <Badge variant="secondary" className={`${statusMap[order.status]} border-none text-[10px]`}>
                              {order.status}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {order.type}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground/80 mt-1">{order.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Box className="h-3 w-3" /> {eq?.name} ({order.equipmentId})</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Opened {order.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden md:flex flex-col text-right">
                          <span className="text-xs text-muted-foreground">Assigned to</span>
                          <span className="text-sm font-semibold">Maintenance Team B</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">AI Diagnosis</CardTitle>
              <CardDescription>Probable causes for current symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-primary mb-1">EQUIPMENT SYMPTOMS</p>
                <p className="text-sm">Unusual vibration in diesel generator C100D5 at high load.</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-muted-foreground">Probable Causes</p>
                <ul className="text-xs space-y-2 list-disc pl-4 text-foreground/80">
                  <li>Misaligned motor shaft or worn couplings.</li>
                  <li>Loosened mounting bolts on base frame.</li>
                  <li>Internal combustion imbalance (injector failure).</li>
                </ul>
              </div>
              <Button size="sm" className="w-full text-xs">Run Diagnostic Flow</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { Box } from "lucide-react"