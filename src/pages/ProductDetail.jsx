import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

const BASE_URL = "http://localhost:3333";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addItemToCart } = useContext(CartContext) || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await API.get(`/products/${id}`);
                const mainProduct = productRes.data;

                if (mainProduct.images) {
                    mainProduct.images = mainProduct.images.map((img) => ({
                        ...img,
                        fullUrl: `${BASE_URL}${img.url}`,
                    }));
                }

                setProduct(mainProduct);

                if (mainProduct.images && mainProduct.images.length > 0) {
                    setSelectedImage(mainProduct.images[0].fullUrl);
                }

                const similarRes = await API.get(`/products/${id}/similar`);
                const processedSimilar = similarRes.data.map((productItem) => ({
                    ...productItem,
                    images: (productItem.images || []).map((img) => ({
                        ...img,
                        fullUrl: `${BASE_URL}${img.url}`,
                    })),
                }));

                setSimilar(processedSimilar);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, [id]);

    if (!product) {
        return <p className="ts-loading-copy">Cargando...</p>;
    }

    const currentImage = selectedImage || product.images?.[0]?.fullUrl || "/placeholder-default.jpg";
    const isOutOfStock = Number(product.stock || 0) <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock) {
            return;
        }

        if (addItemToCart && product) {
            addItemToCart({
                ...product,
                image: currentImage,
            });
        }
    };

    return (
        <div className="ts-main">
            <section className="ts-detail-hero">
                <div className="ts-detail-gallery">
                    <div className="ts-detail-main-image">
                        <img src={currentImage} alt={product.name} />
                    </div>

                    <div className="ts-detail-thumbs">
                        {(product.images || []).map((image, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`ts-thumb-button ${image.fullUrl === currentImage ? "is-active" : ""}`}
                                onClick={() => setSelectedImage(image.fullUrl)}
                            >
                                <img src={image.fullUrl} alt={`Miniatura ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ts-detail-panel">
                    <p className="ts-detail-category">{product.categoria || product.category}</p>
                    <h1 className="ts-detail-title">{product.name}</h1>
                    <p className="ts-detail-description">{product.description}</p>

                    <div className="ts-detail-price-row">
                        <div className="ts-detail-price">{formatCurrency(product.price)}</div>
                        <div className="ts-detail-stock">
                            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
                        </div>
                    </div>

                    <div className="ts-detail-highlights">
                        <div className="ts-highlight-chip">Envio rapido</div>
                        <div className="ts-highlight-chip">Garantia incluida</div>
                        <div className="ts-highlight-chip">Pago seguro</div>
                    </div>

                    <button
                        className="ts-btn ts-btn-primary ts-btn-detail"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
                    </button>
                </div>
            </section>

            <section className="ts-section">
                <div className="ts-section-header">
                    <h2>Productos similares</h2>
                </div>

                {similar.length === 0 && (
                    <p className="ts-empty-text">No hay productos similares en esta categoria.</p>
                )}

                <div className="ts-product-grid">
                    {similar.map((productItem) => (
                        <ProductCard key={productItem.id} product={productItem} />
                    ))}
                </div>
            </section>
        </div>
    );
}
