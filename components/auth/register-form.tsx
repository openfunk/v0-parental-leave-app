"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Plus, X } from "lucide-react"
import citiesData from "@/data/cities.json"

const CITIES_BY_COUNTRY = citiesData.cities

interface ChildData {
  id: string
  name: string
  birthDate: string
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [userExists, setUserExists] = useState(false)

  const [children, setChildren] = useState<ChildData[]>([{ id: crypto.randomUUID(), name: "", birthDate: "" }])

  const addChild = () => {
    setChildren([...children, { id: crypto.randomUUID(), name: "", birthDate: "" }])
  }

  const removeChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter((child) => child.id !== id))
    }
  }

  const updateChild = (id: string, field: "name" | "birthDate", value: string) => {
    setChildren(children.map((child) => (child.id === id ? { ...child, [field]: value } : child)))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setUserExists(false)

    console.log("[v0] Registration form submitted")

    const formData = new FormData(event.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const leaveStartDate = formData.get("leaveStartDate") as string
    const leaveEndDate = formData.get("leaveEndDate") as string

    console.log("[v0] Form data:", {
      firstName,
      lastName,
      email,
      country,
      city,
      leaveStartDate,
      leaveEndDate,
      childrenCount: children.length,
    })

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      console.log("[v0] Password validation failed")
      return
    }

    const validChildren = children.filter((child) => child.name && child.birthDate)
    if (validChildren.length === 0) {
      setError("Please add at least one child with name and birthdate")
      setIsLoading(false)
      console.log("[v0] Child validation failed")
      return
    }

    if (!leaveStartDate || !leaveEndDate) {
      setError("Please provide parental leave start and end dates")
      setIsLoading(false)
      console.log("[v0] Parental leave dates validation failed")
      return
    }

    if (new Date(leaveStartDate) > new Date(leaveEndDate)) {
      setError("Leave start date must be before end date")
      setIsLoading(false)
      console.log("[v0] Parental leave dates order validation failed")
      return
    }

    try {
      const supabase = createClient()
      console.log("[v0] Creating Supabase client")

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            display_name: `${firstName} ${lastName}`,
          },
        },
      })

      console.log("[v0] Sign up response:", { userId: data.user?.id, hasSession: !!data.session, error: signUpError })

      if (signUpError) {
        if (
          signUpError.message.toLowerCase().includes("already registered") ||
          signUpError.message.toLowerCase().includes("already exists") ||
          signUpError.message.toLowerCase().includes("user already registered")
        ) {
          console.log("[v0] User already exists")
          setUserExists(true)
          return
        }
        throw signUpError
      }

      if (!data.user) {
        throw new Error("User creation failed")
      }

      const userId = data.user.id
      console.log("[v0] User created successfully:", userId)

      const { error: userDetailsError } = await supabase.from("user_details").insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        country: country,
        city: city,
      })

      if (userDetailsError) {
        console.error("[v0] Error inserting user details:", userDetailsError)
        throw new Error(`Failed to save user details: ${userDetailsError.message}`)
      }
      console.log("[v0] User details inserted successfully")

      const childrenToInsert = validChildren.map((child) => ({
        user_id: userId,
        name: child.name,
        birth_date: child.birthDate,
      }))

      const { data: insertedChildren, error: childrenError } = await supabase
        .from("children")
        .insert(childrenToInsert)
        .select()

      if (childrenError) {
        console.error("[v0] Error inserting children:", childrenError)
        throw new Error(`Failed to save children: ${childrenError.message}`)
      }
      console.log("[v0] Children inserted successfully:", insertedChildren?.length)

      if (insertedChildren && insertedChildren.length > 0) {
        const parentalLeaveToInsert = insertedChildren.map((child) => ({
          user_id: userId,
          child_id: child.id,
          start_date: leaveStartDate,
          end_date: leaveEndDate,
          leave_type: "parental",
        }))

        const { error: leaveError } = await supabase.from("parental_leave").insert(parentalLeaveToInsert)

        if (leaveError) {
          console.error("[v0] Error inserting parental leave:", leaveError)
          throw new Error(`Failed to save parental leave: ${leaveError.message}`)
        }
        console.log("[v0] Parental leave inserted successfully")
      }

      if (data.user && !data.session) {
        console.log("[v0] Email confirmation required")
        setNeedsEmailConfirmation(true)
      } else if (data.session) {
        console.log("[v0] User logged in, redirecting to dashboard")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("[v0] Registration failed:", err)
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  if (needsEmailConfirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Check Your Email
          </CardTitle>
          <CardDescription>We've sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in and start using the app.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                type="text"
                autoCapitalize="words"
                autoComplete="given-name"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Andersson"
                type="text"
                autoCapitalize="words"
                autoComplete="family-name"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="john@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                disabled={isLoading}
                required
                value={country}
                onValueChange={(value) => {
                  setCountry(value)
                  setCity("") // Reset city when country changes
                }}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="norway">Norway</SelectItem>
                  <SelectItem value="sweden">Sweden</SelectItem>
                  <SelectItem value="denmark">Denmark</SelectItem>
                  <SelectItem value="finland">Finland</SelectItem>
                  <SelectItem value="iceland">Iceland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select disabled={isLoading || !country} required value={city} onValueChange={setCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder={country ? "Select city" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  {country &&
                    CITIES_BY_COUNTRY[country]?.map((cityName) => (
                      <SelectItem key={cityName} value={cityName.toLowerCase()}>
                        {cityName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Create a password (min. 6 characters)"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Children</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChild}
                disabled={isLoading}
                className="h-8 bg-transparent"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Child
              </Button>
            </div>
            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={child.id} className="flex gap-2 items-start">
                  <div className="flex-1 grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Child's name"
                      value={child.name}
                      onChange={(e) => updateChild(child.id, "name", e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <Input
                      type="date"
                      placeholder="Birth date"
                      value={child.birthDate}
                      onChange={(e) => updateChild(child.id, "birthDate", e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {children.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChild(child.id)}
                      disabled={isLoading}
                      className="h-10 w-10 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Parental Leave Period</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="leaveStartDate" className="text-sm text-muted-foreground">
                  Start Date
                </Label>
                <Input id="leaveStartDate" name="leaveStartDate" type="date" disabled={isLoading} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaveEndDate" className="text-sm text-muted-foreground">
                  End Date
                </Label>
                <Input id="leaveEndDate" name="leaveEndDate" type="date" disabled={isLoading} required />
              </div>
            </div>
          </div>

          {userExists && (
            <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                This email is already registered.{" "}
                <Link href="/login" className="font-medium underline hover:no-underline">
                  Sign in instead
                </Link>{" "}
                or{" "}
                <Link href="/forgot-password" className="font-medium underline hover:no-underline">
                  reset your password
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
