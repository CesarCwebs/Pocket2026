"use client"

import { useState } from "react"
import { MOCK_EQUIPMENT, Equipment } from "@/lib/erp-data"
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
  Filter, 
  MoreHorizontal, 
  Box, 
  History, 
  MapPin, 
  Cpu 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EquipmentPage() {
  const [search, setSearch] = useState("")
  
  const statusColors = {
    available: "bg-green-100 text-green-700 hover:bg-green-200",
    rented: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    maintenance: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    decommissioned: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  }

  const filtered = MOCK_EQUIPMENT.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.serialNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Equipment Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage and track enterprise physical assets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Add Equipment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_EQUIPMENT.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Stored across 4 warehouses</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">In Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{MOCK_EQUIPMENT.filter(e => e.status === 'rented').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Generating active revenue</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Downtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{MOCK_EQUIPMENT.filter(e => e.status === 'maintenance').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Units currently unavailable</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, brand or serial..." 
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
                <TableHead className="w-[300px] pl-6">Equipment Name</TableHead>
                <TableHead>Brand / Model</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage (Hrs)</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((equipment) => (
                <TableRow key={equipment.id} className="cursor-pointer">
                  <TableCell className="font-medium pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Box className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span>{equipment.name}</span>
                        <span className="text-xs text-muted-foreground">{equipment.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{equipment.brand}</span>
                      <span className="text-xs text-muted-foreground">{equipment.model}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{equipment.serialNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors[equipment.status]} capitalize border-none`}>
                      {equipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{equipment.hourMeter.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {equipment.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Specs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" /> Log Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <History className="h-4 w-4" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Decommission</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No equipment found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
import { Wrench } from "lucide-react"