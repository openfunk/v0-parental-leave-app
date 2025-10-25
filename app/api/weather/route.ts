import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const WEATHER_API_KEY = "7f04a115fb5246b1bf2145558250110"
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1"

export async function GET(request: Request) {
  try {
    console.log("[v0] Weather API: Starting request")

    // Get the user's location from the database
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Weather API: No authenticated user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Weather API: User authenticated:", user.id)

    // Fetch user details to get city and country
    const { data: userDetails, error: detailsError } = await supabase
      .from("user_details")
      .select("city, country")
      .eq("user_id", user.id)
      .single()

    if (detailsError || !userDetails) {
      console.log("[v0] Weather API: No user details found")
      return NextResponse.json(
        { error: "User location not found. Please update your profile with your city and country." },
        { status: 404 },
      )
    }

    if (!userDetails.city || userDetails.city.trim() === "") {
      console.log("[v0] Weather API: City is empty")
      return NextResponse.json(
        { error: "Please add your city in your profile to see weather information." },
        { status: 400 },
      )
    }

    console.log("[v0] Weather API: User location:", userDetails.city, userDetails.country)

    const location = `${userDetails.city}, ${userDetails.country}`

    const forecastUrl = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=2&aqi=no&alerts=no`
    console.log("[v0] Weather API: Fetching weather for:", location)

    const forecastResponse = await fetch(forecastUrl)
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text()
      console.log("[v0] Weather API: Forecast fetch failed:", forecastResponse.status, errorText)
      throw new Error("Failed to fetch weather data")
    }
    const data = await forecastResponse.json()

    console.log("[v0] Weather API: Successfully fetched weather data")
    console.log("[v0] Weather API: Response structure:", JSON.stringify(data).substring(0, 200))

    return NextResponse.json({
      current: {
        temp_c: data.current.temp_c,
        condition: {
          text: data.current.condition.text,
          code: data.current.condition.code,
        },
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
      },
      forecast: {
        forecastday: data.forecast.forecastday,
      },
      location: {
        city: data.location.name,
        country: data.location.country,
      },
    })
  } catch (error) {
    console.error("[v0] Weather API: Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please check your location settings." },
      { status: 500 },
    )
  }
}
