"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Globe, MapPin, Phone, Edit2, Save, X, CheckCircle2, AlertCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import citiesData from "@/data/cities.json"

const CITIES_BY_COUNTRY = citiesData.cities

interface ProfileFormProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    city: string
    country: string
    phone: string
    displayName: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city,
    country: user.country,
    phone: user.phone || "",
  })

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      country: user.country,
      phone: user.phone || "",
    })
    setIsEditing(false)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        throw new Error("First name and last name are required")
      }

      if (!formData.country || !formData.city) {
        throw new Error("Country and city are required")
      }

      const supabase = createClient()

      // Update profiles table for first_name and last_name
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq("id", user.id)

      if (profileError) {
        throw new Error(`Failed to update profile: ${profileError.message}`)
      }

      // Update user_details table for city, country, and phone
      const { error: updateError } = await supabase
        .from("user_details")
        .update({
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
        })
        .eq("user_id", user.id)

      if (updateError) {
        throw new Error(`Failed to update user details: ${updateError.message}`)
      }

      setSuccess(true)
      setIsEditing(false)

      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing || isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing || isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user.email} disabled className="bg-muted" />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Select
                      disabled={isLoading}
                      required
                      value={formData.country}
                      onValueChange={(value) => {
                        setFormData({ ...formData, country: value, city: "" })
                      }}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CITIES_BY_COUNTRY).map((countryCode) => (
                          <SelectItem key={countryCode} value={countryCode.toLowerCase()}>
                            {countryCode.charAt(0).toUpperCase() + countryCode.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="country" value={formData.country} disabled className="capitalize" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Select
                      disabled={isLoading || !formData.country}
                      required
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder={formData.country ? "Select city" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.country &&
                          CITIES_BY_COUNTRY[formData.country]?.map((cityName) => (
                            <SelectItem key={cityName} value={cityName.toLowerCase()}>
                              {cityName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="city" value={formData.city} disabled className="capitalize" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing || isLoading}
                  placeholder="+47 123 45 678"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto bg-transparent">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
