import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/api'; 

export default function OrdersDashboard() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // NUEVO ESTADO para manejar errores de la API
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    // --- FUNCIÓN PARA CARGAR ÓRDENES DE LA API ---
    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null); // Limpiar errores anteriores
        
        try {
            // LLAMADA REAL A LA API: Asume que el endpoint es /orders
            const res = await API.get('/orders'); 
            setOrders(res.data); // Asume que el array de órdenes está en res.data
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
            setError("No se pudieron cargar las órdenes. Verifique la conexión con el backend o la ruta /orders.");
            setOrders([]); // Asegurar que la lista de órdenes esté vacía en caso de error
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, []);
    
    // --------------------------------------------

    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h1>Dashboard de Órdenes</h1>
                <button onClick={() => navigate('/admin')} className="ts-btn ts-btn-secondary">
                    Volver a Productos
                </button>
            </div>
            
            {isLoading && <p style={{ textAlign: 'center' }}>Cargando órdenes...</p>}
            
            {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>Error: {error}</p>}
            
            {!isLoading && !error && orders.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
                    No hay órdenes registradas.
                </p>
            )}

            {/* Tabla o lista de órdenes */}
            {!isLoading && orders.length > 0 && (
                <>
                    <p>Órdenes encontradas: {orders.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user || 'N/A'}</td> {/* Muestra 'N/A' si el campo 'user' no existe */}
                                    <td>${(order.total || 0).toFixed(2)}</td>
                                    <td>{order.status || 'Desconocido'}</td>
                                    <td>{order.date || 'Sin fecha'}</td>
                                    <td>
                                        <button className="ts-btn ts-btn-ghost" onClick={() => console.log('Ver detalle', order.id)}>Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}