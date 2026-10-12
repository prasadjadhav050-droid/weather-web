import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { fmtTemp } from '../../../utils/weather'

export function ForecastCard() {
  const forecast = useSelector((state: RootState) => state.weather.forecast)
  const unit = useSelector((state: RootState) => state.weather.unit)

  if (!forecast) return null

  return (
    <div className="glass forecast-wrap">
      <div className="forecast-title">
        <i className="fa-solid fa-calendar-week me-2 text-info"></i>5-Day Forecast
      </div>
      <div className="forecast-grid">
        {forecast.map((day) => (
          <div className="forecast-day" key={day.key}>
            <div className="day-label">{day.key}</div>
            <div className="day-icon">
              <i className={day.icon}></i>
            </div>
            <div className="day-desc">{day.desc}</div>
            <div className="day-temps">
              <span className="day-max">{fmtTemp(day.max, unit)}</span>
              &nbsp;/&nbsp;
              <span className="day-min">{fmtTemp(day.min, unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}