import React, { useState } from 'react';
import '../../styles/finalWork.css';
import CodeTabs from '../editor/CodeTabs'; 
import Editor from '../editor/Editor';
import Preview from '../editor/Preview';
const {useNavigate} = require("react-router-dom");

const FinalWork = ({ title, description, dueDate, attemptsLeft }) => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeTab, setActiveTab] = useState('HTML');
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="final-work-container">
      <div className="header">
        <h1 className="title">{title}</h1>
        <div className="header-info">
          <span className="due-date">Fecha de Vencimiento: {dueDate}</span>
          <span className="attempts-left">Intentos Restantes: {attemptsLeft}</span>
        </div>
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
      </div>

      {/* Contenido de la descripción */}
      <div className="description">{description}</div>

      <div className="main-content">
        {/* Dialogo del robot al costado */}
        <div className="robot-container">
          <div className="speech-bubble">
            ¡No olvides completar tu trabajo a tiempo!
          </div>
          <img src="/robot.png" alt="Robot" className="robot-image" />
        </div>

        <div className="editor-preview-container">
          {/* Pestañas para elegir entre HTML y CSS */}
          <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Componente de Editor */}
          <Editor
            activeTab={activeTab}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
            cssCode={cssCode}
            setCssCode={setCssCode}
          />

          {/* Botón para activar la previsualización */}
          <button onClick={() => setPlay(!play)} className="play-button">
            Jugar
          </button>

          {/* Componente de Previsualización */}
          <Preview htmlCode={htmlCode} cssCode={cssCode} play={play} />
        </div>
      </div>
    </div>
  );
};

export default FinalWork;
