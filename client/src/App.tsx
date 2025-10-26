import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './utils';
import Navbar from './components/layout/Navbar';
import { Login, Register } from './pages/auth';
import { CustomerDashboard } from './pages/customer';
import { DriverDashboard } from './pages/driver';
import { DealerDashboard, Marketplace } from './pages/dealer';
import ProtectedRoute from '@/components/layout/ProtectedRoutes';
import RoleBasedRoute from '@/components/layout/RoleBasedRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<></>} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />


          {/* Private routes */}

          <Route
            path={ROUTES.CUSTOMER_DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DRIVER_DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DEALER_DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['dealer']}>
                  <DealerDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.DEALER_MARKETPLACE} element={<Marketplace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;