import React, { useEffect } from "react";
import Preview from "../../components/editor/Preview";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeTabs from "../../components/editor/CodeTabs";
import Editor from "../../components/editor/Editor";
import "../../styles/editor.css";
import { createUserFreeModeProgress, fetchUserFreeModeProgress, updateUserFreeModeProgress } from "../../features/user/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditorPage = () => {
    const dispatch = useDispatch();
    const [htmlCode, setHtmlCode] = useState('');
    const [cssCode, setCssCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    const [activeTab, setActiveTab] = useState('html');
    const [play, setPlay] = useState(false);
    const {freeModeProgress} = useSelector((state) => state.user);

    const handleClear = () => {
      setHtmlCode('');
      setCssCode('');
      setJsCode('');
      setPlay(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        if (!freeModeProgress) {
          await dispatch(fetchUserFreeModeProgress());
        }
        if (freeModeProgress && freeModeProgress.code) {
          parseCode(freeModeProgress.code);
        }
      };
  
      fetchData();
    }, [dispatch, freeModeProgress]);

    const decodeHTML = (str) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'text/html');
      return doc.documentElement.textContent;
    };

    const parseCode = (code) => {
      const parsedCode = JSON.parse(code);
      if(parsedCode.html){
        const htmlDecoded = decodeHTML(parsedCode.html);
        setHtmlCode(htmlDecoded);
      }
      if(parsedCode.css){
        const cssDecoded = decodeHTML(parsedCode.css);
        setCssCode(cssDecoded);
      }
      if(parsedCode.javascript){
        const jsDecoded = decodeHTML(parsedCode.javascript);
        setJsCode(jsDecoded);
      }
    }

    const handleSave = async () => {
      try{
        const code = {
          html: htmlCode,
          css: cssCode,
          javascript: jsCode
        };
        if(freeModeProgress){
          await dispatch(updateUserFreeModeProgress({code}));
        } else{
          await dispatch(createUserFreeModeProgress({code}));
        }
        toast.success('Codigo guardado con exito', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      catch(err){
        console.error(err);
      }
    }
  
    return (
      <div className="code-editor-container">
        <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Editor
          activeTab={activeTab}
          htmlCode={htmlCode}
          setHtmlCode={setHtmlCode}
          cssCode={cssCode}
          setCssCode={setCssCode}
          jsCode={jsCode}
          setJsCode={setJsCode}
        />
        <button onClick={() => setPlay(!play)} className="play-button">
          Jugar
        </button>
        <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} play={play} />
        <div className="action-buttons">
        <button onClick={handleClear} className="clear-button">
          Borrar
        </button>
        <button onClick={handleSave} className="save-button">
          Guardar
        </button>
      </div>
      </div>
    );
}

export default EditorPage