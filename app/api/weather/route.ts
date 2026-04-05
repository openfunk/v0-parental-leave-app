import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const WEATHER_API_KEY = "7f04a115fb5246b1bf2145558250110"
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userDetails, error: detailsError } = await supabase
      .from("user_details")
      .select("city, country")
      .eq("user_id", user.id)
      .single()

    if (detailsError || !userDetails) {
      return NextResponse.json(
        { error: "User location not found. Please update your profile with your city and country." },
        { status: 404 },
      )
    }

    if (!userDetails.city || userDetails.city.trim() === "") {
      return NextResponse.json(
        { error: "Please add your city in your profile to see weather information." },
        { status: 400 },
      )
    }

    const location = `${userDetails.city}, ${userDetails.country}`
    const forecastUrl = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=2&aqi=no&alerts=no`

    const forecastResponse = await fetch(forecastUrl)
    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }
    const data = await forecastResponse.json()

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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather data. Please check your location settings." },
      { status: 500 },
    )
  }
}
