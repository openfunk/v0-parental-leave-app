"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useChildrenStore } from "@/lib/children-store"
import { useRouter } from "next/navigation"

export function AddChildForm() {
  const router = useRouter()
  const addChild = useChildrenStore((state) => state.addChild)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gender, setGender] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const childData = {
      name: formData.get("name") as string,
      birthDate: formData.get("birthDate") as string,
      gender,
      notes: formData.get("notes") as string,
    }

    console.log("[v0] AddChildForm: Submitting child data:", childData)

    try {
      await addChild(childData)
      console.log("[v0] AddChildForm: Child added successfully")
      router.push("/dashboard/children")
    } catch (err) {
      console.error("[v0] AddChildForm: Error adding child:", err)
      setError(err instanceof Error ? err.message : "Failed to add child")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Child Information</CardTitle>
        <CardDescription>Fill in the details about your child</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter child's name"
              type="text"
              autoCapitalize="words"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              disabled={isLoading}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select disabled={isLoading} required value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information..."
              disabled={isLoading}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Adding..." : "Add Child"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
