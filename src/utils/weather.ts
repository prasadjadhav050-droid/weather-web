import type { ForecastDay, ForecastItem, TemperatureUnit, WeatherResponse } from '../types/weather'
import { DEFAULT_ICON, WEATHER_ICONS } from '../constants/icons'
import { WIKIMEDIA_URL } from '../constants/config'

export const toCelsius = (kelvin: number): number => Math.round(kelvin - 273.15)

export const toFahrenheit = (celsius: number): number => Math.round((celsius * 9) / 5 + 32)

export const fmtTemp = (celsius: number, unit: TemperatureUnit): string =>
  unit === 'C' ? `${Math.round(celsius)}°` : `${toFahrenheit(celsius)}°`

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatLocalTime = (dt: number, timezoneOffset: number): string => {
  const date = new Date((dt + timezoneOffset) * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

export const formatLocalDate = (dt: number, timezoneOffset: number): string => {
  const date = new Date((dt + timezoneOffset) * 1000)
  return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
}

export const windCompass = (deg: number): string => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

export const dewPoint = (celsius: number, humidity: number): number => {
  const a = 17.62
  const b = 243.12
  const gamma = Math.log(humidity / 100) + (a * celsius) / (b + celsius)
  return (b * gamma) / (a - gamma)
}

export const humidityLabel = (humidity: number): string => {
  if (humidity < 30) return 'Dry'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Humid'
  return 'Very humid'
}

export const daylightProgress = (data: WeatherResponse): number => {
  const dayLen = data.sys.sunset - data.sys.sunrise
  const elapsed = data.dt - data.sys.sunrise
  return Math.min(100, Math.max(0, Math.round((elapsed / dayLen) * 100)))
}

export const weatherTip = (main: string, desc: string, temp: number): string => {
  const text = `${main} ${desc}`.toLowerCase()
  if (text.includes('thunder')) return 'Thunderstorms expected — stay indoors and away from windows'
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower'))
    return 'Rain expected — carry an umbrella'
  if (text.includes('snow')) return 'Snowfall expected — drive carefully and wear warm layers'
  if (temp >= 38) return 'Extreme heat — stay indoors, keep hydrated, avoid sun exposure'
  if (temp >= 32) return 'Very hot — stay hydrated and avoid direct sun at noon'
  if (temp <= 0) return 'Freezing — bundle up and beware of icy surfaces'
  if (temp <= 5) return 'Cold — bundle up with warm layers'
  if (text.includes('fog') || text.includes('mist') || text.includes('haze'))
    return 'Low visibility — drive with caution'
  if (text.includes('clear')) return 'Clear skies — perfect day to go outside'
  return 'Weather looks steady — enjoy your day'
}

export const groupForecast = (list: ForecastItem[]): ForecastDay[] => {
  const days: Record<string, ForecastDay> = {}
  for (const item of list) {
    const date = new Date(item.dt * 1000)
    const key = date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
    if (!days[key]) {
      days[key] = {
        key,
        min: item.main.temp,
        max: item.main.temp,
        icon: WEATHER_ICONS[item.weather[0].main] || DEFAULT_ICON,
        desc: item.weather[0].description,
      }
    } else {
      days[key].min = Math.min(days[key].min, item.main.temp)
      days[key].max = Math.max(days[key].max, item.main.temp)
    }
  }
  return Object.values(days).slice(0, 5)
}

export const getCityImage = async (city: string, country: string): Promise<string | null> => {
  const query = `${city}${country ? `, ${country}` : ''}`
  const url = `${WIKIMEDIA_URL}?action=query&generator=search&gsrsearch=${encodeURIComponent(
    query,
  )}&gsrnamespace=6&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=900&format=json&origin=*`
  try {
    const res = await fetch(url)
    const data = (await res.json()) as {
      query?: {
        pages?: Record<string, { thumbnail?: { source?: string } }>
      }
    }
    const pages = data.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch (e) {
    console.warn('Could not load city image:', e)
    return null
  }
}