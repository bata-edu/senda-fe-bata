import React from 'react';
import codeIcon from '../../assets/icons/code.svg';

const CodeTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4">
      {['index.html', 'style.css', 'script.js'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-[#CBD1D6] flex text-xs bg-[#1D2B33] font-semibold px-4 py-1 rounded transition-colors ${
            activeTab === tab
              ? 'bg-[#2A3A44] text-white'
              : 'text-gray-700 hover:bg-[#1D2B33]'
          }`}
        >
          <img src={codeIcon} alt="Code" className="w-3 h-3 text-center mr-3 mt-0.5" />
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CodeTabs;
