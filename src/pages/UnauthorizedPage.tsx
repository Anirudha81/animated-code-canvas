
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UnauthorizedPage = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-neutral-800 mb-4">Access Denied</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          <p>You don't have permission to access this page.</p>
        </div>
        <p className="text-neutral-600 mb-8">
          Your current role ({session?.profile?.role || "unknown"}) doesn't have the necessary permissions. Please contact an administrator if you believe this is a mistake.
        </p>
        <div className="space-x-4">
          <Button asChild variant="default">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
