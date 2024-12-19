import React from 'react';
import FileInput from '../input/fileInput';
import ChipInput from '../input/chipInput';
import DatePickerInput from '../input/dateInput';
import PdfViewer from '../../../utils/PdfViewer';
import { useState } from 'react';


const GenericDialog = ({
  title,
  description,
  content = [],
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'alert',
  imageSrc,
  inputs = [],
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-start">
        {type === 'info' && imageSrc && (
          <div className="flex justify-center mb-4 w-full rounded-lg overflow-hidden">
            <img src={imageSrc} alt="info" className="object-contain" />
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>


        {type === 'info' && content.length > 0 && (
          <div className="space-y-4 mb-6">
            {content.map((item, index) => {
              if (item.type === 'text') {
                return <p key={index} className="text-gray-700">{item.value}</p>;
              } else if (item.type === 'file' && item.fileType === 'pdf') {
                return (
                  <div key={index}>
                    {item.value.startsWith('http') ? (
                      <div>
                        <span
                          onClick={() => setShowPdf(!showPdf)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Ver consigna
                        </span>
                            {showPdf && (
                          <PdfViewer pdfUrl={item.value} onClose={() => setShowPdf(!showPdf)}/>)}
                      </div>

                    ) : (
                      <div>
                        <span
                          onClick={() => setShowContent(!showContent)}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Ver consigna
                        </span>
                        {showContent && (
                          <div className="mt-2 border rounded p-2 bg-gray-100 text-gray-700">
                            {item.value}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              } else if (item.type === 'file') {
                return <p key={index} className="text-gray-700">Archivo: {item.value}</p>;
              }

              return null;
            })}
          </div>
        )}

        {type === 'info' && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-100"
            >
              Cerrar
            </button>
          </div>
          
        )}

        {type !== 'info' && inputs.length > 0 && (
          <div className="space-y-4 mb-6">
            {inputs.map((input, index) => (
              input.type === 'file' ? (
                <FileInput
                  key={index}
                  file={input.file}
                  setFile={input.setFile}
                  name={input.fileName}
                  type={input.fileType}
                />
              ) : input.type === 'chip' ? (
                <ChipInput
                  key={index}
                  chips={input.chips}
                  setChips={input.setChips}
                  placeholder={input.placeholder}
                />
              ) : input.type === 'date' ? (
                <DatePickerInput
                  key={index}
                  label={input.placeholder || 'Seleccionar fecha'}
                  value={input.value}
                  onChange={input.onChange}
                  placeholder={input.placeholder}
                />
              ) : input.type === 'textarea' ? (
                <textarea
                  key={index}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  key={index}
                  type={input.type || 'text'}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )
            ))}
          </div>
        )}

        {type !== 'info' && (
          <div className="flex justify-between space-x-4">
            {type !== 'alert' && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-white-300 w-full text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-100"
              >
                {cancelButtonText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-strongBlue w-full text-white rounded-lg hover:bg-strongBlue"
            >
              {confirmButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericDialog;
