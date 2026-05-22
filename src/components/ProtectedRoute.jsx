import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { isLoggedIn, isLoading, hasPermission, isAdmin, isShopApproved, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (!hasPermission(requiredRole)) {
    if (requiredRole === 'admin' && !isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'shop_owner' && user?.role === 'shop_owner') {
      return <Navigate to="/shop" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'shop_owner' && user?.role === 'shop_owner' && !isShopApproved()) {
    return <Navigate to="/shop/pending" replace />;
  }

  return children;
};

export default ProtectedRoute;
