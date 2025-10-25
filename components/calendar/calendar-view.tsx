"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useCalendarStore } from "@/lib/calendar-store"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const events = useCalendarStore((state) => state.events)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const hasEventsOnDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]
    return events.some((event) => event.date === dateStr)
  }

  const isSelectedDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{monthName}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth} className="bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day Headers */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const hasEvents = hasEventsOnDate(day)
            const selected = isSelectedDate(day)
            const today = isToday(day)

            return (
              <button
                key={day}
                onClick={() => onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                className={cn(
                  "relative flex h-12 items-center justify-center rounded-lg text-sm transition-colors",
                  "hover:bg-secondary",
                  selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  today && !selected && "border-2 border-primary",
                )}
              >
                {day}
                {hasEvents && !selected && <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
