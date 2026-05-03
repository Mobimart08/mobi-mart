import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAuthContext } from "./AdminAuthContextValue";
import { getAdminMe, loginAdmin, logoutAdmin } from "../../services/authAPI";
import { getAdminToken } from "../../services/apiClient";

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAdminToken()));
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    logoutAdmin();
    setAdmin(null);
    setIsAuthenticated(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setAdmin(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      const data = await getAdminMe();
      setAdmin(data?.admin || null);
      setIsAuthenticated(true);
      return data?.admin || null;
    } catch {
      logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("admin:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("admin:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      const data = await loginAdmin({ username, password });
      setAdmin(data?.admin || null);
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      const status = error.response?.status;
      return {
        ok: false,
        message:
          status === 401
            ? "Invalid credentials"
            : error.response?.data?.message || "Unable to sign in right now.",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = async () => ({
    ok: false,
    message: "Password reset is not connected to the backend yet.",
  });

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshSession,
      updatePassword,
    }),
    [admin, isAuthenticated, isLoading, login, logout, refreshSession],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
