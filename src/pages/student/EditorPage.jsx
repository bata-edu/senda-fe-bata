import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeTabs from "../../components/editor/CodeTabs";
import Editor from "../../components/editor/Editor";
import Preview from "../../components/editor/Preview";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  fetchUserFreeModeProgressById,
  updateUserFreeModeProgress,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { getUser } from "../../features/auth/authService";
import { getSubmissionById, gradeSubmission, submitExam } from "../../features/exam/examSlice";
import GenericDialog from "../../components/common/dialog/dialog"

const EditorPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {id} = useParams();
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [play, setPlay] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const { freeModeProgress } = useSelector((state) => state.user);
  const {examToCorrect} = useSelector((state) => state.exam);
  const [showCorrectDialog, setShowCorrectDialog] = useState(false);
  const [score, setScore] = useState(0);
  
  const handleClear = () => {
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
    setPlay(false);
  };
  
  const getQueryParam = (param) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };
  const [examId, setExamId] = useState(getQueryParam('examId'));
  const [isTeacher, setIsTeacher] = useState(getQueryParam('teacherRole') === '$true');

  const handleSave = async (exportFiles = false) => {
    const code = { html: htmlCode, css: cssCode, javascript: jsCode };
    try {
      await dispatch(updateUserFreeModeProgress({ code, id }));
      toast.success("Código guardado con éxito");

      if (exportFiles) {
        exportProjectFiles();
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
    setShowSaveOptions(false);
  };

  const exportProjectFiles = () => {
    const zip = new JSZip();

    zip.file("index.html", htmlCode);
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "project.zip");
      toast.success("Proyecto exportado como ZIP");
    });
  };

  useEffect(() => {
    if(isTeacher){
      if(!examToCorrect){
        const getSubmission = async () => {
          await dispatch(getSubmissionById(id));
        };
        getSubmission();
      }
    } else{
      const fetchData = async () => {
        if (!freeModeProgress) await dispatch(fetchUserFreeModeProgressById({id}));
        if (freeModeProgress && freeModeProgress.code) {
          parseCode(freeModeProgress.code);
        }
      };
      fetchData();
    }
  }, [dispatch, freeModeProgress]);

  useEffect(() => {
    if(examToCorrect){
      parseCode(examToCorrect.answer);
    }
  }, [examToCorrect]);

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

  const handleSubmit = async () => {
    try {
      const body = {
        answer: JSON.stringify({ html: htmlCode, css: cssCode, javascript: jsCode }),
        student: getUser().id,
        exam: examId,
      };

      await dispatch(submitExam({body}));
      toast.success("Examen entregado con éxito");
    } catch (error) {
      console.error("Error al entregar el examen:", error);
    }
  }

  const handleCorrect = async () => {
    try {
      await dispatch((gradeSubmission({id: (examToCorrect.id || examToCorrect._id), score})));
      toast.success("Examen corregido con éxito");
      setShowCorrectDialog(false);
    } catch (error) {
      console.error("Error al corregir el examen:", error);
  }
  }

  return (
    <div className="flex flex-col h-screen">
    {showCorrectDialog && 
    <GenericDialog 
      title={"Corregir examen"}
      type="form"
      description={"Ingrese la calificación del examen"}
      onConfirm={handleCorrect}
      onCancel={() => setShowCorrectDialog(false)}
      cancelButtonText="Cancelar"
      confirmButtonText="Corregir"
      inputs={[{type: "number", placeholder: "Calificación", value: score, onChange: (e) => setScore(e.target.value)}]}
      />
    }
      <nav className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
        <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex gap-4">
  {isTeacher ? (
    <div className="flex gap-4">
    <button
      onClick={() => setPlay(!play)}
      className="bg-[#E0F47E] text-black font-semibold px-4 py-1 rounded hover:bg-[#D9F0A3]"
    >
      Ejecutar
    </button>
    <button className="bg-blue-500 px-4 py-1 font-semibold rounded hover:bg-blue-600" onClick={() => setShowCorrectDialog(true)}>
      Calificar
    </button>
    </div>
  ) : (
    <>
      <button
        onClick={handleClear}
        className="bg-[#EE5E37] px-4 py-1 font-semibold rounded hover:bg-[#E76B4D]"
      >
        Borrar
      </button>
      <button
        onClick={() => setPlay(!play)}
        className="bg-[#E0F47E] text-black font-semibold px-4 py-1 rounded hover:bg-[#D9F0A3]"
      >
        Ejecutar
      </button>
      <div className="relative">
        <button
          onClick={() => setShowSaveOptions(!showSaveOptions)}
          className="bg-[#A5BAEB] px-4 py-1 font-semibold rounded hover:bg-[#9CB0E3]"
        >
          Guardar
        </button>
        {showSaveOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-[#A5BAEB] font-semibold rounded-md shadow-lg z-10">
            <button
              onClick={() => handleSave(false)}
              className="block w-full px-4 py-2 text-left hover:bg-[#9CB0E3] rounded-md"
            >
              Solo Guardar
            </button>
            <button
              onClick={() => handleSave(true)}
              className="block w-full px-4 py-2 text-left hover:bg-[#9CB0E3] rounded-md"
            >
              Guardar y Exportar
            </button>
          </div>
        )}
      </div>
      {examId && (
        <button
          onClick={handleSubmit}
          className="bg-[#A5BAEB] px-4 py-1 font-semibold rounded hover:bg-[#9CB0E3]"
        >
          Entregar
        </button>
      )}
    </>
  )}
</div>

      </nav>

      <div className="flex flex-grow">
        <div className="w-1/2 bg-gray-800 text-white p-4 overflow-hidden">
          <Editor
            activeTab={activeTab}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
            cssCode={cssCode}
            setCssCode={setCssCode}
            jsCode={jsCode}
            setJsCode={setJsCode}
          />
        </div>
        <div className="w-1/2 bg-white border-l p-4">
          <Preview
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            play={play}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
