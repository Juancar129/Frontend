import { api } from "../api/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaypalSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("token");

        const res = await api.post(`/paypal/capture/${orderId}`);

        console.log("Pago capturado:", res.data);
        alert("Pago exitoso");

        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Error al capturar pago");
      }
    })();
  }, []);

  return <h1>Procesando pago...</h1>;
}
