'use client';

import React, { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';

const DraggableBall: React.FC = () => {
  const element = useRef(null)

 


  return (
    <div
      ref={element}
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
