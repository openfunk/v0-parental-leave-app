"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChecklistItem } from "./checklist-item"
import type { ChecklistItem as ChecklistItemType } from "@/lib/checklist-utils"

interface ChecklistCategoryProps {
  title: string
  items: ChecklistItemType[]
  checkedItems: Set<string>
  onItemChange: (itemId: string, checked: boolean) => void
}

export function ChecklistCategory({ title, items, checkedItems, onItemChange }: ChecklistCategoryProps) {
  const completedCount = items.filter((item) => checkedItems.has(item.id)).length
  const totalCount = items.length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-0">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            checked={checkedItems.has(item.id)}
            onCheckedChange={(checked) => onItemChange(item.id, checked)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
