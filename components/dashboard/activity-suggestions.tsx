import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import activitiesData from "@/data/activities.json"

// Taking first 3 activities from the JSON data for dashboard display
const activities = activitiesData.activities.slice(0, 3).map((activity) => ({
  title: activity.title,
  location: "Local Area", // Generic location since JSON doesn't have specific venues
  time: activitiesData.labels.duration[activity.duration as keyof typeof activitiesData.labels.duration],
  category: activitiesData.labels.type[activity.type as keyof typeof activitiesData.labels.type],
  image: "/placeholder.svg?height=200&width=300",
}))

export function ActivitySuggestions() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Activity Suggestions</CardTitle>
        <CardDescription>Recommended activities for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex min-w-0 gap-3 rounded-lg border border-border/50 p-3 transition-shadow hover:shadow-md sm:gap-4"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
              <img
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="min-w-0">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 truncate font-medium leading-tight" title={activity.title}>
                    {activity.title}
                  </h3>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    {activity.category}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate text-xs">{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
