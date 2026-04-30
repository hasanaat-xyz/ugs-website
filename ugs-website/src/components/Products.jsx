import jewelleryImg from "../assets/imitationjewellery.jpg";
import dryFruitsImg from "../assets/dryfruits.jpg";
import agroImg from "../assets/agroproducts.jpg";
import furnitureImg from "../assets/furniture.jpg";

export default function Products() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Diverse Products. Premium Quality.</h2>

      <div style={grid}>
        <Card title="Imitation Jewellery" image={jewelleryImg} />
<Card title="Dry Fruits" image={dryFruitsImg} />
<Card title="Agro Products" image={agroImg} />
<Card title="Furniture" image={furnitureImg} />
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
      <h3>{title}</h3>
    </div>
  );
}
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "20px"
};

const card = {
  border: "1px solid #ccc",
  padding: "10px"
};
const imageContainer = {
  height: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f5f5f5"
};

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain"
};