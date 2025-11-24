import { createContext, useState, useEffect } from "react";
import { API } from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkProfile();
  }, []);

  async function login(email, password) {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.access_token);
    await checkProfile();
  }

  async function register(data) {
    await API.post("/auth/register", data);
  }

  async function checkProfile() {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
