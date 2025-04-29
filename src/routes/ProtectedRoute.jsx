// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated && !isLoading) {
    console.log("Redirecting user to /login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
