import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        {/* Hero Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-secondary sm:h-80">
            <img
              src="/placeholder.svg?height=400&width=800"
              alt="Father with baby"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Your Parental Leave Journey Starts Here
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Designed for Scandinavian fathers taking parental leave. Track growth, discover activities, and make every day
          count with your little one.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll to explore</span>
          <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30">
            <div className="mx-auto mt-1.5 h-2 w-1 animate-bounce rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
