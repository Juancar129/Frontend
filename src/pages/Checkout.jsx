import { useState, useContext } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Traemos carrito y total REAL
    const { cart, getCartTotal } = useContext(CartContext);

    const [shippingData, setShippingData] = useState({
        recipientName: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
    };

    const handlePay = async () => {
        try {
            setLoading(true);

            // Validar dirección
            const requiredFields = Object.values(shippingData);
            if (requiredFields.some(v => v === "")) {
                alert("Por favor, rellena todos los campos de la dirección de envío.");
                setLoading(false);
                return;
            }

            // 🔥 TOTAL REAL DEL CARRITO
            const total = getCartTotal();

            // Si el carrito está vacío
            if (cart.length === 0) {
                alert("Tu carrito está vacío.");
                setLoading(false);
                return;
            }

            // 🔥 ITEMS REALES
            const items = cart.map(product => ({
                productId: product.id,
                quantity: product.quantity,
                price: product.price
            }));

            // Payload final
            const order = {
                total,
                items,
                ...shippingData
            };

            const res = await api.post("/paypal/create-order", order);

            if (!res.data.approvalUrl) {
                alert("No se generó el enlace de PayPal.");
                return;
            }

            window.location.href = res.data.approvalUrl;

        } catch (err) {
            console.error(err);
            alert("Error al crear la orden de PayPal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Checkout</h1>

            <p>Total a pagar: <strong>${getCartTotal()}</strong></p>

            <div className="ts-shipping-section" style={{
                maxWidth: '600px',
                margin: '20px auto',
                border: '1px solid #1e293b',
                padding: '20px',
                borderRadius: '12px'
            }}>
                <h4 style={{ color: '#38bdf8' }}>Datos de Envío y Destino</h4>

                <div className="ts-form-group">
                    <label>Nombre del Destinatario</label>
                    <input name="recipientName" value={shippingData.recipientName} onChange={handleShippingChange} className="ts-input" />
                </div>

                <div className="ts-form-group">
                    <label>Dirección</label>
                    <input name="streetAddress" value={shippingData.streetAddress} onChange={handleShippingChange} className="ts-input" />
                </div>

                <div className="ts-form-row" style={{ display: 'flex', gap: '20px' }}>
                    <div className="ts-form-group" style={{ flex: 1 }}>
                        <label>Ciudad</label>
                        <input name="city" value={shippingData.city} onChange={handleShippingChange} className="ts-input" />
                    </div>

                    <div className="ts-form-group" style={{ flex: 1 }}>
                        <label>Código Postal</label>
                        <input name="postalCode" value={shippingData.postalCode} onChange={handleShippingChange} className="ts-input" />
                    </div>
                </div>

                <div className="ts-form-group">
                    <label>País</label>
                    <input name="country" value={shippingData.country} onChange={handleShippingChange} className="ts-input" />
                </div>
            </div>

            <button
                disabled={loading}
                onClick={handlePay}
                style={{
                    background: "#0070ba",
                    color: "white",
                    padding: "12px 20px",
                    fontSize: "18px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: '20px'
                }}
            >
                {loading ? "Conectando con PayPal..." : "Pagar con PayPal"}
            </button>
        </div>
    );
}
