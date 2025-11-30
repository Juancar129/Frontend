import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext"; 

export default function Navbar() {
 const { user, logout } = useContext(AuthContext);

 // 1. Lógica para verificar si es administrador
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


<nav className="ts-nav-links">
<NavLink to="/" className="ts-nav-link">
Inicio
</NavLink>

<NavLink to="/category/PCs" className="ts-nav-link">PCs</NavLink>
<NavLink to="/category/Laptops" className="ts-nav-link">Laptops</NavLink>
<NavLink to="/category/Celulares" className="ts-nav-link">Celulares</NavLink>
<NavLink to="/category/Componentes" className="ts-nav-link">Componentes</NavLink>

</nav>

 <div className="ts-nav-actions">
 
            {/* 2. ENLACE DE ADMINISTRADOR: Solo visible si el rol es 'admin' */}
            {isAdmin && (
                <Link to="/admin" className="ts-nav-link ts-admin-link">
                    Dashboard Admin
                </Link>
            )}

 {user ? (
 <>
 <span className="ts-user-label">
 Hola, {user.name || user.email} {/* Muestra el nombre o email */}
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

<NavLink to="/contacto" className="ts-nav-link">
  Contacto
</NavLink>


 <Link to="/cart" className="ts-cart">
 <span className="ts-cart-icon">🛒</span>
 <span className="ts-cart-badge">3</span> {/* Cambiar por lógica de carrito */}
 </Link>
 </div>
 </div>
 </header>
 );
}