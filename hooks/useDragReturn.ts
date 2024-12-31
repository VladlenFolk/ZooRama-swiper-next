import { useRef, useState, useEffect, useCallback } from "react";
import useDebounce from "./useDebounce";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleDown: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  resetPosition: () => void;
  resetAllState: () => void;
  windowWidth: number;
  pressButtonDisplacement: (direction: "left" | "right") => void;
}

const useDrag = (onDismiss?: () => void): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTop, setIsTop] = useState<"top" | "bottom">("top");
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isAnimating, setIsAnimating] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });

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
  const handleDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const element = elementRef.current;
    if (!element) return;
    element.style.transition = "";
    // Добавляем оптимизацию для анимации
    element.style.willChange = "transform, opacity";

    const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;
    setStartX(clientX);
    setStartY(clientY);
    dragging.current = true;

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const height = rect.height;

    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  const updatePosition = useCallback(
    (x: number, y: number) => {
      const element = elementRef.current;
      if (!element) return;

      const maxTilt = 15;
      const rotationAngle = (x / 100) * maxTilt;
      const rotate =
        isTop === "bottom"
          ? -Math.min(maxTilt, Math.max(-maxTilt, rotationAngle))
          : Math.min(maxTilt, Math.max(-maxTilt, rotationAngle));

      element.style.setProperty("--x", `${x}px`);
      element.style.setProperty("--y", `${y}px`);
      element.style.setProperty("--rotate", `${rotate}deg`);
    },
    [isTop]
  );

  //Движение
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      if (e.cancelable) {
        e.preventDefault(); // Предотвращаем прокрутку
      }
      const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

      const x = clientX - startX;
      const y = clientY - startY;

      lastPositionRef.current = { x, y };

      setTranslateX(x);

      // Обновляем позицию и наклон элемента
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        updatePosition(x, y); // Обновляем позицию только здесь
      });
    },
    [dragging, startX, startY, updatePosition]
  );

  //Отпускание
  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    dragging.current = false;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    const { x, y } = lastPositionRef.current;

    // Проверяем, находится ли элемент в процессе возврата
    if (Math.abs(x) > windowWidth / 10) {
      element.style.setProperty("--x", `${x > 0 ? x + 300 : x - 300}px`);
      element.style.opacity = "0";
      element.style.transition =
        "transform 0.3s ease-out, opacity 0.3s ease-out";
      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        if (onDismiss) onDismiss();
        element.style.willChange = "auto";
      }, 100);
    } else {
      element.style.transition =
        "transform 0.3s ease-out, opacity 0.3s ease-out";
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--rotate", "0deg");
      element.style.opacity = "1";
      setTranslateX(0);
    }
  }, [onDismiss, windowWidth]);

  //Сброс состояний
  const resetPosition = () => {
    const element = elementRef.current;
    if (element) {
      element.style.transition =
        "transform 0.3s ease-out, opacity 0.3s ease-out";
      lastPositionRef.current.x = 0;
      lastPositionRef.current.y = 0;
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--rotate", "0deg");
      element.style.opacity = "1";
      setTranslateX(0);
    }
  };

  const resetAllState = () => {
    // Сбросить позицию элемента
    dragging.current = false; // Сбросить состояние перетаскивания
    setStartX(0); // Сбросить начальную позицию
    setTranslateX(0);
    setTimeout(() => {
      resetPosition();
    }, 300);
  };

  const pressButtonDisplacement = (direction: "right" | "left"): void => {
    if (isAnimating) return; // Блокируем повторные клики
    setIsAnimating(true); // Активируем анимацию

    const element = elementRef.current;
    if (element) {
      element.style.willChange = "transform, opacity";
      direction === "right"
        ? setTranslateX(windowWidth / 10)
        : setTranslateX(-windowWidth / 10);

      const displacement =
        direction === "right"
          ? windowWidth / 5 + 100
          : -(windowWidth / 5 + 100);

      element.style.transition =
        "transform 0.3s ease-out, opacity 0.3s ease-out";

      element.style.setProperty("--x", `${displacement}px`);
      element.style.setProperty(
        "--rotate",
        direction === "right" ? "15deg" : "-15deg"
      );
      element.style.opacity = "0";
      setTimeout(() => {
        if (onDismiss) onDismiss();
        element.style.willChange = "auto";
        element.style.transition = "";
        setIsAnimating(false);
      },  300);
    }
  };

  //Если вынести слушатели в элемент, то при выходе из окна/элемента карточка будет тормозить
  useEffect(() => {
    const addListeners = () => {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    };
  
    const removeListeners = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  
    if (dragging.current) {
      addListeners();
    } else {
      removeListeners();
    }
  
    return removeListeners;
  }, [dragging, handleMove, handleEnd]);

  return {
    elementRef,
    translateX,
    handleDown,
    resetPosition,
    resetAllState,
    windowWidth,
    pressButtonDisplacement,
  };
};

export default useDrag;
