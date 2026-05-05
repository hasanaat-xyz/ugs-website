import { useState } from "react";

import jewelleryImg from "../assets/imitationjewellery.jpg";
import dryFruitsImg from "../assets/dryfruits.jpg";
import agroImg from "../assets/agroproducts.jpg";
import furnitureImg from "../assets/furniture.jpg";
import fruitsnveggies from "../assets/fruitsnveggies.jpg";
import teancoffee from "../assets/teancoffee.jpg";
import dpnbsalt from "../assets/dpnbsalt.jpg";
import multani from "../assets/multani.jpg";
import cerealsnpulses from "../assets/cerealsnpulses.jpg";

export default function Products() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleClick = (image, title) => {
    setSelectedImage(image);
    setSelectedTitle(title);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedTitle("");
  };

  return (
    <div style={container}>
      <h1 style={heading}>Diverse Products. Premium Quality.</h1>

      <div style={grid}>
        <Card title="Imitation Jewellery" image={jewelleryImg} onClick={handleClick} />
        <Card title="Dry Fruits" image={dryFruitsImg} onClick={handleClick} />
        <Card title="Agro Products" image={agroImg} onClick={handleClick} />
        <Card title="Furniture" image={furnitureImg} onClick={handleClick} />
        <Card title="Fruits and Vegetables" image={fruitsnveggies} onClick={handleClick} />
        <Card title="Tea and Coffee" image={teancoffee} onClick={handleClick} />
        <Card title="Dehydrated Powders & Bamboo Salt" image={dpnbsalt} onClick={handleClick} />
        <Card title="Cereals and Pulses" image={cerealsnpulses} onClick={handleClick} />
        <Card title="Herbal Powders, Multani Mitthi & Essential Oils" image={multani} onClick={handleClick} />
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={closeBtn} onClick={closeModal}>×</span>
            <img src={selectedImage} alt={selectedTitle} style={modalImage} />
            <h2 style={{ color: "#0f2f57", marginTop: "15px" }}>{selectedTitle}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, image, onClick }) {
  return (
    <div style={card} onClick={() => onClick(image, title)}>
      <div style={imageContainer}>
        <img src={image} alt={title} style={imgStyle} />
      </div>
      <h3 style={titleStyle}>{title}</h3>
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  padding: "50px",
  textAlign: "center"
};

const heading = {
  color: "#0f2f57",
  marginBottom: "30px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px"
};

const card = {
  border: "1px solid #e0e0e0",
  padding: "15px",
  borderRadius: "10px",
  background: "#fff",
  transition: "0.3s",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const imageContainer = {
  height: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f5f5f5",
  borderRadius: "8px"
};

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain"
};

const titleStyle = {
  color: "#0f2f57",
  marginTop: "12px",
  fontWeight: "600",
  letterSpacing: "0.5px"
};

/* ---------- MODAL STYLES ---------- */

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalContent = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "90%",
  maxHeight: "90%",
  textAlign: "center",
  position: "relative"
};

const modalImage = {
  maxWidth: "100%",
  maxHeight: "70vh",
  borderRadius: "10px"
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "28px",
  cursor: "pointer",
  color: "#333"
};