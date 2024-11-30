"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
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
  const { elementRef, handleMouseDown, resetAllState, translateX } = useDrag(() => {
    // Проверяем, что функция вызывается только для активной карточки
    if (length - index === counter) handleIncrease();
  }, isResetting);
  const isActive = length - index === counter;

  useEffect(() => {
    if (isResetting) {
      resetAllState();
    }
  }, [isResetting]);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  const debouncedHandleResize = useDebounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [debouncedHandleResize]);

  return (
    <>
      <div
        className={`absolute flex items-center justify-center pointer-events-none`}
      >    
        <div
          ref={elementRef}
          onMouseDown={handleMouseDown}
          className={`draggable rounded-lg relative ${
            isActive
              ? "pointer-events-auto select-auto "
              : "pointer-events-none select-none"
          }`}
        >
              <div
          className={`${"absolute z-10  text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none opacity-1 transition-opacity duration-200 ease-in-out"} 
                ${"top-[20px] bg-[red] right-[20px] p-[10px] rounded-[5px] rotate-[30deg]"}`}
                style={{opacity: translateX < -150 ? 1 : 0}}
        >
          NOPE
        </div>
        <div
          className={`${`absolute  z-10 text-center w-[70px] text-[1rem] font-bold  text-white pointer-events-none  transition-opacity duration-200 ease-in-out`}
                      ${"top-[20px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"}`}
                      style={{opacity: translateX > 150 ? 1 : 0}}
        >
          LIKE
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
      </div>
    </>
  );
};

export default DraggableCard;
