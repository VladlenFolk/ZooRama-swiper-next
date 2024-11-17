"use client";
import { Status } from "@/utils/interfaces";
import { ContainerCards } from "../ContainerCards/ContainerCards";
import { data } from "@/utils/data";
import { useState } from "react";
import { Data } from "@/utils/interfaces";

const typesHero: Status[] = ["good", "normal", "bad"];

export const DragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [listItems, setListItems]= useState<Data[]>(data);
  const handleUpdateList  = (id: number, status: Status) =>{
    let card = listItems.find(item =>item.id === id)
    if(card && card.status !== status) {
      card.status = status
      setListItems(prev=> ([
        card!, 
        ...prev.filter(item=>item.id !== id)
      ]))
    }
  }
  const handleDragging = (dragging: boolean) => setIsDragging(dragging);
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
