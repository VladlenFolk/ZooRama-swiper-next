'use client'
import { Status } from "@/utils/interfaces";
import { ContainerCards } from "../ContainerCards/ContainerCards";
import { data } from "@/utils/data";
import { useState } from "react";

const typesHero: Status[] = ["good", "normal", "bad"];

export const DragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragging = (dragging: boolean) => setIsDragging(dragging)
  return (
    <div className="grid grid-cols-3 gap-8 px-8 w-full flex-1">
      {typesHero.map((container) => (
        <ContainerCards status={container} key={container} items={data} isDragging={isDragging} handleDragging={handleDragging} />
      ))}
    </div>
  );
};
