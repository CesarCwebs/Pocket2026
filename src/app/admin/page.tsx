"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, ToggleRight, History, Users, Database, Globe, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Administration</h1>
        <p className="text-muted-foreground mt-1">Manage system configurations, security policies, and audit trails.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Active Users", value: "24", icon: Users },
          { title: "System Modules", value: "12", icon: Database },
          { title: "Policy Version", value: "v2.1", icon: ShieldCheck },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{stat.title}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="rbac" className="space-y-6">
        <TabsList className="bg-white border shadow-sm w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="rbac" className="flex gap-2"><Key className="h-4 w-4" /> RBAC Matrix</TabsTrigger>
          <TabsTrigger value="flags" className="flex gap-2"><ToggleRight className="h-4 w-4" /> Feature Flags</TabsTrigger>
          <TabsTrigger value="audit" className="flex gap-2"><History className="h-4 w-4" /> Audit Logs</TabsTrigger>
          <TabsTrigger value="settings" className="flex gap-2"><Globe className="h-4 w-4" /> Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rbac" className="mt-0 space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>Configure granular access control for each role.</CardDescription>
              </div>
              <Button size="sm">Save Changes</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Module / Object</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead className="pr-6">Guest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    "Equipment Catalog", "Inventory Control", "Work Orders", "Logistics Docs", "Financial Reports"
                  ].map((module) => (
                    <TableRow key={module}>
                      <TableCell className="font-medium pl-6 py-4">{module}</TableCell>
                      <TableCell><Switch checked /></TableCell>
                      <TableCell><Switch checked /></TableCell>
                      <TableCell><Switch checked={!module.includes('Financial')} /></TableCell>
                      <TableCell className="pr-6"><Switch checked={module.includes('Catalog')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags" className="mt-0">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Global Feature Flags</CardTitle>
              <CardDescription>Enable or disable major system modules globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {[
                { name: "AI Optimization Engine", key: "ai_engine", desc: "Enable predictive maintenance alerts and AI dashboard summaries." },
                { name: "Global Finance Integration", key: "fin_ledger", desc: "Sync material master data with global accounting ledger." },
                { name: "Logistics Proof of Delivery", key: "log_pod", desc: "Require digital signature and photos for delivery completion." },
                { name: "Multi-Warehouse Routing", key: "multi_wh", desc: "Allow stocks to be transferred between multiple nodes." },
              ].map((flag) => (
                <div key={flag.key} className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-secondary/10">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm">{flag.name}</h4>
                    <p className="text-xs text-muted-foreground">{flag.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-0">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Activity Trail</CardTitle>
              <CardDescription>Immutable log of significant system mutations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="pr-6">Value Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { time: "2024-03-15 10:22", user: "Jane Doe", act: "UPDATE", ent: "EQ001", change: "status: available -> rented" },
                    { time: "2024-03-15 09:15", user: "System", act: "CREATE", ent: "REC-992", change: "New document generated" },
                    { time: "2024-03-15 08:45", user: "Admin", act: "CONFIG", ent: "FLAG-AI", change: "Feature enabled" },
                  ].map((log, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs text-muted-foreground pl-6">{log.time}</TableCell>
                      <TableCell className="font-bold text-xs">{log.user}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{log.act}</Badge></TableCell>
                      <TableCell className="text-xs">{log.ent}</TableCell>
                      <TableCell className="text-xs text-muted-foreground pr-6 italic">{log.change}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}