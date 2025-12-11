import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("Credenciales incorrectas");
    }
  }

  return (
    <main className="ts-auth-container">
      <div className="ts-auth-card">
        <h2 className="ts-auth-title">Iniciar Sesión</h2>
        <p className="ts-auth-subtitle">
          Bienvenido de nuevo a <span className="ts-gradient-text">TrustedStack</span>
        </p>

        <form className="ts-auth-form" onSubmit={handleSubmit}>
          <label className="ts-input-label">Correo Electrónico</label>
          <input
            type="email"
            className="ts-input"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="ts-input-label">Contraseña</label>
          <input
            type="password"
            className="ts-input"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="ts-btn ts-btn-primary ts-btn-full" type="submit">
            Entrar
          </button>
        </form>

        <p className="ts-auth-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="ts-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
