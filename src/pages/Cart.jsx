import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; 

//FUNCIÓN DE FORMATO ACTUALIZADA A MXN
const formatCurrency = (amount) => {
    // Usamos 'es-MX' y el código 'MXN' para Pesos Mexicanos.
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export default function Cart() {
    const { 
        cart, 
        removeItemFromCart, 
        incrementQuantity, 
        decrementQuantity, 
        getCartTotal 
    } = useContext(CartContext);

    const shippingCost = 10.00;
    const subtotal = getCartTotal(); 
    const finalTotal = subtotal + shippingCost;


    if (cart.length === 0) {
        return (
            <div className="ts-main">
                <h1 className="ts-hero-title">Tu carrito está vacío 🛒</h1>
                <p className="ts-empty-text">
                    Aún no has agregado productos. Explora nuestra <Link to="/" className="ts-link">página de inicio</Link> para encontrar ofertas.
                </p>
            </div>
        );
    }

    return (
        <div className="ts-main">
            <h1 className="ts-hero-title">Mi Carrito de Compras</h1>
            
            <div className="ts-cart-layout"> 
                
                <div className="ts-cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="ts-cart-item">
                            
                            <Link to={`/product/${item.id}`} className="ts-cart-item-image">
                                <img 
                                    src={item.image || "https://via.placeholder.com/100"} 
                                    alt={item.name} 
                                />
                            </Link>
                            
                            <div className="ts-cart-item-info">
                                <Link to={`/product/${item.id}`} className="ts-product-title-small">{item.name}</Link>
                                {/* Formato de precio unitario */}
                                <p className="ts-product-price-small">{formatCurrency(item.price)} c/u</p>
                            </div>
                            
                            {/* Control de Cantidad */}
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
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal del Item */}
                            <div className="ts-cart-item-subtotal">
                                {/* Formato de subtotal del item */}
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>

                            {/* Botón Eliminar */}
                            <button 
                                className="ts-btn ts-btn-ghost ts-btn-remove"
                                onClick={() => removeItemFromCart(item.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* Columna 2: Resumen del Pedido */}
                <div className="ts-cart-summary">
                    <h2 className="ts-summary-title">Resumen del Pedido</h2>
                    
                    <div className="ts-summary-line">
                        <span>Subtotal:</span>
                        {/* Formato de subtotal */}
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="ts-summary-line">
                        <span>Envío (Estándar):</span>
                        {/* Formato de costo de envío */}
                        <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    
                    <div className="ts-summary-total">
                        <strong>Total:</strong>
                        {/* Formato de total final */}
                        <strong>{formatCurrency(finalTotal)}</strong>
                    </div>

                    {/* Botón de Pago funcional con Link */}
                    <Link 
                        to="/checkout" 
                        className="ts-btn ts-btn-primary ts-btn-full ts-btn-checkout"
                    >
                        Proceder al Pago
                    </Link>
                </div>
            </div>
        </div>
    );
}