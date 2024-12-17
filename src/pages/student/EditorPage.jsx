import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeTabs from "../../components/editor/CodeTabs";
import Editor from "../../components/editor/Editor";
import Preview from "../../components/editor/Preview";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  createUserFreeModeProgress,
  fetchUserFreeModeProgress,
  updateUserFreeModeProgress,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";

const EditorPage = () => {
  const dispatch = useDispatch();
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [play, setPlay] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  const { freeModeProgress } = useSelector((state) => state.user);

  const handleClear = () => {
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
    setPlay(false);
  };

  const handleSave = async (exportFiles = false) => {
    const code = { html: htmlCode, css: cssCode, javascript: jsCode };
    try {
      if (freeModeProgress) {
        await dispatch(updateUserFreeModeProgress({ code }));
      } else {
        await dispatch(createUserFreeModeProgress({ code }));
      }
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
    const fetchData = async () => {
      if (!freeModeProgress) await dispatch(fetchUserFreeModeProgress());
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

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
        <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex gap-4">
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
              <div className="absolute right-0 mt-2 w-48 bg-[#A5BAEB]  font-semibold rounded-md shadow-lg z-10">
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
