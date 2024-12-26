import { useDragAndDrop } from "../../../utils/hooks/useDragAndDrop";
import { ContainerCards } from "./ContainerCards";
import React from "react";
import { data } from "./index";
const typesHero = ["good", "normal", "bad"];

export const DragAndDrop = () => {
  const { isDragging, listItems, handleDragging, handleUpdateList } =
    useDragAndDrop(data);

  return (
    <div className="grid">
      {typesHero.map((container) => (
        <ContainerCards
          items={listItems}
          status={container}
          key={container}
          isDragging={isDragging}
          handleDragging={handleDragging}
          handleUpdateList={handleUpdateList}
        />
      ))}
    </div>
  );
};
