"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Child } from "@/lib/children-store"
import { TrendingUp, Calendar, MoreVertical } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChildrenStore } from "@/lib/children-store"
import { EditChildDialog } from "./edit-child-dialog"

export function ChildCard({ child }: { child: Child }) {
  const deleteChild = useChildrenStore((state) => state.deleteChild)
  const updateChild = useChildrenStore((state) => state.updateChild)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const age = calculateAge(child.birthDate)

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${child.name}'s profile?`)) {
      console.log("[v0] ChildCard: Deleting child:", child.id)
      try {
        await deleteChild(child.id)
      } catch (error) {
        console.error("[v0] ChildCard: Delete failed:", error)
        alert("Failed to delete child profile. Please try again.")
      }
    }
  }

  const handleUpdate = async (id: string, data: Partial<Child>) => {
    console.log("[v0] ChildCard: Updating child:", id, data)
    await updateChild(id, data)
  }

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardHeader className="relative p-0">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5">
            {child.photo ? (
              <img src={child.photo || "/placeholder.svg"} alt={child.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-semibold text-primary/30">{child.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 bg-background/80 backdrop-blur">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="mb-1 text-lg font-semibold">{child.name}</h3>
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{age}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="default" asChild size="sm" className="flex-1">
              <Link href={`/dashboard/children/${child.id}/growth`}>
                <TrendingUp className="mr-1 h-3 w-3" />
                Growth
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditChildDialog
        child={child}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdate}
      />
    </>
  )
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())

  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} old`
  } else {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""} old`
    }
    return `${years}y ${remainingMonths}m old`
  }
}
