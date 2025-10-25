"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useChildrenStore } from "@/lib/children-store"
import { Plus, Baby } from "lucide-react"
import Link from "next/link"
import { ChildCard } from "@/components/children/child-card"

export default function ChildrenPage() {
  const { children, isLoading, fetchChildren } = useChildrenStore()

  useEffect(() => {
    console.log("[v0] ChildrenPage: Fetching children on mount")
    fetchChildren()
  }, [fetchChildren])

  if (isLoading && children.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading children...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">My Children</h1>
          <p className="text-muted-foreground">Manage your children's profiles and track their growth</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/children/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Child
          </Link>
        </Button>
      </div>

      {/* Children List */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Baby className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No children added yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Start by adding your first child to track their growth and milestones
            </p>
            <Button asChild>
              <Link href="/dashboard/children/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Child
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  )
}
