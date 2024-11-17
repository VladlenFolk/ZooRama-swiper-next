'use client'
import { Status } from "@/utils/interfaces";
import { ContainerCards } from "../ContainerCards/ContainerCards";
import { data } from "@/utils/data";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

const typesHero: Status[] = ["good", "normal", "bad"];

export const DragAndDrop = () => {
  const { isDragging, listItems, handleDragging, handleUpdateList } =
    useDragAndDrop(data);
  return (
    <div className="grid grid-cols-3 gap-8 px-8 w-full flex-1">
      {typesHero.map((container) => (
        <ContainerCards
          status={container}
          key={container}
          items={listItems}
          isDragging={isDragging}
          handleDragging={handleDragging}
          handleUpdateList={handleUpdateList}
        />
      ))}
    </div>
  );
};
