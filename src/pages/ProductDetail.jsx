import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext"; 


const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// 🛑 URL base del backend
const BASE_URL = "http://localhost:3333"; 

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    // ESTADO PARA LA GALERÍA: Rastrea la imagen que se está mostrando actualmente.
    const [selectedImage, setSelectedImage] = useState(null); 
    const { addItemToCart } = useContext(CartContext) || {}; 

    useEffect(() => {
        // Función para obtener y procesar datos
        const fetchData = async () => {
            try {
                // 1. Obtener Producto Principal
                const productRes = await API.get(`/products/${id}`);
                const mainProduct = productRes.data;
                
                // Agregar fullUrl al producto principal
                if (mainProduct.images) {
                    mainProduct.images = mainProduct.images.map(img => ({
                        ...img,
                        fullUrl: `${BASE_URL}${img.url}`
                    }));
                }
                setProduct(mainProduct);
                
                // FIJAR LA PRIMERA IMAGEN COMO SELECCIONADA AL CARGAR LOS DATOS
                if (mainProduct.images && mainProduct.images.length > 0) {
                    setSelectedImage(mainProduct.images[0].fullUrl);
                }

                // 2. Obtener Productos Similares
                const similarRes = await API.get(`/products/${id}/similar`);
                
                // Mapear similares para agregar fullUrl a cada imagen
                const processedSimilar = similarRes.data.map(p => {
                    if (p.images) {
                        p.images = p.images.map(img => ({
                            ...img,
                            fullUrl: `${BASE_URL}${img.url}`
                        }));
                    }
                    return p;
                });

                setSimilar(processedSimilar);

            } catch (error) {
                console.error("Error fetching product data:", error);
                // Manejar el error, por ejemplo, redirigiendo a 404
            }
        };

        fetchData();
    }, [id]);

    if (!product) return <p>Cargando...</p>;
        
    // Obtener la URL de la imagen que se debe mostrar (o placeholder)
    const currentImage = selectedImage || product.images?.[0]?.fullUrl || "/placeholder-default.jpg";
        
    // Función para el botón de compra
    const handleAddToCart = () => {
        if (addItemToCart && product) {
            
            // 🛑 IMPORTANTE: Aseguramos que el producto tenga la propiedad 'image' simple
            // que Cart.jsx espera. Obtenemos la URL de la imagen que el usuario está viendo
            // actualmente (que puede ser la seleccionada en la galería) o la principal.
            const productForCart = {
                ...product,
                image: currentImage, // Usamos la imagen principal/seleccionada
            };

            addItemToCart(productForCart);
           
        }
    };


    return (
        <div className="ts-main">
            <h1>{product.name}</h1>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                
                {/* Columna de Galería (Imagen Principal y Miniaturas) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* IMAGEN PRINCIPAL */}
                    <img
                        src={currentImage} 
                        alt={product.name}
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            borderRadius: "12px",
                            objectFit: 'cover',
                        }}
                    />
                        
                    {/* MINIATURAS: Mapea todas las imágenes */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.fullUrl}
                                alt={`Miniatura ${index + 1}`}
                                onClick={() => setSelectedImage(image.fullUrl)} // Cambia la imagen principal
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    border: image.fullUrl === currentImage ? '3px solid #3b82f6' : '3px solid transparent',
                                    borderRadius: '8px',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna de Detalles y Acciones */}
                <div>
                    <p><strong>Categoría:</strong> {product.categoria || product.category}</p>
                    <p><strong>Descripción:</strong> {product.description}</p>
                    
                    <h2 style={{ margin: '15px 0' }}>{formatCurrency(product.price)}</h2>
                    
                    {/* Botón de Agregar al Carrito */}
                    <button 
                        className="ts-btn ts-btn-primary" 
                        onClick={handleAddToCart}
                        style={{ padding: '10px 20px', fontSize: '1.1rem' }}
                    >
                        <i className="fas fa-shopping-cart"></i> Agregar al Carrito
                    </button>

                </div>
            </div>


            <hr style={{ margin: "40px 0" }} />

            {/* SIMILARES */}
            <h2>Productos similares</h2>

            {similar.length === 0 && <p>No hay productos similares en la misma categoría.</p>}

            <div className="ts-product-grid">
                {similar.map((p) => (
                    // El ProductCard ya maneja la lógica de imagen para el carrito
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}