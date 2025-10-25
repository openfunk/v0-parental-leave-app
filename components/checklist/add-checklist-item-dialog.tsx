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
import { useChecklistStore, type ChecklistItem } from "@/lib/checklist-store"

interface AddChecklistItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChecklistItemDialog({ open, onOpenChange }: AddChecklistItemDialogProps) {
  const addItem = useChecklistStore((state) => state.addItem)
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<ChecklistItem["category"]>("other")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const itemData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category,
      completed: false,
      dueDate: formData.get("dueDate") as string,
    }

    addItem(itemData)

    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      ;(event.target as HTMLFormElement).reset()
      setCategory("other")
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Checklist Item</DialogTitle>
          <DialogDescription>Create a new task for your pre-leave checklist</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Task title" type="text" disabled={isLoading} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                disabled={isLoading}
                required
                value={category}
                onValueChange={(value: ChecklistItem["category"]) => setCategory(value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="home">Home Preparation</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="baby-gear">Baby Gear</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Additional details..."
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" name="dueDate" type="date" disabled={isLoading} />
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
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
