export function LoadingCard() {
  return (
    <div className="glass loading-wrap">
      <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div>
      <p className="loading-text">Fetching live weather data...</p>
    </div>
  )
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="glass error-card">
      <i className="fa-solid fa-triangle-exclamation"></i>
      <h4>Oops!</h4>
      <p className="mb-0">{message}</p>
    </div>
  )
}