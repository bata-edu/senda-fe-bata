import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

const Editor = ({ activeTab, htmlCode, setHtmlCode, cssCode, setCssCode, jsCode, setJsCode }) => {
  const handleChange = React.useCallback(
    (value) => {
      if (activeTab === 'index.html') setHtmlCode(value);
      if (activeTab === 'style.css') setCssCode(value);
      if (activeTab === 'script.js') setJsCode(value);
    },
    [activeTab, setHtmlCode, setCssCode, setJsCode]
  );

  const extensions = React.useMemo(() => {
    if (activeTab === 'index.html') return [html()];
    if (activeTab === 'style.css') return [css()];
    if (activeTab === 'script.js') return [javascript()];
    return [];
  }, [activeTab]);

  return (
    <div className="flex-grow overflow-hidden">
      <CodeMirror
        value={activeTab === 'index.html' ? htmlCode : activeTab === 'style.css' ? cssCode : jsCode}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        onChange={handleChange}
      />
    </div>
  );
};

export default Editor;
