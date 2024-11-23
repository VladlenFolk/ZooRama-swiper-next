"use client";
import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { useState } from "react";
type Card = {
  id: number;
  img: string;
};

const card: Card[] = [
  {
    id: 1,
    img: "https://avatars.mds.yandex.net/get-altay/1880508/2a0000016e256861de17b2bc4fbf2ce81b1a/XXL",
  },
  {
    id: 2,
    img: "https://i.pinimg.com/736x/61/b7/72/61b772864029519c45dcbdf78680cdbf.jpg",
  },
  {
    id: 3,
    img: "https://avatars.mds.yandex.net/get-entity_search/5513561/952894097/S600xU_2x",
  },
  {
    id: 4,
    img: "https://avatars.mds.yandex.net/get-entity_search/2069560/952076372/S600xU_2x",
  },
];

const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const handleIncrease = () => {
    setCounter((prev) => prev + 1);
  };
  console.log(counter);
  
  return (
    <div className="relative w-full h-screen bg-gray-500 flex flex-col items-center justify-center">
      {card.map((el) => (
        <DraggableCard key={el.id} img={el.img} handleIncrease={handleIncrease}  />
      ))}
    </div>
  );
};

export default CustomDraggables;
