import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for Vercel internal routes, Next.js system files, and API routes
  if (
    path.startsWith("/_vercel") ||
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.match(/\.(ico|png|jpg|jpeg|gif|webp|svg)$/)
  ) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel analytics and internal routes)
     * - api (API routes)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|_vercel|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
