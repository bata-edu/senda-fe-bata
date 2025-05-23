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
} from "../../features/user/freeCodeSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
// import { useLocation } from 'react-router-dom';
import { getUser } from "../../features/auth/authService";
// import { getExamById, getSubmissionById, gradeSubmission, submitExam } from "../../features/exam/examSlice";
import Header from "../../components/common/header/Header";
import playIcon from "../../assets/icons/play.svg";
import saveIcon from "../../assets/icons/save.svg";
import uploadIcon from "../../assets/icons/upload.svg";
// import sendIcon from "../../assets/icons/send.svg";
// import readIcon from "../../assets/icons/read.svg";
// import PdfViewer from "../../utils/PdfViewer";
import GenericDialog from "../../components/common/dialog/dialog";
import SuccessDialog from "../../components/common/dialog/successDialog";
import {LoaderCSS} from "../LoadingPage";
// import { getCourseLocalStorage } from "../../features/school/schoolSlice";

const EditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [activeTab, setActiveTab] = useState("index.html");
  const [play, setPlay] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const { freeModeProgress } = useSelector((state) => state.freeCode);
  // const {examToCorrect, exam} = useSelector((state) => state.exam);
  const [showCorrectDialog, setShowCorrectDialog] = useState(false);
  const [score, setScore] = useState(0);
  // const [showConsigna, setShowConsigna] = useState(false);
  const [showSubmitExamDialog, setShowSubmitExamDialog] = useState(false);
  const user = getUser();
  
  // const handleClear = () => {
  //   setHtmlCode("");
  //   setCssCode("");
  //   setJsCode("");
  //   setPlay(false);
  // };
  
  // const getQueryParam = (param) => {
  //   const queryParams = new URLSearchParams(location.search);
  //   return queryParams.get(param);
  // };
  // const [examId, setExamId] = useState(getQueryParam('examId'));
  // const [isTeacher, setIsTeacher] = useState(getQueryParam('teacherRole') === '$true');
  const [saving, setSaving] = useState(false)

  const handleSave = async (exportFiles = false) => {
    const code = { html: htmlCode, css: cssCode, javascript: jsCode };
    try {
      setSaving(true)
      await dispatch(updateUserFreeModeProgress({ code, id })).unwrap();
      toast.success("Código guardado con éxito");
      setSaving(false)

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
  //   if(isTeacher){
  //     if(!examToCorrect){
  //       const getSubmission = async () => {
  //         await dispatch(getSubmissionById(id));
  //       };
  //       getSubmission();
  //     }
    // } else{
      const parseCode = (code) => {
        if(code.html){
          const htmlDecoded = decodeHTML(code.html);
          setHtmlCode(htmlDecoded);
        }
        if(code.css){
          const cssDecoded = decodeHTML(code.css);
          setCssCode(cssDecoded);
        }
        if(code.javascript){
          const jsDecoded = decodeHTML(code.javascript);
          setJsCode(jsDecoded);
        }
      }
      const fetchData = async () => {
        if (!freeModeProgress) await dispatch(fetchUserFreeModeProgressById({id}));
        if (freeModeProgress && freeModeProgress.code) {
          parseCode(freeModeProgress.code);
        }
      };
      fetchData();
      // if(examId){
      //   const fetchExam = async () => {
      //     await dispatch(getExamById(examId));
      // }
      // fetchExam();
      // }
  //   }

  }, [dispatch, freeModeProgress, id]);

  // useEffect(() => {
  //   if(examToCorrect){
  //     parseCode(examToCorrect.answer);
  //   }
  // }, [examToCorrect]);

  const decodeHTML = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
  };

  // const handleSubmit = async () => {
  //   try {
  //     const body = {
  //       answer: JSON.stringify({ html: htmlCode, css: cssCode, javascript: jsCode }),
  //       student: getUser().id,
  //       exam: examId,
  //     };
  //     await dispatch(submitExam({body}));
  //     setShowSubmitExamDialog(true);
  //   } catch (error) {
  //     console.error("Error al entregar el examen:", error);
  //   }
  // }

  // const handleCorrect = async () => {
  //   try {
  //     await dispatch((gradeSubmission({id: (examToCorrect.id || examToCorrect._id), score})));
  //     toast.success("Examen corregido con éxito");
  //     setShowCorrectDialog(false);
  //     const courseId = getCourseLocalStorage();
  //     navigate("/exam-califications/" + courseId);
  //   } catch (error) {
  //     console.error("Error al corregir el examen:", error);
  // }
  // }


  return (
    <div>
      <Header />
      <div className="flex flex-col h-[90vh]">
      {showCorrectDialog && 
      <GenericDialog 
        title={"Corregir examen"}
        type="form"
        description={"Ingrese la calificación del examen"}
        // onConfirm={handleCorrect}
        onCancel={() => setShowCorrectDialog(false)}
        cancelButtonText="Cancelar"
        confirmButtonText="Corregir"
        inputs={[{type: "number", placeholder: "Calificación", value: score, onChange: (e) => setScore(e.target.value)}]}
        />
      }
      {showSubmitExamDialog &&
        <SuccessDialog
          title={"Examen entregado con éxito"}
          description={"Le avisaremos a su profesor que ha entregado el examen"}
          buttonText={"Ver en calificaciones"}
          onConfirm={() => {setShowSubmitExamDialog(false); navigate(`/grades/${user.schoolData.courses[0]}`)}}
        />
      }
        <nav className="bg-[#1D2B33] text-white flex justify-between items-center p-3 shadow-md">
          <div className="flex items-center gap-4 w-6/12">
            <div className="flex justify-center w-full items-center gap-2">
              <img src={uploadIcon} alt="Upload icon" />
              <span>{freeModeProgress?.name}</span>
            </div>
          </div>
          <div className="flex gap-4">
    {/* {isTeacher ? (
      <div className="flex gap-4">
      <button
        onClick={() => setPlay(!play)}
        className="bg-[#141F25] text-[#E0F47E]  font-semibold px-4 py-1 rounded"
      >
        Ejecutar
      </button>
      <button className="bg-[#141F25] px-4 py-1 font-semibold rounded" onClick={() => setShowCorrectDialog(true)}>
        Calificar
      </button>
      </div>
    ) : ( */}
      <>
{/*         <button
          onClick={handleClear}
          className="bg-[#EE5E37] px-4 py-1 font-semibold rounded hover:bg-[#E76B4D]"
        >
          Borrar
        </button> */}
        <button
          onClick={() => setPlay(!play)}
          className="bg-[#141F25] text-[#E0F47E] flex items-center gap-2 font-semibold px-4 py-1 rounded"
        >
          <img src={playIcon} alt="Play icon" />
          <span>
            Ejecutar
          </span>
        </button>
         <div className="relative">
          <button
            onClick={() => setShowSaveOptions(!showSaveOptions)}
            className="bg-[#141F25] flex items-center gap-2 font-semibold px-3 py-1 rounded"
          >
            <img src={saveIcon} alt="Save icon" />
            <span>
              Guardar
            </span>
          </button>
          {showSaveOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-[#141F25] font-semibold rounded-md shadow-lg z-10">
              <button
                onClick={() => handleSave(false)}
                className={
                  `block w-full px-4 py-2 text-left rounded-md h-10  ${saving && "opacity-50 animate-pulse pointer-events-none"}`}
                
              >
                {saving ? (<LoaderCSS width={30} height={20}/>) : "Guardar"}
                
              </button>
              <button
                onClick={() => handleSave(true)}
                className={["block w-full px-4 py-2 text-left rounded-md h-10",
                  saving && "opacity-50 animate-pulse pointer-events-none"
                ]}
              >
                {saving ? (<LoaderCSS width={30} height={20}/>) : "Guardar y exportar"}
              </button>
            </div>
          )}
        </div>
      {/* {examId && (
        <>
          <button className="bg-[#141F25] flex items-center gap-2 font-semibold px-4 py-1 rounded" onClick={() => setShowConsigna(!showConsigna)}>
            <img src={readIcon} alt="Read icon" />
            Consigna
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#141F25] flex items-center gap-2 font-semibold px-4 py-1 rounded"
          >
            <img src={sendIcon} alt="Send icon" />
            Entregar
          </button>
        </>
      )} */}

      </>
    {/* )} */}
    {/* {showConsigna && (
    exam.question.startsWith('http') ? (
    <PdfViewer pdfUrl={exam?.question} onClose={() => setShowConsigna(false)} />
    ) : (
      <GenericDialog 
        title={"Consigna"}
        type="info"
        description={exam.question}
        onCancel={() => setShowConsigna(false)}
        confirmButtonText="Cerrar"
      />
    )  
    )} */}
    </div>

        </nav>
        <div className="bg-[#141F25] p-2">
          <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
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
    </div>
  );
};

export default EditorPage;
