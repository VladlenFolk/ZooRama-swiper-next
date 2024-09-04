"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag, pinchAction, useGesture  } from "@use-gesture/react";
import Image from "next/image";

const cards = [
  {
    img: "https://avatars.mds.yandex.net/get-entity_search/135316/777333296/S122x122Smart_2x",
    name: "Котик",
    age: "45 лет",
    description: "Грызу тапкиб мешаю спать"
  },
  {
    img: "https://avatars.mds.yandex.net/get-entity_search/2360676/844472719/S122x122_2x",
  },
  {
    img: "https://avatars.mds.yandex.net/get-entity_search/1922058/849472009/S122x122Smart_2x",
  },
  {
    img: "https://avatars.mds.yandex.net/get-entity_search/7689070/784457321/S122x122Smart_2x",
  },
];

export default function SwiperCards() {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const [gone] = useState(new Set<number>());
  const [reset, setReset] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [direction, setDirection] = useState("Направление");
  const [count, setCount] = useState(0);

  const to = (i: number) => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    delay: i * 100,
  });

  const from = (_i: number) => ({
    x: _i % 2 === 0 || 0 ? -windowWidth + 100 : windowWidth + 100,
    rot: 0,
    scale: 1,
    y: 0,
  });
  const trans = (r: number, s: number) => `scale(${s}) rotate(${r * 10}deg)`;

  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  useLayoutEffect(() => {
    api.start((i) => ({
      ...to(i),
      config: { friction: 80, tension: 300 },
    }));
  }, []);

  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx, my],
      direction: [xDir],
      velocity: [vx],
      tap
    }) => {
      if (gone.has(index)) return;
      if (tap) {
        onTap(index, 1); // Swipe right on tap
        return;
      }
      const flippedLeft = mx > windowWidth / 10;
      const flippedRight = mx < -windowWidth / 10;
      const flippedDir = flippedLeft ? 1 : flippedRight ? -1 : 0;
      if (!active && (flippedLeft || flippedRight)) {
        gone.add(index);
        setDirection(flippedDir === -1 ? "left" : "right");
      }

      setReset(true);
      api.start((i) => {
        if (index !== i) return;
        const isGone = gone.has(index);
        const x = isGone ? (200 + windowWidth) * flippedDir : active ? mx : 0;
        const y = active ? my : 0;
        const rot = flippedDir ? mx / 100 + (isGone ? xDir * 2 * vx : 0) : 0;
        if (isGone) {
          setCount((prev) => prev + 1);
        }
        const scale = active ? 1.1 : 1;
        return {
          x,
          y,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });
    }
  );


  const swipe = (index: number, direction: number) => {
    if (gone.has(index)) return;
    gone.add(index);
    setReset(true);
    setTimeout(() => {
      api.start((i) => {
        if (index !== i) return;
        const x = (200 + windowWidth) * direction;
        const rot = direction * 10;
        const scale = 1;
        return {
          x,
          rot,
          scale,
          config: { friction: 380, tension: 480 },
        };
      });
    }, 300);
  };

  const onTap = (index: number, direction: number) => {
    if (gone.has(index)) return;
    gone.add(index);
    setReset(true);
      api.start((i) => {
        if (index !== i) return;
        const x = (200 + windowWidth) * direction;
        const rot = direction * 10;
        const scale = 1;
        return {
          x,
          rot,
          scale,
          config: { friction: 380, tension: 480 },
        };
      });
    
  };

  const doReset = () => {
    setReset(false);
    setLike(false);
    setDislike(false);
    gone.clear();
    api.start((i) => ({
      ...to(i),
      config: { friction: 80, tension: 300 },
    }));
  };

  return (
    <div className="w-full h-full  overflow-hidden flex flex-col justify-center items-center">
      <div className="w-[330px] h-[472px] flex justify-center items-center relative">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div
            className="deck absolute w-full h-full flex justify-center items-center"
            key={i}
            style={{ x, y }}
            onClick={()=> gone.add(i)}
          >
            <animated.div
              {...bind(i)}
              className="touch-none h-full w-full absolute max-w-[300px] rounded-[10px] shadow-card bg-no-repeat bg-center bg-cover"
              style={{
                transform: interpolate([rot, scale], trans),
                x,
                y,
                backgroundImage: `url(${cards[i].img})`,
              }}
            >
              {/* <Image
                  src={cards[i]}
                  fill
                  className="rounded-[10px] w-9/10"
                  sizes="90% (max-width: 300px)"
                  alt="dog"
                  priority
                ></Image> */}
              {reset && i === cards.length - 1 - gone.size && (
                <>
                  <animated.div
                    className={`${"absolute text-[2rem] font-bold  text-white pointer-events-none opacity-0 transition-opacity duration-200 ease-in-out"} 
                                  ${"top-[30px] bg-[red] right-[20px] p-[10px] rounded-[5px] rotate-[30deg]"}`}
                    style={{
                      opacity: interpolate([x], (x) =>
                        x < -windowWidth / 10 ? 1 : 0
                      ),
                    }}
                  >
                    NOPE
                  </animated.div>
                  <animated.div
                    className={`${"absolute text-[2rem] font-bold  text-white pointer-events-none opacity-0 transition-opacity duration-200 ease-in-out"}  
                                  ${"top-[30px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"}`}
                    style={{
                      opacity: interpolate([x], (x) =>
                        x > windowWidth / 10 ? 1 : 0
                      ),
                    }}
                  >
                    LIKE
                  </animated.div>
                </>
              )}
              <>
                <animated.div
                  className={`${`absolute text-[2rem] font-bold  text-white pointer-events-none ${
                    dislike ? "opacity-1" : " opacity-0"
                  } transition-opacity duration-200 ease-in-out`} 
                    ${"top-[30px] bg-[red] right-[20px] p-[10px] rounded-[5px] rotate-[30deg] "}`}
                >
                  NOPE
                </animated.div>
                <animated.div
                  className={`${`absolute text-[2rem] font-bold  text-white pointer-events-none ${
                    like ? "opacity-1" : " opacity-0"
                  } transition-opacity duration-200 ease-in-out`}
                      ${"top-[30px] bg-[green] left-[20px] p-[10px] rounded-[5px] rotate-[-30deg]"}`}
                >
                  LIKE
                </animated.div>
              </>
            </animated.div>
          </animated.div>
        ))}
        <div
          className={`absolute bottom-[25px] flex space-x-4 justify-center items-center`}
        >
          <button className="w-[24px] h-[24px]" onClick={doReset}>
            <Image
              className="w-[24px] h-[24px]"
              src="refresh.svg"
              alt="перезагрузка"
              width="24"
              height="24"
            ></Image>
          </button>
          <button
            className="w-[31px] h-[31px]"
            onClick={() => {
              swipe(cards.length - 1 - gone.size, -1),
                setDislike(true),
                setDirection("left");
              setTimeout(() => setDislike(false), 200);
            }}
          >
            <Image
              className="w-[30px] h-[30px]"
              src="nope.svg"
              alt="отклонить"
              width="24"
              height="24"
            ></Image>
          </button>
          <button
            className="w-[24px] h-[24px]"
            onClick={() => {
              console.log("добавлено в избранное");
            }}
          >
            <Image
              className="w-[24px] h-[24px]"
              src="star.svg"
              alt="в избранное"
              width="24"
              height="24"
            ></Image>
          </button>
          <button
            className="w-[30px] h-[30px]"
            onClick={() => {
              swipe(cards.length - 1 - gone.size, 1),
                setLike(true),
                setDirection("right");
              setTimeout(() => setLike(false), 200);
            }}
          >
            <Image
              className="w-[30px] h-[30px]"
              src="heart.svg"
              alt="лайк"
              width="24"
              height="24"
            ></Image>
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              className="w-[24px] h-[24px]"
              src="exclamation.svg"
              alt="перезагрузка"
              width="24"
              height="24"
            ></Image>
          </button>
        </div>
      </div>
    </div>
  );
}
