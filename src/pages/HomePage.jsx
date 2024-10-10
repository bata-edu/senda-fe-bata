import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLevels, fetchLevelInfo } from '../features/level/levelSlice';
import { fetchUser } from '../features/user/userSlice';
import { fetchUserProgress } from '../features/userProgress/userProgressSlice';
import Sidebar from '../components/home/SideBar';
import SidebarRight from '../components/home/SideBarRight';
import '../styles/home.css';
import { Outlet } from 'react-router-dom';
import LoadingPage from './LoadingPage';


const Home = () => {
  const dispatch = useDispatch();
  const courseId = "66fc2fb14c227e973f81b4d1";
  const [loading, setLoading] = useState(true);
  const { page } = useSelector((state) => state.level || {});

  useEffect(() => {
    const fetchData = async () => {
      try{
        await Promise.all([
          dispatch(fetchAllLevels({ courseId })),
          dispatch(fetchLevelInfo({ courseId, page, limit: 3 })),
          dispatch(fetchUser()),
          dispatch(fetchUserProgress(courseId))
        ]);
        setLoading(false);
      } catch (error) {
        setLoading(true)
      }
    };
    fetchData();
  }, [dispatch, courseId]);

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <div className="home-container">
      <Sidebar />
      <div className='main-container'>
        <Outlet />
      </div>
      <SidebarRight />
    </div>
  );
};

export default Home;
