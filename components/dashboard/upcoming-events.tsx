"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useCalendarStore } from "@/lib/calendar-store"
import { useMemo } from "react"

export function UpcomingEvents() {
  const allEvents = useCalendarStore((state) => state.events)

  const events = useMemo(() => {
    const now = new Date()
    return allEvents
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  }, [allEvents])

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => {
          const eventDate = new Date(event.date)
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          let dateLabel = eventDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
          if (eventDate.toDateString() === today.toDateString()) {
            dateLabel = "Today"
          } else if (eventDate.toDateString() === tomorrow.toDateString()) {
            dateLabel = "Tomorrow"
          }

          return (
            <div key={event.id} className="flex gap-3 rounded-lg border border-border/50 p-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {dateLabel} at {event.time}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
