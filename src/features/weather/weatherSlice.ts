import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ForecastDay,
  ForecastResponse,
  Suggestion,
  TemperatureUnit,
  WeatherResponse,
} from '../../types/weather'
import { CITIES } from '../../constants/cities'
import { API_KEY, FORECAST_URL, WEATHER_URL } from '../../constants/config'
import { getCityImage, groupForecast } from '../../utils/weather'
import type { RootState } from '../../store'

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error'

interface WeatherState {
  unit: TemperatureUnit
  status: WeatherStatus
  city: string
  current: WeatherResponse | null
  forecast: ForecastDay[] | null
  cityImage: string | null
  error: string | null
  input: string
  suggestions: Suggestion[]
  activeSuggestionIndex: number
}

const initialState: WeatherState = {
  unit: 'C',
  status: 'idle',
  city: '',
  current: null,
  forecast: null,
  cityImage: null,
  error: null,
  input: '',
  suggestions: [],
  activeSuggestionIndex: -1,
}

export interface FetchWeatherPayload {
  city: string
  data: WeatherResponse
  forecast: ForecastDay[] | null
  image: string | null
}

export const fetchWeather = createAsyncThunk<
  FetchWeatherPayload,
  string,
  { rejectValue: string }
>('weather/fetchWeather', async (city, { rejectWithValue }) => {
  try {
    const [res, forecastRes] = await Promise.all([
      fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}`),
      fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&cnt=40`),
    ])

    const data = (await res.json()) as WeatherResponse

    if (data.cod !== 200) {
      return rejectWithValue(`City "${city}" not found. Please check the spelling and try again.`)
    }

    const forecastData = (await forecastRes.json()) as ForecastResponse
    const image = await getCityImage(data.name, data.sys.country ?? '')

    return {
      city,
      data,
      forecast: forecastData.cod === '200' ? groupForecast(forecastData.list) : null,
      image,
    }
  } catch (error) {
    console.error(error)
    return rejectWithValue('Network error. Please check your internet connection and try again.')
  }
})

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setUnit(state) {
      state.unit = state.unit === 'C' ? 'F' : 'C'
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload
      const query = action.payload.trim().toLowerCase()

      if (!query) {
        state.suggestions = []
        state.activeSuggestionIndex = -1
        return
      }

      let matches = CITIES.filter((c) => c.toLowerCase().startsWith(query)).slice(0, 8)
      if (!matches.length) {
        matches = CITIES.filter((c) => c.toLowerCase().includes(query)).slice(0, 8)
      }

      state.suggestions = matches.map((city) => ({ city, country: '' }))
      state.activeSuggestionIndex = -1
    },
    clearSuggestions(state) {
      state.suggestions = []
      state.activeSuggestionIndex = -1
    },
    setActiveSuggestionIndex(state, action: PayloadAction<number>) {
      state.activeSuggestionIndex = action.payload
    },
    selectSuggestion(state, action: PayloadAction<number>) {
      const suggestion = state.suggestions[action.payload]
      if (suggestion) {
        state.input = suggestion.city
        state.suggestions = []
        state.activeSuggestionIndex = -1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'success'
        state.city = action.payload.city
        state.current = action.payload.data
        state.forecast = action.payload.forecast
        state.cityImage = action.payload.image
        state.error = null
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Something went wrong. Please try again.'
      })
  },
})

export const {
  setUnit,
  setInput,
  clearSuggestions,
  setActiveSuggestionIndex,
  selectSuggestion,
} = weatherSlice.actions

export default weatherSlice.reducer

export const selectWeather = (state: RootState) => state.weather