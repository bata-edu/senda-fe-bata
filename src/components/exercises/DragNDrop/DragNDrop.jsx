import React, { useState } from "react";

import { DragAndDrop } from "./DragAndDrop";
import { useDragAndDrop } from "../../../utils/hooks/useDragAndDrop";
import { DraggableItem } from "./DraggableItem";

export default function DragNDrop({
  exercise,
  advance,
  completedExercise,
  setSelectedOption,
  colors,
}) {
  const [dropped, setDropped] = useState();
  const handleDrop = (e) => {
    e.preventDefault();
    handleDragging(false);
    setDropped(e.dataTransfer.getData("text"));
    setSelectedOption(e.dataTransfer.getData("text"));
  };
  const handleDragOver = (e) => e.preventDefault();
  const { isDragging, handleDragging } = useDragAndDrop();
  return (
    <>
      <div className="border-[#F4F5F7] border-8 rounded-lg w-1/2 mx-auto">
        <div className="p-4 border-b border-b-[#F4F5F7] border-b-4 flex justify-center">
          <span
            className={`text-lg font-medium text-[${colors?.primary}] font-sans`}
          >
            Selecciona la respuesta correcta
          </span>
        </div>
        <div className="p-4 w-full">
          <div
            className={`layout-cards ${isDragging ? "layout-dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <h2 className="font-semibold font-xl text-center font-sans">
              {dropped
                ? exercise?.content.replace("______", dropped)
                : exercise?.content}
            </h2>
          </div>
          <div className="flex items-center justify-center mt-24">
            <span className="mr-2">Opciones:</span>
            {exercise?.options.map((option, index) => {
              if (option !== dropped) {
                return (
                  <div key={index} className="mr-2">
                    <DraggableItem
                      handleDragging={handleDragging}
                      option={option}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}
