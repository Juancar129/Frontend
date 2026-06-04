import { useEffect, useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paypalCapture } from "../api/api";
import { CartContext } from "../context/CartContext";

export default function PaypalSuccess() {
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const hasCapturedRef = useRef(false);
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("Estamos confirmando tu pago con PayPal.");
    const [paypalId, setPaypalId] = useState(null);

    useEffect(() => {
        (async () => {
            if (hasCapturedRef.current) {
                return;
            }

            hasCapturedRef.current = true;

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const orderId = urlParams.get("token");

                if (!orderId) {
                    setStatus("error");
                    setMessage("No encontramos el ID de la orden de PayPal.");
                    return;
                }

                const res = await paypalCapture(orderId);

                await clearCart();
                setPaypalId(res.id || orderId);
                setStatus("success");
                setMessage("Tu pedido fue comprado con exito. Ya puedes revisarlo en tu historial.");
            } catch (err) {
                console.error("Error al capturar pago:", err.response?.data || err.message);
                setStatus("error");
                setMessage(
                    err.response?.data?.message ||
                    "No se pudo confirmar el pago. Revisa tu historial de ordenes o intenta de nuevo.",
                );
            }
        })();
    }, [clearCart, navigate]);

    return (
        <div className="ts-main">
            <section className={`ts-payment-result ts-payment-${status}`}>
                <div className="ts-payment-icon">
                    {status === "processing" && "..."}
                    {status === "success" && "OK"}
                    {status === "error" && "!"}
                </div>

                <p className="ts-detail-category">
                    {status === "processing" && "Procesando pago"}
                    {status === "success" && "Compra confirmada"}
                    {status === "error" && "Pago pendiente de revisar"}
                </p>

                <h1 className="ts-page-title">
                    {status === "processing" && "Un momento..."}
                    {status === "success" && "Pedido comprado con exito"}
                    {status === "error" && "No pudimos confirmar el pago"}
                </h1>

                <p className="ts-payment-message">{message}</p>

                {paypalId && (
                    <p className="ts-muted-text">PayPal ID: {paypalId}</p>
                )}

                <div className="ts-payment-actions">
                    {status === "success" && (
                        <>
                            <Link to="/profile" className="ts-btn ts-btn-primary">
                                Ver mis compras
                            </Link>
                            <Link to="/" className="ts-btn ts-btn-secondary">
                                Seguir comprando
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <Link to="/profile" className="ts-btn ts-btn-secondary">
                                Revisar mis ordenes
                            </Link>
                            <button className="ts-btn ts-btn-primary" onClick={() => navigate("/checkout")}>
                                Volver al checkout
                            </button>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
