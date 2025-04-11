import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  forgotPassword,
  verifyEmail,
  googleLogin,
} from "../../features/auth/authService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import simpleLogo from "../../assets/simple-logo.svg";
import GenericDialog from "../common/dialog/dialog";
import { TextInput } from "../common/input/Input";
import { StyledPasswordInput } from "../common/input/PasswordInput.jsx";
import Header from "../common/header/Header.jsx";

import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../features/auth/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/learn/modules");
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(login({ email, password }))
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
        <Header />

        <div className="flex flex-1 items-center justify-center bg-grayBg">
          <div className="w-full max-w-sm bg-grayBg rounded-lg p-6">
            <img
              src={simpleLogo}
              alt="Logo Bata"
              className="h-16 mx-auto my-3"
            />
            <h2 className="text-xl font-bold text-center text-gray-800">
              Inicia sesión en Bata
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              ¡Bienvenido! Por favor, ingresa tus datos.
            </p>
            <div className="space-y-4">
  <form onSubmit={handleSubmit} className="space-y-4">
    <TextInput
      label={"Email"}
      id="email"
      type="email"
      placeHolder="Ingresar email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <StyledPasswordInput
      label={"Contraseña"}
      id="password"
      type="password"
      placeHolder="Ingresar contraseña"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
    <div className="mt-3 text-end">
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="text-sm text-strongBlue hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
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
</div>

            <div className="mt-3 flex flex-col space-y-2">
              {/* <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Error al autenticar con Google")}
              /> */}
              {/*                <button
                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img src="/assets/facebook-icon.svg" alt="Facebook" className="h-5 mr-2" />
                Regístrate con Facebook
              </button>  */}
            </div>
            <div>
              {showDialog && (
                <GenericDialog
                  type="form"
                  title={"Recuperar Contraseña"}
                  description={
                    "Ingresa tu correo electrónico para recuperar tu contraseña"
                  }
                  inputs={[
                    {
                      placeholder: "Correo electrónico",
                      type: "email",
                      value: emailForReset,
                      onChange: (e) => setEmailForReset(e.target.value),
                    },
                  ]}
                  confirmButtonText={"Enviar"}
                  cancelButtonText={"Cancelar"}
                  onCancel={() => setShowDialog(false)}
                  onConfirm={handleForgotPassword}
                />
              )}
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
