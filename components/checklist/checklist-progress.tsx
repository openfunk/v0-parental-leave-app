"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useChecklistStore } from "@/lib/checklist-store"
import { CheckCircle2 } from "lucide-react"

export function ChecklistProgress() {
  const items = useChecklistStore((state) => state.items)
  const getCompletionPercentage = useChecklistStore((state) => state.getCompletionPercentage)

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const percentage = getCompletionPercentage()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              {completedCount} of {totalCount} tasks completed
            </CardDescription>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <p className="text-right text-sm font-medium text-muted-foreground">{percentage}%</p>
        </div>
      </CardContent>
    </Card>
  )
}
