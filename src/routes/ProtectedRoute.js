import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = UserAuth();

  if (loading) {
    return <div>Loading...</div>; // or any loading indicator
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
