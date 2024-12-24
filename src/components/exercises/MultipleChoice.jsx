import React from "react";

const MultipleChoice = ({ exercise, advance, completedExercise, colors }) => {
  const getLetterPrefix = (index) => String.fromCharCode(97 + index);

  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-1/2 mx-auto">
      <div className="p-4 border-b border-b-[#F4F5F7] border-b-4 flex justify-center">
        <span
          className={`text-lg font-medium text-[${colors.primary}] font-sans`}
        >
          Selecciona la respuesta correcta
        </span>
      </div>
      <div className="p-4 w-full">
        <h2 className="font-semibold font-xl text-center font-sans">
          {exercise?.content}
        </h2>
        <div className="flex flex-col items-center justify-center">
          {exercise?.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center w-full mt-3 justify-start -ml-4"
            >
              <span className="w-1/2 text-right mr-4">{`${getLetterPrefix(
                index
              )})`}</span>
              <button
                className={` ${
                  option === completedExercise?.answer ? "bg-green" : ""
                } border-[#F4F5F7] border-2 py-2 px-3  bg-[#FAFAFA] rounded-lg font-sans`}
                onClick={() => advance(option)}
              >
                {option}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
