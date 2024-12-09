'use client'
import DraggableCard from "@/components/DraggableCard/DraggableCard";
import ResetCard from "@/components/ResetCard/ResetCard";
import { useState, useEffect } from "react";
import { card } from "@/utils/data";

const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isEndOfCard, setIsEndOfCard] = useState(false);

  const handleIncrease = () => setCounter((prev) => prev + 1);

  useEffect(() => {
    setIsEndOfCard(card.length === counter);
  }, [counter]);

  const handleReset = () => {
    setIsResetting(true);
    setCounter(0);
    setTimeout(() => setIsResetting(false), 100);
  };

  return (
    <div className="relative w-full h-screen bg-gray-500 flex flex-col items-center justify-center overflow-hidden">
      {card.map((el, index) => (
        <DraggableCard
          key={el.id}
          img={el.img}
          handleIncrease={handleIncrease}
          counter={counter}
          length={card.length - 1}
          index={index}
          isResetting={isResetting}
        />
      ))}
      <ResetCard handleReset={handleReset} isEndOfCard={isEndOfCard} />
    </div>
  );
};

export default CustomDraggables;
