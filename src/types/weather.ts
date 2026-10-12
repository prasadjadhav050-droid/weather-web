export type TemperatureUnit = 'C' | 'F'

export interface WeatherResponse {
  coord: { lon: number; lat: number }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: { speed: number; deg: number; gust?: number }
  clouds: { all: number }
  dt: number
  sys: {
    type?: number
    id?: number
    country?: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  clouds: { all: number }
  wind: { speed: number; deg: number; gust: number }
  visibility: number
  pop: number
  sys: { pod: string }
  dt_txt: string
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    coord: { lon: number; lat: number }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export interface Suggestion {
  city: string
  country: string
}

export interface ForecastDay {
  key: string
  min: number
  max: number
  icon: string
  desc: string
}