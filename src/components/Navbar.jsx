import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Tienda</Link>
      <Link to="/cart">Carrito</Link>

      {user ? (
        <>
          <Link to="/profile">{user.email}</Link>
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <>
          <Link to="/login">Entrar</Link>
          <Link to="/register">Crear cuenta</Link>
        </>
      )}
    </nav>
  );
}
