import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, API } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import CreateProduct from "./CreateProduct";

const BASE_URL = "http://localhost:3333";

export default function Productos() {
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("TODAS");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";
    const categories = [
        "TODAS",
        ...new Set(products.map((product) => product.categoria || product.category).filter(Boolean)),
    ];
    const filteredProducts = products.filter((product) => {
        const searchValue = searchTerm.trim().toLowerCase();
        const category = product.categoria || product.category;
        const matchesSearch =
            searchValue === "" ||
            product.name?.toLowerCase().includes(searchValue) ||
            product.description?.toLowerCase().includes(searchValue);
        const matchesCategory = categoryFilter === "TODAS" || category === categoryFilter;

        return matchesSearch && matchesCategory;
    });
    const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5);
    const inventoryValue = products.reduce(
        (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
        0,
    );

    const handleEditProduct = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleViewOrders = () => {
        navigate("/admin/orders");
    };

    const handleCreateProduct = () => {
        setViewMode("create");
    };

    const handleBackToGrid = () => {
        setViewMode("grid");
        setError(null);
    };

    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm(
            `Estas seguro de que deseas eliminar el Producto ID ${productId}?`,
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteProduct(productId);
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
            alert(`Producto ID ${productId} eliminado con exito.`);
        } catch (e) {
            alert("Error al eliminar el producto. Verifica tu token o permisos.");
            console.error(e.response?.data || e);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

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
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("No se pudieron cargar los productos. Verifica la conexion con el backend.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === "grid" && isAdmin) {
            fetchProducts();
        }
    }, [viewMode, isAdmin]);

    if (!user) {
        return (
            <div className="ts-main">
                <h2 style={{ color: "#ef4444" }}>Sesion requerida</h2>
                <p style={{ color: "#9ca3af" }}>
                    Inicia sesion para acceder a esta interfaz de gestion.
                </p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="ts-main">
                <h2 style={{ color: "#ef4444" }}>Acceso denegado</h2>
                <p style={{ color: "#9ca3af" }}>
                    Solo los administradores pueden acceder a esta interfaz de gestion.
                </p>
            </div>
        );
    }

    if (viewMode === "create") {
        return <CreateProduct onCancel={handleBackToGrid} onSuccess={handleBackToGrid} />;
    }

    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h2>Gestion de Productos</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleViewOrders} className="ts-btn ts-btn-secondary">
                        Ver Ordenes
                    </button>
                    <button onClick={handleCreateProduct} className="ts-btn ts-btn-primary">
                        Crear Producto
                    </button>
                </div>
            </div>

            {!isLoading && !error && products.length > 0 && (
                <>
                    <div className="ts-admin-stats">
                        <div className="ts-admin-stat-card">
                            <span>Productos activos</span>
                            <strong>{products.length}</strong>
                        </div>
                        <div className="ts-admin-stat-card">
                            <span>Stock bajo</span>
                            <strong>{lowStockProducts.length}</strong>
                        </div>
                        <div className="ts-admin-stat-card">
                            <span>Valor inventario</span>
                            <strong>
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                    maximumFractionDigits: 0,
                                }).format(inventoryValue)}
                            </strong>
                        </div>
                    </div>

                    <div className="ts-admin-filters">
                        <input
                            className="ts-input"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Buscar producto"
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
                    </div>

                    {lowStockProducts.length > 0 && (
                        <div className="ts-notice ts-notice-warning">
                            Stock bajo: {lowStockProducts.map((product) => product.name).join(", ")}
                        </div>
                    )}
                </>
            )}

            {isLoading && <p style={{ textAlign: "center" }}>Cargando productos...</p>}
            {error && <p style={{ color: "#ef4444", textAlign: "center" }}>Error: {error}</p>}

            {!isLoading && !error && products.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "40px", color: "#6b7280" }}>
                    No hay productos disponibles. Usa el boton "Crear Producto" para anadir uno.
                </p>
            )}

            {!isLoading && products.length > 0 && (
                <div className="ts-product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isAdmin={true}
                            onEdit={() => handleEditProduct(product.id)}
                            onDelete={() => handleDeleteProduct(product.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
