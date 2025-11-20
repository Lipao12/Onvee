import { useAuth } from "@/context/auth-provider";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-6 text-center">Carregando...</div>;

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    // User authorized but not for this role, redirect to home or dashboard
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
