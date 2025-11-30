import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
    API.get(`/products/${id}/similar`).then((res) => setSimilar(res.data));
  }, [id]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="ts-main">
      <h1>{product.name}</h1>

      <img
        src={
          product.images?.[0]?.url ||
          "https://via.placeholder.com/600x400?text=Producto"
        }
        alt={product.name}
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      />

      <p>{product.description}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Categoría:</strong> {product.category}</p>

      <hr style={{ margin: "40px 0" }} />

      {/* SIMILARES */}
      <h2>Productos similares</h2>

      {similar.length === 0 && <p>No hay productos similares.</p>}

      <div className="ts-product-grid">
        {similar.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
