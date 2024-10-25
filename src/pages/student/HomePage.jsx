import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLevels, fetchLevelInfo } from "../../features/level/levelSlice";
import { fetchUser } from "../../features/user/userSlice";
import { fetchRank } from "../../features/user/userSlice";
import Sidebar from "../../components/home/SideBar";
import SidebarRight from "../../components/home/SideBarRight";
import "../../styles/home.css";
import { Outlet } from "react-router-dom";
import LoadingPage from "../LoadingPage";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { page, levels } = useSelector((state) => state.level || {});
  const { selectedModule } = useSelector((state) => state.modules || {});

  useEffect(() => {
    if (levels && levels.length) {
      return;
    }
    const fetchData = async () => {
      try {
        dispatch(fetchRank());
        if (!selectedModule) return;
        setLoading(true);

        await Promise.all([
          dispatch(
            fetchLevelInfo({ courseId: selectedModule, page, limit: 3 })
          ),
          dispatch(fetchAllLevels({ courseId: selectedModule })),
        ]);

        dispatch(fetchUser());
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(true);
      }
    };
    fetchData();
  }, [dispatch, selectedModule]);

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <div className="home-container">
        <Sidebar />
        <div className="main-container">
          <Outlet />
        </div>
        <SidebarRight />
      </div>
    );
  }
};

export default Home;
