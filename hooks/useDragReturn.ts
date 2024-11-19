import { useRef, useState, useEffect } from 'react';

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    const style = window.getComputedStyle(element);
    const translateX = parseInt(style.getPropertyValue('--x')) || 0;
    const translateY = parseInt(style.getPropertyValue('--y')) || 0;

    setStartX(e.pageX - translateX);
    setStartY(e.pageY - translateY);
    setDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const x = e.pageX - startX;
    const y = e.pageY - startY;

    setTranslate({ x, y });

    const element = elementRef.current;
    if (element) {
      element.style.setProperty('--x', `${x}px`);
      element.style.setProperty('--y', `${y}px`);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, startX, startY]);

  return { elementRef, translate, handleMouseDown };
};

export default useDrag;
