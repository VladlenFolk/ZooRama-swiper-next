import { useRef, useState, useEffect } from "react";
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

    const offsetY =
      "touches" in e
        ? clientY - element.getBoundingClientRect().top
        : e.nativeEvent.offsetY;

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const height = rect.height;

    const translateX =
      parseInt(window.getComputedStyle(element).getPropertyValue("--x")) || 0;
    const translateY =
      parseInt(window.getComputedStyle(element).getPropertyValue("--y")) || 0;
    setStartX(clientX - translateX);
    setStartY(clientY - translateY);
    setDragging(true);
    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  //Движение
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;

    const clientX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const clientY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

    const x = clientX - startX;
    const y = clientY - startY;
    setTranslateX(x);
    setTranslateY(y);

    const element = elementRef.current;
    const maxTilt = 15; // Максимальный угол наклона (в градусах)
    const rotationAngle = (x / 100) * maxTilt; // Наклон увеличивается пропорционально

    if (element) {
      // Обновляем смещение
      element.style.setProperty("--x", `${x}px`);
      element.style.setProperty("--y", `${y}px`);
      if (isTop === "bottom") {
        element.style.setProperty(
          "--rotate",
          `${Math.max(Math.min(rotationAngle, maxTilt), -maxTilt) * -1}deg`
        );
      } else {
        element.style.setProperty(
          "--rotate",
          `${Math.max(Math.min(rotationAngle, maxTilt), -maxTilt)}deg`
        );
      }
    }
  };

  //Отпускание
  const handleEnd = () => {
    const element = elementRef.current;
    if (!element) return;

    const x = translateX;

    // Проверяем, находится ли элемент в процессе возврата
    const isDismissed = element.classList.contains("dismissed");
    if (Math.abs(x) > windowWidth / 10 && !isDismissed && !isResetting) {
      element.style.setProperty("--x", `${x > 0 ? x + 100 : x - 100}px`);
      element.style.setProperty("--opacity", `0`);
      element.classList.add("dismissed");
      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        if (onDismiss) onDismiss();
        element.style.willChange = "auto";
        element.classList.remove("dismissed");
      }, 100);
    } else if (!isDismissed) {
      element.style.display = "block";
      element.classList.add("returning");
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--opacity", "1");
      element.style.setProperty("--rotate", "0");
      setTranslateX(0);
    }
    setDragging(false);
  };

  //Сброс состояний
  const resetPosition = () => {
    const element = elementRef.current;
    if (element) {
      element.style.display = "block";
      setTimeout(() => {
        element.classList.add("returning");
        element.style.setProperty("--x", "0px");
        element.style.setProperty("--y", "0px");
        element.style.setProperty("--rotate", "0");
        element.style.setProperty("--opacity", "1");
      }, 200);
    }
    setTranslateX(0);
  };

  const resetAllState = () => {
    resetPosition(); // Сбросить позицию элемента
    setDragging(false); // Сбросить состояние перетаскивания
    setStartX(0); // Сбросить начальную позицию
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
  }, [
    dragging,
    startX,
    translateX,
    handleEnd,
    resetPosition,
    translateX,
    windowWidth,
  ]);

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
