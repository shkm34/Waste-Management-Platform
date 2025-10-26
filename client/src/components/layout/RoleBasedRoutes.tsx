import { Navigate } from "react-router-dom"
import { ROUTES, USER_ROLES } from "@/utils"
import { useAuth } from "@/hooks/useAuth"

interface RoleBasedRoutesProps {
    children: React.ReactNode
    allowedRoles: string[]
}
function RoleBasedRoutes({ children, allowedRoles }: RoleBasedRoutesProps) {
    const { user, token, isAuthenticated } = useAuth()
    const userRole = user?.role

    // if no token/not authenticated/ no user, redirect to login
    if (!token || !isAuthenticated || !user) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    // if user role is in allowed roles, render children
    if (userRole && allowedRoles.includes(userRole)) {
        return <>{children}</>
    }

    //***  HANDLING UN-AUTHORIZED USER, other than allowed roles *** // 

    // if user role is not in allowed roles, redirect to home as default
    let redirectPath = ROUTES.HOME

    // if user role is different from allowed roles,
    //  redirect to there respective dashboard
    switch (userRole) {
        case USER_ROLES.CUSTOMER:
            redirectPath = ROUTES.CUSTOMER_DASHBOARD
            break

        case USER_ROLES.DRIVER:
            redirectPath = ROUTES.DRIVER_DASHBOARD
            break

        case USER_ROLES.DEALER:
            redirectPath = ROUTES.DEALER_DASHBOARD
            break

        default:
            redirectPath = ROUTES.LOGIN
            break
    }
    return <Navigate to={redirectPath} replace />
}

export default RoleBasedRoutes
