"use client";

import DraggableCard from "@/components/DraggableCard/DraggableCard";
import ResetCard from "@/components/ResetCard/ResetCard";
import { useEffect, useState } from "react";
import { card } from "@/utils/data";

const AnimatedBackground = () => {
  const cubes = Array.from({ length: 6 }, (_, index) => index + 1);
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center ">
      <h1 className="gradient-text text-6xl font-bold antialiased">Loading</h1>
      <div className="hero">
        {cubes.map((_, index) => (
          <div key={index} className={`cube`}></div>
        ))}
      </div>
    </div>
  );
};

const CustomDraggables: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isEndOfCard, setIsEndOfCard] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

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
  }, [counter, isEndOfCard]);

  // Функция для сброса карточек
  const handleReset = () => {
    setIsResetting((prev) => (prev = true)); // Включаем режим сброса
    setCounter(0); // Сбрасываем счётчик
    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  // Отслеживание загрузки изображений
  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      const newCount = prev + 1;
      if (newCount === card.length) {
        setAllLoaded(true);
      }
      return newCount;
    });
  };

  return (
    <div
      className={`relative w-full h-screen flex flex-col items-center overflow-hidden justify-center select-none `}
    >
      {!allLoaded && <AnimatedBackground />}

      {card.map((el, index) => (
        <DraggableCard
          key={el.id}
          img={el.img}
          handleIncrease={handleIncrease}
          counter={counter}
          length={card.length - 1}
          index={index}
          isResetting={isResetting}
          onImageLoad={handleImageLoad}
          allLoaded={allLoaded}
        />
      ))}
      {allLoaded && (
        <ResetCard handleReset={handleReset} isEndOfCard={isEndOfCard} />
      )}
    </div>
  );
};

export default CustomDraggables;
