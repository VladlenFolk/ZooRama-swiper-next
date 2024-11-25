"use client";

import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { useState } from "react";
import { card } from "@/utils/data";


const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);

  const handleIncrease = () => {
    setCounter((prev) => prev + 1);
  };
  console.log(counter);

  return (
    <div
      className={`relative w-full h-screen bg-gray-500 flex flex-col items-center justify-center  pointer-events-all select-none`}
    >
      {card.map((el, index) => (
        <DraggableCard
          key={el.id}
          img={el.img}
          handleIncrease={handleIncrease}
          counter={counter}
          length={card.length - 1}
          index={index}
        />
      ))}
    </div>
  );
};

export default CustomDraggables;
