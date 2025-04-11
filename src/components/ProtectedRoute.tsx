
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    } else if (!loading && session && allowedRoles) {
      const userRole = session.profile?.role as UserRole;
      if (!allowedRoles.includes(userRole)) {
        navigate("/unauthorized");
      }
    }
  }, [session, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
