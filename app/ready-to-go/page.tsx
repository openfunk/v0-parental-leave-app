"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { WeatherDisplay } from "@/components/ready-to-go/weather-display"
import { ChecklistCategory } from "@/components/ready-to-go/checklist-category"
import { getChecklistCategories, getWeatherItems, type WeatherData } from "@/lib/checklist-utils"
import { RotateCcw, CloudSun } from "lucide-react"

export default function ReadyToGoPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [weatherItems, setWeatherItems] = useState<{ id: string; label: string }[]>([])
  const [weatherLoaded, setWeatherLoaded] = useState(false)

  const categories = getChecklistCategories()

  const handleWeatherLoaded = useCallback((weather: WeatherData) => {
    const items = getWeatherItems(weather)
    setWeatherItems(items)
    setWeatherLoaded(true)
  }, [])

  const handleItemChange = (itemId: string, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(itemId)
      } else {
        next.delete(itemId)
      }
      return next
    })
  }

  const handleReset = () => {
    setCheckedItems(new Set())
  }

  // Calculate total progress
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0) + weatherItems.length
  const completedItems = checkedItems.size
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">Ready to Go</h1>
            <p className="text-xs text-muted-foreground">
              {completedItems}/{totalItems} items checked ({progressPercent}%)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} disabled={completedItems === 0}>
            <RotateCcw data-icon="inline-start" />
            Reset
          </Button>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col gap-4 p-4 pb-8">
        {/* Weather Display */}
        <WeatherDisplay onWeatherLoaded={handleWeatherLoaded} />

        {/* Weather Essentials - Dynamic section */}
        {weatherLoaded && weatherItems.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <CloudSun className="size-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">Weather Essentials</h2>
            </div>
            <ChecklistCategory
              title="Based on today's weather"
              items={weatherItems}
              checkedItems={checkedItems}
              onItemChange={handleItemChange}
            />
          </div>
        )}

        {/* Fixed Categories */}
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <ChecklistCategory
              key={category.id}
              title={category.title}
              items={category.items}
              checkedItems={checkedItems}
              onItemChange={handleItemChange}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
