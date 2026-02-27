"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { AiSummaryCard } from "@/components/dashboard/ai-summary-card"
import { Box, Package, Wrench, Truck, ArrowUpRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Operational Hub</h1>
          <p className="text-muted-foreground mt-2">Welcome back. Here's a real-time pulse of NexusFlow enterprise operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search modules..." className="pl-10 bg-white" />
          </div>
          <Button variant="outline" className="hidden sm:flex">Export Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Equipment Availability" 
          value="84%" 
          description="3 units in maintenance"
          icon={Box}
          trend={{ value: 4.5, label: "vs last week", isPositive: true }}
        />
        <StatsCard 
          title="Inventory Alerts" 
          value="12" 
          description="SKUs below threshold"
          icon={Package}
          trend={{ value: 2.1, label: "increased", isPositive: false }}
          className="bg-red-50/50"
        />
        <StatsCard 
          title="Open Work Orders" 
          value="28" 
          description="8 urgent items"
          icon={Wrench}
        />
        <StatsCard 
          title="Active Logistics" 
          value="15" 
          description="Deliveries in transit"
          icon={Truck}
          trend={{ value: 12, label: "volume growth", isPositive: true }}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Asset Management", desc: "Track, maintain and audit high-value equipment.", icon: Box, link: "/equipment", color: "text-blue-600 bg-blue-100" },
              { title: "Material Control", desc: "Real-time stock ledger and warehouse management.", icon: Package, link: "/inventory", color: "text-cyan-600 bg-cyan-100" },
              { title: "Maintenance", desc: "Schedule preventive work and manage repairs.", icon: Wrench, link: "/maintenance", color: "text-indigo-600 bg-indigo-100" },
              { title: "Logistics", desc: "End-to-end delivery tracking and proof of pickup.", icon: Truck, link: "/logistics", color: "text-teal-600 bg-teal-100" },
            ].map((module) => (
              <Link key={module.title} href={module.link} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${module.color}`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{module.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{module.desc}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-dashed border-border flex justify-between items-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">8 Active Entities</span>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">Launch</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {[
                  { user: "Jane Doe", action: "Approved Work Order #WO-882", time: "12 mins ago", icon: Wrench },
                  { user: "System", action: "Auto-reorder triggered for SKU-OIL-01", time: "1 hour ago", icon: Package },
                  { user: "Marcus V.", action: "Marked Generator C100 as Maintenance", time: "4 hours ago", icon: Box },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <act.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm"><span className="font-bold">{act.user}</span> {act.action}</span>
                      <span className="text-xs text-muted-foreground">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <AiSummaryCard />
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader>
              <CardTitle className="text-xl">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Server Latency", value: "24ms", color: "bg-green-500" },
                { label: "Sync Engine", value: "Synchronized", color: "bg-green-500" },
                { label: "API Gateway", value: "Stable", color: "bg-green-500" },
                { label: "Audit Ledger", value: "Protected", color: "bg-blue-500" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.value}</span>
                    <div className={`h-2 w-2 rounded-full ${s.color}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}