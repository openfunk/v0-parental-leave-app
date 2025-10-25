"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GrowthEntry } from "@/lib/children-store"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function GrowthChart({ entries }: { entries: GrowthEntry[] }) {
  const chartData = entries
    .slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: entry.weight,
      height: entry.height,
    }))

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Chart</CardTitle>
          <CardDescription>No growth data available yet</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
          Add your first growth entry to see the chart
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Chart</CardTitle>
        <CardDescription>Weight and height over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Weight (kg)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="height"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Height (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
