import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import robot from '../../assets/robot.png';

const MainContent = () => {
  const { levelsInfo = [] } = useSelector((state) => state.level || {});
  const [hoveredSection, setHoveredSection] = useState(null);

  const getImageSrc = (index) => {
    const sectionNumber = (index % 6) + 1;
    return require(`../../assets/sections-icons-enabled/seccion ${sectionNumber}.png`);
  };

  const getMarginStyle = (index) => {
    return (index + 1) % 2 === 0 ? { marginRight: '120px' } : { marginLeft: '120px' };
  };

  return (
    <div className="main-content">
      {levelsInfo?.length ? (
        <div className="progress-path">
          <div className="section-container">
            {levelsInfo.map((level) => (
              <div key={level._id} className="level-stars">
                <div className="section-header">
                  <h2>{`LEVEL ${level.order}`}</h2>
                </div>
                <div className="section-content">
                  <div className='snake-path'>
                  {level.sections.map((section, index) => (
                    <div 
                    key={section._id} 
                    className="section-icon"
                    style={getMarginStyle(index)}
                    onMouseEnter={() => setHoveredSection(section.name)}
                    onMouseLeave={() => setHoveredSection(null)}
                    >
                      <img src={getImageSrc(index)} alt={`Section ${index + 1}`} />
                    </div>
                  ))}
                  </div>
                <div className="robot">
                  <img src={robot} alt="Robot" />
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-progress">
          <h2>You are not enrolled in any courses</h2>
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
