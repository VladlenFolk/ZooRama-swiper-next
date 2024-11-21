"use client";

import useFreeDrag from "@/hooks/useFreeCardDrag";

const DraggableFreeCard: React.FC = () => {
  const { elementRef, handleMouseDown } = useFreeDrag();

  return (
    <div ref={elementRef} onMouseDown={handleMouseDown} className="draggable" />
  );
};

export default DraggableFreeCard;
