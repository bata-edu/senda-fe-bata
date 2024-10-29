import React, { useState, useEffect } from 'react';
import '../../styles/finalWork.css';
import CodeTabs from '../editor/CodeTabs'; 
import Editor from '../editor/Editor';
import Preview from '../editor/Preview';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinalLevelInfo } from '../../features/level/levelSlice';
import { submitFinalLevel } from '../../features/userProgress/userProgressSlice';

const FinalWork = ({ advance, progress, levelId, index }) => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeTab, setActiveTab] = useState('HTML');
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const finalLevelProyect = useSelector((state) => state.level.finalLevelProyect);

  useEffect(() => {
    if (progress) {
      const id = levelId || progress.currentLevel;
      dispatch(fetchFinalLevelInfo({id}));
      const response = levelId ? progress.finalProjectLevel.previousResponses[index] : progress.finalProjectLevel.previousResponses.at(-1);
      parseFinalResponse(response);
    }
  }, [progress]);

  const decodeHTML = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
  };
  
  const parseFinalResponse = (finalResponse) => {
    const decodedResponse = decodeHTML(finalResponse);
  
    const cssMatch = decodedResponse.match(/<style>([\s\S]*?)<\/style>/);
    const cssCode = cssMatch ? cssMatch[1].trim() : '';
  
    const htmlCode = decodedResponse.replace(/<style>[\s\S]*?<\/style>/, '').trim();
  
    setHtmlCode(htmlCode);
    setCssCode(cssCode);
  };

  const handleSubmitFinalProject = async () => {
    if(levelId){
      navigate('/home');
      return;
    }
    const finalProjectCode = `
      <style>${cssCode}</style>
      ${htmlCode}
    `;

    const body = {
      userResponse :finalProjectCode
    };

    await dispatch(submitFinalLevel({ 
      levelId: progress.currentLevel, 
      body 
    }));
    advance();
  }

  return (
    <div className="final-work-container">
      <div className="header">
        <h1 className="title">{finalLevelProyect?.title}</h1>
        <div className="header-info">
          <span className="due-date">Fecha de Vencimiento: {progress?.finalProjectLevel?.expirationDate}</span>
          <span className="attempts-left">Intentos Restantes: {progress?.finalProjectLevel.attemptsLeft}</span>
        </div>
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
      </div>

      <div className="description">{finalLevelProyect?.description}</div>

      <div className="main-content">
        <div className="robot-container-finalwork">
          <div className="speech-bubble">
            ¡No olvides completar tu trabajo a tiempo!
          </div>
          <img src="/robot.png" alt="Robot" className="robot-image-finalwork" />
        </div>

        <div className="editor-preview-container">
          <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <Editor
            activeTab={activeTab}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
            cssCode={cssCode}
            setCssCode={setCssCode}
          />

          <button onClick={() => setPlay(!play)} className="play-button">
            Jugar
          </button>

          <Preview htmlCode={htmlCode} cssCode={cssCode} play={play} />
          <button onClick={handleSubmitFinalProject} className="submit-button">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalWork;
