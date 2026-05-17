import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";
import Spinner from "../../components/ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
          <Spinner label="Verifying admin session..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
