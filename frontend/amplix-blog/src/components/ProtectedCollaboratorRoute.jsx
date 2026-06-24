import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Guard que permite el acceso solo a ADMIN y COLLABORATOR.
 * Los usuarios no autenticados son redirigidos a /login.
 * Los usuarios con rol USER son redirigidos a /.
 */
const ProtectedCollaboratorRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant font-medium">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN" && user?.role !== "COLLABORATOR") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedCollaboratorRoute;
