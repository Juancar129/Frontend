import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await register(email, password);
    } catch (error) {
      console.error("Error al registrarse", error);
      alert("Hubo un error, intenta con otro correo.");
    }
  }

  return (
    <main className="ts-auth-container">
      <div className="ts-auth-card">
        <h2 className="ts-auth-title">Crear Cuenta</h2>
        <p className="ts-auth-subtitle">
          Únete a <span className="ts-gradient-text">TrustedStack</span>
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

          <label className="ts-input-label">Confirmar Contraseña</label>
          <input
            type="password"
            className="ts-input"
            placeholder="•••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="ts-btn ts-btn-primary ts-btn-full" type="submit">
            Registrarme
          </button>
        </form>

        <p className="ts-auth-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="ts-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
