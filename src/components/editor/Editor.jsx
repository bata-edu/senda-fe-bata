import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

const Editor = ({ activeTab, htmlCode, setHtmlCode, cssCode, setCssCode }) => {
  const handleChange = React.useCallback((value) => {
    if (activeTab === 'html') {
      setHtmlCode(value);
    } else {
      setCssCode(value);
    }
  }, [activeTab, setHtmlCode, setCssCode]);

  const extensions = [activeTab === 'html' ? html() : css()];

  return (
    <div className="editor-container">
    <CodeMirror
      value={activeTab === 'html' ? htmlCode : cssCode}
      height="300px"
      width='100%'
      theme={oneDark}
      extensions={extensions}
      onChange={handleChange}
    />
    </div>
  );
};

export default Editor;
