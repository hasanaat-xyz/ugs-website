import { useState } from "react";
import "./App.css";

const OWNER_WHATSAPP = "919700006910";

const flavours = [
 {
  name: "Mango",
  image: "https://bakewithshivesh.com/wp-content/uploads/2022/05/IMG_9512-scaled.jpg",
  description: "Creamy mango goodness made for summer.",
},
  {
    name: "Vanilla",
    image:
      "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600",
    description: "Classic, creamy and timeless.",
  },
{
  name: "Butterscotch",
image: "/images/butterscotch.jpg",
  description: "Creamy butterscotch with a delightful caramel crunch.",
},
{
  name: "Chocolate",
  image: "https://i2.wp.com/beyondsweetandsavory.com/wp-content/uploads/2019/07/Earl-grey-chocolate-ice-cream-final-Vy-Tran-1-of-5-843x1280.jpg?fit=610%2C927&ssl=1",
  description: "Rich, creamy chocolate indulgence.",
},
{
  name: "Strawberry",
  image: "https://goodthingsbaking.com/wp-content/uploads/2022/05/strawberry-ice-cream-recipe-13-683x1024.jpg",
  description: "Sweet, fruity and refreshing.",
},
  {
  name: "Pista",
  image: "/images/pista.jpg",
  description: "Rich, creamy pistachio with a nutty twist.",
},
];

const premiumFlavours = [
 {
  name: "Litchi",
  image: "/images/litchi.jpg",
  description: "Delicate, creamy and refreshing.",
},
  {
    name: "Real Mango",
    image: "/images/mango.jpg",
    description: "Made for true mango lovers.",
  },
    {
    name: "Blackcurrant",
    image: "https://leelalicious.com/wp-content/uploads/2016/11/Black-Currant-Ice-Cream.jpg",
    description: "A burst of rich, tangy berry goodness.",
  },
];

const orderOnWhatsApp = (message) => {
  const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};

function App()
 {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="website">

     <nav className="navbar">
 <a href="#home" className="logo">
  HIFI
  <small>ICECREAM</small>
</a>

  <div className={`nav-links ${menuOpen ? "menu-open" : ""}`}>
    <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
    <a href="#flavours" onClick={() => setMenuOpen(false)}>Flavours</a>
    <a href="#premium" onClick={() => setMenuOpen(false)}>Premium</a>
    <a href="#party" onClick={() => setMenuOpen(false)}>Party Orders</a>
    <a href="#location" onClick={() => setMenuOpen(false)}>Location</a>
  </div>

  <button
    className="nav-button"
    onClick={() =>
      orderOnWhatsApp("Hello HIFI Icecream! I would like to place an order.")
    }
  >
    Order Now ↗
  </button>

  <button
    className="menu-toggle"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Toggle navigation menu"
    aria-expanded={menuOpen}
  >
    {menuOpen ? "✕" : "☰"}
  </button>
</nav>

     {/* HERO SECTION */}
<section className="hero" id="home">
  <div className="hero-overlay"></div>

  <div className="hero-art">
    <p className="hero-art-label">
      Choose Your Favorite
      <span>ICE CREAM FLAVOURS</span>
    </p>

    <div className="hero-scoop scoop-strawberry">
      <img
        src="https://goodthingsbaking.com/wp-content/uploads/2022/05/strawberry-ice-cream-recipe-13-683x1024.jpg"
        alt="Strawberry ice cream"
      />
    </div>

    <div className="hero-scoop scoop-chocolate">
      <img
        src="https://i2.wp.com/beyondsweetandsavory.com/wp-content/uploads/2019/07/Earl-grey-chocolate-ice-cream-final-Vy-Tran-1-of-5-843x1280.jpg?fit=610%2C927&ssl=1"
        alt="Chocolate ice cream"
      />
    </div>

    <div className="hero-scoop scoop-pista">
      <img
        src="/images/pista.jpg"
        alt="Pistachio ice cream"
      />
    </div>
  </div>

  <div className="hero-content">
    <p className="eyebrow">A LITTLE SCOOP OF HAPPINESS</p>

    <h1>
      ICE CREAM
      <br />
      <span>SHOP.</span>
    </h1>

    <h3 className="hero-subheading">HAPPINESS IN EVERY SCOOP</h3>

    <p className="hero-description">
      Life is sweeter with HIFI! Discover our delicious
      collection of classic and premium ice cream flavours.
      Find your favourite scoop and make every moment special.
    </p>

    <div className="hero-buttons">
      <a href="#flavours" className="primary-button">
        Explore Flavours →
      </a>

      <button
        className="secondary-button"
        onClick={() =>
          orderOnWhatsApp(
            "Hello! I want to order ice cream from HIFI."
          )
        }
      >
        Order on WhatsApp ↗
      </button>
    </div>

    <div className="hero-location">
      📍 Asif Nagar, Hyderabad
    </div>
  </div>
</section>

      {/* INTRODUCTION */}
      <section className="intro">
        <p className="eyebrow">WELCOME TO HIFI</p>

        <h2>
          Every scoop tells
          <br />
          <span>a sweeter story.</span>
        </h2>

        <p>
          From timeless classics to irresistible premium flavours,
          there's something special waiting for everyone.
          Come, discover your next favourite scoop!
        </p>
      </section>

      {/* REGULAR FLAVOURS */}
      <section className="flavours-section" id="flavours">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MADE TO MAKE YOU SMILE</p>
            <h2>Our Flavours</h2>
          </div>

          <p className="section-subtitle">
            Which flavour are you craving today?
          </p>
        </div>

        <div className="flavour-grid">
          {flavours.map((flavour, index) => (
            <div className="flavour-card" key={flavour.name}>
              <div className="flavour-image">
                <img src={flavour.image} alt={flavour.name} />
                <span className="flavour-number">
                  0{index + 1}
                </span>
              </div>

              <div className="flavour-info">
                <div>
                  <h3>{flavour.name}</h3>
                  <p>{flavour.description}</p>
                </div>

                <button
                  className="plus-button"
                  aria-label={`Order ${flavour.name}`}
                  onClick={() =>
                    orderOnWhatsApp(
                      `Hello HIFI Icecream! I would like to order ${flavour.name} ice cream.`
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREMIUM COLLECTION */}
<section className="premium-section" id="premium">
  <div className="premium-heading">
    <p className="eyebrow">A LITTLE EXTRA MAGIC</p>
    <h2>
      The Premium
      <br />
      <span>Collection :)</span>
    </h2>
    <p>
      For those moments when ordinary just isn't enough.
    </p>
  </div>

  <div className="premium-grid">
    {premiumFlavours.map((flavour) => (
      <div className="premium-card" key={flavour.name}>

        <div className="premium-image-circle">
          <img src={flavour.image} alt={flavour.name} />
        </div>

        <div className="premium-card-content">
          <span className="premium-label">✦ PREMIUM</span>

          <h3>{flavour.name}</h3>

          <p>{flavour.description}</p>

          <button
            onClick={() =>
              orderOnWhatsApp(
                `Hello HIFI Icecream! I would like to order ${flavour.name}.`
              )
            }
          >
            Order This Flavour ↗
          </button>
        </div>

      </div>
    ))}
  </div>
</section>

     <section className="party-section" id="party">
  <div className="party-content">
    <p className="eyebrow">CELEBRATE WITH HIFI</p>

    <h2>
      Make your celebrations
      <br />
      <span>a little sweeter.</span>
    </h2>

    <p>
      Birthday parties, family gatherings, weddings
      or special occasions - make every celebration
      unforgettable with HIFI Icecream!
    </p>

    <button
      className="party-button"
      onClick={() =>
        orderOnWhatsApp(
          "Hello HIFI Icecream! I am interested in placing a bulk/party order. Please share the details."
        )
      }
    >
      Enquire for Party Orders ↗
    </button>
  </div>

  <div className="party-image">
    <img
      src="/images/icecream.jpg"
      alt="Delicious ice cream"
    />
  </div>
</section>

      {/* LOCATION */}
      <section className="location-section" id="location">
        <p className="eyebrow">COME SAY HELLO</p>

        <h2>Find Your Happy Place.</h2>

        <p className="location-address">
          HIFI Icecream
          <br />
          Natraj Nagar, Asif Nagar Road,
          <br />
          Asif Nagar, Hyderabad – 500028,
          <br />
          Telangana, India.
        </p>

        <a
          className="location-button"
          href="https://www.google.com/maps/search/?api=1&query=HIFI+Icecream+Natraj+Nagar+Asif+Nagar+Road+Hyderabad+500028+Telangana"
          target="_blank"
          rel="noopener noreferrer"
        >
          📍 Get Directions on Google Maps ↗
        </a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <a href="#home" className="footer-logo">
            HIFI
          </a>
          <p>Life is sweeter with HIFI.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#flavours">Flavours</a>
          <a href="#premium">Premium</a>
          <a href="#party">Party Orders</a>
        </div>

        <div className="footer-contact">
          <p>Made with ♥ for ice cream lovers.</p>
          <p>Asif Nagar, Hyderabad.</p>
        </div>

        <div className="copyright">
          © 2026 HIFI Icecream. All rights reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <button
        className="whatsapp-float"
        onClick={() =>
          orderOnWhatsApp("Hello HIFI Icecream! I would like to know more.")
        }
        aria-label="Contact HIFI Icecream on WhatsApp"
      >
        ☎
      </button>

    </div>
  );
}

export default App;