import React, { useState } from "react";
import {
  registerUser,
  googleRegister,
  registerTeacher,
} from "../../features/auth/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import logoImage from "../../assets/logo.svg";
import simpleLogo from "../../assets/simple-logo.svg";
import SuccessDialog from "../common/dialog/successDialog";
import { TextInput } from "../common/input/Input";

const MySwal = withReactContent(Swal);

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
      setPasswordError("Debe contener al menos una letra y un número");
    } else {
      setPasswordError("");
    }
    setPassword(value);
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmPasswordError("");
    }
    setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isTeacher) {
        await registerTeacher({
          name,
          lastName,
          email,
          password,
          confirmPassword,
          code,
        });
        setShowSuccessDialog(true);
      } else {
        await registerUser({
          email,
          password,
          name,
          lastName,
          confirmPassword,
        });
        setShowSuccessDialog(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    }
  };

  const handleGoogleRegister = async (response) => {
    try {
      await googleRegister(response.credential);
      setShowSuccessDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar con Google");
    }
  };

  const isFormInvalid =
    !email ||
    !password ||
    !confirmPassword ||
    !name ||
    !lastName ||
    (isTeacher && !code) ||
    passwordError ||
    confirmPasswordError;

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
            <img
              src={simpleLogo}
              alt="Logo Bata"
              className="h-16 mx-auto my-3"
            />
            <h2 className="text-xl font-bold text-center text-gray-800">
              Crea tu perfil
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Regístrate para empezar a usar Bata.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Nombre"
                id="name"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                label="Apellido"
                id="lastName"
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextInput
                label="Correo"
                id="email"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div>
                <TextInput
                  label="Contraseña"
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
              <div>
                <TextInput
                  label="Confirmar Contraseña"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => validateConfirmPassword(e.target.value)}
                  required
                />
                {confirmPasswordError && (
                  <p className="text-sm text-red-500 mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTeacher"
                  checked={isTeacher}
                  onChange={(e) => setIsTeacher(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isTeacher" className="text-sm text-gray-700">
                  Soy maestro
                </label>
              </div>
              {isTeacher && (
                <TextInput
                  label="Código de Escuela"
                  id="code"
                  type="text"
                  placeholder="Código de Escuela"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              )}
              <button
                type="submit"
                className={`w-full py-2 text-white font-bold rounded-lg ${
                  isFormInvalid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-strongBlue hover:bg-strongBlue-600"
                }`}
                disabled={isFormInvalid}
              >
                Crear cuenta
              </button>
            </form>
            <div className="mt-6 flex flex-col space-y-2">
              <GoogleLogin
                text="signup_with"
                onSuccess={handleGoogleRegister}
                onError={() => setError("Error al autenticar con Google")}
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </div>
        </div>
        {showSuccessDialog && (
          <SuccessDialog
            title="Cuenta registrada con éxito"
            description="Comenzá tu camino en Bata"
            buttonText="Ok"
            onConfirm={() => navigate("/login")}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterForm;
