"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalendarStore } from "@/lib/calendar-store"
import { Calendar, MapPin, Clock, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

const eventTypeColors = {
  appointment: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  activity: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  reminder: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  milestone: "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

export function EventList({ selectedDate }: { selectedDate: Date }) {
  const dateStr = selectedDate.toISOString().split("T")[0]
  const allEvents = useCalendarStore((state) => state.events)
  const deleteEvent = useCalendarStore((state) => state.deleteEvent)

  // Filter events for the selected date using useMemo to avoid unnecessary recalculations
  const events = useMemo(() => {
    return allEvents.filter((event) => event.date === dateStr)
  }, [allEvents, dateStr])

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-border/50 p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium leading-tight">{event.title}</h4>
                    <Badge variant="outline" className={cn("mt-1 text-xs", eventTypeColors[event.type])}>
                      {event.type}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.notes && <p className="mt-2 text-xs text-muted-foreground">{event.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
