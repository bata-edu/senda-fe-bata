import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../isAuthenticated';

const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default RootRedirect;
