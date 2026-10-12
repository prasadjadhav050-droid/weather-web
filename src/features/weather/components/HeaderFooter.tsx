export function Header() {
  return (
    <section className="hero container">
      <div className="brand-icon">
        <i className="fa-solid fa-cloud-sun"></i>
      </div>
      <h1 className="brand-title">SkyCast</h1>
      <p className="brand-sub">Real-time weather for any city in the world</p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <i className="fa-regular fa-copyright"></i> 2026 SkyCast &mdash; Powered by OpenWeatherMap API
    </footer>
  )
}