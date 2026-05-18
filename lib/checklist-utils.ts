import checklistCategoriesData from "@/data/checklist-categories.json"
import weatherChecklistData from "@/data/weather-checklist-items.json"

// Types
export interface ChecklistItem {
  id: string
  label: string
}

export interface ChecklistCategory {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface WeatherItemCondition {
  minTemp?: number
  maxTemp?: number
  codes?: number[]
  minWind?: number
}

export interface WeatherChecklistItem extends ChecklistItem {
  conditions: WeatherItemCondition
}

export interface WeatherData {
  temp_c: number
  conditionCode: number
  wind_kph: number
}

// Get fixed categories from JSON
export function getChecklistCategories(): ChecklistCategory[] {
  return checklistCategoriesData.categories
}

// Get all weather items from JSON
export function getAllWeatherItems(): WeatherChecklistItem[] {
  return weatherChecklistData.weatherItems
}

// Filter weather items based on current conditions
export function getWeatherItems(weather: WeatherData): ChecklistItem[] {
  const allWeatherItems = getAllWeatherItems()
  
  return allWeatherItems.filter((item) => {
    const { conditions } = item
    
    // Check temperature conditions
    if (conditions.minTemp !== undefined && weather.temp_c < conditions.minTemp) {
      return false
    }
    if (conditions.maxTemp !== undefined && weather.temp_c > conditions.maxTemp) {
      return false
    }
    
    // Check wind conditions
    if (conditions.minWind !== undefined && weather.wind_kph < conditions.minWind) {
      return false
    }
    
    // Check weather codes - if codes are specified, at least one must match
    if (conditions.codes && conditions.codes.length > 0) {
      if (!conditions.codes.includes(weather.conditionCode)) {
        return false
      }
    }
    
    return true
  }).map(({ id, label }) => ({ id, label }))
}

// Get weather condition description for display
export function getWeatherDescription(weather: WeatherData): string {
  const temp = weather.temp_c
  
  if (temp < 0) return "Very Cold"
  if (temp < 10) return "Cold"
  if (temp < 15) return "Cool"
  if (temp < 20) return "Mild"
  if (temp < 25) return "Warm"
  return "Hot"
}
