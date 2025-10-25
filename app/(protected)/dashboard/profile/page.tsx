import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userDetails } = await supabase.from("user_details").select("*").eq("user_id", user.id).single()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  console.log("[v0] Profile page - User data:", {
    userId: user.id,
    email: user.email,
    userDetails,
    profile,
  })

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <ProfileForm
        user={{
          id: user.id,
          email: user.email || "",
          firstName: userDetails?.first_name || "",
          lastName: userDetails?.last_name || "",
          city: userDetails?.city || "",
          country: userDetails?.country || "",
          phone: userDetails?.phone || "",
          displayName: profile?.display_name || "",
        }}
      />
    </div>
  )
}
