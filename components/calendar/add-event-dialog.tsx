"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCalendarStore } from "@/lib/calendar-store"

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
}

export function AddEventDialog({ open, onOpenChange, selectedDate }: AddEventDialogProps) {
  const addEvent = useCalendarStore((state) => state.addEvent)
  const [isLoading, setIsLoading] = useState(false)
  const [eventType, setEventType] = useState<"appointment" | "activity" | "reminder" | "milestone">("appointment")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const eventData = {
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      type: eventType,
      location: formData.get("location") as string,
      notes: formData.get("notes") as string,
    }

    addEvent(eventData)

    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      ;(event.target as HTMLFormElement).reset()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>Create a new calendar event</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Event title" type="text" disabled={isLoading} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                disabled={isLoading}
                required
                value={eventType}
                onValueChange={(value: any) => setEventType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  disabled={isLoading}
                  required
                  defaultValue={selectedDate.toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" disabled={isLoading} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" name="location" placeholder="Event location" type="text" disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Additional details..." disabled={isLoading} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
