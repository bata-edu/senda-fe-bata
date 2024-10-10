import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../features/auth/authService';
import Swal from 'sweetalert2';
import logoImage from '../../assets/logo 3.png';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


const ResetPasswordForm = ({token}) => {
  const [email, setEmail] = useState('');
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
    <div className="reset-password-page">
      <div className="logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <div className="reset-password-container">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Restablecer Contraseña</h2>
          <div className="form-group">
            <input
              type="password"
              className="form-control input-field"
              placeholder="Nueva Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control input-field"
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-btn">
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
