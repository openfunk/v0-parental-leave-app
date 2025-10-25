import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-2 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-semibold">P</span>
            </div>
            <span className="text-2xl font-semibold">Pappa</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Welcome back to your parental leave companion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
