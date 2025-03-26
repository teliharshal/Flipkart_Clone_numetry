import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";

  console.log("Admin Auth Status:", isAuthenticated); // Debugging

  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
