import React, { useState } from "react";
import { registerUser, googleRegister, registerTeacher } from "../../features/auth/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import logoImage from "../../assets/logo.svg";
import simpleLogo from "../../assets/simple-logo.svg";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isTeacher) {
        await registerTeacher({ name, lastName, email, password, confirmPassword, code });
        MySwal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Tu cuenta de maestro ha sido creada exitosamente.",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/login");
        });
      } else {
        await registerUser({ email, password, name, lastName, confirmPassword });
        MySwal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Ve tu correo electrónico para terminar el proceso",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    }
  };

  const handleGoogleRegister = async (response) => {
    try {
      await googleRegister(response.credential);
      MySwal.fire({
        icon: "success",
        title: "Registro con Google exitoso",
        text: "Ve tu correo electrónico para terminar el proceso",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar con Google");
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
            <h2 className="text-xl font-bold text-center text-gray-800">Crea tu perfil</h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Regístrate para empezar a usar Bata.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Correo"
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
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
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
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Código de Escuela
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="Código de Escuela"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className={`w-full py-2 text-white font-bold rounded-lg ${
                  !email || !password || !confirmPassword || !name || !lastName || (isTeacher && !code)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-strongBlue hover:bg-strongBlue-600"
                }`}
                disabled={
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !name ||
                  !lastName ||
                  (isTeacher && !code)
                }
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
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="text-strongBlue hover:underline">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterForm;
