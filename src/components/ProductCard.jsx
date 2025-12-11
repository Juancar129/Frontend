import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const {
    id,
    name,
    price,
    image,
    category,
    description,
    oldPrice,
    discount,
    reviewsCount,
  } = product;

  const currentPrice = price ?? 0;
  const previousPrice =
    oldPrice || (currentPrice ? Math.round(currentPrice * 1.25) : null);
  const discountLabel =
    discount ||
    (previousPrice
      ? `-${Math.round((1 - currentPrice / previousPrice) * 100)}%`
      : null);

  return (
    <article className="ts-product-card">
      {discountLabel && (
        <span className="ts-badge-discount">{discountLabel}</span>
      )}

      <div className="ts-product-image">
        <img
          src={image || "https://via.placeholder.com/600x400?text=Producto"}
          alt={name}
        />
      </div>

      <div className="ts-product-body">
        <p className="ts-product-category">
          {(category || "Periféricos").toUpperCase()}
        </p>

        <h3 className="ts-product-title">{name}</h3>

        <p className="ts-product-description">
          {description ||
            "Producto de alta calidad ideal para complementar tu setup."}
        </p>

        <div className="ts-product-meta">
          <div className="ts-product-price">
            <span className="ts-price-current">${currentPrice}</span>
            {previousPrice && (
              <span className="ts-price-old">${previousPrice}</span>
            )}
          </div>
          <div className="ts-product-rating">
            <span className="ts-stars">★★★★☆</span>
            <span className="ts-reviews">
              ({reviewsCount || 120})
            </span>
          </div>
        </div>

        <div className="ts-product-actions">
          <button className="ts-btn ts-btn-primary ts-btn-full">
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
