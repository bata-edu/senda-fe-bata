import React from 'react';
import laptopImage from '../../assets/laptop.png'

const SidebarRight = () => {
  return (
    <div className="sidebar-right">
      <div className="icons">
        <span className="bell-icon">🔔</span>
        <span className="flame-icon">🔥 4</span>
        <span className="heart-icon">❤️ 2</span>
      </div>
      <div className="web-preview">
        <h3>Mi página web</h3>
        <div className="preview-images">
          <img src={laptopImage} alt="Laptop 1" />
          <img src={laptopImage} alt="Laptop 2" />
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
