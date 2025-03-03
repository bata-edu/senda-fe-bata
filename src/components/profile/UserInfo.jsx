import React from "react";
import { useSelector } from "react-redux";
import userImage from "../../assets/profile.png";
import "../../styles/profile.css";

const UserInfo = () => {
  const { user } = useSelector((state) => state.user || {});
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month}. ${year}`;
}
  return (
    <div className="user-info-container">
      {user && (
        <div>
          <div className="image-icons-div">
            <img className="profile-img" src={userImage} alt="User profile" />

            <div>
              {/* <EditIcon width="30px" height="30px" />
              <SettingsIcon width="30px" height="30px" /> */}
            </div>
          </div>
          <div className="name-created-div">
            <span className="user-name">
              {user.name} {user.lastName}
            </span>
            <span className="">{user.email}</span>
            <span className="">Se unió el {parseDate(user.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
