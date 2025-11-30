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
      <h2 className="ts-section-header">Productos</h2>

      <div className="ts-product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* 🔽 SECCIÓN CONTACTO SIN ROMPER NADA */}
      <section id="contacto" className="ts-contact-box">
        <h2>Contacto y Asesoría Técnica</h2>

        <p>
          Si adquiriste un producto nuevo, evita forzar componentes, abrir equipos
          sin conocimiento o instalar software no verificado.
        </p>

        <p>Para soporte, recuperación de contraseña o dudas:</p>

        <ul>
          <li>📧 soporte@techstore.com</li>
          <li>📞 55-1234-5678</li>
          <li>🛠️ Lunes a Viernes, 9:00 - 18:00</li>
        </ul>
      </section>
    </div>
  );
}
