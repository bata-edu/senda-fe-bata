import React from 'react';

const PdfViewer = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 font-xs text-xl text-white w-15 h-15 flex items-center justify-center hover:focus:outline-none z-50"
      >
        ×
      </button>
      
      <div className="w-11/12 h-5/6 bg-white shadow-lg rounded-lg overflow-hidden relative">
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default PdfViewer;