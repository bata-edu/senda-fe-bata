import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLevelInfo } from '../features/level/levelSlice';
import { fetchUser } from '../features/user/userSlice';
import Sidebar from '../components/home/SideBar';
import MainContent from '../components/home/MainContent';
import SidebarRight from '../components/home/SideBarRight';
import '../styles/home.css';

const Home = () => {
  const dispatch = useDispatch();
  const courseId = "66fc2fb14c227e973f81b4d1";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try{
        await Promise.all([
          dispatch(fetchLevelInfo({ courseId, page: 0, limit: 3 })),
          dispatch(fetchUser())
        ]);
        setLoading(false);
      } catch (error) {
        setLoading(true)
      }
    };
    fetchData();
  }, [dispatch, courseId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="home-container">
      <Sidebar />
      <MainContent />
      <SidebarRight />
    </div>
  );
};

export default Home;
