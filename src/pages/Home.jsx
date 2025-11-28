import { useEffect, useState } from "react";
import { api } from "../api/api"; // 🔹 Usa api, no API
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error cargando productos", err);
      });
  }, []);

  return (
    <main className="ts-main">
      {/* HERO PRINCIPAL */}
      <section className="ts-hero">
        <div className="ts-hero-content">
          <div className="ts-hero-badge">
            🔥 Ofertas especiales hasta 40% OFF
          </div>

          <h1 className="ts-hero-title">
            La mejor tecnología
            <span className="ts-hero-gradient">al mejor precio</span>
          </h1>

          <p className="ts-hero-subtitle">
            Descubre nuestra selección premium de PCs Gaming, Laptops de última
            generación y Smartphones de las mejores marcas. Calidad garantizada
            y envío rápido.
          </p>

          <div className="ts-hero-actions">
            <button className="ts-btn ts-btn-primary">Ver Ofertas</button>
            <button className="ts-btn ts-btn-outline">
              Catálogo Completo
            </button>
          </div>

          <div className="ts-hero-benefits">
            <div className="ts-benefit">
              <span className="ts-benefit-icon">⚡</span>
              <span>Envío Exprés</span>
            </div>
            <div className="ts-benefit">
              <span className="ts-benefit-icon">🛡️</span>
              <span>Garantía Extendida</span>
            </div>
            <div className="ts-benefit">
              <span className="ts-benefit-icon">📞</span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="ts-section">
        <div className="ts-section-header">
          <h2>Ofertas destacadas</h2>
          <button className="ts-btn ts-btn-ghost">
            Ver Catálogo Completo →
          </button>
        </div>

        <div className="ts-product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="ts-empty-text">
              Aún no hay productos. Agrega algunos desde tu backend. 🙂
            </p>
          )}
        </div>

        <div className="ts-section-footer">
          <button className="ts-btn ts-btn-primary">
            Ver Catálogo Completo
          </button>
        </div>
      </section>
    </main>
  );
}
