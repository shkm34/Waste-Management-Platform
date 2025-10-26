import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils';
import { USER_ROLES } from '@/utils';
import { useAuth } from '@/hooks/useAuth';

function Navbar() {

  const {token, user, isAuthenticated, logout} = useAuth()
  const userRole = user?.role
  const userName = user?.name

  const navigate = useNavigate()
  

  const handleLogout = async() => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  // Navigation items based on role
  const getNavItems = () => {

    if (!token || !isAuthenticated || !user) return []

    switch (userRole) {
      case USER_ROLES.CUSTOMER:
        return [
          { label: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD },
          { label: 'Create Waste', path: ROUTES.CUSTOMER_DASHBOARD + '/create' },
          { label: 'My Waste', path: ROUTES.CUSTOMER_DASHBOARD + '/my-waste' },
          { label: 'Wallet', path: ROUTES.CUSTOMER_DASHBOARD + '/wallet' },
        ]

      case USER_ROLES.DRIVER:
        return [
          { label: 'Dashboard', path: ROUTES.DRIVER_DASHBOARD },
          { label: 'My Assignments', path: ROUTES.DRIVER_DASHBOARD + '/assignments' },
          { label: 'History', path: ROUTES.DRIVER_DASHBOARD + '/history' },
        ]

      case USER_ROLES.DEALER:
        return [
          { label: 'Dashboard', path: ROUTES.DEALER_DASHBOARD },
          { label: 'MarketPlace', path: ROUTES.DEALER_DASHBOARD + '/marketplace' },
          { label: 'Incoming', path: ROUTES.DEALER_DASHBOARD + '/incomings' },
          { label: 'Inventory', path: ROUTES.DEALER_DASHBOARD + '/inventory' },
        ]

      default: return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className='bg-white shadow-md'>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className='flex items-center'>
            <span className='text-2xl font-bold text-blue-600'>Home</span>
          </Link>

          {(token || isAuthenticated || user) ? (
            <div className='flex items-center space-x-6'>
              {navItems.map((item) =>
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  {item.label}</Link>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {userName}{' '}
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {userRole}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>


          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
