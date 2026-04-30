import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaWhatsapp
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <div style={styles.footer} id="contact">
      {/* LEFT */}
      <div>
        <h3>UGS International</h3>
        <p>Unity Global Solutions</p>
      </div>

      {/* CENTER */}
      <div>
        <p>+91 9949636274</p>
        <p>mwk@ugsinternational.com</p>
      </div>

      {/* RIGHT - SOCIAL MEDIA */}
      <div style={styles.socialContainer}>
        <h4>Connect With Us</h4>
        <div style={styles.icons}>
          
          <a href="https://www.linkedin.com/company/ugsinternational/?viewAsMember=true" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaLinkedin />
          </a>

          <a href="https://instagram.com/ugs_international/" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaInstagram />
          </a>

          <a href="https://facebook.com/profile.php?id=61573235087110&sk=about" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaFacebook />
          </a>

          <a href="https://twitter.com/ugsworldwide" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaXTwitter />
          </a>

          <a href="https://pinterest.com/ugsinternational1/" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaPinterest />
          </a>

          <a href="https://wa.me/919949636274?text=Hello%20UGS%20International,%20I%20am%20interested%20in%20your%20products" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaWhatsapp />
          </a>

        </div>
      </div>
    </div>
  );
}

const styles = {
  footer: {
    background: "#0b2c4d",
    color: "white",
    padding: "30px 60px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },

socialContainer: {
  textAlign: "left",
  marginRight: "60px"   // 👈 adjust this value
},

  icons: {
    display: "flex",
    gap: "18px",
    marginTop: "10px",
    fontSize: "22px"
  },

  iconLink: {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};