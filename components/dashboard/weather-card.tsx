"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, CloudSnow, CloudDrizzle, CloudFog, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClothingRecommendations } from "./clothing-recommendations"

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
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          code: number
        }
      }
      hour: Array<{
        time: string
        temp_c: number
        condition: {
          code: number
        }
      }>
    }>
  }
  location: {
    city: string
    country: string
  }
}

// Map weather condition codes to icons
function getWeatherIcon(code: number) {
  // Sunny/Clear
  if (code === 1000) return Sun
  // Partly cloudy
  if ([1003, 1006, 1009].includes(code)) return Cloud
  // Rain
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return CloudRain
  // Drizzle
  if ([1168, 1171].includes(code)) return CloudDrizzle
  // Snow
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return CloudSnow
  // Fog/Mist
  if ([1030, 1135, 1147].includes(code)) return CloudFog
  // Default
  return Cloud
}

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        console.log("[v0] WeatherCard: Fetching weather data")
        setLoading(true)
        setError(null)

        const response = await fetch("/api/weather")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather")
        }

        const data = await response.json()
        console.log("[v0] WeatherCard: Weather data received:", JSON.stringify(data).substring(0, 300))

        if (!data.forecast || !data.forecast.forecastday || data.forecast.forecastday.length < 2) {
          throw new Error("Invalid weather data structure")
        }

        setWeatherData(data)
      } catch (err) {
        console.error("[v0] WeatherCard: Error fetching weather:", err)
        setError(err instanceof Error ? err.message : "Failed to load weather")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Plan your outdoor activities</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading weather...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Plan your outdoor activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error || "Unable to load weather data."}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const today = weatherData.forecast?.forecastday?.[0]
  const tomorrow = weatherData.forecast?.forecastday?.[1]

  if (!today || !tomorrow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Plan your outdoor activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Weather forecast data is incomplete. Please try again later.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>
            {weatherData.location.city}, {weatherData.location.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <WeatherDay
                currentTemp={weatherData.current.temp_c}
                condition={weatherData.current.condition.text}
                conditionCode={weatherData.current.condition.code}
                high={today.day.maxtemp_c}
                low={today.day.mintemp_c}
                humidity={weatherData.current.humidity}
                wind={weatherData.current.wind_kph}
                hourly={today.hour}
              />
            </TabsContent>

            <TabsContent value="tomorrow" className="space-y-4">
              <WeatherDay
                currentTemp={tomorrow.day.maxtemp_c}
                condition={tomorrow.day.condition.text}
                conditionCode={tomorrow.day.condition.code}
                high={tomorrow.day.maxtemp_c}
                low={tomorrow.day.mintemp_c}
                humidity={weatherData.current.humidity}
                wind={weatherData.current.wind_kph}
                hourly={tomorrow.hour}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Clothing Recommendations */}
      <ClothingRecommendations
        temperature={weatherData.current.temp_c}
        condition={weatherData.current.condition.text}
        conditionCode={weatherData.current.condition.code}
        windSpeed={weatherData.current.wind_kph}
      />
    </div>
  )
}

interface WeatherDayProps {
  currentTemp: number
  condition: string
  conditionCode: number
  high: number
  low: number
  humidity: number
  wind: number
  hourly: Array<{
    time: string
    temp_c: number
    condition: { code: number }
  }>
}

function WeatherDay({ currentTemp, condition, conditionCode, high, low, humidity, wind, hourly }: WeatherDayProps) {
  const Icon = getWeatherIcon(conditionCode)

  // Get hourly forecast for key times (every 4 hours)
  const keyHours = hourly.filter((_, index) => index % 4 === 0).slice(0, 5)

  return (
    <>
      {/* Current Weather */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-4xl font-semibold">{Math.round(currentTemp)}°C</p>
            <p className="text-muted-foreground">{condition}</p>
          </div>
        </div>
        <div className="text-left text-sm sm:text-right">
          <p className="text-muted-foreground">High / Low</p>
          <p className="font-medium">
            {Math.round(high)}° / {Math.round(low)}°
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-medium">{humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
            <Wind className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-medium">{Math.round(wind)} km/h</p>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="min-w-0">
        <p className="mb-3 text-sm font-medium">Hourly Forecast</p>
        <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {keyHours.map((hour, index) => {
            const HourIcon = getWeatherIcon(hour.condition.code)
            const time = new Date(hour.time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            return (
              <div
                key={index}
                className="flex min-w-[70px] flex-shrink-0 flex-col items-center gap-2 rounded-lg bg-secondary/50 p-3"
              >
                <p className="text-xs text-muted-foreground">{time}</p>
                <HourIcon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">{Math.round(hour.temp_c)}°</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
