import { useEffect, useState } from "react";
import { getOrders, getProfile } from "../api/api";

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

export default function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [profileData, ordersData] = await Promise.all([
                    getProfile(),
                    getOrders(),
                ]);

                setUser(profileData);
                setOrders(ordersData);
            } catch (err) {
                console.error("Error cargando perfil:", err);
                setError("No se pudo cargar la informacion del perfil.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (isLoading) {
        return <div className="ts-main"><p className="ts-loading-copy">Cargando perfil...</p></div>;
    }

    if (error) {
        return <div className="ts-main"><p className="ts-error-text">Error: {error}</p></div>;
    }

    return (
        <div className="ts-main">
            <div className="ts-profile-hero">
                <div>
                    <p className="ts-detail-category">Mi cuenta</p>
                    <h1 className="ts-page-title">Hola, {user?.name || "Usuario"}</h1>
                    <p className="ts-muted-text">{user?.email}</p>
                </div>

                <div className="ts-profile-stat">
                    <strong>{orders.length}</strong>
                    <span>ordenes realizadas</span>
                </div>
            </div>

            <section className="ts-section">
                <div className="ts-section-header">
                    <h2>Historial de compras</h2>
                </div>

                {orders.length === 0 && (
                    <p className="ts-empty-text">Todavia no tienes compras registradas.</p>
                )}

                {orders.length > 0 && (
                    <div className="ts-profile-orders">
                        {orders.map((order) => (
                            <article key={order.id} className="ts-profile-order-card">
                                <div className="ts-profile-order-head">
                                    <div>
                                        <strong>Orden #{order.id}</strong>
                                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                                    </div>
                                    <span className={`ts-status-pill ts-status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="ts-summary-line">
                                    <span>Total</span>
                                    <strong>{formatCurrency(order.total)}</strong>
                                </div>

                                <div className="ts-order-items-list">
                                    {order.orderItems?.map((item) => (
                                        <div key={item.id} className="ts-order-item-card">
                                            <div className="ts-order-item-title">
                                                {item.product?.name || `Producto #${item.productId}`}
                                            </div>
                                            <div className="ts-order-item-meta">
                                                Cantidad: {item.quantity} | Precio: {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
