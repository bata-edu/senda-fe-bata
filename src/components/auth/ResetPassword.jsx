import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../features/auth/authService';
import Swal from 'sweetalert2';
import logoImage from '../../assets/logo.svg';
import simpleLogo from '../../assets/simple-logo.svg';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ResetPasswordForm = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      MySwal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      await resetPassword(password, token);
      MySwal.fire('Éxito', 'Tu contraseña ha sido restablecida', 'success').then(() => {
        navigate('/login');
      });
    } catch (err) {
      MySwal.fire('Error', err.response?.data?.message || 'Error al restablecer contraseña', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl p-4 flex items-center">
          <img src={logoImage} alt="Logo Bata" className="h-8" />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center bg-grayBg">
        <div className="w-full max-w-sm bg-grayBg rounded-lg p-6">
          <img src={simpleLogo} alt="Logo Bata" className="h-16 mx-auto my-3" />
          <h2 className="text-xl font-bold text-center text-gray-800">Restablecer Contraseña</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Ingresa tu nueva contraseña para continuar.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Nueva Contraseña"
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
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirmar Nueva Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 text-white font-bold rounded-lg ${
                !password || !confirmPassword
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-strongBlue hover:bg-strongBlue-600'
              }`}
              disabled={!password || !confirmPassword}
            >
              Restablecer Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
