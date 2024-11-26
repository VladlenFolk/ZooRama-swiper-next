"use client";

import DraggableCard from "@/components/DraggableCard/DraggableCard";
import { useState } from "react";
import { card } from "@/utils/data";

const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [isResetting, setIsResetting] = useState(false);

  // Увеличение счётчика при удалении карточки
  const handleIncrease = () => {
    setCounter((prev) => prev + 1);
  };

  // Функция для сброса карточек
  const handleReset = () => {
    setIsResetting((prev) => (prev = true)); // Включаем режим сброса
    setCounter(0); // Сбрасываем счётчик
    setTimeout(() => setIsResetting(false), 100);
  };

  return (
    <div
      className={`relative w-full h-screen bg-gray-500 flex flex-col items-center justify-center select-none`}
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
      <button
        onClick={handleReset}
        className="absolute bottom-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reset All
      </button>
    </div>
  );
};

export default CustomDraggables;
