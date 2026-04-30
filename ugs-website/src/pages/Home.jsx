import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <div id="home">
        <Hero />
      </div>

      <div id="about">
        <section className="section">
          <h3>Our Founder</h3>
<p>
  UGS International was founded by <strong>Dr. M. Wali Khan</strong>, a
  physician-turned-entrepreneur with over a decade of experience in emergency
  and critical care medicine. His background in high-pressure environments has
  shaped his precision, leadership, and analytical approach to business.
</p>

<p>
  Today, he leads UGS International with a vision to build strong global trade
  networks, deliver quality products, and create sustainable growth
  opportunities across international markets.
</p>
        </section>
      </div>

     <div id="why-us">
  <section className="section">
    <h2>Why Choose UGS</h2>

    <div className="why-grid">
      <div className="why-card">
        <h3>Global Network</h3>
        <p>Strong sourcing and distribution channels across markets.</p>
      </div>

      <div className="why-card">
        <h3>Reliable Quality</h3>
        <p>Every product meets consistent quality standards.</p>
      </div>

      <div className="why-card">
        <h3>Transparent Deals</h3>
        <p>Clear pricing and honest business practices.</p>
      </div>

      <div className="why-card">
        <h3>Customer First</h3>
        <p>We prioritize long-term relationships over short-term gains.</p>
      </div>
    </div>

  </section>
</div>

      <div id="quality">
        <section className="section">
          <h2>Quality</h2>
          <p>
            At UGS, quality is not optional. Every product goes through strict
            checks to ensure durability, finish, and international standards.
          </p>
        </section>
      </div>

      <div id="products">
        <Products />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </>
  );
}