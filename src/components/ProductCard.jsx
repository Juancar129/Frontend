import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const renderStars = (rating) => {
  const roundedRating = Math.round(rating || 0);
  return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
};

export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const { addItemToCart } = useContext(CartContext) || {};
  const [imageRatio, setImageRatio] = useState("4 / 3");
  const [isAdding, setIsAdding] = useState(false);

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
    categoria,
    images,
    stock,
  } = product;

  const mainImageUrl =
    images && images.length > 0
      ? images[0].fullUrl
      : "https://via.placeholder.com/600x400?text=Producto+Sin+Imagen";

  const currentPrice = price ?? 0;
  const previousPrice = oldPrice;
  const discountLabel = discount || null;
  const displayCategory = categoria || category || "Sin Categoria";
  const availableStock = Number(stock ?? 0);
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const shortDescription = description
    ? description.length > 96
      ? `${description.slice(0, 96)}...`
      : description
    : "Producto de alta calidad.";

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      return;
    }

    if (addItemToCart && product) {
      try {
        setIsAdding(true);
        await addItemToCart({
          ...product,
          image: mainImageUrl,
        });
      } catch (error) {
        alert(error.response?.data?.message || "No se pudo agregar el producto al carrito.");
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    if (!naturalWidth || !naturalHeight) {
      return;
    }

    const ratio = naturalWidth / naturalHeight;
    const balancedRatio = Math.min(Math.max(ratio, 1.28), 1.5);
    setImageRatio(`${balancedRatio} / 1`);
  };

  return (
    <article className="ts-product-card">
      {discountLabel && <span className="ts-badge-discount">{discountLabel}</span>}
      <span className={`ts-stock-badge ${isOutOfStock ? "is-out" : isLowStock ? "is-low" : "is-ok"}`}>
        {isOutOfStock ? "Sin stock" : isLowStock ? `Quedan ${availableStock}` : "Disponible"}
      </span>

      <div className="ts-product-image" style={{ "--ts-product-image-ratio": imageRatio }}>
        <Link to={`/product/${id}`}>
          <img src={mainImageUrl} alt={name} loading="lazy" onLoad={handleImageLoad} />
        </Link>
      </div>

      <div className="ts-product-body">
        <p className="ts-product-category">{displayCategory.toUpperCase()}</p>

        <h3 className="ts-product-title">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>

        <p className="ts-product-description">{shortDescription}</p>

        <div className="ts-product-meta">
          <div className="ts-product-price">
            <span className="ts-price-current">{formatCurrency(currentPrice)}</span>
            {previousPrice && (
              <span className="ts-price-old">{formatCurrency(previousPrice)}</span>
            )}
          </div>

          <div className="ts-product-rating">
            <span className="ts-stars">{renderStars(rating)}</span>
            <span className="ts-reviews">({reviewsCount || 0})</span>
          </div>
        </div>

        <div className="ts-product-actions">
          {isAdmin ? (
            <>
              <button
                onClick={onEdit}
                className="ts-btn ts-btn-secondary ts-btn-full"
                style={{ background: "#3b82f6", borderColor: "#2563eb" }}
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="ts-btn ts-btn-ghost ts-btn-full"
                style={{ color: "#ef4444", borderColor: "#ef444455" }}
              >
                Eliminar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ts-btn ts-btn-primary ts-btn-full"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
              >
                {isOutOfStock ? "Agotado" : isAdding ? "Agregando..." : "Agregar al carrito"}
              </button>
              <Link to={`/product/${id}`} className="ts-btn ts-btn-secondary ts-btn-full">
                Ver detalles
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
