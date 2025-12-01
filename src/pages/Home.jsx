import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="ts-main">
      {/* Bloque Hero con la nueva clase para estilos */}
      <div className="ts-hero-banner">
        {/* Etiqueta de Oferta con degradado */}
        <div className="ts-offer-tag">
          <span className="ts-dot"></span>
          Ofertas especiales hasta **20% OFF**
        </div>

        {/* Título Principal */}
        <h1 className="ts-hero-title">
          La mejor tecnología <span className="ts-gradient-text">al mejor precio</span>
        </h1>

        {/* Descripción */}
        <p className="ts-hero-description">
          Descubre nuestra selección premium de PCs Gaming, Laptops de última
          generación y Smartphones de de lo mejor. Calidad garantizada y envío
          rápido.
        </p>
      </div>

      <h2 className="ts-section-header">Productos</h2>

      <div className="ts-product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}