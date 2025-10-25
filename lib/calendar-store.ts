"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: "appointment" | "activity" | "reminder" | "milestone"
  location?: string
  notes?: string
  childId?: string
}

interface CalendarStore {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  getEventsForDate: (date: string) => CalendarEvent[]
  getUpcomingEvents: (limit?: number) => CalendarEvent[]
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: Date.now().toString() }],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      getEventsForDate: (date) => {
        return get().events.filter((event) => event.date === date)
      },
      getUpcomingEvents: (limit = 5) => {
        const now = new Date()
        return get()
          .events.filter((event) => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, limit)
      },
    }),
    {
      name: "calendar-storage",
    },
  ),
)
