"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Baby, Sun, Cloud, Home, Heart, Music, Book, Utensils } from "lucide-react"
import activitiesData from "@/data/activities.json"

type ActivityType = "physical" | "creative" | "educational" | "social" | "outdoor" | "indoor"
type AgeRange = "0-6m" | "6-12m" | "12-24m" | "2y+"
type Duration = "short" | "medium" | "long"

interface Activity {
  title: string
  description: string
  ageRange: AgeRange[]
  duration: Duration
  type: ActivityType
  location: "indoor" | "outdoor" | "both"
  icon?: any
}

const iconMap: Record<string, any> = {
  Baby,
  Sun,
  Cloud,
  Heart,
  Music,
  Book,
  Utensils,
  Home,
}

const activities: Activity[] = activitiesData.activities.map((activity) => ({
  ...activity,
  icon: iconMap[
    activity.type === "physical"
      ? "Baby"
      : activity.type === "outdoor"
        ? "Sun"
        : activity.type === "creative"
          ? "Heart"
          : activity.type === "educational"
            ? "Book"
            : activity.type === "social"
              ? "Utensils"
              : "Home"
  ],
}))

const ageRangeLabels: Record<AgeRange, string> = activitiesData.labels.ageRange as Record<AgeRange, string>
const typeLabels: Record<ActivityType, string> = activitiesData.labels.type as Record<ActivityType, string>
const durationLabels: Record<Duration, string> = activitiesData.labels.duration as Record<Duration, string>

export function ActivitySuggestionsCard() {
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange | "all">("all")
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all")
  const [selectedLocation, setSelectedLocation] = useState<"indoor" | "outdoor" | "all">("all")

  const filteredActivities = activities.filter((activity) => {
    if (selectedAgeRange !== "all" && !activity.ageRange.includes(selectedAgeRange)) {
      return false
    }
    if (selectedType !== "all" && activity.type !== selectedType) {
      return false
    }
    if (selectedLocation !== "all" && activity.location !== selectedLocation && activity.location !== "both") {
      return false
    }
    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Suggestions</CardTitle>
        <CardDescription>Discover fun activities to do with your baby</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          {/* Age Range Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium">Age Range</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedAgeRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAgeRange("all")}
              >
                All Ages
              </Button>
              {(Object.keys(ageRangeLabels) as AgeRange[]).map((age) => (
                <Button
                  key={age}
                  variant={selectedAgeRange === age ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgeRange(age)}
                >
                  {ageRangeLabels[age]}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium">Activity Type</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All Types
              </Button>
              {(Object.keys(typeLabels) as ActivityType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {typeLabels[type]}
                </Button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLocation === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation("all")}
              >
                All Locations
              </Button>
              <Button
                variant={selectedLocation === "indoor" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation("indoor")}
              >
                Indoor
              </Button>
              <Button
                variant={selectedLocation === "outdoor" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation("outdoor")}
              >
                Outdoor
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
        </div>

        {/* Activities List */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
              <p className="text-muted-foreground">No activities match your filters. Try adjusting your selection.</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg border border-border/50 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium leading-tight">{activity.title}</h3>
                      <Badge variant="secondary" className="flex-shrink-0 text-xs">
                        {typeLabels[activity.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Baby className="h-3 w-3" />
                        <span>{activity.ageRange.map((age) => ageRangeLabels[age]).join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{durationLabels[activity.duration]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activity.location === "indoor" ? <Home className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                        <span className="capitalize">{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
