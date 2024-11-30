import { useState } from "react";

interface Props {
  handleReset: () => void;
  isEndOfCard: boolean;
}

const ResetCard: React.FC<Props> = ({ handleReset, isEndOfCard }) => {
  const [isAnimating, setIsAnimating] = useState(false);

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
      className={`w-[200px] h-[400px]  flex flex-col items-center justify-center
        cursor-pointer  rounded-lg bg-[#c7c7c7] ${
          isEndOfCard ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <div
        className={`w-[100px] h-[100px] bg-[length:100px_100px]
          bg-rotatingArrow bg-no-repeat bg-center transition-transform duration-400 ${
            isAnimating ? "animate-rotate-once" : ""
          }`}
      ></div>
    </div>
  );
};

export default ResetCard;
