"use client"

const MultipleChoice = ({ exercise, locked, setSelectedOption, colors, selectedOption }) => {
  const getLetterPrefix = (index) => String.fromCharCode(97 + index)

  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-full max-w-md mx-auto">
      <div className="p-4 border-b-[#F4F5F7] border-b-4 flex justify-center">
                
      <span className="text-lg font-medium font-sans">
          {exercise?.prompt}
        </span>
      
      </div>
      <div className="p-4 w-full">
        <h2 className="font-semibold text-xl text-center font-sans mb-6">{exercise?.content}</h2>
        <div className="flex flex-col items-center justify-center">
          {exercise?.options.map((option, index) => (
            <div key={index} className="flex items-center w-full mt-3 justify-start">
              <span className="w-12 text-right mr-4 text-gray-500">{`${getLetterPrefix(index)})`}</span>
              <button
                className={`
                  border-2 py-2 px-4 rounded-lg font-sans w-full text-left
                  ${option === selectedOption[0] ? "bg-[#4558C8]/10 border-[#4558C8]" : "border-[#F4F5F7] bg-[#FAFAFA]"}
                  ${locked ? "pointer-events-none" : ""}
                `}
                onClick={() => {
                  setSelectedOption([option])
                }}
              >
                {option}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MultipleChoice

