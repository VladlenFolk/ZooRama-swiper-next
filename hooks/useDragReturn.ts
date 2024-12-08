import { useRef, useState, useCallback } from "react";

interface UseDragReturn {
  elementRef: React.RefObject<HTMLDivElement>;
  translateX: number;
  handleDown: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  handleMove: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  handleEnd: () => void;
  resetAllState: () => void;
  windowWidth: number;
}

const useDrag = (onDismiss: () => void): UseDragReturn => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1024;

  // Используем ref для хранения значений, чтобы избежать лишних рендеров
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);

  // Вспомогательная переменная для контроля throttling
  const isThrottled = useRef(false);

  const handleDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      e.stopPropagation();

      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;
      setStartX(clientX);
      setStartY(clientY);
      setDragging(true);
    },
    []
  );

  const handleMove = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!dragging || isThrottled.current) return;

      const clientX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const clientY = "touches" in e ? e.touches[0].pageY : e.pageY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      translateXRef.current = deltaX;
      translateYRef.current = deltaY;
      // window.requestAnimationFrame(() => {
      const element = elementRef.current;
      if (element) {
        let rotation = Math.max(Math.min((deltaX / 100) * 15, 15), -15);
        element.style.setProperty("--x", `${deltaX}px`);
        element.style.setProperty("--y", `${deltaY}px`);
        element.style.setProperty("--rotate", `${rotation}deg`);
      }
      // });

      // Запускаем throttling, чтобы обновление происходило только с задержкой
      // isThrottled.current = true;
      // setTimeout(() => {
      //   isThrottled.current = false;
      // }, 16); // 16ms = 60fps
    },
    [dragging, startX, startY]
  );

  const handleEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    const x = translateXRef.current;

    // Если перемещение достаточно велико, карточка исчезает
    if (Math.abs(x) > windowWidth / 10) {
      element.style.setProperty("--x", `${x > 0 ? x + 20 : x - 20}px`);
      element.style.setProperty("--opacity", "0");
      element.classList.add("dismissed");

      setTimeout(() => {
        if (onDismiss) onDismiss(); // Уведомляем о том, что карточка должна быть удалена
      }, 300); // Время анимации исчезновения
    } else {
      // Возвращаем карточку на место
      element.classList.add("returning");
      element.style.setProperty("--x", `0px`);
      element.style.setProperty("--y", `0px`);
      element.style.setProperty("--opacity", `1`);
      element.style.setProperty("--rotate", `0deg`);
      translateXRef.current = 0;
      translateYRef.current = 0;

      setTimeout(() => {
        element.classList.remove("returning");
      }, 300);
    }
    setDragging(false);
  }, [windowWidth, onDismiss]);

  const resetAllState = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.classList.add("returning");
      element.style.setProperty("--x", "0px");
      element.style.setProperty("--y", "0px");
      element.style.setProperty("--opacity", "1");
      element.style.setProperty("--rotate", "0deg");
    }
    translateXRef.current = 0;
    translateYRef.current = 0;
    setTranslateX(0);
    setTranslateY(0);
    setDragging(false);
    setTimeout(() => {
      // Убираем класс возвращения после завершения анимации
      const element = elementRef.current;
      if (element) {
        element.classList.remove("returning");
      }
    }, 300); // Длительность анимации возврата
  }, []);

  return {
    elementRef,
    translateX,
    handleDown,
    handleMove,
    handleEnd,
    resetAllState,
    windowWidth,
  };
};

export default useDrag;
