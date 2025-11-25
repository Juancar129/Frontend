import { createContext, useState, useEffect } from "react";
import { api, loadToken, saveToken, removeToken } from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkProfile();
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });

    
    saveToken(res.data.token);

    await checkProfile();
  }

  async function register(data) {
    await api.post("/auth/register", data);
  }

  async function checkProfile() {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
