import React, { useState } from "react";
import { TextInput } from "./Input";

const ChipInput = ({ chips, setChips, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddChip = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setChips([...chips, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveChip = (chipToRemove) => {
    setChips(chips.filter((chip) => chip !== chipToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="w-1/4 flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
            <span className="mr-2 text-sm">{chip}</span>
            <button
              onClick={() => handleRemoveChip(chip)}
              className="text-blue-700 hover:text-blue-900"
            >
              &times;
            </button>
          </div>
        ))}
        <TextInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddChip}
          placeholder={placeholder || "Add a value..."}
          className="flex-1 outline-none "
        />
      </div>
    </div>
  );
};

export default ChipInput;
