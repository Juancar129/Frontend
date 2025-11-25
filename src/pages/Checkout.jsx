import { useState } from "react";
import { api } from "../api/api";   // ← CORREGIDO
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      setLoading(true);

      const order = {
        total: 200,
        items: [
          { productId: 1, quantity: 1, price: 200 }
        ]
      };

      const res = await api.post("/paypal/create", order);

      const approvalUrl = res.data.approvalUrl;

      if (!approvalUrl) {
        alert("No se generó el enlace de PayPal");
        return;
      }

      window.location.href = approvalUrl;

    } catch (err) {
      console.error(err);
      alert("Error al crear la orden de PayPal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>

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
          cursor: "pointer"
        }}
      >
        {loading ? "Conectando con PayPal..." : "Pagar con PayPal"}
      </button>
    </div>
  );
}
