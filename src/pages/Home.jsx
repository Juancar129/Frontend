import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";


const BASE_URL = "http://localhost:3333"; 

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Función para obtener y procesar los productos
        const fetchProducts = async () => {
            try {
                const res = await API.get("/products");
                
                // 🛑 PROCESAMIENTO CLAVE: Añadir la fullUrl a cada imagen
                const processedProducts = res.data.map(product => {
                    if (product.images && product.images.length > 0) {
                        product.images = product.images.map(image => ({
                            ...image,
                            // Construye la URL completa
                            fullUrl: `${BASE_URL}${image.url}` 
                        }));
                    }
                    return product;
                });

                setProducts(processedProducts);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProducts();
    }, []); // Dependencia vacía para que se ejecute solo una vez al montar

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
                    // El ProductCard ya usa la propiedad p.images[0].fullUrl
                    // Recuerda que ProductCard ha sido corregido para pasar la URL de la imagen al carrito.
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}