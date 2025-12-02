import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { CartContext } from "../context/CartContext"; 

export default function Navbar() {
    // Obtiene el estado del usuario (incluye datos y rol) y la función de cierre de sesión
    const { user, logout } = useContext(AuthContext);

    // OBTENER EL CONTEO DE ÍTEMS DEL CONTEXTO DEL CARRITO
    // Asegúrate de que itemCount se obtiene correctamente del contexto
    const { itemCount } = useContext(CartContext); 

    // Determina si el usuario es administrador
    const isAdmin = user && user.role === 'admin'; 

    return (
        <header className="ts-navbar">
            <div className="ts-navbar-inner">
                
                {/* LOGO */}
                <Link to="/" className="ts-logo">
                    <div className="ts-logo-icon">🛒</div>
                    <span className="ts-logo-text">
                        <span>ZenithGear</span>
                    </span>
                </Link>

                {/* ENLACES PRINCIPALES */}
                <nav className="ts-nav-links">
                    <NavLink to="/" className="ts-nav-link">
                        Inicio
                    </NavLink>
                
                    {/* Enlaces de Categorías */}
                    <NavLink to="/category/PCs" className="ts-nav-link">PCs</NavLink>
                    <NavLink to="/category/Laptops" className="ts-nav-link">Laptops</NavLink>
                    <NavLink to="/category/Celulares" className="ts-nav-link">Celulares</NavLink>
                    <NavLink to="/category/Componentes" className="ts-nav-link">Componentes</NavLink>
                </nav>

                
                <div className="ts-nav-actions">

                    {/* Enlace de Administrador (Solo visible para 'admin') */}
                    {isAdmin && (
                        <Link to="/admin" className="ts-nav-link ts-admin-link">
                            Dashboard Admin
                        </Link> 
                    )}

                    {/* Enlaces de Usuario / Autenticación */}
                    {user ? (
                        <>
                            <span className="ts-user-label">
                                {/* Lógica mejorada: Intenta usar el nombre. Si no existe, usa la parte del email antes del @ */}
                                Hola, {user.name || user.email.split('@')[0]} 
                            </span>
                            <button onClick={logout} className="ts-btn ts-btn-ghost">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Enlaces para usuarios no logueados */}
                            <Link to="/login" className="ts-nav-link ts-nav-auth">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="ts-btn ts-btn-primary">
                                Registrarse
                            </Link>
                        </>
                    )}

                    {/* Enlace de Contacto */}
                    <NavLink to="/contacto" className="ts-nav-link">
                        Contacto
                    </NavLink>

                    {/* Enlace de Carrito con Contador */}
                    <Link to="/cart" className="ts-cart">
                        <span className="ts-cart-icon">🛒</span>
                        {/* MOSTRAR EL CONTEO REAL */}
                        {/* Usa un contador o 0 si está vacío/no definido */}
                        <span className="ts-cart-badge">{itemCount || 0}</span> 
                    </Link>
                </div>
            </div>
        </header>
    );
}