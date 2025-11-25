import { useEffect, useState } from "react";
import { getProfile } from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  }

  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
