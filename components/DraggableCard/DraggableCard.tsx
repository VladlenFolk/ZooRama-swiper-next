"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useEffect, useState } from "react";
// import useDebounce from "@/hooks/useDebounce";
interface Props {
  img: string;
  handleIncrease: () => void;
  counter: number;
  index: number;
  length: number;
  isResetting: boolean;
}

const DraggableCard: React.FC<Props> = ({
  img,
  handleIncrease,
  counter,
  index,
  length,
  isResetting,
}) => {
  const [windowWidth, setWindowWidth] = useState(1024);

  const { elementRef, handleDown, resetAllState, translateX } = useDrag(
    () => {
      // Проверяем, что функция вызывается только для активной карточки
      if (length - index === counter) handleIncrease();
    },
    isResetting
  );
  const isActive = length - index === counter;

  useEffect(() => {
    if (isResetting) {
      resetAllState();
    }
  }, [isResetting]);

  // const handleResize = () => {
  //   setWindowWidth(window.innerWidth);
  // };
  // const debouncedHandleResize = useDebounce(handleResize, 300);

  // useEffect(() => {
  //   window.addEventListener("resize", debouncedHandleResize);

  //   return () => {
  //     window.removeEventListener("resize", debouncedHandleResize);
  //   };
  // }, [debouncedHandleResize]);

  return (
    <>
      <div
        className={`absolute flex items-center justify-center pointer-events-none`}
      >
        <div className="relative">
          <div
            ref={elementRef}
            onMouseDown={handleDown}
            onTouchStart={handleDown}
            className={`draggable rounded-lg relative ${
              isActive
                ? "pointer-events-auto select-auto "
                : "pointer-events-none select-none"
            }`}
          >
            <div
              className={`${`absolute  z-10 text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none  transition-opacity duration-200 ease-in-out`}
                      ${"top-[20px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"} ${
                translateX > 160 ? "opacity-100" : "opacity-0"
              }`}
            >
              LIKE
            </div>
            <div
              className={`${"absolute z-10  text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none opacity-1 transition-opacity duration-200 ease-in-out"} 
                ${"top-[20px] bg-[red] right-[20px] p-[10px] rounded-[5px] rotate-[30deg]"} ${
                translateX < -160 ? "opacity-100" : "opacity-0"
              }`}
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
          {(index === 0 && translateX >= 250) ||(index === 0 && translateX <= -250)||
            (isActive && (
              <div className="flex justify-around absolute bottom-[10px] w-full">
                <button
                  className={`w-[31px] h-[31px] pointer-events-auto rounded-full border-[1px] border-[#B40335] flex items-center justify-center ${
                    translateX <= -150 ? "bg-[#B40335]" : ""
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
                      fill={translateX <= -150 ? "#FFFFFF" : "#B40335"} // Белый крестик при активном состоянии
                    />
                  </svg>
                </button>
                <button
                  className={`w-[31px] h-[31px]  pointer-events-auto rounded-full border-[1px] border-[#36DE8D] flex items-center justify-center ${
                    translateX >= 150 ? "bg-[#36DE8D] " : ""
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
                      fill={translateX >= 150 ? "#FFFFFF" : "#36DE8D"}
                    />
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DraggableCard;
