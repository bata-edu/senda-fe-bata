import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

const Preview = ({ htmlCode, cssCode, play }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(htmlCode);
    const sanitizedCss = DOMPurify.sanitize(cssCode);

    const completeOutput = `
      <html>
        <head>
          <style>${sanitizedCss}</style>
        </head>
        <body>${sanitizedHtml}</body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(completeOutput);
    iframeDoc.close();
  }, [play]);

  return (
    <div className="preview-container">
      <iframe ref={iframeRef} title="Preview" className="preview-iframe" />
    </div>
  );
};

export default Preview;
