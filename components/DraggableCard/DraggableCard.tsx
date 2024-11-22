"use client";

import useDrag from "@/hooks/useDragReturn";

const DraggableCard: React.FC = () => {
  const { elementRef, handleMouseDown, resetPosition } = useDrag();

  return (
    <div className="relative flex flex-col justify-center items-center w-[100px] h-[220px] ">
      <div
        ref={elementRef}
        onMouseDown={handleMouseDown}
        className="draggable"
      />
      <button
        onClick={resetPosition}
        className="px-[20px] py-[5px] absolute bg-blue-500 text-white rounded shadow left-[10px] bottom-[0px]"
      >
        Reset
      </button>
    </div>
  );
};

export default DraggableCard;
