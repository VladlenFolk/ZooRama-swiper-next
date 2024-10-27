'use client';

import React, { useRef } from 'react';

const DraggableBall = () => {
  const ballRef = useRef(null);

  const handleMouseDown = (event) => {
    const ball = ballRef.current;
    if (!ball) return;

    // Calculate the shift offset to keep the cursor at the clicked part of the ball
    const shift = {
      x: event.clientX - ball.getBoundingClientRect().left,
      y: event.clientY - ball.getBoundingClientRect().top,
    };

    // Set absolute positioning for the ball
    ball.style.position = 'absolute';
    ball.style.zIndex = 1000;

    // Move the ball to the initial cursor position
    moveAt(event.pageX, event.pageY, shift);

    // Prevent default drag behavior
    ball.ondragstart = () => false;

    // Create a handler for mousemove that captures the shift
    const handleMouseMove = (moveEvent) => {
      moveAt(moveEvent.pageX, moveEvent.pageY, shift);
    };

    // Mouse up event to stop dragging and cleanup
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach the event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const moveAt = (pageX, pageY, shift) => {
    const ball = ballRef.current;
    if (ball) {
      ball.style.left = pageX - shift.x + 'px';
      ball.style.top = pageY - shift.y + 'px';
    }
  };

  return (
    <div
      ref={ballRef}
      onMouseDown={handleMouseDown}
      style={{
        width: '50px',
        height: '50px',
        // borderRadius: '50%',
        backgroundColor: 'red',
        position: 'relative',
        cursor: 'pointer',
      }}
    />
  );
};

export default DraggableBall;
