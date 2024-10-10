import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, forgotPassword, verifyEmail } from '../../features/auth/authService';
import '../../styles/login.css';
import logoImage from '../../assets/logo 3.png'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MySwal = withReactContent(Swal);

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmailToken = async (token) => {
    try {
      await verifyEmail(token);
      toast.success('¡Correo verificado exitosamente!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar el correo');
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      validateEmailToken(token);
    }
  }, [location.search])

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

  const handleForgotPassword = async () => {
    const { value: emailForReset } = await MySwal.fire({
      title: 'Recuperar Contraseña',
      input: 'email',
      inputPlaceholder: 'Ingresa tu correo electrónico',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Necesitas ingresar un correo electrónico';
        }
      },
    });

    if (emailForReset) {
      try {
        await forgotPassword(emailForReset);
        MySwal.fire('¡Éxito!', 'Se ha enviado un enlace para restablecer tu contraseña a tu correo.', 'success');
      } catch (err) {
        MySwal.fire('Error', 'Hubo un problema al enviar el correo. Inténtalo nuevamente.', 'error');
      }
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
          <div className="forgot-password-link">
            <button type="button" className="link-button" onClick={handleForgotPassword}>
              Olvidé mi contraseña
            </button>
          </div>
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
