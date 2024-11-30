import { useRef, useState, useEffect } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  resetPosition: () => void;
  resetAllState: () => void;
}

const useDrag = (
  onDismiss: () => void,
  isResetting: boolean,
  handleCurrentIncrease:()=> void,
): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isTop, setIsTop] = useState<"top" | "bottom">("top");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;
    // onAnimate();

    element.classList.remove("returning", "dismissed");

    const offsetY = e.nativeEvent.offsetY;

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const height = rect.height;

    const translateX =
      parseInt(window.getComputedStyle(element).getPropertyValue("--x")) || 0;
    const translateY =
      parseInt(window.getComputedStyle(element).getPropertyValue("--y")) || 0;
    setStartX(e.pageX - translateX);
    setStartY(e.pageY - translateY);
    setDragging(true);
    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const x = e.pageX - startX;
    const y = e.pageY - startY;
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

  const handleMouseUp = () => {
    const element = elementRef.current;
    if (!element) return;

    const x = translateX;

    // Проверяем, находится ли элемент в процессе возврата
    const isDismissed = element.classList.contains("dismissed");
    if (Math.abs(x) > 150 && !isDismissed && !isResetting) {
      element.style.setProperty("--x", `${x > 0 ? x + 100 : x - 100}px`);
      element.style.setProperty("--opacity", `0`);
      element.classList.add("dismissed");
      handleCurrentIncrease();
      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        if (onDismiss) onDismiss();
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

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startX, translateX, handleMouseUp, resetPosition]);

  return {
    elementRef,
    translateX,
    handleMouseDown,
    resetPosition,
    resetAllState,
  };
};

export default useDrag;
