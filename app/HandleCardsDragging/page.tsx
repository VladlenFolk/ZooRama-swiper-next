"use client";

import DraggableCard from "@/components/DraggableCard/DraggableCard";
import ResetCard from "@/components/ResetCard/ResetCard";
import { useEffect, useState } from "react";
import { card } from "@/utils/data";

const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isEndOfCard, setIsEndOfCard] = useState(false);

  // Увеличение счётчика при удалении карточки
  const handleIncrease = () => {
    setCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (card.length === counter) {
      setIsEndOfCard(true);
    } else if (isEndOfCard) {
      setIsEndOfCard(false);
    }
  }, [card.length, counter]);

  // Функция для сброса карточек
  const handleReset = () => {
    setIsResetting((prev) => (prev = true)); // Включаем режим сброса
    setCounter(0); // Сбрасываем счётчик
    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  return (
    <div
      className={`relative w-full h-screen bg-gray-500 flex flex-col items-center overflow-hidden justify-center select-none`}
    >
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
