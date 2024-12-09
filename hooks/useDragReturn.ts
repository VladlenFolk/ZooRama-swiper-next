import { useRef, useState, useCallback } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  translateY: number;
  handleDown: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  handleMove: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  handleEnd: () => void;
  resetAllState: () => void;
}

const useDrag = (onDismiss: () => void): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement>(null);
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

      translateXRef.current = clientX;
      translateYRef.current = clientY;
      setDragging(true);
    },
    []
  );

  const handleMove = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!dragging) return;

      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

      const deltaX = clientX - translateXRef.current;
      const deltaY = clientY - translateYRef.current;

      if (elementRef.current) {
        elementRef.current.style.setProperty("--x", `${deltaX}px`);
        elementRef.current.style.setProperty("--y", `${deltaY}px`);
        elementRef.current.style.setProperty("--rotate", `${(deltaX / 100) * 15}deg`);
      }
    },
    [dragging]
  );

  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const deltaX = parseInt(element.style.getPropertyValue("--x") || "0");

    if (Math.abs(deltaX) > window.innerWidth / 10) {
      element.style.setProperty("--opacity", "0");
      setTimeout(() => onDismiss(), 300);
    } else {
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--rotate", "0deg");
    }
    setDragging(false);
  }, [onDismiss]);

  const resetAllState = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--opacity", "1");
      element.style.setProperty("--rotate", "0deg");
    }
    setDragging(false);
  }, []);

  return {
    elementRef,
    translateX: parseInt(translateXRef.current.toString(), 10),
    translateY: parseInt(translateYRef.current.toString(), 10),
    handleDown,
    handleMove,
    handleEnd,
    resetAllState,
  };
};

export default useDrag;
