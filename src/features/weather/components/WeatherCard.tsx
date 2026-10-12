import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { DEFAULT_ICON, WEATHER_ICONS } from '../../../constants/icons'
import {
  daylightProgress,
  dewPoint,
  fmtTemp,
  formatLocalDate,
  formatLocalTime,
  formatTime,
  humidityLabel,
  toCelsius,
  weatherTip,
  windCompass,
} from '../../../utils/weather'

export function WeatherCard() {
  const current = useSelector((state: RootState) => state.weather.current)
  const city = useSelector((state: RootState) => state.weather.city)
  const cityImage = useSelector((state: RootState) => state.weather.cityImage)
  const unit = useSelector((state: RootState) => state.weather.unit)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [cityImage])

  if (!current) return null

  const icon = WEATHER_ICONS[current.weather[0].main] || DEFAULT_ICON
  const tempC = toCelsius(current.main.temp)
  const feelsLikeC = toCelsius(current.main.feels_like)
  const tempMaxC = toCelsius(current.main.temp_max)
  const tempMinC = toCelsius(current.main.temp_min)
  const windSpeed = Math.round(current.wind.speed * 3.6)
  const dp = dewPoint(tempC, current.main.humidity)
  const daylight = daylightProgress(current)
  const country = current.sys.country ?? ''

  return (
    <div className="glass weather-card">
      {cityImage && !imgFailed && (
        <div className="city-img-wrap">
          <img
            className="city-img"
            src={cityImage}
            alt={`Photo of ${city}`}
            onError={() => setImgFailed(true)}
          />
          <div className="city-img-overlay"></div>
        </div>
      )}

      <div className="weather-main">
        <div className="text-start">
          <h2 className="city-name">
            <i className="fa-solid fa-location-dot me-2 text-info"></i>
            {city}
          </h2>
          <p className="city-meta mb-1">
            {country && <>{country} &bull; </>}
            {current.name}
          </p>
          <p className="city-meta mb-1">
            <i className="fa-solid fa-calendar-day me-1"></i>
            {formatLocalDate(current.dt, current.timezone)}
          </p>
          <p className="city-meta mb-0">
            <i className="fa-regular fa-clock me-1"></i>
            {formatLocalTime(current.dt, current.timezone)} local
          </p>
        </div>
        <div className="text-end">
          <i className={`${icon} weather-icon`}></i>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between flex-wrap mt-4">
        <div>
          <div className="temp">
            {fmtTemp(tempC, unit)}
            <span className="temp-unit">&deg;{unit}</span>
          </div>
          <div className="condition">{current.weather[0].description}</div>
        </div>
        <div className="feels-like">
          <i className="fa-solid fa-temperature-half me-1"></i>Feels like {fmtTemp(feelsLikeC, unit)}
          <div className="mt-1">
            <i className="fa-solid fa-arrow-up me-1 text-info"></i>
            {fmtTemp(tempMaxC, unit)}
            <i className="fa-solid fa-arrow-down ms-2 me-1 text-primary"></i>
            {fmtTemp(tempMinC, unit)}
          </div>
        </div>
      </div>

      <div className="daylight-wrap">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="fa-solid fa-sun text-warning me-2"></i>Daylight progress
          </span>
          <span className="fw-bold">{daylight}%</span>
        </div>
        <div className="daylight-bar">
          <div className="daylight-fill" style={{ width: `${daylight}%` }}></div>
        </div>
        <div className="daylight-times">
          <span>
            <i className="fa-solid fa-sunrise me-1 text-warning"></i>
            {formatTime(current.sys.sunrise)}
          </span>
          <span>
            <i className="fa-solid fa-sunset me-1 text-warning"></i>
            {formatTime(current.sys.sunset)}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <i className="fa-solid fa-droplet"></i>
          <div className="stat-value">{current.main.humidity}%</div>
          <div className="stat-label">Humidity</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-water"></i>
          <div className="stat-value">{fmtTemp(dp, unit)}</div>
          <div className="stat-label">Dew Point</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-wind"></i>
          <div className="stat-value">{windSpeed} km/h</div>
          <div className="stat-label">Wind</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-compass"></i>
          <div className="stat-value">
            {windCompass(current.wind.deg)} ({current.wind.deg}&deg;)
          </div>
          <div className="stat-label">Wind Dir</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-gauge-high"></i>
          <div className="stat-value">{Math.round(current.main.pressure)} hPa</div>
          <div className="stat-label">Pressure</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-eye"></i>
          <div className="stat-value">
            {current.visibility ? `${(current.visibility / 1000).toFixed(1)}` : 'N/A'} km
          </div>
          <div className="stat-label">Visibility</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-cloud"></i>
          <div className="stat-value">{current.clouds.all}%</div>
          <div className="stat-label">Clouds</div>
        </div>
        <div className="stat">
          <i className="fa-solid fa-droplet-slash"></i>
          <div className="stat-value">{humidityLabel(current.main.humidity)}</div>
          <div className="stat-label">Air Quality</div>
        </div>
      </div>

      <div className="tip-box">
        <i className="fa-solid fa-lightbulb"></i>
        {weatherTip(current.weather[0].main, current.weather[0].description, tempC)}
      </div>
    </div>
  )
}