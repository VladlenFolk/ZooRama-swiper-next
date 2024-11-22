import { useRef, useState, useEffect } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translate: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const useDrag = (): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
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
    const translateY = parseInt(style.getPropertyValue("--y")) || 0;

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

    setTranslate({ x, y });
    const element = elementRef.current;
    const maxTilt = 15; // Максимальный угол наклона (в градусах)
    const rotationAngle = (x / 100) * maxTilt; // Наклон увеличивается пропорционально

    if (element) {
      element.style.setProperty("--x", `${x}px`);
      element.style.setProperty("--y", `${y}px`);
      if (isTop === "bottom") {
        element.style.setProperty(
          "--rotate",
          `${Math.max(Math.min(rotationAngle, maxTilt), -maxTilt)*-1}deg`
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
    setDragging(false);

    const element = elementRef.current;
    if (element) {
      // Добавляем класс `returning` для включения анимации
      element.classList.add("returning");
      // Сброс позиции и наклона
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--rotate", "0deg");
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startX, startY]);

  return { elementRef, translate, handleMouseDown };
};

export default useDrag;
