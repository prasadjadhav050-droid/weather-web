import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { KeyboardEvent } from 'react'
import type { AppDispatch, RootState } from '../../../store'
import {
  clearSuggestions,
  fetchWeather,
  selectSuggestion,
  setActiveSuggestionIndex,
  setInput,
  setUnit,
} from '../weatherSlice'

export default function SearchBox() {
  const dispatch = useDispatch<AppDispatch>()
  const input = useSelector((state: RootState) => state.weather.input)
  const suggestions = useSelector((state: RootState) => state.weather.suggestions)
  const activeSuggestionIndex = useSelector((state: RootState) => state.weather.activeSuggestionIndex)
  const unit = useSelector((state: RootState) => state.weather.unit)
  const loading = useSelector((state: RootState) => state.weather.status === 'loading')
  const containerRef = useRef<HTMLDivElement>(null)

  const search = () => {
    const city = input.trim()
    if (!city) return
    dispatch(clearSuggestions())
    dispatch(fetchWeather(city))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        dispatch(clearSuggestions())
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dispatch])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && suggestions.length && activeSuggestionIndex >= 0) {
      event.preventDefault()
      const city = suggestions[activeSuggestionIndex].city
      dispatch(selectSuggestion(activeSuggestionIndex))
      dispatch(fetchWeather(city))
      return
    }

    if (!suggestions.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      dispatch(setActiveSuggestionIndex(Math.min(activeSuggestionIndex + 1, suggestions.length - 1)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      dispatch(setActiveSuggestionIndex(Math.max(activeSuggestionIndex - 1, 0)))
    } else if (event.key === 'Escape') {
      dispatch(clearSuggestions())
    }
  }

  return (
    <div className="search-box" ref={containerRef}>
      <div className="d-flex gap-2">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name e.g. Karachi, London, Tokyo..."
          autoComplete="off"
          value={input}
          onChange={(e) => dispatch(setInput(e.target.value))}
          onKeyDown={handleKeyDown}
        />
        <button className="btn search-btn text-white" onClick={search} disabled={loading}>
          <i className="fa-solid fa-magnifying-glass me-2"></i>Search
        </button>
        <button
          className="btn unit-btn"
          onClick={() => dispatch(setUnit())}
          title="Switch temperature unit"
        >
          <span className={unit === 'C' ? 'active-unit' : ''}>&deg;C</span> /{' '}
          <span className={unit === 'F' ? 'active-unit' : ''}>&deg;F</span>
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions-container active">
          {suggestions.map((item, i) => (
            <div
              key={`${item.city}-${i}`}
              className={`suggestion-item ${i === activeSuggestionIndex ? 'active' : ''}`}
              onMouseEnter={() => dispatch(setActiveSuggestionIndex(i))}
              onClick={() => {
                const city = item.city
                dispatch(selectSuggestion(i))
                dispatch(fetchWeather(city))
              }}
            >
              <i className="fa-solid fa-location-dot"></i>
              <span className="suggestion-city">{item.city}</span>
              {item.country && <span className="suggestion-country">{item.country}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}