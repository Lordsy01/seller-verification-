import { useAuth } from '../../auth/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return children;
}

export default AdminRoute;