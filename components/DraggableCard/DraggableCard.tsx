import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useEffect, memo, useState } from "react";
import useRenderCount from "@/hooks/useRenderCount";
import LikeDislikeButtons from "./LikeDisleikeButtons/LikeDislikeButtons";
interface Props {
  img: string;
  handleIncrease: () => void;
  counter: number;
  index: number;
  length: number;
  isResetting: boolean;
}

const DraggableCard: React.FC<Props> = memo(
  ({ img, handleIncrease, counter, index, length, isResetting }) => {
    const isActiveCard = length - index === counter;

    const {
      elementRef,
      handleDown,
      resetAllState,
      translateX,
      windowWidth,
      pressButtonDisplacement,
    } = useDrag(() => {
      // Проверяем, что функция вызывается только для активной карточки
      if (isActiveCard) handleIncrease();
    });
    useRenderCount(`DraggableCard-${index}`);
    // Оптимизированный сброс состояния с requestAnimationFrame
    useEffect(() => {
      if (isResetting) {
        requestAnimationFrame(() => {
          resetAllState();
        });
      }
    }, [isResetting, resetAllState]);

    // Максимальное значение при котором opacity становится 1
    const maxX = windowWidth / 10 + 10;

    // Нормализация значения opacity от 0 до 1 для обоих направлений
    const likeOpacity = Math.min(Math.max((translateX - 0) / maxX, 0), 1);
    const nopeOpacity = Math.min(Math.max((0 - translateX) / maxX, 0), 1);

    return (
      <>
        <div
          className={`absolute flex items-center justify-center pointer-events-none transition-opacity duration-500`}
        >
          <div className="relative">
            <div
              ref={elementRef}
              onMouseDown={isActiveCard ? handleDown : undefined}
              onTouchStart={isActiveCard ? handleDown : undefined}
              className={`draggable cursor-grab rounded-lg relative ${
                isActiveCard
                  ? "pointer-events-auto select-auto"
                  : "pointer-events-none select-none"
              } w-[200px] h-[400px] sm:w-[300px] sm:h-[80vh] md:w-[300px] md:h-[80vh] lg:w-[500px] lg:h-[70vh] ${isActiveCard}`}
            >
              <div
                aria-label="like"
                className={`${`absolute  z-10 text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none  `}
                      ${"top-[20px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"} `}
                style={{
                  opacity: likeOpacity,
                }}
              >
                LIKE
              </div>
              <div
                aria-label="dislike"
                className={`${"absolute z-10  text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none"} 
                ${"top-[20px] bg-[red] right-[20px] p-[10px] rounded-[5px] rotate-[30deg]"} `}
                style={{
                  opacity: nopeOpacity,
                }}
              >
                NOPE
              </div>

              <Image
                src={img}
                alt="dog"
                fill
                priority={index === length}
                sizes="(max-width: 768px) 100vw, 300px"
                className="pointer-events-none select-none  rounded-lg object-center object-cover"
                loading={index === length ? "eager" : "lazy"}
              />
            </div>
            <LikeDislikeButtons
              pressButtonDisplacement={pressButtonDisplacement}
              index={index}
              translateX={translateX}
              windowWidth={windowWidth}
              isActiveCard={isActiveCard}
              isResetting={isResetting}
            />
          </div>
        </div>
      </>
    );
  }
);

DraggableCard.displayName = "DraggableCard";

export default DraggableCard;
