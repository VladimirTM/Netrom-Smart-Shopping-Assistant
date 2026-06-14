import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthUser } from "./auth-context";
import { authApi } from "../../api/clients/AuthApiClient";
import { TOKEN_KEY, setUnauthorizedHandler } from "../../api/base/http";

function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();
  const logoutRef = useRef<() => void>(() => {});

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  logoutRef.current = logout;

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logoutRef.current();
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    authApi.me().then(setUser).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }).finally(() => setLoading(false));
  }, [token]);

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
