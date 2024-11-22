import { useRef, useState, useEffect } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const useDrag = (): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTop, setIsTop] = useState<"top" | "bottom">("top");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove("returning");

    const offsetY = e.nativeEvent.offsetY;

    // Размеры элемента
    const rect = element.getBoundingClientRect();
    const height = rect.height;

    const style = window.getComputedStyle(element);
    const translateX = parseInt(style.getPropertyValue("--x")) || 0;

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
    console.log(translateX);
    
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

  const handleMouseUp = () => {
    const element = elementRef.current;
    if (element) {
      const x = translateX;
      if (Math.abs(x) > 150) {
        element.style.setProperty("--x", `${x > 0 ? 500 : -500}px`);
        element.style.setProperty("--opacity", `0`);
        element.classList.add("dismissed");
        // Удаляем элемент через 300ms после завершения анимации
        setTimeout(() => {
          element.style.display = "none";
        }, 300);
      } else {
        // Возвращаем в исходное положение
        element.classList.add("returning");
        element.style.setProperty("--x", "0px");
        element.style.setProperty("--y", "0px");
        element.style.setProperty("--opacity", "1");
        element.style.setProperty("--rotate", "0");
        setTranslateX(0)
      }
      console.log(x);
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
  }, [dragging, startX, translateX]);

  return { elementRef, translateX, handleMouseDown };
};

export default useDrag;
