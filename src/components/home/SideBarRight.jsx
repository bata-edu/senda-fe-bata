import React from 'react';
import { useSelector } from 'react-redux';
import laptopImage from '../../assets/laptop.png';

const SidebarRight = () => {
  const { user } = useSelector((state) => state.user || {});

  return (
    <div className="sidebar-right">
    {user && (
      <div>
      <div className="icons">
        <span className="diamond-icon">💎 {user.points}</span>
        <span className="flame-icon">🔥 {user.streak}</span>
        <span className="heart-icon">❤️ {user.life}</span>
      </div>
      <div className="web-preview">
        <h3>Mi página web</h3>
        <div className="preview-images">
          <img src={laptopImage} alt="Laptop 1" />
          <img src={laptopImage} alt="Laptop 2" />
        </div>
      </div>
      </div>
    )}
    </div>
  );

};

export default SidebarRight;
