"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog, Loader2, MapPin } from "lucide-react"
import { getWeatherDescription } from "@/lib/checklist-utils"

interface WeatherData {
  current: {
    temp_c: number
    condition: {
      text: string
      code: number
    }
    humidity: number
    wind_kph: number
  }
  location: {
    city: string
    country: string
  }
}

interface WeatherDisplayProps {
  onWeatherLoaded?: (data: { temp_c: number; conditionCode: number; wind_kph: number }) => void
}

// Map weather condition codes to icons (reused from weather-card.tsx)
function getWeatherIcon(code: number) {
  if (code === 1000) return Sun
  if ([1003, 1006, 1009].includes(code)) return Cloud
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return CloudRain
  if ([1168, 1171].includes(code)) return CloudDrizzle
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return CloudSnow
  if ([1030, 1135, 1147].includes(code)) return CloudFog
  return Cloud
}

export function WeatherDisplay({ onWeatherLoaded }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/weather/public")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather")
        }

        const data = await response.json()
        setWeatherData(data)

        // Notify parent component about weather data
        if (onWeatherLoaded) {
          onWeatherLoaded({
            temp_c: data.current.temp_c,
            conditionCode: data.current.condition.code,
            wind_kph: data.current.wind_kph,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load weather")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [onWeatherLoaded])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardContent className="py-4">
          <Alert variant="destructive">
            <AlertDescription>{error || "Unable to load weather data."}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const Icon = getWeatherIcon(weatherData.current.condition.code)
  const weatherDescription = getWeatherDescription({
    temp_c: weatherData.current.temp_c,
    conditionCode: weatherData.current.condition.code,
    wind_kph: weatherData.current.wind_kph,
  })

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-7 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{Math.round(weatherData.current.temp_c)}°C</span>
              <Badge variant="secondary" className="text-xs">
                {weatherDescription}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{weatherData.current.condition.text}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span>
                {weatherData.location.city}, {weatherData.location.country}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
