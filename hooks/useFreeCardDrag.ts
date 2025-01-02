import { useRef, useState, useEffect, useCallback } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
}

const useFreeDrag = (): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    const element = elementRef.current;
    if (!element) return;

    element.style.transition = "";
    element.style.willChange = "transform, opacity";

    const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

    setStartX(clientX - lastPositionRef.current.x);
    setStartY(clientY - lastPositionRef.current.y);

    dragging.current = true;
  };

  const updatePosition = (x: number, y: number) => {
    const element = elementRef.current;
    if (!element) return;
    element.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;

      const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

      const x = clientX - startX;
      const y = clientY - startY;

      lastPositionRef.current = { x, y };

      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        updatePosition(x, y);
      });
    },
    [startX, startY]
  );

  const handleEnd = () => {
    dragging.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  useEffect(() => {
  

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [handleMove]);

  return { elementRef, handleMouseDown };
};

export default useFreeDrag;
