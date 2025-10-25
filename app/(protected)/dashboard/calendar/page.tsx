"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CalendarView } from "@/components/calendar/calendar-view"
import { EventList } from "@/components/calendar/event-list"
import { AddEventDialog } from "@/components/calendar/add-event-dialog"
import { ActivitySuggestionsCard } from "@/components/calendar/activity-suggestions-card"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">Calendar</h1>
          <p className="text-muted-foreground">Manage your appointments and activities</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div>
          <EventList selectedDate={selectedDate} />
        </div>
      </div>

      <div className="mt-6">
        <ActivitySuggestionsCard />
      </div>

      <AddEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={selectedDate} />
    </div>
  )
}
