import { useRef, useState, useEffect, useCallback } from "react";
import useDebounce from "./useDebounce";
import { throttle } from "./useThrottle";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleDown: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  resetPosition: () => void;
  resetAllState: () => void;
  windowWidth: number;
}

const useDrag = (
  onDismiss: () => void,
  isResetting: boolean
): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isTop, setIsTop] = useState<"top" | "bottom">("top");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const lastPosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  const debouncedHandleResize = useDebounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [debouncedHandleResize]);


  const handleDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;
      setStartX(clientX);
      setStartY(clientY);
      setDragging(true);
    },
    []
  );

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
      lastPosition.current = {
        x: clientX - startX,
        y: clientY - startY,
      };
    },
    [dragging, startX, startY]
  );

  const updatePosition = useCallback(() => {
    if (!dragging || !elementRef.current) return;
    const { x, y } = lastPosition.current;

    elementRef.current.style.setProperty("--x", `${x}px`);
    elementRef.current.style.setProperty("--y", `${y}px`);

    const maxTilt = 15;
    const rotationAngle = (x / 100) * maxTilt;
    const rotate =
      isTop === "bottom"
        ? -Math.min(maxTilt, Math.max(-maxTilt, rotationAngle))
        : Math.min(maxTilt, Math.max(-maxTilt, rotationAngle));

    elementRef.current.style.setProperty("--rotate", `${rotate}deg`);

    requestRef.current = requestAnimationFrame(updatePosition);
  }, [dragging, isTop]);

  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const { x, y } = lastPosition.current;

    // Если перемещение достаточно велико, считаем, что карточка должна исчезнуть
    if (Math.abs(x) > windowWidth / 10) {
      element.style.setProperty("--x", `${x > 0 ? x + 20 : x - 20}px`);
      element.style.setProperty("--opacity", `0`);
      element.classList.add("dismissed");

      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300); // Время анимации
    } else {
      // Если перемещение недостаточно велико, возвращаем карточку в исходное положение
      element.style.setProperty("--x", `0px`);
      element.style.setProperty("--y", `0px`);
      element.style.setProperty("--opacity", `1`);
      element.style.setProperty("--rotate", `0deg`);
      lastPosition.current = {
        x: 0,
        y: 0,
      };
      element.classList.add("returning");
      setTimeout(() => {
        element.classList.remove("returning");
      }, 300);
    }
    setDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [windowWidth, onDismiss]);

  const resetAllState = (): void => {
    const element = elementRef.current;
    element!.style.setProperty("--x", `0px`);
    element!.style.setProperty("--y", `0px`);
    element!.style.setProperty("--opacity", `1`);
    element!.style.setProperty("--rotate", `0deg`);
    lastPosition.current = {
      x: 0,
      y: 0,
    };
    element!.classList.add("returning");
    setTimeout(() => {
      element!.classList.remove("returning");
    }, 300);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleEnd);

      requestRef.current = requestAnimationFrame(updatePosition);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [dragging, handleMove, handleEnd, updatePosition]);

  return {
    elementRef,
    translateX: lastPosition.current.x,
    handleDown,
    resetPosition: () => setTranslateX(0),
    resetAllState,
    windowWidth,
  };
};

export default useDrag;
