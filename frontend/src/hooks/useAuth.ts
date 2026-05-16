import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    user,
    token,
    setSession,
    clearSession,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin"
  };
};
