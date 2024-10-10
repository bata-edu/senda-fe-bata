import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLevelInfo } from '../../features/level/levelSlice';
import robot from '../../assets/robot.png';
import '../../styles/mainContent.css';

const MainContent = () => {
  const dispatch = useDispatch();
  const { levelsInfo = [], page, loading } = useSelector((state) => state.level || {});
  const { progress } = useSelector((state) => state.userProgress || {});
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hasMoreLevels, setHasMoreLevels] = useState(true);
  const [showNoMoreLevels, setShowNoMoreLevels] = useState(false);
  const sentinelRef = useRef(null);
  const courseId = "66fc2fb14c227e973f81b4d1";
  const levelRefs = useRef({});

  const currentLevel = levelsInfo.find((level) => level._id === progress.currentLevel);
  const currentLevelIndex = levelsInfo.findIndex((level) => level._id === progress.currentLevel);
  const currentSectionIndex = currentLevel?.sections.findIndex((section) => section._id === progress.currentSection) || 0;

  const getImageSrc = (index) => {
    const sectionNumber = (index % 6) + 1;
    return require(`../../assets/sections-icons-enabled/seccion ${sectionNumber}.png`);
  };

  const getMarginStyle = (index) => {
    return (index + 1) % 2 === 0 ? { marginRight: '120px' } : { marginLeft: '120px' };
  };

  useEffect(() => {
    
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMoreLevels && !loading) {
          try {

            if (window.location.hash) {
              window.history.replaceState(null, null, window.location.pathname);
            }

            const response = await dispatch(fetchLevelInfo({ courseId, page, limit: 3 })).unwrap();
            if (response.levels.length > 0) {
            } else {
              setHasMoreLevels(false);
              setShowNoMoreLevels(true); 
            }
          } catch (error) {
            console.error('Error loading more levels:', error);
          }
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.5
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [page, hasMoreLevels, dispatch]);

  useEffect(() => {
    const handleHashChange = async () => {
      const levelId = window.location.hash.replace('#', '');
      if(levelId){
        let targetLevel = levelsInfo.find((level) => level._id === levelId);
  
        while (!targetLevel && hasMoreLevels && !loading) {
          try {
            const response = await dispatch(fetchLevelInfo({ courseId, page, limit: 3 })).unwrap();
            if (response.levels.length === 0) {
              setHasMoreLevels(false);
              break;
            }
            targetLevel = response.levels.find((level) => level._id === levelId);
          } catch (error) {
            console.error('Error fetching levels:', error);
            setHasMoreLevels(false);
            break;
          }
        }
  
        if (targetLevel) {
          const targetElement = levelRefs.current[levelId];
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [levelsInfo]);

  useEffect(() => {
    if (showNoMoreLevels) {
      const timer = setTimeout(() => {
        setShowNoMoreLevels(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoMoreLevels]);

  return (
    <div className="main-content">
      {levelsInfo?.length ? (
        <div className="progress-path">
          <div className="level-container">
            {levelsInfo.map((level, levelIndex) => (
              <div key={level._id} 
                className={`level-info
                ${levelIndex <= currentLevelIndex ? 'active' : 'disabled'}`}
                ref={(el) => (levelRefs.current[level._id] = el)}
                >
                <div className="level-header">
                  <h2>{`NIVEL ${level.order}`}</h2>
                </div>
                <div className="section-content">
                  <div className="snake-path">
                    {level.sections.map((section, sectionIndex) => (
                      <div 
                        key={section._id} 
                        className={`section-icon ${levelIndex < currentLevelIndex || (levelIndex === currentLevelIndex && sectionIndex <= currentSectionIndex) ? 'active' : 'disabled'}`}
                        style={getMarginStyle(sectionIndex)}
                        onMouseEnter={() => setHoveredSection(section.name)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        <img src={getImageSrc(sectionIndex)} alt={`Section ${sectionIndex + 1}`} />
                      </div>
                    ))}
                  </div>
                  <div className="robot">
                    <img src={robot} alt="Robot" />
                  </div>
                </div>
                <div className='robot-final-container'>
                  <div className='robot-final'>
                    <img src={robot} alt="Robot" />
                  </div>
                </div>
                <div className='final-project-container'>
                  <div className='final-project-title'>
                    <h3>{level.finalLevelProject[0]?.title}</h3>
                  </div>
                  
                </div>
              </div>
            ))}
            <div ref={sentinelRef} className="sentinel"></div>
          </div>
        </div>
      ) : (
        <div className="no-progress">
          <h2>You are not enrolled in any courses</h2>
        </div>
      )}
      {showNoMoreLevels && (
        <div className="no-more-levels">
          No hay más niveles disponibles.
        </div>
      )}
      {hoveredSection && (
        <div className="section-tooltip">
          {hoveredSection}
        </div>
      )}
    </div>
  );
};

export default MainContent;
