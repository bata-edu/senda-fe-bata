import React from "react";
import { useSelector } from "react-redux";
import userImage from "../../assets/profile.png";
import "../../styles/profile.css";

const UserInfo = () => {
  const { user } = useSelector((state) => state.user || {});
  return (
    <div className="user-info-container">
      <div className="image-icons-div">
        <img className="profile-img" src={userImage} alt="User profile" />

        <div>
          <img className="profile-img" src={userImage} alt="User profile" />
          <img className="profile-img" src={userImage} alt="User profile" />
        </div>
      </div>
      <div className="name-created-div">
        <span className="user-name">
          {user.name} {user.lastName}
        </span>

        <span className="user-nickName">Juan2002</span>
        <span className="user-date">Se unio el 25 de Agosto</span>
      </div>
    </div>
  );
};

export default UserInfo;
