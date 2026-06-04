import { useState, useContext } from "react";
import { paypalCreate } from "../api/api";
import { CartContext } from "../context/CartContext";

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState(null);
    const { cart, getCartTotal } = useContext(CartContext);

    const [shippingData, setShippingData] = useState({
        recipientName: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePay = async () => {
        try {
            setLoading(true);
            setNotice(null);

            if (Object.values(shippingData).some((value) => value.trim() === "")) {
                setNotice({ type: "error", text: "Rellena todos los campos de la direccion de envio." });
                return;
            }

            if (cart.length === 0) {
                setNotice({ type: "error", text: "Tu carrito esta vacio." });
                return;
            }

            const items = cart.map((product) => ({
                productId: Number(product.id),
                quantity: Number(product.quantity),
                price: Number(product.price),
            }));

            const hasInvalidItem = items.some(
                (item) =>
                    !Number.isInteger(item.productId) ||
                    item.productId <= 0 ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity <= 0 ||
                    !Number.isFinite(item.price) ||
                    item.price <= 0,
            );

            if (hasInvalidItem) {
                setNotice({
                    type: "error",
                    text: "Hay un producto invalido en el carrito. Eliminalo y agregalo de nuevo.",
                });
                return;
            }

            const total = Number(
                items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2),
            );

            const res = await paypalCreate(total, items, shippingData);

            if (!res.approvalUrl) {
                setNotice({ type: "error", text: "No se genero el enlace de PayPal." });
                return;
            }

            window.location.href = res.approvalUrl;
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message ||
                "Error al crear la orden de PayPal. Revisa tu carrito e intenta de nuevo.";
            setNotice({ type: "error", text: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h1 className="ts-page-title">Checkout</h1>
            </div>

            <div className="ts-checkout-layout">
                <div className="ts-checkout-panel">
                    <h2 className="ts-panel-title">Datos de envio</h2>

                    <div className="ts-form-grid">
                        <div className="ts-form-group">
                            <label>Nombre del destinatario</label>
                            <input
                                name="recipientName"
                                value={shippingData.recipientName}
                                onChange={handleShippingChange}
                                className="ts-input"
                            />
                        </div>

                        <div className="ts-form-group ts-form-group-full">
                            <label>Direccion</label>
                            <input
                                name="streetAddress"
                                value={shippingData.streetAddress}
                                onChange={handleShippingChange}
                                className="ts-input"
                            />
                        </div>

                        <div className="ts-form-group">
                            <label>Ciudad</label>
                            <input
                                name="city"
                                value={shippingData.city}
                                onChange={handleShippingChange}
                                className="ts-input"
                            />
                        </div>

                        <div className="ts-form-group">
                            <label>Codigo Postal</label>
                            <input
                                name="postalCode"
                                value={shippingData.postalCode}
                                onChange={handleShippingChange}
                                className="ts-input"
                            />
                        </div>

                        <div className="ts-form-group ts-form-group-full">
                            <label>Pais</label>
                            <input
                                name="country"
                                value={shippingData.country}
                                onChange={handleShippingChange}
                                className="ts-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="ts-checkout-summary">
                    <h2 className="ts-panel-title">Resumen</h2>
                    {notice && (
                        <div className={`ts-notice ts-notice-${notice.type}`}>
                            {notice.text}
                        </div>
                    )}
                    <div className="ts-checkout-items">
                        {cart.map((item) => (
                            <div key={item.id} className="ts-checkout-item">
                                <span>{item.name}</span>
                                <strong>
                                    {item.quantity} x {formatCurrency(item.price)}
                                </strong>
                            </div>
                        ))}
                    </div>
                    <div className="ts-summary-line">
                        <span>Productos</span>
                        <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                    </div>
                    <div className="ts-summary-line">
                        <span>Total</span>
                        <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                    <button
                        disabled={loading}
                        onClick={handlePay}
                        className="ts-btn ts-btn-primary ts-btn-full ts-btn-checkout"
                    >
                        {loading ? "Conectando con PayPal..." : "Pagar con PayPal"}
                    </button>
                </div>
            </div>
        </div>
    );
}
