import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 1. Estados de Formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. Estados de UI (Carga y Error)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      // Intenta iniciar sesión usando la función del contexto
      await login(email, password);
      
      // Si tiene éxito, navega al inicio
      navigate('/'); 

    } catch (err) {
      // 3. Manejo de Errores (401, 400, Red)
      let message = 'Ocurrió un error al intentar iniciar sesión.';
      
      // Axios envuelve el error en `err.response`
      if (err.response) {
        // Asumimos que el error 401 (Unauthorized) es la credencial incorrecta
        if (err.response.status === 401) {
          message = err.response.data.message || 'Credenciales incorrectas.';
        } else if (err.response.status === 400) {
          message = 'Error de validación. Verifica el email y la contraseña.';
        } else {
          message = 'Error del servidor. Inténtalo más tarde.';
        }
      } else {
        // Error de red (servidor no responde)
        message = 'No se pudo conectar con el servidor.';
      }
      
      setError(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    // 4. Aplicación de Clases CSS
    <div className="ts-auth-container">
      <div className="ts-auth-card">
        
        <h1 className="ts-auth-title">
          <span className="ts-gradient-text">Iniciar Sesión</span>
        </h1>
        <p className="ts-auth-subtitle">
          Ingresa tus credenciales para continuar.
        </p>
        
        <form onSubmit={handleSubmit} className="ts-auth-form">
          
          {/* Input: Email */}
          <div>
            <label htmlFor="email" className="ts-input-label">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="ts-input" 
              placeholder="correo@ejemplo.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          {/* Input: Contraseña */}
          <div>
            <label htmlFor="password" className="ts-input-label">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="ts-input" 
              placeholder="********"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {/* Mensaje de Error */}
          {error && <p style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>{error}</p>}
          
          <button 
            type="submit" 
            className="ts-btn ts-btn-primary ts-btn-full"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        {/* Footer para enlace a Register */}
        <p className="ts-auth-footer">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="ts-link">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}