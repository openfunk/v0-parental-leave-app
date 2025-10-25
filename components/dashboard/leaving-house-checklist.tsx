"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, Home } from "lucide-react"
import { useLeavingHouseStore, type Duration } from "@/lib/leaving-house-store"

interface LeavingHouseChecklistProps {
  editMode?: boolean
}

const durationOptions = [
  { value: "quick" as Duration, label: "Quick trip", time: "< 1 hour" },
  { value: "half-day" as Duration, label: "Half day", time: "1-4 hours" },
  { value: "full-day" as Duration, label: "Full day", time: "4-8 hours" },
  { value: "overnight" as Duration, label: "Overnight", time: "8+ hours" },
]

export function LeavingHouseChecklist({ editMode = false }: LeavingHouseChecklistProps) {
  const [duration, setDuration] = useState<Duration>("quick")
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const { items, isLoading, fetchItems } = useLeavingHouseStore()

  useEffect(() => {
    console.log("[v0] LeavingHouseChecklist: Component mounted, fetching items")
    fetchItems()
  }, [fetchItems])

  // Get items for selected duration and all shorter durations
  const displayItems = useMemo(() => {
    const durationHierarchy: Duration[] = ["quick", "half-day", "full-day", "overnight"]
    const selectedIndex = durationHierarchy.indexOf(duration)
    const includedDurations = durationHierarchy.slice(0, selectedIndex + 1)

    return items.filter((item) => includedDurations.includes(item.duration)).sort((a, b) => a.item_order - b.item_order)
  }, [items, duration])

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const checkedCount = displayItems.filter((item) => checkedItems.has(item.id)).length
  const totalCount = displayItems.length
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <CardTitle>Leaving House Checklist</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading checklist...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <CardTitle>Leaving House Checklist</CardTitle>
        </div>
        <CardDescription>
          {editMode
            ? "Manage your checklist items and assign them to different durations"
            : "Select how long you'll be out to get a customized checklist"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Duration Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Duration</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                  duration === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{option.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        {!editMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {checkedCount}/{totalCount} items
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Checklist Items */}
        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-medium">Items to pack</Label>
          {displayItems.length === 0 ? (
            <div className="rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
              No items for this duration yet. {editMode && "Add items from the management section below."}
            </div>
          ) : (
            <div className="min-w-0 space-y-2 rounded-lg border border-border p-3">
              {displayItems.map((item) => (
                <div key={item.id} className="flex min-w-0 items-center gap-3">
                  {!editMode && (
                    <Checkbox
                      id={item.id}
                      checked={checkedItems.has(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="flex-shrink-0"
                    />
                  )}
                  <label
                    htmlFor={item.id}
                    className={`min-w-0 flex-1 truncate text-sm ${
                      !editMode && checkedItems.has(item.id) ? "text-muted-foreground line-through" : ""
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </label>
                  {editMode && (
                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                      {durationOptions.find((d) => d.value === item.duration)?.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        {!editMode && checkedCount > 0 && (
          <button
            onClick={() => setCheckedItems(new Set())}
            className="w-full rounded-lg border border-border py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Reset checklist
          </button>
        )}
      </CardContent>
    </Card>
  )
}
