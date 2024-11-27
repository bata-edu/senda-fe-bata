import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loginUser,
  forgotPassword,
  verifyEmail,
  googleLogin,
  getAuthData,
} from "../../features/auth/authService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImage from "../../assets/logo.svg";
import simpleLogo from "../../assets/simple-logo.svg"
import useNavigateToDashboard from "../../utils/userRoles";
import GenericDialog from "../common/dialog/dialog";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const navigateToDashboard = useNavigateToDashboard();

  const validateEmailToken = async (token) => {
    try {
      await verifyEmail(token);
      toast.success("¡Correo verificado exitosamente!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al verificar el correo");
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      validateEmailToken(token);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password);
      const { user } = getAuthData();
      navigateToDashboard(user.role);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      await googleLogin(response.credential);
      navigate("/home");
    } catch (error) {
      setError("Error al autenticar con Google");
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
      try {
        await forgotPassword(emailForReset);
        setShowDialog(false);
        toast.success("¡Correo enviado exitosamente!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      } catch (err) {
        console.error(err);
      }
  };


  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col bg-white">
        <header className="w-full bg-white shadow-sm">
          <div className="max-w-6xl p-4 flex items-center">
            <img src={logoImage} alt="Logo Bata" className="h-8" />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center bg-grayBg">
          <div className="w-full max-w-sm bg-grayBg rounded-lg p-6">
            <img src={simpleLogo} alt="Logo Bata" className="h-16 mx-auto my-3" />
            <h2 className="text-xl font-bold text-center text-gray-800">Inicia sesión en Bata</h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              ¡Bienvenido! Por favor, ingresa tus datos.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresar email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresar contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className={`w-full py-2 text-white font-bold rounded-lg ${
                  isLoading ? "bg-gray-400" : "bg-strongBlue hover:strongBlue-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </form>
            <div className="mt-4 text-end">
              <button
                onClick={() => setShowDialog(true)}
                className="text-sm text-strongBlue hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="mt-6 flex flex-col space-y-2">
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Error al autenticar con Google")}
              />
{/*                <button
                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img src="/assets/facebook-icon.svg" alt="Facebook" className="h-5 mr-2" />
                Regístrate con Facebook
              </button>  */}
            </div>
            <div>
              {showDialog &&
                <GenericDialog 
                type="form"
                title={"Recuperar Contraseña"}
                description={"Ingresa tu correo electrónico para recuperar tu contraseña"}
                inputs={[{ placeholder: "Correo electrónico", type: "email", value: emailForReset, onChange: (e) => setEmailForReset(e.target.value) }] }
                confirmButtonText={"Enviar"}
                cancelButtonText={"Cancelar"} 
                onCancel={() => setShowDialog(false)} 
                onConfirm={handleForgotPassword}
                />
            }
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta?{" "}
                <a href="/register" className="text-strongBlue hover:underline">
                  Regístrate
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
