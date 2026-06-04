import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminOrders, getAdminOrderById, updateAdminOrderStatus } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

const ORDER_STATUSES = ["CREATED", "PENDING", "COMPLETED", "ENVIADO", "CANCELADO"];

export default function OrdersDashboard() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const filteredOrders = orders.filter((order) => {
        const searchValue = searchTerm.trim().toLowerCase();
        const matchesSearch =
            searchValue === "" ||
            String(order.id).includes(searchValue) ||
            order.user?.name?.toLowerCase().includes(searchValue) ||
            order.user?.email?.toLowerCase().includes(searchValue);

        const matchesStatus = statusFilter === "TODOS" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const completedSales = orders
        .filter((order) => order.status === "COMPLETED" || order.status === "ENVIADO")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const soldItems = orders.reduce(
        (sum, order) =>
            sum +
            (order.orderItems || []).reduce(
                (itemSum, item) => itemSum + Number(item.quantity || 0),
                0,
            ),
        0,
    );

    const recentOrders = orders.slice(0, 3);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || user.role !== "admin") {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const data = await getAdminOrders();
                setOrders(data);
            } catch (err) {
                console.error("Error al cargar ordenes:", err);
                setError("No se pudieron cargar las ordenes. Verifica conexion o backend.");
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleViewDetail = async (orderId) => {
        setIsDetailLoading(true);

        try {
            const data = await getAdminOrderById(orderId);
            setSelectedOrder(data);
        } catch (err) {
            console.error("Error al cargar detalle de orden:", err);
            alert("No se pudo cargar el detalle de la orden.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const updatedOrder = await updateAdminOrderStatus(orderId, status);

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId ? { ...order, status: updatedOrder.status } : order,
                ),
            );

            setSelectedOrder((currentOrder) =>
                currentOrder?.id === orderId
                    ? { ...currentOrder, status: updatedOrder.status }
                    : currentOrder,
            );
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            alert(err.response?.data?.message || "No se pudo actualizar el estado de la orden.");
        }
    };

    if (!user) {
        return <div className="ts-main"><p>Inicia sesion para consultar ordenes.</p></div>;
    }

    if (user.role !== "admin") {
        return (
            <div className="ts-main">
                <p style={{ color: "#ef4444" }}>Solo administradores pueden entrar aqui.</p>
            </div>
        );
    }

    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h1 className="ts-page-title">Ordenes de clientes</h1>
                <button onClick={() => navigate("/admin")} className="ts-btn ts-btn-secondary">
                    Volver a Productos
                </button>
            </div>

            {!isLoading && !error && orders.length > 0 && (
                <>
                    <div className="ts-admin-stats">
                        <div className="ts-admin-stat-card">
                            <span>Ventas confirmadas</span>
                            <strong>{formatCurrency(completedSales)}</strong>
                        </div>
                        <div className="ts-admin-stat-card">
                            <span>Ordenes</span>
                            <strong>{orders.length}</strong>
                        </div>
                        <div className="ts-admin-stat-card">
                            <span>Productos vendidos</span>
                            <strong>{soldItems}</strong>
                        </div>
                    </div>

                    <div className="ts-admin-filters">
                        <input
                            className="ts-input"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Buscar por orden, cliente o correo"
                        />
                        <select
                            className="ts-input"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="TODOS">Todos los estados</option>
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {isLoading && <p className="ts-loading-copy">Cargando ordenes...</p>}
            {error && <p style={{ color: "#ef4444", textAlign: "center" }}>Error: {error}</p>}

            {!isLoading && !error && orders.length === 0 && (
                <p className="ts-empty-text">No hay ordenes registradas.</p>
            )}

            {!isLoading && orders.length > 0 && (
                <div className="ts-admin-layout">
                    <div className="ts-table-shell">
                        <div className="ts-table-toolbar">
                            <p>Ordenes encontradas: {filteredOrders.length}</p>
                        </div>

                        <div className="ts-table-scroll" aria-label="Tabla de ordenes">
                            <table className="ts-table ts-orders-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Correo</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Items</th>
                                        <th>Fecha</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.user?.name || "Sin nombre"}</td>
                                            <td className="ts-table-email">{order.user?.email || "Sin correo"}</td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td>
                                                <select
                                                    className={`ts-status-select ts-status-${order.status?.toLowerCase()}`}
                                                    value={order.status}
                                                    onChange={(event) =>
                                                        handleStatusChange(order.id, event.target.value)
                                                    }
                                                >
                                                    {ORDER_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{order.orderItems?.length || 0}</td>
                                            <td className="ts-table-date">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                <div className="ts-table-actions">
                                                    <button
                                                        className="ts-btn ts-btn-primary ts-btn-table"
                                                        onClick={() => handleViewDetail(order.id)}
                                                        disabled={isDetailLoading}
                                                    >
                                                        Ver
                                                    </button>
                                                    {order.status !== "ENVIADO" && order.status !== "CANCELADO" && (
                                                        <button
                                                            className="ts-btn ts-btn-secondary ts-btn-table"
                                                            onClick={() => handleStatusChange(order.id, "ENVIADO")}
                                                        >
                                                            Enviar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="ts-order-detail-card">
                        <h2 className="ts-panel-title">Detalle de orden</h2>

                        {!selectedOrder && recentOrders.length > 0 && (
                            <div className="ts-order-detail-section ts-recent-orders">
                                <h3>Ordenes recientes</h3>
                                {recentOrders.map((order) => (
                                    <button
                                        key={order.id}
                                        type="button"
                                        className="ts-recent-order-button"
                                        onClick={() => handleViewDetail(order.id)}
                                    >
                                        <span>#{order.id} - {order.user?.name || "Cliente"}</span>
                                        <strong>{formatCurrency(order.total)}</strong>
                                    </button>
                                ))}
                            </div>
                        )}

                        {isDetailLoading && <p className="ts-loading-copy">Cargando detalle...</p>}

                        {!isDetailLoading && !selectedOrder && (
                            <p className="ts-empty-text">
                                Selecciona una orden para ver productos, envio y datos del comprador.
                            </p>
                        )}

                        {!isDetailLoading && selectedOrder && (
                            <div className="ts-order-detail-content">
                                <div className="ts-order-detail-block">
                                    <strong>Orden</strong>
                                    <span>#{selectedOrder.id}</span>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>Cliente</strong>
                                    <span>{selectedOrder.user?.name || "Sin nombre"}</span>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>Correo</strong>
                                    <span>{selectedOrder.user?.email || "Sin correo"}</span>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>Estado</strong>
                                    <select
                                        className={`ts-status-select ts-status-select-detail ts-status-${selectedOrder.status?.toLowerCase()}`}
                                        value={selectedOrder.status}
                                        onChange={(event) =>
                                            handleStatusChange(selectedOrder.id, event.target.value)
                                        }
                                    >
                                        {ORDER_STATUSES.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>Total</strong>
                                    <span>{formatCurrency(selectedOrder.total)}</span>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>PayPal ID</strong>
                                    <span>{selectedOrder.paypalId || "No aplica"}</span>
                                </div>
                                <div className="ts-order-detail-block">
                                    <strong>Fecha</strong>
                                    <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                                </div>

                                <div className="ts-order-detail-section">
                                    <h3>Envio</h3>
                                    <p>{selectedOrder.recipientName}</p>
                                    <p>{selectedOrder.streetAddress}</p>
                                    <p>{selectedOrder.city}, {selectedOrder.postalCode}</p>
                                    <p>{selectedOrder.country}</p>
                                </div>

                                <div className="ts-order-detail-section">
                                    <h3>Productos</h3>
                                    <div className="ts-order-items-list">
                                        {selectedOrder.orderItems?.map((item) => (
                                            <div key={item.id} className="ts-order-item-card">
                                                <div className="ts-order-item-title">
                                                    {item.product?.name || `Producto #${item.productId}`}
                                                </div>
                                                <div className="ts-order-item-meta">
                                                    Categoria: {item.product?.categoria || item.product?.category || "N/A"}
                                                </div>
                                                <div className="ts-order-item-meta">
                                                    Cantidad: {item.quantity}
                                                </div>
                                                <div className="ts-order-item-meta">
                                                    Precio: {formatCurrency(item.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </div>
    );
}
