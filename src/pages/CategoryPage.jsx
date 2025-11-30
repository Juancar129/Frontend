import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => {
      const filtered = res.data
        .filter((p) => p.categoria.toLowerCase() === category.toLowerCase())
        .map((p) => ({
          ...p,
          category: p.categoria,
          images: [{ url: p.imagen }],
        }));

      setProducts(filtered);
    });
  }, [category]);

  return (
    <div>
      <h2>{category}</h2>

      <div className="ts-product-grid">
        {products.map((p) => (
            <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
