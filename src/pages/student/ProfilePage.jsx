import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../features/user/userSlice";

import "../../styles/profile.css";
import LoadingPage from "../LoadingPage";
import UserInfo from "../../components/profile/UserInfo";
import Streaks from "../../components/profile/Streaks";
import MyWebPage from "../../components/profile/MyWebPage";

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (user && user.name) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        dispatch(fetchUser());
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(true);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="profile-container">
      <UserInfo />
      <Streaks />
      <MyWebPage />
    </div>
  );
};

export default Profile;
