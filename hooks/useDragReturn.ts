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
  const [elementRect, setElementRect] = useState<DOMRect | null>(null); // Состояние для хранения размеров элемента
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const lastPosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Обработчик изменения размера окна
  const handleResize = useDebounce(
    () => setWindowWidth(window.innerWidth),
    300
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Инициализация размеров элемента только один раз
  useEffect(() => {
    const updateElementRect = () => {
      if (elementRef.current) {
        setElementRect(elementRef.current.getBoundingClientRect());
      }
    };

    // Обновляем размеры при монтировании компонента и на каждом изменении окна
    updateElementRect();
    window.addEventListener("resize", updateElementRect);

    return () => window.removeEventListener("resize", updateElementRect);
  }, []);

  const handleDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      e.stopPropagation();
      const element = elementRef.current;
      // Не проверяем на null, предполагаем, что элемент уже отрендерен
      element!.style.willChange = "transform, opacity";

      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

      setStartX(clientX);
      setStartY(clientY);
      setDragging(true);


      if (elementRect) {
        const offsetY = clientY - elementRect.top;
        const height = elementRect.height;

        if (offsetY > height / 2) {
          setIsTop("bottom");
        } else {
          setIsTop("top");
        }
      }
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
    const element = elementRef.current;


    let rotation = Math.max(Math.min((x / 100) * 15, 15), -15);
    if (isTop === "bottom") {
      rotation = -rotation;
    }

    // Устанавливаем ограниченные значения для перемещения
    element.style.setProperty("--x", `${x}px`);
    element.style.setProperty("--y", `${y}px`);
    elementRef.current.style.setProperty("--rotate", `${rotation}deg`);
    

    requestRef.current = requestAnimationFrame(updatePosition);
  }, [dragging, windowWidth, isTop]);

  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const { x, y } = lastPosition.current;
    element.style.willChange = "auto";
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
