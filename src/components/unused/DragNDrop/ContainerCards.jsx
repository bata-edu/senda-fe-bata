import { DraggableItem } from "./DraggableItem";

export const ContainerCards = ({
  items = [],
  status,
  isDragging,
  handleDragging,
  handleUpdateList,
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    handleUpdateList(+e.dataTransfer.getData("text"), status);
    handleDragging(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className={`layout-cards ${isDragging ? "layout-dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>{status} hero</p>
      {items.map(
        (item) =>
          status === item.status && (
            <DraggableItem
              data={item}
              key={item.id}
              handleDragging={handleDragging}
            />
          )
      )}
    </div>
  );
};
