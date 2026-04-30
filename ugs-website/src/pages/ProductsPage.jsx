import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "50px" }}>
        <h1>All Products</h1>
        <p>Here you will show all your catalogue items.</p>
      </div>

      <Footer />
    </>
  );
}