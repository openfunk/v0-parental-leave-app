import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GrowthEntry } from "@/lib/children-store"
import { Calendar, Ruler, Weight } from "lucide-react"

export function GrowthEntryList({ entries }: { entries: GrowthEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Entries</CardTitle>
          <CardDescription>No entries recorded yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Entries</CardTitle>
        <CardDescription>All recorded measurements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-border/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(entry.date).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <Weight className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-medium">{entry.weight} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                  <Ruler className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="font-medium">{entry.height} cm</p>
                </div>
              </div>
              {entry.headCircumference && (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                    <Ruler className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Head</p>
                    <p className="font-medium">{entry.headCircumference} cm</p>
                  </div>
                </div>
              )}
            </div>
            {entry.notes && <p className="mt-3 text-sm text-muted-foreground">{entry.notes}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
