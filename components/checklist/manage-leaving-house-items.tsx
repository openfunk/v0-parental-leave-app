"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLeavingHouseStore, type Duration, type LeavingHouseItem } from "@/lib/leaving-house-store"
import { Plus, Pencil, Trash2, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const durationOptions = [
  { value: "quick" as Duration, label: "Quick trip (< 1 hour)" },
  { value: "half-day" as Duration, label: "Half day (1-4 hours)" },
  { value: "full-day" as Duration, label: "Full day (4-8 hours)" },
  { value: "overnight" as Duration, label: "Overnight (8+ hours)" },
]

export function ManageLeavingHouseItems() {
  const { items, addItem, updateItem, deleteItem } = useLeavingHouseStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LeavingHouseItem | null>(null)
  const [newItemLabel, setNewItemLabel] = useState("")
  const [newItemDuration, setNewItemDuration] = useState<Duration>("quick")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddItem = async () => {
    if (!newItemLabel.trim()) {
      setError("Please enter an item name")
      return
    }

    try {
      await addItem(newItemLabel, newItemDuration)
      setSuccess("Item added successfully!")
      setNewItemLabel("")
      setNewItemDuration("quick")
      setIsAddDialogOpen(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError("Failed to add item. Please try again.")
    }
  }

  const handleEditItem = async () => {
    if (!editingItem || !newItemLabel.trim()) {
      setError("Please enter an item name")
      return
    }

    try {
      await updateItem(editingItem.id, newItemLabel, newItemDuration)
      setSuccess("Item updated successfully!")
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError("Failed to update item. Please try again.")
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      await deleteItem(id)
      setSuccess("Item deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError("Failed to delete item. Please try again.")
    }
  }

  const openEditDialog = (item: LeavingHouseItem) => {
    setEditingItem(item)
    setNewItemLabel(item.label)
    setNewItemDuration(item.duration)
    setIsEditDialogOpen(true)
  }

  // Group items by duration
  const itemsByDuration = durationOptions.map((duration) => ({
    ...duration,
    items: items.filter((item) => item.duration === duration.value),
  }))

  return (
    <div className="space-y-4">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Manage Checklist Items</h2>
          <p className="text-sm text-muted-foreground">Add, edit, or remove items from your leaving house checklist</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items by Duration */}
      <div className="grid gap-4 sm:grid-cols-2">
        {itemsByDuration.map((duration) => (
          <Card key={duration.value}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{duration.label}</CardTitle>
              </div>
              <CardDescription>{duration.items.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              {duration.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items yet</p>
              ) : (
                <div className="space-y-2">
                  {duration.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2"
                    >
                      <span className="text-sm">{item.label}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
            <DialogDescription>Add a new item to your leaving house checklist</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-label">Item Name</Label>
              <Input
                id="item-label"
                placeholder="e.g., Extra diapers"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-duration">Duration</Label>
              <Select value={newItemDuration} onValueChange={(value) => setNewItemDuration(value as Duration)}>
                <SelectTrigger id="item-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Item</DialogTitle>
            <DialogDescription>Update the item name or duration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-label">Item Name</Label>
              <Input
                id="edit-item-label"
                placeholder="e.g., Extra diapers"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-duration">Duration</Label>
              <Select value={newItemDuration} onValueChange={(value) => setNewItemDuration(value as Duration)}>
                <SelectTrigger id="edit-item-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
