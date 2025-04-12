import React from "react";
import { useSelector } from "react-redux";

import "../../styles/profile.css";
import LoadingPage from "../LoadingPage";
import UserInfo from "../../components/profile/UserInfo";
import Streaks from "../../components/profile/Streaks";

const Profile = () => {
  const { user } = useSelector((state) => state.auth || {});

  if (!user) {
    return <LoadingPage message={"Cargando perfil..."} />;
  }

  return (
    <div className="profile-container">
      <UserInfo user={user} />
      <Streaks />
    </div>
  );
};

export default Profile;
