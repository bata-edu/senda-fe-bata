import React from 'react';
import logoImage from '../../assets/logo 3.png'
import logoutIcon from '../../assets/logOut.svg'
import {logoutUser} from '../../features/auth/authService'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RESET_STATE } from '../../utils/constants';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser()
    dispatch({type: RESET_STATE})
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
      <div className="sidebar">
        <div className='sidebar-header'>
          <div className='logo-sideBar'>
              <img src={logoImage}/>
          </div>
          <div className="logout-section" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" className="logout-icon" />
          </div>
        </div>
      <ul className="nav-list">
      <li onClick={() => handleNavigation('/home')}>APRENDER</li>
        <li onClick={() => handleNavigation('/home/levels')}>NIVELES</li>
        <li onClick={() => handleNavigation('/home/profile')}>PERFIL</li>
        <li onClick={() => handleNavigation('/home/editor')}>LIBRE</li>
      </ul>

      <div className="league">
        <h2>LIGA</h2>
        <ul className="ranking">
          <li>1º BRUNO <span>87 pts</span></li>
          <li>2º LUCAS <span>75 pts</span></li>
          <li>3º MARTIN <span>61 pts</span></li>
          <li>4º TOMAS <span>50 pts</span></li>
          <li>5º NICOLAS <span>34 pts</span></li>
          <li>6º YO <span>0 pts</span></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
