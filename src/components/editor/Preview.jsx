import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

const Preview = ({ htmlCode, cssCode, play, jsCode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(htmlCode);
    const sanitizedCss = DOMPurify.sanitize(cssCode);
    const sanitizedJs = DOMPurify.sanitize(jsCode);

    const output = `
    <html>
      <head>
        <style>${sanitizedCss}</style>
      </head>
      <body>
        ${sanitizedHtml}
        <div id="log" style="display: none; background-color: #f4f4f4; color: #333; padding: 10px; font-family: monospace; white-space: pre-wrap; margin-top: 20px;">
          <strong>Console Output:</strong><br />
        </div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            var logger = document.getElementById('log');
            var oldConsoleLog = console.log;
            
            // Overwrite console.log to display output in the 'log' div
            console.log = function (message) {
              if (logger.style.display === 'none') {
                logger.style.display = 'block'; // Show log div on first console.log
              }
  
              if (typeof message === 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message, null, 2) : message) + '<br />';
              } else {
                logger.innerHTML += message + '<br />';
              }
              
              oldConsoleLog.apply(console, arguments); // Call original console.log
            };
            
            ${sanitizedJs}
          });
        </script>
      </body>
    </html>
  `;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(output);
    iframeDoc.close();
  }, [play, htmlCode, cssCode, jsCode]);

  return (
    <div className="w-full h-full">
      <iframe ref={iframeRef} title="Preview" className="w-full h-full border-none" />
    </div>
  );
};

export default Preview;
