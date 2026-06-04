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
        {/* LOGO */}
        <Link to="/" className="ts-logo">
          <div className="ts-logo-icon">🧠</div>
          <span className="ts-logo-text">
            Trusted<span>Stack</span>
          </span>
        </Link>

        {/* LINKS PRINCIPALES */}
        <nav className="ts-nav-links">
          <NavLink to="/" className="ts-nav-link">
            Inicio
          </NavLink>
          <button className="ts-nav-link ts-nav-link-btn" type="button">
            PCs
          </button>
          <button className="ts-nav-link ts-nav-link-btn" type="button">
            Laptops
          </button>
          <button className="ts-nav-link ts-nav-link-btn" type="button">
            Celulares
          </button>
          <button className="ts-nav-link ts-nav-link-btn" type="button">
            Componentes
          </button>
        </nav>

        {/* ACCIONES DERECHA */}
        <div className="ts-nav-actions">
          {user ? (
            <>
              <span className="ts-user-label">
                {user.email}
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

          <a href="#contacto" className="ts-nav-link ts-contact-link">
            Contacto
          </a>

          <Link to="/cart" className="ts-cart">
            <span className="ts-cart-icon">🛒</span>
            <span className="ts-cart-badge">3</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
