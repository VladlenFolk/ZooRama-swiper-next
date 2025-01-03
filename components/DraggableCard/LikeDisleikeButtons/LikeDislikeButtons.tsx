import { useState, FC, useEffect } from "react";

interface Props {
  index: number;
  translateX: number;
  windowWidth: number;
  pressButtonDisplacement: (direction: "left" | "right") => void;
  isActiveCard: boolean;
  isResetting: boolean;
}

const LikeDislikeButtons: FC<Props> = ({
  index,
  translateX,
  windowWidth,
  pressButtonDisplacement,
  isActiveCard,
  isResetting,
}) => {
  const [isPressed, setIsPressed] = useState<"left" | "right" | null>(null);

  const onLeftClick = () => {
    pressButtonDisplacement("left");
  };

  const onRightClick = () => {
    pressButtonDisplacement("right");
  };

  useEffect(() => {
    if (isResetting) {
      setIsPressed(null);
    }
  }, [isResetting]);

  if (
    (index === 0 && translateX >= windowWidth / 10 + 10) ||
    (index === 0 && translateX <= -windowWidth / 10 - 10) ||
    (isActiveCard && !isResetting)
  ) {
    return (
      (index === 0 && translateX >= windowWidth / 10 + 10) ||
      (index === 0 && translateX <= -windowWidth / 10 - 10) ||
      (isActiveCard && !isResetting && (
        <div className="flex justify-around absolute bottom-[10px] w-full">
          <button
            aria-label="dislike"
            onClick={onLeftClick}
            onMouseDown={() => setIsPressed("left")}
            onMouseUp={() => setIsPressed(null)}
            onMouseLeave={() => setIsPressed(null)}
            onTouchStart={() => setIsPressed("left")}
            onTouchEnd={() => setIsPressed(null)}
            className={`w-[40px] h-[40px] pointer-events-auto rounded-full border-[1px] border-[#B40335] flex items-center justify-center ${
              translateX <= -windowWidth / 10 || isPressed === "left"
                ? "bg-[#B40335]"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="25"
            >
              <path
                d="M18.364 5.636a1 1 0 0 0-1.414 0L12 10.586 7.05 5.636a1 1 0 1 0-1.414 1.414L10.586 12l-5.95 5.95a1 1 0 1 0 1.414 1.414L12 13.414l5.95 5.95a1 1 0 1 0 1.414-1.414L13.414 12l5.95-5.95a1 1 0 0 0 0-1.414z"
                fill={
                  translateX <= -windowWidth / 10 || isPressed === "left"
                    ? "#FFFFFF"
                    : "#B40335"
                } // Белый крестик при активном состоянии
              />
            </svg>
          </button>
          <button
            aria-label="like"
            onClick={onRightClick}
            onMouseDown={() => setIsPressed("right")}
            onMouseUp={() => setIsPressed(null)}
            onMouseLeave={() => setIsPressed(null)}
            onTouchStart={() => setIsPressed("right")}
            onTouchEnd={() => setIsPressed(null)}
            className={`w-[40px] h-[40px]  pointer-events-auto rounded-full border-[1px] border-[#36DE8D] flex items-center justify-center ${
              translateX >= windowWidth / 10 || isPressed === "right"
                ? "bg-[#36DE8D] "
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="25"
            >
              <path
                d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z"
                fill={
                  translateX >= windowWidth / 10 || isPressed === "right"
                    ? "#FFFFFF"
                    : "#36DE8D"
                }
              />
            </svg>
          </button>
        </div>
      ))
    );
  }
};
export default LikeDislikeButtons;
