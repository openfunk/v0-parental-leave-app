import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Calendar, Baby, CheckSquare, TrendingUp, Sparkles } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "Weather Forecast",
    description: "Plan your outdoor activities with accurate weather forecasts for today and tomorrow.",
  },
  {
    icon: Sparkles,
    title: "Activity Suggestions",
    description: "Discover age-appropriate activities and local events perfect for you and your child.",
  },
  {
    icon: Baby,
    title: "Child Management",
    description: "Keep track of important details, milestones, and memories for each of your children.",
  },
  {
    icon: TrendingUp,
    title: "Growth Tracker",
    description: "Monitor your child's growth and development with easy-to-use tracking tools.",
  },
  {
    icon: Calendar,
    title: "Activity Calendar",
    description: "Stay organized with a calendar featuring country-specific activities and events.",
  },
  {
    icon: CheckSquare,
    title: "Pre-Leaving Checklist",
    description: "Never forget essentials with customizable checklists before heading out.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-4xl">
            We can do this
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Everything You Need for Parental Leave. Thoughtfully designed features to support you during this special time with your child.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-border/50 transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
