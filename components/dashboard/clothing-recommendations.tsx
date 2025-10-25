"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Wind, Sun, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import clothingRulesData from "@/data/clothing-rules.json"

interface ClothingRecommendationsProps {
  temperature: number
  condition: string
  conditionCode: number
  windSpeed: number
}

interface ClothingItem {
  icon: React.ElementType
  label: string
  items: string[]
}

function getClothingRecommendations(
  temp: number,
  conditionCode: number,
  windSpeed: number,
): { layers: ClothingItem[]; accessories: ClothingItem; tips: string[] } {
  const recommendations: { layers: ClothingItem[]; accessories: ClothingItem; tips: string[] } = {
    layers: [],
    accessories: { icon: Shirt, label: "Accessories", items: [] },
    tips: [],
  }

  // Icon mapping for layers
  const iconMap: Record<string, React.ElementType> = {
    "Base Layer": Shirt,
    "Mid Layer": Shirt,
    "Outer Layer": Wind,
    "Light Clothing": Sun,
    "Minimal Clothing": Sun,
  }

  // Determine temperature range
  let tempRange: keyof typeof clothingRulesData.temperatureRanges
  if (temp < 0) {
    tempRange = "veryCold"
  } else if (temp < 10) {
    tempRange = "cold"
  } else if (temp < 20) {
    tempRange = "mild"
  } else if (temp < 25) {
    tempRange = "warm"
  } else {
    tempRange = "hot"
  }

  const tempRules = clothingRulesData.temperatureRanges[tempRange]

  // Add layers from JSON data
  recommendations.layers = tempRules.layers.map((layer) => ({
    icon: iconMap[layer.label] || Shirt,
    label: layer.label,
    items: layer.items,
  }))

  // Add accessories
  recommendations.accessories.items = [...tempRules.accessories]

  // Add tips
  recommendations.tips = [...tempRules.tips]

  // Weather condition adjustments from JSON
  const weatherConditions = clothingRulesData.weatherConditions

  // Check for rain
  if (weatherConditions.rain.conditionCodes.includes(conditionCode)) {
    recommendations.accessories.items.push(...weatherConditions.rain.accessories)
    recommendations.tips.push(...weatherConditions.rain.tips)
  }

  // Check for snow
  if (weatherConditions.snow.conditionCodes.includes(conditionCode)) {
    recommendations.accessories.items.push(...weatherConditions.snow.accessories)
    recommendations.tips.push(...weatherConditions.snow.tips)
  }

  // Check for windy conditions
  if (windSpeed > weatherConditions.windy.windSpeedThreshold) {
    recommendations.accessories.items.push(...weatherConditions.windy.accessories)
    recommendations.tips.push(...weatherConditions.windy.tips)
  }

  return recommendations
}

export function ClothingRecommendations({
  temperature,
  condition,
  conditionCode,
  windSpeed,
}: ClothingRecommendationsProps) {
  const recommendations = getClothingRecommendations(temperature, conditionCode, windSpeed)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">What to Dress Baby In</span>
        </CardTitle>
        <CardDescription>
          Recommendations for {Math.round(temperature)}°C, {condition.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 space-y-6">
        {/* Layers */}
        <div className="space-y-4">
          {recommendations.layers.map((layer, index) => {
            const Icon = layer.icon
            return (
              <div key={index} className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">{layer.label}</h3>
                </div>
                <ul className="ml-10 space-y-1">
                  {layer.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Accessories */}
        {recommendations.accessories.items.length > 0 && (
          <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2">
              <Shirt className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{recommendations.accessories.label}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.accessories.items.map((item, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {recommendations.tips.length > 0 && (
          <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Tips</h3>
            </div>
            <ul className="space-y-1">
              {recommendations.tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
