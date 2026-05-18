"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ChecklistItemProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function ChecklistItem({ id, label, checked, onCheckedChange }: ChecklistItemProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
        "min-h-[44px]", // Mobile-friendly touch target
        "hover:bg-secondary/50",
        checked && "bg-secondary/30"
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="size-5"
      />
      <span
        className={cn(
          "text-sm font-medium transition-all",
          checked && "text-muted-foreground line-through"
        )}
      >
        {label}
      </span>
    </label>
  )
}
