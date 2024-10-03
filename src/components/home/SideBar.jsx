import React from 'react';
import logoImage from '../../assets/logo 3.png'

const Sidebar = () => {
  return (
      <div className="sidebar">
        <div className='logo-sideBar'>
            <img src={logoImage}/>
        </div>
      <ul className="nav-list">
        <li><a href="#">APRENDER</a></li>
        <li><a href="#">NIVELES</a></li>
        <li><a href="#">PERFIL</a></li>
        <li><a href="#">LIBRE</a></li>
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
