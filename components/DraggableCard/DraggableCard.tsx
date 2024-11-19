"use client";

import React, { useState, useRef, useEffect } from "react";

const DraggableCard: React.FC = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    const style = window.getComputedStyle(element);

    // Считываем кастомные свойства --x и --y
    const translateX = parseInt(style.getPropertyValue('--x')) || 0;
    const translateY = parseInt(style.getPropertyValue('--y')) || 0;

    setStartX(e.pageX - translateX);
    setStartY(e.pageY - translateY);
    setDragging(true);
  };
  const handleMouseUp = () => {
    setDragging(false);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const x = e.pageX - startX;
    const y = e.pageY - startY;

    const element = elementRef.current;
    if (element) {
      element.style.setProperty('--x', `${x}px`);
      element.style.setProperty('--y', `${y}px`);
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

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className='draggable'
    />
  );
};

export default DraggableCard;
