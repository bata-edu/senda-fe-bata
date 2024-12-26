import { useState } from "react";
import React from "react";

export const useDragAndDrop = (initialState) => {
  const [isDragging, setIsDragging] = useState(false);
  const [listItems, setListItems] = useState(initialState);

  const handleUpdateList = (id, status) => {
    let card = listItems.find((item) => item.id === id);

    if (card && card.status !== status) {
      card.status = status;
      if (Array.isArray(listItems)) {
        setListItems((prev) => {
          if (!card) return prev; // Safety check in case `card` is null/undefined
          return [card, ...prev.filter((item) => item.id !== id)];
        });
      }
    }
  };

  const handleDragging = (dragging) => setIsDragging(dragging);

  return {
    isDragging,
    listItems,
    handleUpdateList,
    handleDragging,
  };
};
