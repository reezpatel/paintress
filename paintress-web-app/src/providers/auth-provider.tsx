import { authStore } from "@/lib/store/auth.store";
import { AuthWrapper } from "@/scene/auth/auth-wrapper";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const forceShowAuth = authStore((state) => state.forceShowAuth);
  const isOffline = authStore((state) => state.isOffline);
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (forceShowAuth || (!isAuthenticated && !isOffline)) {
    return <AuthWrapper />;
  }

  return <>{children}</>;
};
