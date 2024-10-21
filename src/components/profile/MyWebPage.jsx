import React from "react";
import { useSelector } from "react-redux";
import "../../styles/profile.css";
import laptopImage from "../../assets/laptop.png";

const MyWebPage = () => {
  const { user } = useSelector((state) => state.user || {});

  return (
    <div className="web-page-container">
      {user && (
        <div>
          <span className="web-page-title">Mi pagina web</span>
          <div className="laptop-containter">
            <span>Codigo / Pagina</span>
            <img src={laptopImage} alt="Laptop 1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWebPage;
