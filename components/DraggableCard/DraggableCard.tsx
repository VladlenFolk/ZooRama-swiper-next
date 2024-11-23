"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
interface Props {
  img: string;
}

const DraggableCard: React.FC<Props> = ({ img }) => {
  const { elementRef, handleMouseDown, resetPosition } = useDrag();

  return (
    <div className="absolute flex items-center justify-center" draggable={false}>
      <div
        ref={elementRef}
        onMouseDown={handleMouseDown}
        className="draggable rounded-lg"
      >
        <Image
          src={img}
          draggable={false}
          alt="dog"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="pointer-events-none select-none  rounded-lg"
        />
      </div>
    </div>
  );
};

export default DraggableCard;
