import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { adminGet, adminPost, getToken, setToken, clearToken, setUnauthorizedHandler } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminRef = useRef(null);
  adminRef.current = admin;

  const logout = useCallback(async () => {
    try {
      await adminPost("/auth/logout");
    } catch (_) {
      /* ignore */
    }
    await clearToken();
    setAdmin(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await adminPost("/auth/login", { email, password });
    if (res?.data?.accessToken) await setToken(res.data.accessToken);
    setAdmin(res.data.admin);
    return res.data.admin;
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (adminRef.current) {
        clearToken();
        setAdmin(null);
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await adminGet("/auth/me");
        setAdmin(res.data);
      } catch (_) {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
