import { AddChildForm } from "@/components/children/add-child-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewChildPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/children">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Children
          </Link>
        </Button>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">Add a Child</h1>
        <p className="text-muted-foreground">Enter your child's information to create their profile</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <AddChildForm />
      </div>
    </div>
  )
}
