"use client"

import { useParams, useRouter } from "next/navigation"
import { useChildrenStore } from "@/lib/children-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { GrowthChart } from "@/components/children/growth-chart"
import { GrowthEntryList } from "@/components/children/growth-entry-list"
import { AddGrowthEntryDialog } from "@/components/children/add-growth-entry-dialog"
import { useState, useMemo } from "react"

export default function ChildGrowthPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id as string
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const child = useChildrenStore((state) => state.children.find((c) => c.id === childId))
  const allGrowthEntries = useChildrenStore((state) => state.growthEntries)

  const growthEntries = useMemo(() => {
    return allGrowthEntries
      .filter((entry) => entry.childId === childId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [allGrowthEntries, childId])

  if (!child) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Child not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/children">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Children
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">{child.name}'s Growth</h1>
            <p className="text-muted-foreground">Track and monitor growth over time</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <GrowthChart entries={growthEntries} />
        <GrowthEntryList entries={growthEntries} />
      </div>

      <AddGrowthEntryDialog childId={childId} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
