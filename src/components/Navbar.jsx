import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
    const { user = null, logout = () => {} } = useContext(AuthContext) || {};
    const { itemCount = 0 } = useContext(CartContext) || {};
    const isAdmin = user?.role === "admin";
    const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Usuario";

    return (
        <header className="ts-navbar">
            <div className="ts-navbar-inner">
                <Link to="/" className="ts-logo">
                    <div className="ts-logo-icon">ZG</div>
                    <span className="ts-logo-text">
                        <span>ZenithGear</span>
                    </span>
                </Link>

                <nav className="ts-nav-links">
                    <NavLink to="/" className="ts-nav-link">
                        Inicio
                    </NavLink>
                    <NavLink to="/category/PCs" className="ts-nav-link">
                        PCs
                    </NavLink>
                    <NavLink to="/category/Laptops" className="ts-nav-link">
                        Laptops
                    </NavLink>
                    <NavLink to="/category/Celulares" className="ts-nav-link">
                        Celulares
                    </NavLink>
                    <NavLink to="/category/Componentes" className="ts-nav-link">
                        Componentes
                    </NavLink>
                </nav>

                <div className="ts-nav-actions">
                    {isAdmin && (
                        <Link to="/admin" className="ts-btn ts-btn-secondary ts-btn-nav">
                            Dashboard Admin
                        </Link>
                    )}

                    <NavLink to="/contacto" className="ts-nav-link">
                        Contacto
                    </NavLink>

                    {user ? (
                        <div className="ts-user-pill">
                            <span className="ts-user-label">
                                Hola, {displayName}
                            </span>
                            <button onClick={logout} className="ts-btn ts-btn-ghost ts-btn-nav">
                                Cerrar sesion
                            </button>
                        </div>
                    ) : (
                        <div className="ts-auth-actions">
                            <Link to="/login" className="ts-nav-link ts-nav-auth">
                                Iniciar sesion
                            </Link>
                            <Link to="/register" className="ts-btn ts-btn-primary ts-btn-nav">
                                Registrarse
                            </Link>
                        </div>
                    )}

                    <Link to="/cart" className="ts-cart">
                        <span className="ts-cart-icon">Carrito</span>
                        <span className="ts-cart-badge">{itemCount || 0}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
