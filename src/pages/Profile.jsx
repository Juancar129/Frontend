import { useEffect, useState } from "react";
import { getProfile } from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Añadido manejo de error

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setError("No se pudo cargar la información del perfil."); // Mensaje de error al usuario
    }
  }

  // Manejo de estados: Error, Carga, Datos
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
  if (!user) return <p>Cargando...</p>;
  
  // Desestructuración para un código más limpio
  const { name, email } = user;

  return (
    <div>
 
      <h2>Hola, **{name}**</h2> 
      
      <p><strong>Nombre:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  );
}