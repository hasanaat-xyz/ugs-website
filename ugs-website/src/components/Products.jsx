import jewelleryImg from "../assets/imitationjewellery.jpg";
import dryFruitsImg from "../assets/dryfruits.jpg";
import agroImg from "../assets/agroproducts.jpg";
import furnitureImg from "../assets/furniture.jpg";
import fruitsnveggies from "../assets/fruitsnveggies.jpg";
import teancoffee from "../assets/teancoffee.jpg";

import dpnbsalt from "../assets/dpnbsalt.jpg";

import cerealsnpulses from "../assets/cerealsnpulses.jpg";

export default function Products() {
  return (
    <div style={container}>
      <h1 style={heading}>Diverse Products. Premium Quality.</h1>

      <div style={grid}>
        <Card title="Imitation Jewellery" image={jewelleryImg} />
        <Card title="Dry Fruits" image={dryFruitsImg} />
        <Card title="Agro Products" image={agroImg} />
        <Card title="Furniture" image={furnitureImg} />
          <Card title="Fruits and vegetables" image={fruitsnveggies} />
            <Card title="Tea and Coffee" image={teancoffee} />

            <Card title="Dehydrated Powders and Bamboo Salt" image={dpnbsalt} />

            <Card title="Cereals and Pulses" image={cerealsnpulses} />
      </div>
    </div>
  );
}

function Card({ title, image }) {
  return (
    <div style={card}>
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
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px"
};

const card = {
  border: "1px solid #e0e0e0",
  padding: "15px",
  borderRadius: "10px",
  background: "#fff",
  transition: "0.3s",
  cursor: "pointer"
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