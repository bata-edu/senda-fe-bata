import React from 'react';
import logoImage from '../../assets/logo 3.png'
import logoutIcon from '../../assets/logOut.svg'
import {getAuthData, logoutUser} from '../../features/auth/authService'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RESET_STATE } from '../../utils/constants';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {rank} = useSelector((state) => state.user || {});

  const {user} = getAuthData();

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
          {rank && rank.length
            ? rank.map((rankUser, index) => (
                <li
                  key={rankUser.id}
                  className={`ranking-item ${
                    rankUser.id === user?.id ? 'current-user' : ''
                  } ${index === 0 ? 'first-place' : ''}`}
                >
                  {index === 0 && '👑 '}
                  {index + 1}º {rankUser.name.toUpperCase()}{' '}
                  <span>{rankUser.points}</span>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
