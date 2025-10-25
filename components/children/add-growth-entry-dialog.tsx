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
import { useChildrenStore } from "@/lib/children-store"

interface AddGrowthEntryDialogProps {
  childId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGrowthEntryDialog({ childId, open, onOpenChange }: AddGrowthEntryDialogProps) {
  const addGrowthEntry = useChildrenStore((state) => state.addGrowthEntry)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const entryData = {
      childId,
      date: formData.get("date") as string,
      weight: Number.parseFloat(formData.get("weight") as string),
      height: Number.parseFloat(formData.get("height") as string),
      headCircumference: formData.get("headCircumference")
        ? Number.parseFloat(formData.get("headCircumference") as string)
        : undefined,
      notes: formData.get("notes") as string,
    }

    addGrowthEntry(entryData)

    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      ;(event.target as HTMLFormElement).reset()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Growth Entry</DialogTitle>
          <DialogDescription>Record new measurements for your child</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                disabled={isLoading}
                required
                max={new Date().toISOString().split("T")[0]}
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="5.5"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="65"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headCircumference">Head Circumference (cm) - Optional</Label>
              <Input
                id="headCircumference"
                name="headCircumference"
                type="number"
                step="0.1"
                min="0"
                placeholder="40"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Any observations..." disabled={isLoading} rows={3} />
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
              {isLoading ? "Adding..." : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
