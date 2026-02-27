"use client"

import { useState } from "react"
import { MOCK_MATERIALS, Material } from "@/lib/erp-data"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  ClipboardList, 
  Warehouse, 
  AlertTriangle 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function InventoryPage() {
  const [search, setSearch] = useState("")

  const filtered = MOCK_MATERIALS.filter(m => 
    m.description.toLowerCase().includes(search.toLowerCase()) || 
    m.sku.toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = MOCK_MATERIALS.reduce((acc, curr) => acc + (curr.stock * curr.price), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Material Master</h1>
          <p className="text-muted-foreground mt-1">Control inventory levels and warehouse logistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <ArrowDownLeft className="h-4 w-4 mr-2" /> Stock IN
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" /> Stock OUT
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> New SKU
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{MOCK_MATERIALS.filter(m => m.stock < m.minStock).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Items below safety threshold</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">4</div>
            <p className="text-xs text-muted-foreground mt-1">Strategic distribution nodes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search materials by SKU or name..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="pl-6">Material SKU</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Available Stock</TableHead>
                  <TableHead>Safety Min</TableHead>
                  <TableHead className="text-right pr-6">Value (Unit)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const isLow = item.stock < item.minStock
                  return (
                    <TableRow key={item.sku} className="cursor-pointer group">
                      <TableCell className="font-mono text-xs pl-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className={`h-4 w-4 ${isLow ? 'text-destructive' : 'text-primary'}`} />
                          {item.sku}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.description}</span>
                          <span className="text-xs text-muted-foreground">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLow ? 'text-destructive' : 'text-foreground'}`}>
                            {item.stock}
                          </span>
                          {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                      <TableCell className="text-right pr-6 font-medium">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Kardex Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Warehouse Capacity</span>
                  <span className="font-semibold">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Recent Movements</h4>
                {[
                  { type: 'IN', ref: 'REC-2201', qty: '+50', item: 'Hydraulic Oil', date: 'Just now' },
                  { type: 'OUT', ref: 'WO-8821', qty: '-2', item: 'Air Filter Element', date: '2h ago' },
                  { type: 'ADJ', ref: 'INV-CNT', qty: '-5', item: 'Solid Tire', date: '5h ago' },
                ].map((mv, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        mv.type === 'IN' ? 'bg-green-100 text-green-700' : 
                        mv.type === 'OUT' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {mv.type}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">{mv.item}</span>
                        <span className="text-[10px] text-muted-foreground">{mv.ref}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${mv.qty.startsWith('+') ? 'text-green-600' : 'text-foreground'}`}>
                        {mv.qty}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{mv.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full text-xs">View Full Ledger</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}