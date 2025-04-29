"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { checkAuth } from "../../features/auth/authSlice"
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingFullScreen } from "../../pages/LoadingPage";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      dispatch(checkAuth())
      setIsChecking(false)
    }

    checkAuthentication()
  }, [dispatch])

  useEffect(() => {
    if (isChecking) return;
    const publicRoutes = ["/login", "/"]
    const isPublicRoute = publicRoutes.includes(location.pathname)
    if (!isAuthenticated && !isPublicRoute) {
      navigate("/login")
    } else if (isAuthenticated && location.pathname === "/login") {
      navigate("/learn/modules")
    }
  }, [isAuthenticated, user, location.pathname, navigate, isChecking])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isChecking) {
    return (
      <LoadingFullScreen/>
    )
  }

  return <>{children}</>
}