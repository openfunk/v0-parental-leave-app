import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

import { Inter, Geist as V0_Font_Geist, Source_Serif_4 as V0_Font_Source_Serif_4 } from "next/font/google"
import { Geist_Mono as V0_Font_Geist_Mono } from "next/font/google" // Import GeistMono

// Initialize fonts
const _geist = V0_Font_Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pappa - Parental Leave Companion",
  description: "Your companion app for parental leave in Scandinavia",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
