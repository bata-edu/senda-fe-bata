import React from 'react';

const CodeTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="code-tabs">
          <div
            className={`code-tab ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            HTML
          </div>
          <div
            className={`code-tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            CSS
          </div>
          <div
            className={`code-tab ${activeTab === 'javascript' ? 'active' : ''}`}
            onClick={() => setActiveTab('javascript')}
          >
            JS
          </div>  
        </div>
      );
};

export default CodeTabs;
