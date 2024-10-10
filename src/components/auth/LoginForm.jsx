import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authService';
import '../../styles/login.css';
import logoImage from '../../assets/logo 3.png'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
        <div className='logo'>
          <img src={logoImage} alt="" />
        </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Iniciar sesión</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control input-field"
              placeholder="Usuario"
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
          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          {error && <p className="error-auth">{error}</p>}
          <div className="signup-link">
            ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
