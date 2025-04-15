"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { checkAuth } from "../../features/auth/authSlice"
import { useNavigate, useLocation } from "react-router-dom"

export default function AuthGuard({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  // const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) return;
    const verifyAuthAndRedirect = async () => {
      await dispatch(checkAuth()).unwrap();
      console.log("Checking auth...")
    }
    verifyAuthAndRedirect()

    const publicRoutes = ["/", "/login"]
    const isPublic = publicRoutes.includes(location.pathname)
    if (!isAuthenticated && !isPublic) {
      navigate("/login")
      return;
    }
  }, [dispatch, isAuthenticated, location.pathname, navigate])

  if (!isAuthenticated) return;
  return <>{children}</>

}
