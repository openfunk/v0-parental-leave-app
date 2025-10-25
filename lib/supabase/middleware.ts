import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables in middleware")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error && error.message !== "Auth session missing!") {
      console.error("[v0] Error getting user in middleware:", error.message)
    }

    const isPublicPath =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/forgot-password") ||
      request.nextUrl.pathname.startsWith("/reset-password") ||
      request.nextUrl.pathname.startsWith("/auth") ||
      request.nextUrl.pathname === "/"

    if (user && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register"))) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    if (!user && !isPublicPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware error:", error instanceof Error ? error.message : "Unknown error")
    return supabaseResponse
  }
}
