export const FillBlank = ({ exercise, colors, setSelectedOption, selectedOption, locked }) => {
  return (
    <div className="border-[#F4F5F7] border-8 rounded-lg w-1/2 mx-auto">
      <div className="p-4 border-b-[#F4F5F7] border-b-4 flex justify-center">
        <span className="text-lg font-medium font-sans">
          {exercise?.description}
        </span>
      </div>
      <div className="p-4 w-full">
        <h2 className="font-semibold text-xl text-center font-sans">
          {exercise?.content}
        </h2>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center w-full mt-3 justify-start -ml-4">
            <span className="w-1/2 text-right mr-4">{exercise?.content}</span>
            <input
              type="text"
              disabled={locked}
              className={`border rounded px-2 py-1 ${locked ? "pointer-events-none opacity-50" : ""}`}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
