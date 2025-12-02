import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";

// URL base de tu API de NestJS para construir la URL completa de la imagen.
// Asegúrate de que este puerto coincida con tu main.ts (3000 por defecto)
const BASE_URL = 'http://localhost:3333'; 

export default function CategoryPage() {
 const { category } = useParams();
 const [products, setProducts] = useState([]);

 useEffect(() => {

    // productos por categoría directamente (ej: /products/by-category/:category)
  API.get("/products").then((res) => {
   const filtered = res.data
    // Usamos el campo 'categoria' que definiste para la navegación/visualización
    .filter((p) => p.category.toLowerCase() === category.toLowerCase()) 
    .map((p) => {
            // Ya no es necesario crear un array de imágenes ni usar p.imagen
            
            // Mapeamos las imágenes para añadir la URL base necesaria para el frontend
            const correctedImages = p.images.map(image => ({
                ...image,
                // Si la URL es /uploads/imagen.jpg, la convertimos a http://localhost:3000/uploads/imagen.jpg
                fullUrl: `${BASE_URL}${image.url}` 
            }));

            return {
                ...p,
                // Mantenemos el campo 'category' para ProductCard si lo necesita para filtros o títulos
                // y usamos el array de imágenes corregido.
                images: correctedImages, 
            };
        });

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