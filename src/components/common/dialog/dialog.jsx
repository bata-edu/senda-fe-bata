import React from 'react';
import FileInput from '../input/fileInput';
import ChipInput from '../input/chipInput';

const GenericDialog = ({
  title,
  description,
  inputs = [],
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'alert',
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-start">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>

        {inputs.length > 0 && (
          <div className="space-y-4 mb-6">
              {inputs.map((input, index) => (
                input.type === 'file' ? (
                  <FileInput key={index} file={input.file} setFile={input.setFile} name={input.fileName} type={input.fileType} />
                ) : input.type === 'chip' ? (
                  <ChipInput
                    key={index}
                    chips={input.chips}
                    setChips={input.setChips}
                    placeholder={input.placeholder}
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
      </div>
    </div>
  );
};

export default GenericDialog;
