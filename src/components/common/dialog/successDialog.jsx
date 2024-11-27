import React from 'react';
import check from '../../../assets/check.svg';

const SuccessDialog = ({ title, description, buttonText, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <img src={check} alt="Check" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        <p className="text-gray-600 mb-6">{description}</p>

        <button
          onClick={onConfirm}
          className="w-full bg-strongBlue text-white py-2 px-4 rounded-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;
