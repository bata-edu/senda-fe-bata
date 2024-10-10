import React from "react";
import Preview from "../components/editor/Preview";
import { useState } from "react";
import CodeTabs from "../components/editor/CodeTabs";
import Editor from "../components/editor/Editor";
import "../styles/editor.css";

const EditorPage = () => {
    const [htmlCode, setHtmlCode] = useState('');
    const [cssCode, setCssCode] = useState('');
    const [activeTab, setActiveTab] = useState('html');
    const [play, setPlay] = useState(false);
  
    return (
      <div className="code-editor-container">
        <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Editor
          activeTab={activeTab}
          htmlCode={htmlCode}
          setHtmlCode={setHtmlCode}
          cssCode={cssCode}
          setCssCode={setCssCode}
        />
        <button onClick={() => setPlay(!play)} className="play-button">
          Play
        </button>
        <Preview htmlCode={htmlCode} cssCode={cssCode} play={play} />
      </div>
    );
}

export default EditorPage