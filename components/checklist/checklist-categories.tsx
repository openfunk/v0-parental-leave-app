"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useChecklistStore, type ChecklistItem } from "@/lib/checklist-store"
import { FileText, Heart, Home, Briefcase, ShoppingCart, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const categories = [
  { id: "documents" as const, label: "Documents", icon: FileText, color: "text-chart-1" },
  { id: "medical" as const, label: "Medical", icon: Heart, color: "text-chart-2" },
  { id: "home" as const, label: "Home Preparation", icon: Home, color: "text-chart-3" },
  { id: "work" as const, label: "Work", icon: Briefcase, color: "text-chart-4" },
  { id: "baby-gear" as const, label: "Baby Gear", icon: ShoppingCart, color: "text-chart-5" },
  { id: "other" as const, label: "Other", icon: MoreHorizontal, color: "text-muted-foreground" },
]

export function ChecklistCategories() {
  const items = useChecklistStore((state) => state.items)
  const toggleItem = useChecklistStore((state) => state.toggleItem)
  const deleteItem = useChecklistStore((state) => state.deleteItem)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(id)
    }
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.category === category.id)

        if (categoryItems.length === 0) return null

        const Icon = category.icon
        const completedCount = categoryItems.filter((item) => item.completed).length

        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${category.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{category.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {categoryItems.length} completed
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryItems.map((item) => (
                <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={handleDelete} />
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function ChecklistItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: ChecklistItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/50">
      <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => onToggle(item.id)} className="mt-0.5" />
      <label htmlFor={item.id} className="flex-1 cursor-pointer space-y-1">
        <p className={`font-medium leading-tight ${item.completed ? "text-muted-foreground line-through" : ""}`}>
          {item.title}
        </p>
        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
        {item.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {new Date(item.dueDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
        )}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
