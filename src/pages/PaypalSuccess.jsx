import { useEffect, useState } from "react";
import api from "../api/api";
import { useSearchParams } from "react-router-dom";

export default function PaypalSuccess() {
  const [params] = useSearchParams();
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = params.get("token");

  useEffect(() => {
    const capture = async () => {
      try {
        const res = await api.post(`/paypal/capture/${token}`);
        setOrderResult(res.data);
      } catch (err) {
        console.error(err);
        setOrderResult({ error: true });
      } finally {
        setLoading(false);
      }
    };

    capture();
  }, [token]);

  if (loading) return <h2>Capturando pago...</h2>;

  if (orderResult?.error)
    return <h2>Error al capturar el pago. Intenta nuevamente.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pago Completado</h1>
      <h3>Gracias por tu compra</h3>

      <p><b>ID de orden:</b> {orderResult.orderId}</p>
      <p><b>Total pagado:</b> ${orderResult.total}</p>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "20px",
          background: "black",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
}
