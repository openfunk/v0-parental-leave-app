import { NextResponse } from "next/server"

const WEATHER_API_KEY = "7f04a115fb5246b1bf2145558250110"
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1"

// Default location for unauthenticated users (DEV ONLY)
const DEFAULT_LOCATION = "Berlin, Germany"

export async function GET() {
  try {
    const forecastUrl = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(DEFAULT_LOCATION)}&days=2&aqi=no&alerts=no`

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
      { error: "Failed to fetch weather data." },
      { status: 500 },
    )
  }
}
