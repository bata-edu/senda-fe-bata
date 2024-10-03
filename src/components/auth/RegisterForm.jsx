import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authService';
import '../../styles/register.css'
import logoImage from '../../assets/logo 3.png'

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    dispatch(registerUser({ email, password, name, lastName }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className='logo'>
          <img src={logoImage} />
        </div>
        <h1 className="create-profile">Crea tu perfil</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control input-field"
              placeholder="Nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            disabled={!email || !password || !confirmPassword}
          >
            {'Crear cuenta'}
          </button>
        </form>


        <div className="social-login">
          <button className="facebook-btn">Facebook</button>
        </div>

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
