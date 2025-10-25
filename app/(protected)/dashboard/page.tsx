import { WeatherCard } from "@/components/dashboard/weather-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivitySuggestions } from "@/components/dashboard/activity-suggestions"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { LeavingHouseChecklist } from "@/components/dashboard/leaving-house-checklist"

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome Back</h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>

      {/* Main Grid */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <WeatherCard />
          <ActivitySuggestions />
        </div>

        {/* Right Column - Sidebar */}
        <div className="min-w-0 space-y-6">
          <QuickActions />
          <UpcomingEvents />
          <LeavingHouseChecklist />
        </div>
      </div>
    </div>
  )
}
