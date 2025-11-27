import React, { useState } from 'react';
import api from '../api/api'; 


const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  
 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(''); 

    try {
      // Intenta enviar los datos al endpoint de registro
      const response = await api.post('/auth/register', formData);
      
      console.log("Usuario Registrado:", response.data);
      
      // Si tiene éxito
      setSuccess(true);
      setFormData({ name: '', email: '', password: '' }); // Limpia el formulario

    } catch (err) {
      
  
      if (err.response && err.response.status === 400) {


        const validationErrors = err.response.data.message;
        
        if (Array.isArray(validationErrors)) {
          // Muestra el primer error de la lista (ej. "password must be longer...")
          setError(`Error de validación: ${validationErrors[0]}`);
        } else if (typeof validationErrors === 'string') {
   
          setError(validationErrors);
        } else {
          setError('Error de validación: Por favor, verifica tus datos.');
        }
      } else {
        // Maneja errores de servidor (500) o de red
        setError('Ocurrió un error. Intenta de nuevo.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h2>Registro de Usuario</h2>
      
      {}
      <div>
          <label htmlFor="name">Nombre:</label>
          <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
          />
      </div>
      
      {}
      <div>
          <label htmlFor="email">Email:</label>
          <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
          />
      </div>
      
      {}
      <div>
          <label htmlFor="password">Contraseña:</label>
          <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
          />
      </div>
      
      {}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>¡Registro Exitoso! Puedes iniciar sesión.</p>}
      
      <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
        Registrar
      </button>
    </form>
  );
};

export default Register;