import { Navigate } from "react-router-dom";
import { ROUTES } from "@/utils";

interface ProtectedRoutesProps {
    children: React.ReactNode
}

//  Redirects to login if user is not authenticated
function ProtectedRoutes({children}: ProtectedRoutesProps) {
    const isAuthenticated = !!localStorage.getItem('token')

    if(!isAuthenticated){
        return <Navigate to={ROUTES.LOGIN} replace/>
    }

  return <>{children}</>
}

export default ProtectedRoutes
