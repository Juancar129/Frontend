import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

export default function Cart() {
    const {
        cart,
        removeItemFromCart,
        incrementQuantity,
        decrementQuantity,
        getCartTotal,
    } = useContext(CartContext);

    const shippingCost = 10.0;
    const subtotal = getCartTotal();
    const finalTotal = subtotal + shippingCost;

    if (cart.length === 0) {
        return (
            <div className="ts-main">
                <section className="ts-empty-state">
                    <h1 className="ts-empty-title">Tu carrito esta vacio</h1>
                    <p className="ts-empty-text">
                        Explora nuestra <Link to="/" className="ts-link">pagina de inicio</Link> para encontrar ofertas.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h1 className="ts-page-title">Mi Carrito</h1>
            </div>

            <div className="ts-cart-layout">
                <div className="ts-cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="ts-cart-item">
                            <Link to={`/product/${item.id}`} className="ts-cart-item-image">
                                <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} />
                            </Link>

                            <div className="ts-cart-item-info">
                                <Link to={`/product/${item.id}`} className="ts-product-title-small">
                                    {item.name}
                                </Link>
                                <p className="ts-product-price-small">{formatCurrency(item.price)} c/u</p>
                            </div>

                            <div className="ts-cart-item-quantity">
                                <button
                                    className="ts-btn ts-btn-ghost ts-btn-square"
                                    onClick={() => decrementQuantity(item.id)}
                                >
                                    -
                                </button>
                                <span className="ts-quantity-display">{item.quantity}</span>
                                <button
                                    className="ts-btn ts-btn-ghost ts-btn-square"
                                    onClick={() => incrementQuantity(item.id)}
                                    disabled={item.stock && item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>

                            <div className="ts-cart-item-subtotal">
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>

                            <button
                                className="ts-btn ts-btn-ghost ts-btn-remove"
                                onClick={() => {
                                    const shouldRemove = window.confirm("Quieres eliminar este producto del carrito?");

                                    if (shouldRemove) {
                                        removeItemFromCart(item.id);
                                    }
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="ts-cart-summary">
                    <h2 className="ts-summary-title">Resumen del pedido</h2>

                    <div className="ts-summary-line">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="ts-summary-line">
                        <span>Envio estandar</span>
                        <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="ts-summary-total">
                        <strong>Total</strong>
                        <strong>{formatCurrency(finalTotal)}</strong>
                    </div>

                    <Link to="/checkout" className="ts-btn ts-btn-primary ts-btn-full ts-btn-checkout">
                        Proceder al pago
                    </Link>
                </div>
            </div>
        </div>
    );
}
