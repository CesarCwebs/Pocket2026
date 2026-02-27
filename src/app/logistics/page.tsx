"use client"

import { MOCK_LOGISTICS } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, MapPin, User, ChevronRight, Plus, Filter, Search, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function LogisticsPage() {
  const statusMap = {
    'Draft': 'bg-slate-100 text-slate-600',
    'Sent': 'bg-blue-100 text-blue-600',
    'Delivered': 'bg-teal-100 text-teal-600',
    'Completed': 'bg-green-100 text-green-600',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Logistics Operations</h1>
          <p className="text-muted-foreground mt-1">Manage transport routes, deliveries, and equipment returns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> New Logistics Doc
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="active">Active Routes</TabsTrigger>
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Docs</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents or customers..." className="pl-10 bg-white" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>

        <TabsContent value="active" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {MOCK_LOGISTICS.map((doc) => (
              <Card key={doc.id} className="border-none shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden group">
                <div className={`h-1.5 w-full ${doc.type === 'delivery' ? 'bg-primary' : 'bg-accent'}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${doc.type === 'delivery' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{doc.id}</span>
                    </div>
                    <Badge variant="secondary" className={`${statusMap[doc.status]} border-none text-[10px] uppercase font-bold`}>
                      {doc.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{doc.customer}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3" /> 123 Industrial Dr, Sector 9
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Type</span>
                        <p className="text-sm font-semibold capitalize">{doc.type}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Scheduled</span>
                        <p className="text-sm font-semibold">{doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-medium text-foreground/80">Robert J. (Driver)</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 group-hover:translate-x-1 transition-transform">
                        Details <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-none shadow-sm flex flex-col items-center justify-center p-8 bg-dashed bg-secondary/30 border-2 border-dashed border-border text-center">
               <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                 <FileText className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="font-bold text-lg">New Logistics Operation</h3>
               <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">Create documents for equipment pickup or distribution.</p>
               <Button variant="outline" className="mt-6 bg-white shadow-sm">Get Started</Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="flex items-center justify-center h-64 text-muted-foreground">
          No pending orders currently queued.
        </TabsContent>
        
        <TabsContent value="completed" className="flex items-center justify-center h-64 text-muted-foreground">
          Showing logs from the past 30 days.
        </TabsContent>
      </Tabs>
    </div>
  )
}