import React from "react";

export const DraggableItem = ({ option, handleDragging }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text", `${option}`);
    handleDragging(true);
  };
  const handleDragEnd = () => handleDragging(false);

  return (
    <div
      className="border-[#F4F5F7] border-2 bg-[#FAFAFA] px-3 py-2 rounded-lg flex items-center"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <span>{option}</span>
    </div>
  );
};
