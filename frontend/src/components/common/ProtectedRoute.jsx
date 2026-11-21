import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { admin, ready } = useAuth();
  if (!ready) return <main className="page-state">Checking secure access…</main>;
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
