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
  const [windowWidth, setWindowWidth] = useState(1024);
  const requestRef = useRef<number | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
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

  // Получение текущих координат и поворота элемента

  //Движение
  const handleDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove("returning", "dismissed");
    // Добавляем оптимизацию для анимации
    element.style.willChange = "transform, opacity";

    const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;
    setStartX(clientX);
    setStartY(clientY);
    setDragging(true);

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const height = rect.height;

    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  const updatePosition = (x: number, y: number) => {
    const element = elementRef.current;
    if (!element) return;

    const maxTilt = 15;
    const rotationAngle = (x / 100) * maxTilt;
    const rotate =
      isTop === "bottom"
        ? -Math.min(maxTilt, Math.max(-maxTilt, rotationAngle))
        : Math.min(maxTilt, Math.max(-maxTilt, rotationAngle));

    element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
  };

  //Движение
  const throttledHandleMove = useCallback(
    throttle((e) => {
      if (!dragging) return;

      const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

      const x = clientX - startX;
      const y = clientY - startY;

      // setTranslateX(x);
      // setTranslateY(y);
      
      // Сохраняем последние координаты
      lastPosition.current = { x, y };

      updatePosition(x, y); // Обновляем позицию только здесь
    }, 16), // Ограничиваем вызов функции до 60 раз в секунду (1000 ms / 60 ≈ 16 ms)
    [dragging, startX, startY, isTop]
  );

  //Отпускание
  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    // const x = translateX;
    // const y = translateY;

    const { x, y } = lastPosition.current;
    // Считываем текущий наклон элемента
    const currentRotation = parseFloat(
      element.style.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/)?.[1] ||
        "0"
    );
    // Проверяем, находится ли элемент в процессе возврата
    // const isDismissed = element.classList.contains("dismissed");
    if (Math.abs(x) > windowWidth / 10) {
      element.style.transform = `translate3d(${
        x > 0 ? x + 100 : x - 100
      }px, ${y}px, 0) rotate3d(0, 0, 1, ${currentRotation}deg)`;
      element.style.opacity = "0";
      element.classList.add("dismissed");

      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        if (onDismiss) onDismiss();
        element.style.willChange = "auto";
        element.classList.remove("dismissed");
      }, 100);
    } else {
      element.classList.add("returning");
      element.style.transform = `translate3d(0px, 0px, 0) rotate3d(0, 0, 1, 0deg)`;
      element.style.opacity = "1";
      setTranslateX(0);
      setTranslateY(0);
    }
    setDragging(false);
  }, [translateX, isResetting, onDismiss]);

  //Сброс состояний
  const resetPosition = () => {
    const element = elementRef.current;
    if (element) {
      setTimeout(() => {
        element.classList.add("returning");
        element.style.transform = `translate3d(0px, 0px, 0) rotate3d(0, 0, 1, 0deg)`;
        element.style.opacity = "1";

        setTranslateX(0);
        setTranslateY(0);
      }, 100);
    }
  };

  const resetAllState = () => {
    // Сбросить позицию элемента
    setDragging(false); // Сбросить состояние перетаскивания
    setStartX(0); // Сбросить начальную позицию
    setTimeout(() => {
      resetPosition();
    }, 200);
  };

  useEffect(() => {
    if (dragging) {
      const handleMoveBound = throttledHandleMove.bind(null);
      const handleEndBound = handleEnd.bind(null);

      document.addEventListener("mousemove", handleMoveBound);
      document.addEventListener("mouseup", handleEndBound);
      document.addEventListener("touchmove", handleMoveBound);
      document.addEventListener("touchend", handleEndBound);

      return () => {
        document.removeEventListener("mousemove", handleMoveBound);
        document.removeEventListener("mouseup", handleEndBound);
        document.removeEventListener("touchmove", handleMoveBound);
        document.removeEventListener("touchend", handleEndBound);
      };
    }
  }, [dragging, throttledHandleMove, handleEnd]);

  return {
    elementRef,
    translateX,
    handleDown,
    resetPosition,
    resetAllState,
    windowWidth,
  };
};

export default useDrag;
