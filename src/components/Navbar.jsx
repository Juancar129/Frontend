import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { CartContext } from "../context/CartContext"; 

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    // OBTENER EL CONTEO DE ÍTEMS DEL CONTEXTO DEL CARRITO
    const { itemCount } = useContext(CartContext); 

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
                
                    <NavLink to="/category/PCs" className="ts-nav-link">PCs</NavLink>
                    <NavLink to="/category/Laptops" className="ts-nav-link">Laptops</NavLink>
                    <NavLink to="/category/Celulares" className="ts-nav-link">Celulares</NavLink>
                    <NavLink to="/category/Componentes" className="ts-nav-link">Componentes</NavLink>
                </nav>


                {/* ACCIONES (AUTH, ADMIN, CARRITO) */}
                <div className="ts-nav-actions">

                    {/* Enlace de Administrador (Condicional) */}
                    {isAdmin && (
                        <Link to="/admin" className="ts-nav-link ts-admin-link">
                            Dashboard Admin
                        </Link> 
                    )}

                    {/* Enlaces de Usuario / Autenticación */}
                    {user ? (
                        <>
                            <span className="ts-user-label">
                                Hola, **{user.name || user.email}**
                            </span>
                            <button onClick={logout} className="ts-btn ts-btn-ghost">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
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

                    {/* Enlace de Carrito */}
                    <Link to="/cart" className="ts-cart">
                        <span className="ts-cart-icon">🛒</span>
                        {/* MOSTRAR EL CONTEO REAL */}
                        <span className="ts-cart-badge">{itemCount || 0}</span> 
                    </Link>
                </div>
            </div>
        </header>
    );
}