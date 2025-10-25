"use client"

import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Baby, Calendar, CheckSquare, UserIcon, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/children", label: "Children", icon: Baby },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
]

export function DashboardNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-semibold">P</span>
          </div>
          <span className="hidden font-semibold sm:inline-block">Pappa</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button key={item.href} asChild variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.user_metadata?.display_name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
            <LogOut className="h-4 w-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4">
                <div className="border-b border-border pb-4">
                  <p className="font-medium">{user?.user_metadata?.display_name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className="justify-start gap-2"
                        onClick={() => setOpen(false)}
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </Button>
                    )
                  })}
                  <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
