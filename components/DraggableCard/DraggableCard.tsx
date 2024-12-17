"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useEffect, memo, useState, useRef } from "react";
import useRenderCount from "@/hooks/useRenderCount";

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
   
    const [isHolding, setIsHolding] = useState(false);
    const [enter, setEnter] = useState(false);
    const isActiveCard = length - index === counter;
    // const isActive = useRef(false); // Ref для фиксации активности состояния кнопки
    // const isHoldingRef = useRef(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const handleGlobalMouseUp = () => {
        if (isHolding) {
          setIsHolding(false);
          setEnter(false); // Сброс состояния при отпускании мыши/пальца
        }
      };
    
      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault(); // Работает, если passive = false
        setIsHolding(true);
        setEnter(true);
      };
    
      const handleTouchMove = (e: TouchEvent) => {
        if (isHolding) {
          const touch = e.touches[0];
          const button = buttonRef.current;
          if (button) {
            const rect = button.getBoundingClientRect();
            const isInside =
              touch.clientX >= rect.left &&
              touch.clientX <= rect.right &&
              touch.clientY >= rect.top &&
              touch.clientY <= rect.bottom;
            setEnter(isInside);
          }
        }
      };
    
      const handleTouchEnd = () => {
        if (isHolding) {
          setIsHolding(false);
          setEnter(false);
        }
      };
    
      // if (isHolding) {
      //   // Добавляем слушатели для глобальных событий
      //   document.addEventListener("mouseup", handleGlobalMouseUp);
      //   document.addEventListener("touchend", handleTouchEnd);
      //   document.addEventListener("touchmove", handleTouchMove, { passive: false });
      // }
      // document.addEventListener("touchstart", handleTouchStart, { passive: false });
    
      // return () => {
      //   // Удаляем слушатели, чтобы избежать утечек памяти
      //   document.removeEventListener("mouseup", handleGlobalMouseUp);
      //   document.removeEventListener("touchend", handleTouchEnd);
      //   document.removeEventListener("touchend", handleTouchEnd);
      //   document.removeEventListener("touchmove", handleTouchMove);
      // };
    }, [isHolding]);
// console.log(isHolding, enter, isHoldingRef.current, isActive.current);


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
    // console.log(enter, isHolding);

    // Максимальное значение при котором opacity становится 1
    const maxX = windowWidth / 10 + 10;

    // Нормализация значения opacity от 0 до 1 для обоих направлений
    const likeOpacity = Math.min(Math.max((translateX - 0) / maxX, 0), 1);
    const nopeOpacity = Math.min(Math.max((0 - translateX) / maxX, 0), 1);

    return (
      <>
        <div
          className={`absolute flex items-center justify-center pointer-events-none`}
        >
          <div className="relative">
            <div
              ref={elementRef}
              onMouseDown={isActiveCard ? handleDown : undefined}
              onTouchStart={isActiveCard ? handleDown : undefined}
              className={`draggable rounded-lg relative ${
                isActiveCard
                  ? "pointer-events-auto select-auto "
                  : "pointer-events-none select-none"
              }`}
            >
              <div
                className={`${`absolute  z-10 text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none  `}
                      ${"top-[20px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"} `}
                style={{
                  opacity: likeOpacity,
                }}
              >
                LIKE
              </div>
              <div
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
                priority
                sizes="(max-width: 768px) 100vw, 300px"
                className="pointer-events-none select-none  rounded-lg object-center object-cover"
              />
            </div>
            {(index === 0 && translateX >= windowWidth / 10 + 10) ||
              (index === 0 && translateX <= -windowWidth / 10 - 10) ||
              (isActiveCard && !isResetting && (
                <div className="flex justify-around absolute bottom-[10px] w-full">
                  <button
                  ref={buttonRef}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Предотвращаем нежелательное поведение
                    setIsHolding(true);
                    setEnter(true); // Сразу активируем состояние
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault(); // Предотвращаем двойное срабатывание
                    if (isHolding && enter) {
                      pressButtonDisplacement("left"); // Вызываем действие
                    }
                    setIsHolding(false);
                    setEnter(false); // Сбрасываем состояние
                  }}
                  onMouseLeave={() => {
                    if (isHolding) {
                      setEnter(false); // Убираем активное состояние при выходе
                    }
                  }}
                  onMouseEnter={() => {
                    if (isHolding) {
                      setEnter(true); // Включаем активное состояние при входе
                    }
                  }}
                  // onTouchStart={(e) => {
                  //   e.preventDefault();
                  //   setIsHolding(true);
                  //   setEnter(true); // Сразу активируем состояние
                  // }}
                  // onTouchEnd={(e) => {
                  //   e.preventDefault();
                  //   if (isHolding && enter) {
                  //     pressButtonDisplacement("left"); // Выполняем действие
                  //   }
                  //   setIsHolding(false);
                  //   setEnter(false); // Сбрасываем состояние
                  // }}
                  // onTouchMove={(e) => {
                  //   if (isHolding) {
                  //     const touch = e.touches[0];
                  //     const button = buttonRef.current;
                  //     if (button) {
                  //       const rect = button.getBoundingClientRect();
                  //       const isInside =
                  //         touch.clientX >= rect.left &&
                  //         touch.clientX <= rect.right &&
                  //         touch.clientY >= rect.top &&
                  //         touch.clientY <= rect.bottom;
            
                  //       setEnter(isInside); // Обновляем состояние `enter` в зависимости от положения пальца
                  //     }
                  //   }
                  // }}
                    className={`w-[31px] h-[31px] pointer-events-auto rounded-full border-[1px] border-[#B40335] flex items-center justify-center ${
                      translateX <= -windowWidth / 10 ||
                      (isHolding && enter)
                        ? "bg-[#B40335]"
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="25"
                    >
                      <path
                        d="M18.364 5.636a1 1 0 0 0-1.414 0L12 10.586 7.05 5.636a1 1 0 1 0-1.414 1.414L10.586 12l-5.95 5.95a1 1 0 1 0 1.414 1.414L12 13.414l5.95 5.95a1 1 0 1 0 1.414-1.414L13.414 12l5.95-5.95a1 1 0 0 0 0-1.414z"
                        fill={
                          translateX <= -windowWidth / 10 ||
                          (isHolding && enter)
                            ? "#FFFFFF"
                            : "#B40335"
                        } // Белый крестик при активном состоянии
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => pressButtonDisplacement("right")}
                    className={`w-[31px] h-[31px]  pointer-events-auto rounded-full border-[1px] border-[#36DE8D] flex items-center justify-center ${
                      translateX >= windowWidth / 10 ? "bg-[#36DE8D] " : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 -960 960 960"
                      width="25"
                    >
                      <path
                        d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z"
                        fill={
                          translateX >= windowWidth / 10 ? "#FFFFFF" : "#36DE8D"
                        }
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
);

DraggableCard.displayName = "DraggableCard";

export default DraggableCard;
