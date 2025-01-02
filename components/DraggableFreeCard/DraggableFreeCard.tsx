"use client";

import useFreeDrag from "@/hooks/useFreeCardDrag";

const DraggableFreeCard: React.FC = () => {
  const { elementRef, handleMouseDown } = useFreeDrag();

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className="draggable bg-[url('/astronaut.svg')] w-[260px] h-[200px] sm:w-[400px] sm:h-[300px] md:w-[400px] md:h-[300px] lg:w-[600px] lg:h-[400px]  bg-cover bg-no-repeat bg-center"

    />
  );
};

export default DraggableFreeCard;
