"use client";

import useDrag from "@/hooks/useDragReturn";

const DraggableCard: React.FC = () => {
  const { elementRef, handleMouseDown } = useDrag();

  return (
    <div ref={elementRef} onMouseDown={handleMouseDown} className="draggable" />
  );
};

export default DraggableCard;
