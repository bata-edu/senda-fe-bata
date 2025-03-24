import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Icon from "../../../../../assets/icons/guide.svg"

export const GuideViewer = ({ guide, text, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, guide.length - 1));
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeDialog();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className="p-1 rounded transition flex items-center gap-2"
        onClick={openDialog}
      >
        {text && <span className="font-sans text-[#4558C8] text-lg underline font-semibold">{text}</span>}
        {icon && <img src={Icon} alt=""/>}
      </button>

      {isOpen && (
        <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleBackdropClick}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            <div className="flex justify-between items-center mb-4">
              <button 
                className="text-gray-500 hover:text-gray-800"
                onClick={closeDialog}
              >
                ✕
              </button>
            </div>

            {/* Contenido del markdown */}
            <div className="prose max-h-[70vh] overflow-auto">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-200 px-1 rounded" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {guide[currentPage]}
              </ReactMarkdown>
            </div>

            {/* Paginador */}
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-3 py-1 rounded ${currentPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={goPrev}
                disabled={currentPage === 0}
              >
                Anterior
              </button>

              <span className="text-gray-600 dark:text-gray-300">
                Página {currentPage + 1} de {guide.length}
              </span>

              <button
                className={`px-3 py-1 rounded ${currentPage === guide.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={goNext}
                disabled={currentPage === guide.length - 1}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
