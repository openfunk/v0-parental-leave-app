import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Baby, Calendar, CheckSquare, TrendingUp } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    icon: Baby,
    label: "Add Child",
    href: "/dashboard/children/new",
    color: "text-chart-1",
  },
  {
    icon: TrendingUp,
    label: "Log Growth",
    href: "/dashboard/children?action=growth",
    color: "text-chart-2",
  },
  {
    icon: Calendar,
    label: "View Calendar",
    href: "/dashboard/calendar",
    color: "text-chart-3",
  },
  {
    icon: CheckSquare,
    label: "Checklist",
    href: "/dashboard/checklist",
    color: "text-chart-4",
  },
]

export function QuickActions() {
  return (
    null
  )
}
