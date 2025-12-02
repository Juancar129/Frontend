import { useState } from "react";
import { api } from "../api/api";   
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. ESTADO para almacenar la dirección de envío
    const [shippingData, setShippingData] = useState({
        recipientName: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: ''
    });

    // 2. HANDLER para actualizar el estado de envío
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePay = async () => {
        try {
            setLoading(true);

            // 3. Validación simple de los campos de envío
            const requiredFields = Object.values(shippingData);
            if (requiredFields.some(value => value === '')) {
                alert("Por favor, rellena todos los campos de la dirección de envío.");
                setLoading(false);
                return;
            }
            
            // 4. PREPARACIÓN DEL PAYLOAD: Unimos los datos de la orden y el envío
            const order = {
                total: 200, // <<-- RECUERDA: Reemplazar con el total real del carrito -->>
                items: [
                    { productId: 1, quantity: 1, price: 200 } // <<-- RECUERDA: Reemplazar con los items reales -->>
                ],
                ...shippingData // AGREGAMOS los 5 campos de envío requeridos por el backend
            };

            // 💡 CORRECCIÓN DE LA RUTA: Llamamos al endpoint '/paypal/create-order'
            const res = await api.post("/paypal/create-order", order); 

            const approvalUrl = res.data.approvalUrl;

            if (!approvalUrl) {
                alert("No se generó el enlace de PayPal");
                return;
            }

            window.location.href = approvalUrl;

        } catch (err) {
            console.error(err);
            alert("Error al crear la orden de PayPal. Revisa la consola para más detalles.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Checkout</h1>

            {/* 5. IMPLEMENTACIÓN DEL FORMULARIO DE ENVÍO (JSX) */}
            <div 
                className="ts-shipping-section" 
                style={{
                    maxWidth: '600px', 
                    margin: '20px auto', 
                    border: '1px solid #1e293b', 
                    padding: '20px', 
                    borderRadius: '12px'
                }}
            >
                <h4 style={{color: '#38bdf8'}}>Datos de Envío y Destino</h4>
                
                <div className="ts-form-group">
                    <label htmlFor="recipientName">Nombre del Destinatario</label>
                    <input 
                        type="text" 
                        id="recipientName"
                        name="recipientName" 
                        placeholder="Ej: Juan Pérez"
                        value={shippingData.recipientName}
                        onChange={handleShippingChange} 
                        required
                        className="ts-input" 
                    />
                </div>

                <div className="ts-form-group">
                    <label htmlFor="streetAddress">Dirección (Calle y Número)</label>
                    <input 
                        type="text" 
                        id="streetAddress"
                        name="streetAddress" 
                        placeholder="Ej: Avenida Siempre Viva 742"
                        value={shippingData.streetAddress}
                        onChange={handleShippingChange} 
                        required
                        className="ts-input" 
                    />
                </div>

                <div className="ts-form-row" style={{display: 'flex', gap: '20px'}}>
                    <div className="ts-form-group" style={{flex: 1}}>
                        <label htmlFor="city">Ciudad</label>
                        <input 
                            type="text" 
                            id="city"
                            name="city" 
                            placeholder="Ej: Ciudad de México"
                            value={shippingData.city}
                            onChange={handleShippingChange} 
                            required
                            className="ts-input" 
                        />
                    </div>

                    <div className="ts-form-group" style={{flex: 1}}>
                        <label htmlFor="postalCode">Código Postal</label>
                        <input 
                            type="text" 
                            id="postalCode"
                            name="postalCode" 
                            placeholder="Ej: 03100"
                            value={shippingData.postalCode}
                            onChange={handleShippingChange} 
                            required
                            className="ts-input" 
                        />
                    </div>
                </div>

                <div className="ts-form-group">
                    <label htmlFor="country">País/Región</label>
                    <input 
                        type="text" 
                        id="country"
                        name="country" 
                        placeholder="Ej: México"
                        value={shippingData.country}
                        onChange={handleShippingChange} 
                        required
                        className="ts-input" 
                    />
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