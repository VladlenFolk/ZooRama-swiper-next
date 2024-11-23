"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useState } from "react";
interface Props {
  img: string;
  handleIncrease: () => void;
}

const DraggableCard: React.FC<Props> = ({ img, handleIncrease }) => {
 
  const { elementRef, handleMouseDown, resetPosition, translateX } = useDrag(handleIncrease);



  return (
    <div
      className="absolute flex items-center justify-center"
      draggable={false}
    >
      <div
        ref={elementRef}
        onMouseDown={handleMouseDown}
        className="draggable rounded-lg relative"
      >
        <Image
          src={img}
          draggable={false}
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
