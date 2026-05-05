import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* LEFT: LOGO */}
      <div className="logo">
        <img src="/logo.png" alt="UGS Logo" />
        <div>
          <h2>UGS</h2>
          <p>Unity Global Solutions</p>
        </div>
      </div>

      {/* HAMBURGER (MOBILE) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* MENU */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/#about">About Us</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="/#why-us">Why Us</a></li>
        <li><a href="/#quality">Quality</a></li>
        <li><a href="/#contact">Contact Us</a></li>
      </ul>

      {/* BUTTON */}
      <div className="nav-btn">
        <a
          href="https://wa.me/919949636274?text=Hello%20UGS%20International,%20I'm%20interested%20in%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Get in Touch</button>
        </a>
      </div>

    </nav>
  );
}