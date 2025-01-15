import { useState } from "react";

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragging = (dragging) => setIsDragging(dragging);

  return {
    isDragging,
    handleDragging,
  };
};
