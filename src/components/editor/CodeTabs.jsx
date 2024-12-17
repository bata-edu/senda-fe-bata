import React from 'react';

const CodeTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4">
      {['html', 'css', 'javascript'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-sm font-semibold px-4 py-1 rounded transition-colors ${
            activeTab === tab
              ? 'bg-[#2A3A44] text-white'
              : 'text-gray-700 hover:bg-[#1D2B33]'
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CodeTabs;
