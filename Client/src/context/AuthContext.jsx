import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("shopshee_token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("shopshee_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("shopshee_token")));

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("shopshee_user");
      setLoading(false);
      return;
    }

    const hydrateProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        localStorage.setItem("shopshee_user", JSON.stringify(data));
      } catch (error) {
        setToken("");
        setUser(null);
        localStorage.removeItem("shopshee_token");
        localStorage.removeItem("shopshee_user");
      } finally {
        setLoading(false);
      }
    };

    hydrateProfile();
  }, [token]);

  const login = (payload) => {
    localStorage.setItem("shopshee_token", payload.token);
    localStorage.setItem("shopshee_user", JSON.stringify(payload));
    setToken(payload.token);
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("shopshee_token");
    localStorage.removeItem("shopshee_user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
