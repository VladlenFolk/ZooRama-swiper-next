'use client'
import { useState, useRef, createRef, useMemo } from "react";
import "./App.css";
import Button from "@/app/components/button/button";

interface Animal {
  id: number;
  name: string;
  img: string;
}

type Direction = "left" | "right" | "up" | "down";

interface CardRef {
  swipe: (dir?: Direction) => Promise<void>;
  restoreCard: () => Promise<void>;
}

const animals: Animal[] = [
  {
    id: 1,
    name: "Доша",
    img: "https://avatars.mds.yandex.net/get-entity_search/2360676/844472719/S122x122_2x",
  },
  {
    id: 2,
    name: "Сиба",
    img: "https://avatars.mds.yandex.net/get-entity_search/135316/777333296/S122x122Smart_2x",
  },
  {
    id: 3,
    name: "Шпиц",
    img: "https://avatars.mds.yandex.net/get-entity_search/1922058/849472009/S122x122Smart_2x",
  },
  {
    id: 4,
    name: "Джек",
    img: "https://avatars.mds.yandex.net/get-entity_search/7689070/784457321/S122x122Smart_2x",
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(animals.length - 1);
  const [lastDirection, setLastDirection] = useState<Direction | undefined>();

  const currentIndexRef = useRef<number>(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(animals.length)
        .fill(0)
        .map(() => createRef<CardRef>()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < animals.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (
    direction: Direction,
    index: number
  ) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const swipe = async (dir?: Direction) => {
    if (canSwipe && currentIndex < animals.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };
  return (
    <div className="app">
      <div className="flex flex-col items-center content-center w-screen h-screen min-h-600 p-5 relative">
        <div className="flex flex-col h-300 max-w-260 relative w-90v">
          {animals.map((animal) => (
            <div
              // ref={childRefs[index]}
              className="origin-center w-full h-full absolute"
              key={animal.id}
              // onSwipe={(dir) => swiped(dir as Direction, animal.name, index)}
            >
              <div
                style={{ backgroundImage: `url(${animal.img})` }}
                className="absolute rounded-[20px] bg-white max-w-260 h-[260px] bg-cover bg-center w-80v shadow-card"
              >
                <h3 className="absolute bottom-4 right-4 text-white font-bold text-lg ">{animal.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center">
          <Button text={'Смахнуть влево!'} swipe={() => swipe("left")} canSwipe={canSwipe} />
           <Button text={'Предыдущий!'} swipe={() => goBack()} canSwipe={canGoBack} />
           <Button text={'Смахнуть вправо!'} swipe={() => swipe("right")} canSwipe={canSwipe} />
        </div>
        {lastDirection ? (
          <h2 key={lastDirection} className="infoText">
            You swiped {lastDirection}
          </h2>
        ) : (
          <h2 className="infoText">
            Swipe a card or press a button to get Restore Card button visible!
          </h2>
        )}
      </div>
    </div>
  );
}

export default App;
