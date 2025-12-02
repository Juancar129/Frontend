import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext"; 

// FUNCIÓN DE FORMATO: Pesos Mexicanos (MXN)
const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Función auxiliar para estrellas
const renderStars = (rating) => {
  const roundedRating = Math.round(rating || 0); 
  const stars = '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
  return stars;
};

// Componente principal
export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const { addItemToCart } = useContext(CartContext) || {}; 
  
  // Cláusula de guarda
  if (!product || !product.id) {
    return null;
  }

  const {
    id,
    name,
    price, 
    description,
    oldPrice,
    discount,
    reviewsCount,
    rating,
    category, 
    images,
  } = product;

  // Obtener la URL completa de la imagen
  const mainImageUrl = (images && images.length > 0) 
    ? images[0].fullUrl // Usamos la URL completa generada en Home.jsx
    : "https://via.placeholder.com/600x400?text=Producto+Sin+Imagen"; 
  
  // Lógica defensiva de precios
  const currentPrice = price ?? 0;
  const previousPrice = oldPrice; 
  const discountLabel = discount || null;

  const handleAddToCart = () => {
    if (addItemToCart && product) {
        
      
   
      const productForCart = {
          ...product,
          image: mainImageUrl, 
      };

      addItemToCart(productForCart); // Enviamos el objeto corregido
    }
  };

  return (
    <article className="ts-product-card">
      {discountLabel && (
        <span className="ts-badge-discount">{discountLabel}</span>
      )}

      <div className="ts-product-image">
        <Link to={`/product/${id}`}>
          <img src={mainImageUrl} alt={name} loading="lazy" />
        </Link>
      </div>

      <div className="ts-product-body">
        <p className="ts-product-category">
          {(category || "Sin Categoría").toUpperCase()}
        </p>

        <h3 className="ts-product-title">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>

        <p className="ts-product-description">
          {description || "Producto de alta calidad."}
        </p>

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
              ({reviewsCount || 0})
            </span>
          </div>
        </div>

        {/* ZONA DE ACCIONES CONDICIONALES (ADMIN vs CLIENTE) */}
        <div className="ts-product-actions">
          {isAdmin ? (
            // Controles para Administrador
            <>
              <button 
                onClick={onEdit} 
                className="ts-btn ts-btn-secondary ts-btn-full"
                style={{ background: '#3b82f6', borderColor: '#2563eb' }}
              >
                <i className="fas fa-edit"></i> Editar
              </button>
              <button 
                onClick={onDelete} 
                className="ts-btn ts-btn-ghost ts-btn-full"
                style={{ color: '#ef4444', borderColor: '#ef444455' }}
              >
                <i className="fas fa-trash"></i> Eliminar
              </button>
            </>
          ) : (
            // Botones públicos (Cliente)
            <>
              <button 
                type="button"
                className="ts-btn ts-btn-primary ts-btn-full"
                onClick={handleAddToCart}
              >
                <i className="fas fa-shopping-cart"></i> Agregar al carrito
              </button>
              <Link
                to={`/product/${id}`}
                className="ts-btn ts-btn-secondary ts-btn-full"
              >
                Ver detalles
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}