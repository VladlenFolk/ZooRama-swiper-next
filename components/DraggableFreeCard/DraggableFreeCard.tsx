"use client";

import useFreeDrag from "@/hooks/useFreeCardDrag";

const DraggableFreeCard: React.FC = () => {
  const { elementRef, handleMouseDown } = useFreeDrag();

  return (
    <div ref={elementRef} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} className="draggable bg-slate-400 w-[200px] h-[400px]" />
  );
};

export default DraggableFreeCard;
