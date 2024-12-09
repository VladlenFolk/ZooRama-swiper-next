import useDrag from "@/hooks/useDragReturn";
import Image from "next/image";
import { useEffect, memo } from "react";

interface Props {
  img: string;
  handleIncrease: () => void;
  counter: number;
  index: number;
  length: number;
  isResetting: boolean;
}

const DraggableCard: React.FC<Props> = memo(
  ({ img, handleIncrease, counter, index, length, isResetting }) => {
    const isActive = length - index === counter;
    const {
      elementRef,
      handleDown,
      handleMove,
      handleEnd,
      resetAllState,
    } = useDrag(() => {
      if (isActive) handleIncrease();
    });

    useEffect(() => {
      if (isResetting) resetAllState();
    }, [isResetting, resetAllState]);

    return (
      <div
        className={`absolute flex items-center justify-center z-${index} pointer-events-none`}
      >
        <div
          ref={elementRef}
          onMouseDown={isActive ? handleDown : undefined}
          onTouchStart={isActive ? handleDown : undefined}
          onMouseMove={isActive ? handleMove : undefined}
          onMouseUp={isActive ? handleEnd : undefined}
          onTouchMove={isActive ? handleMove : undefined}
          onTouchEnd={isActive ? handleEnd : undefined}
          className={`draggable rounded-lg ${
            isActive ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <Image
            src={img}
            alt="Card Image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 300px"
            className="rounded-lg object-center object-cover"
          />
        </div>
      </div>
    );
  }
);

DraggableCard.displayName = "DraggableCard";
export default DraggableCard;
