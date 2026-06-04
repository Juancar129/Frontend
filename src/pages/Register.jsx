import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      if (err.response) {
        let message = "Ocurrio un error al intentar registrar el usuario.";

        if (err.response.status === 400) {
          const validationErrors = err.response.data.message;
          if (Array.isArray(validationErrors)) {
            message = `Error de validacion: ${validationErrors[0]}`;
          } else if (typeof validationErrors === "string") {
            message = validationErrors;
          }
        } else if (err.response.status === 409) {
          message = err.response.data.message || "El correo electronico ya esta registrado.";
        }

        setError(message);
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ts-auth-container">
      <div className="ts-auth-card">
        <h1 className="ts-auth-title">
          <span className="ts-gradient-text">Crear Cuenta</span>
        </h1>
        <p className="ts-auth-subtitle">
          Registrate para acceder a todos nuestros productos.
        </p>

        <form onSubmit={handleSubmit} className="ts-auth-form">
          <div>
            <label htmlFor="name" className="ts-input-label">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              className="ts-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="ts-input-label">Correo Electronico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="ts-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="ts-input-label">Contrasena</label>
            <input
              type="password"
              id="password"
              name="password"
              className="ts-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: "#f87171", fontSize: "14px", fontWeight: "bold" }}>{error}</p>}

          <button
            type="submit"
            className="ts-btn ts-btn-primary ts-btn-full"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p className="ts-auth-footer">
          Ya tienes una cuenta?{" "}
          <Link to="/login" className="ts-link">
            Inicia Sesion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
