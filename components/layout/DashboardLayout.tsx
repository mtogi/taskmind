"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, LayoutDashboard, CalendarDays, Settings, BarChart3, CreditCard, LogOut, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: PlusCircle },
    { name: "Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-xl tracking-tight">TaskMind</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-between overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="px-2 space-y-4">
            <Link href="/pricing" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <CreditCard className="h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <div className="flex-1 font-semibold">
            {navItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))?.name || "Dashboard"}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
} 