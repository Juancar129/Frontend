import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";

const BASE_URL = "http://localhost:3333";

export default function CategoryPage() {
 const { category } = useParams();
 const [products, setProducts] = useState([]);
 const [searchTerm, setSearchTerm] = useState("");
 const [sortMode, setSortMode] = useState("DESTACADOS");

 const visibleProducts = products
  .filter((product) => {
   const searchValue = searchTerm.trim().toLowerCase();
   return (
    searchValue === "" ||
    product.name?.toLowerCase().includes(searchValue) ||
    product.description?.toLowerCase().includes(searchValue)
   );
  })
  .sort((a, b) => {
   if (sortMode === "PRECIO_ASC") return Number(a.price || 0) - Number(b.price || 0);
   if (sortMode === "PRECIO_DESC") return Number(b.price || 0) - Number(a.price || 0);
   if (sortMode === "STOCK") return Number(b.stock || 0) - Number(a.stock || 0);
   return 0;
  });

 useEffect(() => {
  API.get("/products").then((res) => {
   const filtered = res.data
    .filter((product) => {
     const visibleCategory = product.categoria || product.category || "";
     return visibleCategory.toLowerCase() === category.toLowerCase();
    })
    .map((product) => ({
     ...product,
     images: (product.images || []).map((image) => ({
      ...image,
      fullUrl: `${BASE_URL}${image.url}`,
     })),
    }));

   setProducts(filtered);
  });
 }, [category]);

 return (
  <div className="ts-main">
  <div className="ts-section-header">
   <h2>{category}</h2>
  </div>

  <div className="ts-catalog-controls ts-catalog-controls-compact">
   <input
    className="ts-input"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    placeholder={`Buscar en ${category}`}
   />
   <select
    className="ts-input"
    value={sortMode}
    onChange={(event) => setSortMode(event.target.value)}
   >
    <option value="DESTACADOS">Destacados</option>
    <option value="PRECIO_ASC">Menor precio</option>
    <option value="PRECIO_DESC">Mayor precio</option>
    <option value="STOCK">Mayor stock</option>
   </select>
  </div>

  <div className="ts-product-grid">
    {visibleProducts.map((product) => (
     <ProductCard key={product.id} product={product} />
    ))}
  </div>

  {visibleProducts.length === 0 && (
   <p className="ts-empty-text">No encontramos productos en esta categoria con esos filtros.</p>
  )}
 </div>
);
}
