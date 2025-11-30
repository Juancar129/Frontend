import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext"; 

// FUNCIÓN DE FORMATO DE MONEDA (PESOS MEXICANOS)
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) {
        amount = 0;
    }
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN', 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Función auxiliar para estrellas (sin cambios)
const renderStars = (rating) => {
    const roundedRating = Math.round(rating || 0); 
    const stars = '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
    return stars;
};

export default function ProductCard({ product }) {
  const { addItemToCart } = useContext(CartContext); 
  
  const {
    id,
    name,
    price,
    // ❌ Eliminamos 'image' ya que el backend ahora envía 'images'
    // image, 
    description,
    oldPrice,
    discount,
    reviewsCount,
    rating,
    
    // 🟢 NUEVOS CAMPOS DESDE EL BACKEND
    category,
    images, // Array de objetos { id, url, productId }
  } = product;

  // 1. OBTENER LA URL DE LA IMAGEN PRINCIPAL:
  // Usamos la URL del primer objeto en el array 'images'. 
  // Usamos una URL placeholder si el array está vacío o no existe.
  const mainImageUrl = (images && images.length > 0) 
    ? images[0].url 
    : "https://via.placeholder.com/600x400?text=Producto+Sin+Imagen"; 
  
  // 2. Lógica defensiva de precios y descuentos (sin cambios)
  const currentPrice = price ?? 0;
  const previousPrice =
    oldPrice || (currentPrice ? Math.round(currentPrice * 1.25) : null);
  const discountLabel =
    discount ||
    (previousPrice
      ? `-${Math.round((1 - currentPrice / previousPrice) * 100)}%`
      : null);

  const handleAddToCart = () => {
    if (addItemToCart) {
      addItemToCart(product);
    }
  };


  return (
    <article className="ts-product-card">
      {discountLabel && (
        <span className="ts-badge-discount">{discountLabel}</span>
      )}

      <div className="ts-product-image">
        <img
          // 🟢 USAMOS LA URL PRINCIPAL
          src={mainImageUrl}
          alt={name}
        />
      </div>

      <div className="ts-product-body">
        <p className="ts-product-category">
          {/* 🟢 MOSTRAMOS LA CATEGORÍA */}
          {(category || "Sin Categoría").toUpperCase()}
        </p>

        <h3 className="ts-product-title">{name}</h3>

        <p className="ts-product-description">
          {description ||
            "Producto de alta calidad ideal para complementar tu setup."}
        </p>

        {/* ... (resto del componente sigue igual) ... */}
        <div className="ts-product-meta">
          <div className="ts-product-price">
            <span className="ts-price-current">{formatCurrency(currentPrice)}</span>
            {previousPrice && (
              <span className="ts-price-old">{formatCurrency(previousPrice)}</span>
            )}
          </div>
          <div className="ts-product-rating">
            <span className="ts-stars">{renderStars(rating)}</span> 
            <span className="ts-reviews">
              ({reviewsCount || 120})
            </span>
          </div>
        </div>

        <div className="ts-product-actions">
          <button 
              type="button"
              className="ts-btn ts-btn-primary ts-btn-full"
              onClick={handleAddToCart}
            >
            Agregar al carrito
          </button>
          <Link
            to={`/product/${id}`}
            className="ts-btn ts-btn-secondary ts-btn-full"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}