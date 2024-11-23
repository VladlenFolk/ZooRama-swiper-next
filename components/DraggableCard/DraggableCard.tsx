"use client";

import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";

const DraggableCard: React.FC = () => {
  const { elementRef, handleMouseDown, resetPosition } = useDrag();

  return (
    <div className="relative flex flex-col justify-center items-center w-[100px] h-[220px] ">
      <div ref={elementRef} onMouseDown={handleMouseDown} className="draggable rounded-lg relative">
        <Image
          src={
            "https://avatars.mds.yandex.net/get-entity_search/2069560/952076372/S600xU_2x"
          }
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
