import { api } from "../api/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaypalSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Función asíncrona que se ejecuta una vez al montar el componente
    (async () => {
      try {
        // 1. Extraer los parámetros de la URL (donde PayPal nos redirigió)
        const urlParams = new URLSearchParams(window.location.search);
        
        // El ID de la orden de PayPal viene en el parámetro 'token'
        const orderId = urlParams.get("token");

        if (!orderId) {
            console.error("No se encontró el token de la orden en la URL.");
            alert("Error: ID de orden de PayPal no encontrado.");
            navigate("/checkout/error"); // Redirige a una página de error
            return;
        }

        // 2. Llamar al backend (NestJS) para CAPTURAR el pago final
        // Se envía el token JWT automáticamente gracias al interceptor de Axios.
        const res = await api.post(`/paypal/capture/${orderId}`);

        // 3. Manejo de éxito
        console.log("Pago capturado:", res.data);
        alert("¡Pago exitoso! Tu orden ha sido confirmada.");

        // Redirigir al usuario a la página principal o a su historial de órdenes
        navigate("/"); 
      } catch (err) {
        // 4. Manejo de error
        console.error("Error al capturar pago:", err.response?.data || err.message);
        alert("Error al capturar el pago. Por favor, revisa tu historial de órdenes.");
        navigate("/checkout/error"); // O la ruta que desees para errores de pago
      }
    })();
  }, [navigate]); // navigate se incluye como dependencia de useEffect

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Procesando pago...</h1>
      <p>No cierres esta ventana. Estamos confirmando tu transacción.</p>
    </div>
  );
}