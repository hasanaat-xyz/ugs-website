export default function Hero() {
  return (
    <div className="hero">

      {/* BACKGROUND IMAGE */}
      <img src="/hero-bg.jpg" alt="Hero Background" className="hero-img" />

      {/* TOP RIGHT LOGO */}
      <img src="/logo.png" alt="UGS Logo" className="hero-logo-top" />

      {/* CONTENT */}
      <div className="hero-content">
        <h1>Global Connections. Quality We Deliver.</h1>
        <p>UGS International brings premium products worldwide.</p>
      </div>

    </div>
  );
}