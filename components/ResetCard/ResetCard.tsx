import { log } from "node:console";
import { useState } from "react";

interface Props {
  handleReset: () => void;
  isEndOfCard: boolean;
  length: number;
  counter: number;
}

const ResetCard: React.FC<Props> = ({
  handleReset,
  isEndOfCard,
  length,
  counter,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  if (length - counter > 1) {
    return null;
  }
  const doResetWithAnimate = () => {
    setIsAnimating(true); // Запускаем анимацию

    setTimeout(() => {
      handleReset(); // Вызываем сброс после завершения анимации
      setIsAnimating(false); // Сбрасываем состояние анимации
    }, 500); // 500ms соответствует длительности анимации
  };
  return (
    <div
      onClick={doResetWithAnimate}
      className={`w-[200px] h-[400px] sm:w-[300px] sm:h-[500px] md:w-[300px] md:h-[500px] lg:w-[400px] lg:h-[600px]   flex flex-col items-center justify-center
        cursor-pointer  rounded-lg bg-[#c7c7c7] ${
          isEndOfCard ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <div
        className={`w-[100px] h-[100px] bg-[length:100px_100px]
          bg-rotatingArrow bg-no-repeat bg-center transition-transform duration-400 ${
            isAnimating ? "animate-rotate-once" : ""
          } `}
      ></div>
    </div>
  );
};

export default ResetCard;
