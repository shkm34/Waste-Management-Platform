import { Navigate } from "react-router-dom";
import { ROUTES } from "@/utils";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

function ProtectedRoutes({ children }: ProtectedRoutesProps) {
    const { isAuthenticated, loading } = useAuth();

    // show loading spinner while auth is running
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    //  Redirects to login if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoutes;
