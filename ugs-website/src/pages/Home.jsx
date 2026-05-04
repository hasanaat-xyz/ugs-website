import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Footer from "../components/Footer";
import {
  FaCode,
  FaPaintBrush,
  FaBullhorn,
  FaTruck,
  FaShippingFast,
  FaFileInvoiceDollar
} from "react-icons/fa";
export default function Home() {
  return (
    <>
      <Navbar />

      <div id="home">
        <Hero />
      </div>

     <div id="about">
  <section className="section founder-section">
    
    <div className="founder-container">
      
      {/* LEFT SIDE - TEXT */}
      <div className="founder-text">
        <h1>Our Founder</h1>

        <p>
          UGS International was founded by <strong>Dr. M. Wali Khan</strong>, a
          physician-turned-entrepreneur with over a decade of experience in emergency
          and critical care medicine.
        </p>

        <p>
          His background in high-pressure environments has shaped his precision,
          leadership, and analytical approach to business.
        </p>

        <p>
          Today, he leads UGS International with a vision to build strong global trade
          networks, deliver quality products, and create sustainable growth
          opportunities across international markets.
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="founder-image">
        <img src="/founder.jpg" alt="Founder" />
      </div>

    </div>
<div id="team" className="team-section-dark">
  <section className="section">
    
    <h2 className="team-title">Our Team</h2>

    <div className="team-grid">
      
      <div className="team-card">
        <FaCode className="team-icon" />
        <h3>Software Engineers</h3>
        <p>
          Building and maintaining digital systems that streamline operations,
          communication, and global trade efficiency.
        </p>
      </div>

      <div className="team-card">
        <FaPaintBrush className="team-icon" />
        <h3>UI/UX Experts</h3>
        <p>
          Designing intuitive and user-friendly experiences that enhance
          customer interaction and brand presence.
        </p>
      </div>

      <div className="team-card">
        <FaBullhorn className="team-icon" />
        <h3>Marketing Lead</h3>
        <p>
          Driving brand growth through strategic campaigns, global outreach,
          and market positioning.
        </p>
      </div>

      <div className="team-card">
        <FaTruck className="team-icon" />
        <h3>Logistics & Supply Management</h3>
        <p>
          Managing end-to-end supply chain operations to ensure timely and
          efficient delivery worldwide.
        </p>
      </div>

      <div className="team-card">
        <FaShippingFast className="team-icon" />
        <h3>Freight Management Services</h3>
        <p>
          Handling international freight operations with reliability,
          cost-efficiency, and precision.
        </p>
      </div>

      <div className="team-card">
        <FaFileInvoiceDollar className="team-icon" />
        <h3>Custom Agent (CHA)</h3>
        <p>
          Ensuring smooth customs clearance processes and compliance with
          international trade regulations.
        </p>
      </div>
    </div>

  </section>
    </div>

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