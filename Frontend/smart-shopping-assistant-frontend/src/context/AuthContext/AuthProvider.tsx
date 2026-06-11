import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./auth-context";
import { authApi } from "../../api/clients/AuthApiClient";

const TOKEN_KEY = "auth_token";

function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    authApi.me().then(setUser).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    });
  }, [token]);

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
