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
  // const [windowWidth, setWindowWidth] = useState(1024);

  // const handleResize = () => {
  //   setWindowWidth(window.innerWidth);
  // };
  // const debouncedHandleResize = useDebounce(handleResize, 300);

  // useEffect(() => {
  //   window.addEventListener("resize", debouncedHandleResize);

  //   return () => {
  //     window.removeEventListener("resize", debouncedHandleResize);
  //   };
  // }, [debouncedHandleResize]);

  //Движение
  const handleDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove("returning", "dismissed");
    // Добавляем оптимизацию для анимации
    element.style.willChange = "transform, opacity";

    const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

    // const offsetY =
    //   "touches" in e
    //     ? clientY - element.getBoundingClientRect().top
    //     : e.nativeEvent.offsetY;

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const height = rect.height;

    // const translateX =
    //   parseInt(window.getComputedStyle(element).getPropertyValue("--x")) || 0;
    // const translateY =
    //   parseInt(window.getComputedStyle(element).getPropertyValue("--y")) || 0;
    setStartX(clientX - translateX);
    setStartY(clientY - translateY);
    setDragging(true);

    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  //Движение
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

      const x = clientX - startX;
      const y = clientY - startY;

      setTranslateX(x);
      setTranslateY(y);

      const element = elementRef.current;

      if (element) {
        const maxTilt = 15; // Максимальный угол наклона (в градусах)
        const rotationAngle = (x / 100) * maxTilt; // Наклон увеличивается пропорционально

        const rotate =
          isTop === "bottom"
            ? -Math.min(maxTilt, Math.max(-maxTilt, rotationAngle))
            : Math.min(maxTilt, Math.max(-maxTilt, rotationAngle));

        // Обновляем позицию и наклон элемента через transform
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      }
    },
    [dragging, startX, startY, isTop]
  );

  //Отпускание
  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const x = translateX;
    const y = translateY;
    // Считываем текущий наклон элемента
    const currentRotation = parseFloat(
      element.style.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/)?.[1] ||
        "0"
    );
    // Проверяем, находится ли элемент в процессе возврата
    const isDismissed = element.classList.contains("dismissed");
    if (Math.abs(x) > window.innerWidth / 10 && !isDismissed && !isResetting) {
      element.style.transform = `translate(${
        x > 0 ? x + 100 : x - 100
      }px, ${y}px) rotate(${currentRotation}deg)`;
      element.style.opacity = "0";
      element.classList.add("dismissed");

      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        if (onDismiss) onDismiss();
        element.style.willChange = "auto";
        element.classList.remove("dismissed");
      }, 100);
    } else if (!isDismissed) {
      element.classList.add("returning");
      element.style.transform = `translate(0px, 0px) rotate(0deg)`;
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
        element.style.transform = `translate(0px, 0px) rotate(0deg)`;
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
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
    };
  }, [dragging, startX, translateX, handleEnd, resetPosition, translateX]);

  useEffect(() => {
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [handleEnd]);

  return {
    elementRef,
    translateX,
    handleDown,
    resetPosition,
    resetAllState,
  };
};

export default useDrag;
