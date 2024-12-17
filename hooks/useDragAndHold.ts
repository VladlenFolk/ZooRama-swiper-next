import { useRef, useState, useEffect } from "react";

const useDragAndHold = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [enter, setEnter] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  
  // Флаг для того, чтобы избежать перерегистрации слушателей
  const isInitialized = useRef(false);

//   useEffect(() => {
//     const handleGlobalMouseUp = () => {
//       if (isHolding) {
//         setIsHolding(false);
//         setEnter(false); // Сброс состояния при отпускании мыши/пальца
//       }
//     };

//     const handleTouchStart = (e: TouchEvent) => {
//       e.preventDefault(); // Работает, если passive = false
//       setIsHolding(true);
//       setEnter(true);
//     };

//     const handleTouchMove = (e: TouchEvent) => {
//       if (isHolding) {
//         const touch = e.touches[0];
//         const button = buttonRef.current;
//         if (button) {
//           const rect = button.getBoundingClientRect();
//           const isInside =
//             touch.clientX >= rect.left &&
//             touch.clientX <= rect.right &&
//             touch.clientY >= rect.top &&
//             touch.clientY <= rect.bottom;
//           setEnter(isInside);
//         }
//       }
//     };

//     const handleTouchEnd = () => {
//       if (isHolding) {
//         setIsHolding(false);
//         setEnter(false);
//       }
//     };

//     // Регистрация слушателей событий только один раз при изменении состояния
//     // if (!isInitialized.current) {
//     //   document.addEventListener("mouseup", handleGlobalMouseUp);
//     //   document.addEventListener("touchend", handleTouchEnd);
//     //   document.addEventListener("touchmove", handleTouchMove, { passive: false });
//     //   document.addEventListener("touchstart", handleTouchStart, { passive: false });

//     //   // Фиксируем, что слушатели были зарегистрированы
//     //   isInitialized.current = true;
//     // }

//     // // Очистка слушателей при размонтировании или сбросе состояния
//     // return () => {
//     //   document.removeEventListener("mouseup", handleGlobalMouseUp);
//     //   document.removeEventListener("touchend", handleTouchEnd);
//     //   document.removeEventListener("touchmove", handleTouchMove);
//     //   document.removeEventListener("touchstart", handleTouchStart);

//     //   // Сбрасываем флаг и повторно инициализируем, если необходимо
//     //   isInitialized.current = false;
//     // };
//   }, [isHolding]);

  return {
    buttonRef,
    isHolding,
    enter,
  };
};

export default useDragAndHold;
