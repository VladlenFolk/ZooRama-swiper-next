'use client';

import React, { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';

const DraggableBall: React.FC = () => {
  const ballRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const ball = ballRef.current;
    if (!ball) return;

    // Start dragging
    setIsDragging(true);

    // Calculate the shift offset to keep the cursor at the clicked part of the ball
    const shift = {
      x: event.clientX - ball.getBoundingClientRect().left,
      y: event.clientY - ball.getBoundingClientRect().top,
    };

    // Set absolute positioning for the ball
    ball.style.position = 'absolute';
    ball.style.zIndex = '1000';

    // Move the ball to the initial cursor position
    moveAt(event.pageX, event.pageY, shift);

    // Prevent default drag behavior
    ball.ondragstart = () => false;

    // Mousemove handler with captured shift
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveAt(moveEvent.pageX, moveEvent.pageY, shift);
    };

    // Mouseup handler for cleanup
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const moveAt = (pageX: number, pageY: number, shift: { x: number; y: number }) => {
    const ball = ballRef.current;
    if (ball) {
      ball.style.left = `${pageX - shift.x}px`;
      ball.style.top = `${pageY - shift.y}px`;
    }
  };

  return (
    <div
      ref={ballRef}
      onMouseDown={handleMouseDown}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'red',
        position: 'relative',
        cursor: 'pointer',
      }}
    />
  );
};

export default DraggableBall;
