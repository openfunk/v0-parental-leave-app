"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    try {
      const supabase = createClient()

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err) {
      console.error("Password reset failed:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link. Please check your email and follow the instructions to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
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
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
