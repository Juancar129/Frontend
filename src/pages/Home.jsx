import { useEffect, useState } from "react";
import { api } from "../api/api"; // 🔹 Usa api, no API
import ProductCard from "../components/ProductCard";

const BASE_URL = "http://localhost:3333";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("TODAS");
    const [sortMode, setSortMode] = useState("DESTACADOS");

    const categories = [
        "TODAS",
        ...new Set(products.map((product) => product.categoria || product.category).filter(Boolean)),
    ];

    const visibleProducts = products
        .filter((product) => {
            const searchValue = searchTerm.trim().toLowerCase();
            const category = product.categoria || product.category;
            const matchesSearch =
                searchValue === "" ||
                product.name?.toLowerCase().includes(searchValue) ||
                product.description?.toLowerCase().includes(searchValue);
            const matchesCategory = categoryFilter === "TODAS" || category === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortMode === "PRECIO_ASC") return Number(a.price || 0) - Number(b.price || 0);
            if (sortMode === "PRECIO_DESC") return Number(b.price || 0) - Number(a.price || 0);
            if (sortMode === "STOCK") return Number(b.stock || 0) - Number(a.stock || 0);
            return 0;
        });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get("/products");
                const processedProducts = res.data.map((product) => ({
                    ...product,
                    images: (product.images || []).map((image) => ({
                        ...image,
                        fullUrl: `${BASE_URL}${image.url}`,
                    })),
                }));

                setProducts(processedProducts);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="ts-main">
            <div className="ts-hero-banner">
                <div className="ts-offer-tag">
                    <span className="ts-dot"></span>
                    Ofertas especiales hasta 20% OFF
                </div>

                <h1 className="ts-hero-title">
                    La mejor tecnologia <span className="ts-gradient-text">al mejor precio</span>
                </h1>

                <p className="ts-hero-description">
                    Descubre nuestra seleccion premium de PCs Gaming, laptops de ultima
                    generacion y smartphones destacados. Calidad garantizada y envio rapido.
                </p>
            </div>

            <div className="ts-section-header">
                <h2>Productos</h2>
            </div>

            <div className="ts-catalog-controls">
                <input
                    className="ts-input"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar laptops, celulares, componentes..."
                />
                <select
                    className="ts-input"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
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
                <p className="ts-empty-text">No encontramos productos con esos filtros.</p>
            )}
        </div>
    );
}
