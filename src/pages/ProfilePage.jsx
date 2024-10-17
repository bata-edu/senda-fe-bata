import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLevels, fetchLevelInfo } from "../features/level/levelSlice";
import { fetchUser } from "../features/user/userSlice";
import { fetchUserProgress } from "../features/userProgress/userProgressSlice";

import "../styles/profile.css";
import LoadingPage from "./LoadingPage";
import UserInfo from "../components/profile/UserInfo";
import Streaks from "../components/profile/Streaks";
import MyWebPage from "../components/profile/MyWebPage";

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { page } = useSelector((state) => state.level || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchUserProgress()).unwrap();
        if (response.length > 0) {
          await Promise.all([
            dispatch(
              fetchLevelInfo({ courseId: response[0].course, page, limit: 3 })
            ),
            dispatch(fetchAllLevels({ courseId: response[0].course })),
          ]);
        }
        dispatch(fetchUser());
        setLoading(false);
      } catch (error) {
        console.log("Error loading data:", error);
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
