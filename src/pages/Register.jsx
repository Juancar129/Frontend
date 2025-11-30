import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Para el enlace de "Ya tengo cuenta"
import api from '../api/api'; 

const Register = () => {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  
  // Estado para mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Maneja cambios en los inputs y actualiza el estado
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpia errores al empezar a escribir
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(''); // Limpia errores anteriores

    try {
      const response = await api.post('/auth/register', formData);
      
      console.log("Usuario Registrado:", response.data);
      
      setSuccess(true);
      setFormData({ name: '', email: '', password: '' }); // Limpia el formulario

    } catch (err) {
      // Manejo de errores 400 (Validación) o 409 (Email duplicado)
      if (err.response) {
        let message = 'Ocurrió un error al intentar registrar el usuario.';
        
        if (err.response.status === 400) {
            // Maneja errores de validación (array de strings)
            const validationErrors = err.response.data.message;
            if (Array.isArray(validationErrors)) {
                message = `Error de validación: ${validationErrors[0]}`;
            } else if (typeof validationErrors === 'string') {
                message = validationErrors;
            }
        } else if (err.response.status === 409) {
            // Maneja el error de email duplicado (ConflictException)
            message = err.response.data.message || 'El correo electrónico ya está registrado.';
        }
        
        setError(message);
      } else {
        // Errores de red
        setError('No se pudo conectar con el servidor.');
      }
    }
  };

  return (
    <div className="ts-auth-container">
      <div className="ts-auth-card">
        
        <h1 className="ts-auth-title">
          <span className="ts-gradient-text">Crear Cuenta</span>
        </h1>
        <p className="ts-auth-subtitle">
          Regístrate para acceder a todos nuestros productos.
        </p>
        
        <form onSubmit={handleSubmit} className="ts-auth-form">
          
          {/* Input: Nombre */}
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
          
          {/* Input: Email */}
          <div>
            <label htmlFor="email" className="ts-input-label">Correo Electrónico</label>
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
          
          {/* Input: Contraseña */}
          <div>
            <label htmlFor="password" className="ts-input-label">Contraseña</label>
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
          
          {/* Mensajes de Estado */}
          {error && <p style={{ color: '#f87171', fontSize: '14px', fontWeight: 'bold' }}>{error}</p>}
          {success && <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>¡Registro Exitoso!</p>}
          
          <button 
            type="submit" 
            className="ts-btn ts-btn-primary ts-btn-full"
            disabled={success} // Deshabilita el botón si el registro fue exitoso
          >
            Registrar
          </button>
        </form>
        
        {/* Footer para enlace a Login */}
        <p className="ts-auth-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="ts-link">
            Inicia Sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;