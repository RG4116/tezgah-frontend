// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Kullanıcı login değilse login sayfasına yönlendir
  if (!user.token) {
    return <Navigate to="/login" />;
  }

  // Kullanıcının rolü istenen role uygun değilse login sayfasına yönlendir
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı yetkiliyse children component'i göster
  return children;
};

export default ProtectedRoute;