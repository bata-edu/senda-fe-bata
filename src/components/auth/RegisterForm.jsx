import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authService';
import '../../styles/register.css'
import logoImage from '../../assets/logo 3.png'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      await registerUser({ email, password, name, lastName, confirmPassword });
      MySwal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ve tu correo electrónico para terminar el proceso',
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="register-page">
        <div className='logo'>
          <img src={logoImage} />
        </div>
      <div className="register-container">
        <h1 className="create-profile">Crea tu perfil</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control input-field"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control input-field"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control input-field"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control input-field"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="register-btn"
            disabled={!email || !password || !confirmPassword || !name || !lastName}
          >
            {'Crear cuenta'}
          </button>
        </form>

        <div className="social-login">
          <button className="facebook-btn">Facebook</button>
        </div>

        {error && <p className="error-auth">{error}</p>}

        <div className="separator">
          <hr className="line" />
          <hr className="line" />
        </div>
        
        <div className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>

        <p className="terms">
          Al registrarte en Bata, aceptas nuestros Términos y Política de privacidad. Esta página está protegida por reCAPTCHA Enterprise.
        </p>

      </div>
    </div>
  );
};


export default RegisterForm;
