import { createContext, useState, useEffect } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getProfile,
  loadToken,
  removeToken,
} from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (loadToken()) {
      checkProfile();
    } else {
      setUser(null);
    }
  }, []);

  async function login(email, password) {
    await loginRequest(email, password);
    await checkProfile();
  }

  async function register(data) {
    await registerRequest(data.name, data.email, data.password);
    await checkProfile();
  }

  async function checkProfile() {
    try {
      const data = await getProfile();
      setUser(data);
      return data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeToken();
      }

      setUser(null);
      return null;
    }
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
