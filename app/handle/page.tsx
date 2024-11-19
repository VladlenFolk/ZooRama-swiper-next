"use client";

import React, { useState, useRef, useEffect } from "react";

interface Translate {
  x: number;
  y: number;
}

const DraggableBall: React.FC = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translate, setTranslate] = useState<Translate>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    const style = window.getComputedStyle(element);
    const transform = new DOMMatrixReadOnly(style.transform);
    const translateX = transform.m41;
    const translateY = transform.m42;

    setStartX(e.pageX - translateX);
    setStartY(e.pageY - translateY);
    setDragging(true);
    console.log(dragging);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const x = e.pageX - startX;
      const y = e.pageY - startY;
      setTranslate({ x, y });
    };
    const handleMouseUp = () => {
      setDragging(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startX, startY]);

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className={`w-[100px] h-[200px]  bg-red-700`}
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`,
        position: "absolute", // Убедитесь, что элемент позиционируется корректно
        cursor: "grab",
      }}
    />
  );
};

export default DraggableBall;
