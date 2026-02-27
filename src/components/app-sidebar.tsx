"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Box,
  Truck,
  Wrench,
  Package,
  ShieldCheck,
  History,
  Settings2,
  Cpu,
  LogOut,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Operational Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Equipment Catalog",
    url: "/equipment",
    icon: Box,
  },
  {
    title: "Inventory Management",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Maintenance Orders",
    url: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Logistics Operations",
    url: "/logistics",
    icon: Truck,
  },
  {
    title: "Admin & RBAC",
    url: "/admin",
    icon: ShieldCheck,
    subItems: [
      { title: "User Permissions", url: "/admin/rbac" },
      { title: "Feature Flags", url: "/admin/flags" },
      { title: "Audit Logs", url: "/admin/audit" },
    ]
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg tracking-tight">NexusFlow</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Enterprise ERP</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.subItems ? (
                  <>
                    <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/menu-item:rotate-90" />
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {item.subItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === sub.url}>
                            <Link href={sub.url}>{sub.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <span className="text-xs font-bold text-secondary-foreground">JD</span>
              </div>
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Jane Doe</span>
                <span className="text-xs text-muted-foreground">Admin User</span>
              </div>
              <MoreHorizontal className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}