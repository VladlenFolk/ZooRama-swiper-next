import { useRef, useState, useEffect } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  resetPosition: () => void;
}

const useDrag = (onDismiss: () => void): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTop, setIsTop] = useState<"top" | "bottom">("top");
  const [reset, setReset] = useState(true);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove("returning", "dismissed");

    const offsetY = e.nativeEvent.offsetY;
    setReset(false);
    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const height = rect.height;

    const translateX =
      parseInt(window.getComputedStyle(element).getPropertyValue("--x")) || 0;

    setStartX(e.pageX - translateX);
    setDragging(true);
    if (offsetY > height / 2) {
      setIsTop("bottom");
    } else setIsTop("top");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const x = e.pageX - startX;
    setTranslateX(x);

    const element = elementRef.current;
    const maxTilt = 15; // Максимальный угол наклона (в градусах)
    const rotationAngle = (x / 100) * maxTilt; // Наклон увеличивается пропорционально

    if (element) {
      // Обновляем смещение
      element.style.setProperty("--x", `${x}px`);
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
        element.style.setProperty("--rotate", "0");
        element.style.setProperty("--opacity", "1");
      }, 100);
    }
    setTranslateX(0);
  };

  const handleMouseUp = () => {
    const element = elementRef.current;
    if (!element) return;

    const x = translateX;

    // Проверяем, находится ли элемент в процессе возврата
    const isDismissed = element.classList.contains("dismissed");

    if (Math.abs(x) > 150 && !isDismissed) {

      element.style.setProperty("--x", `${x > 0 ? 500 : -500}px`);
      element.style.setProperty("--opacity", `0`);
      element.classList.add("dismissed");
      
      
      // Удаляем элемент через 300ms после завершения анимации
      setTimeout(() => {
        //Вызываем счетчик через 0.3 с чтобы карточка "вылетела"
      if (onDismiss) onDismiss();
        element.style.display = "none";
        element.classList.remove("dismissed");
        element.style.setProperty("--x", "0px");
        element.style.setProperty("--opacity", "1");
      }, 300);

    } else if (!isDismissed) {
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

  return { elementRef, translateX, handleMouseDown, resetPosition };
};

export default useDrag;
