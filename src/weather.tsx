import { useSelector } from 'react-redux'
import type { RootState } from './store'
import SearchBox from './features/weather/components/SearchBox'
import { WeatherCard } from './features/weather/components/WeatherCard'
import { ForecastCard } from './features/weather/components/ForecastCard'
import { ErrorCard, LoadingCard } from './features/weather/components/StatusCards'
import { Footer, Header } from './features/weather/components/HeaderFooter'

function WeatherContent() {
  const status = useSelector((state: RootState) => state.weather.status)
  const error = useSelector((state: RootState) => state.weather.error)

  if (status === 'loading') return <LoadingCard />
  if (status === 'error') return <ErrorCard message={error ?? 'Something went wrong. Please try again.'} />
  if (status === 'success') {
    return (
      <>
        <WeatherCard />
        <ForecastCard />
      </>
    )
  }
  return null
}

export default function Weather() {
  const status = useSelector((state: RootState) => state.weather.status)

  return (
    <>
      <Header />

      <section className="container">
        <SearchBox />
        {status === 'idle' && (
          <p className="default-hint">
            <i className="fa-solid fa-arrow-up me-1"></i>Type a city and press Search or Enter
          </p>
        )}
      </section>

      <section className="container">
        <WeatherContent />
      </section>

      <Footer />
    </>
  )
}