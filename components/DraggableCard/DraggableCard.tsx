"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
interface Props {
  img: string;
  handleIncrease: () => void;
  counter: number;
  index: number;
  length: number;
}

const DraggableCard: React.FC<Props> = ({
  img,
  handleIncrease,
  counter,
  index,
  length,
}) => {
  const { elementRef, handleMouseDown, resetPosition } = useDrag(() => {
    // Проверяем, что функция вызывается только для активной карточки
    if (length - index === counter) handleIncrease();
  });
  const isActive = length - index === counter;

  return (
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
  );
};

export default DraggableCard;
