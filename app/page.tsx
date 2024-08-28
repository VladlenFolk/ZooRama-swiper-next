"use client";
import { useState, useEffect } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const cards = [
  "https://avatars.mds.yandex.net/get-entity_search/135316/777333296/S122x122Smart_2x",
  "https://avatars.mds.yandex.net/get-entity_search/2360676/844472719/S122x122_2x",
  "https://avatars.mds.yandex.net/get-entity_search/1922058/849472009/S122x122Smart_2x",
  "https://avatars.mds.yandex.net/get-entity_search/7689070/784457321/S122x122Smart_2x",
];

const to = (i: number) => ({
  x: 0,
  y: 0,
  rot: 0,
  scale: 1,
  delay: i * 100,
});
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1, y: 0 });
const trans = (r: number, s: number) => `scale(${s}) rotate(${r * 10}deg)`;

function Deck() {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const [gone] = useState(new Set<number>());
  const [reset, setReset] = useState(true);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [direction, setDirection] = useState("Направление");
  const [count, setCount] = useState(0)
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx, my],
      direction: [xDir],
      velocity: [vx],
    }) => {
      if (gone.has(index)) return;
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
        if(isGone){
          setCount((prev)=>prev+1)
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
    <div className="container">
      <div className="cards">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div className="deck" key={i} style={{ x, y }}>
            <animated.div
              {...bind(i)}
              className="card"
              style={{
                transform: interpolate([rot, scale], trans),
                x,
                y,
                backgroundImage: `url(${cards[i]})`,
              }}
            >
              {reset && i === cards.length - 1 - gone.size && (
                <>
                  <animated.div
                    className={`label nope `}
                    style={{
                      opacity: interpolate([x], (x) =>
                        x < -windowWidth / 10 ? 1 : 0
                      ),
                    }}
                  >
                    NOPE
                  </animated.div>
                  <animated.div
                    className="label like"
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
                  className={`label nope ${dislike ? "opacity" : ""} `}
                >
                  NOPE
                </animated.div>
                <animated.div className={`label like ${like ? "opacity" : ""}`}>
                  LIKE
                </animated.div>
              </>
            </animated.div>
          </animated.div>
        ))}
        <div className="buttons">
          <button
            onClick={() => {
              swipe(cards.length - 1 - gone.size, -1),
                setDislike(true),
                setDirection('left')
                setTimeout(() => setDislike(false), 200);
            }}
          >
            Дизлайк
          </button>
          <button
            onClick={() => {
              swipe(cards.length - 1 - gone.size, 1),
                setLike(true),
                setDirection('right');
                setTimeout(() => setLike(false), 200);
            }}
          >
            Лайк
          </button>
          <button onClick={doReset}>Заново</button>
        </div>
      </div>
      <h1>{direction}</h1>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <Deck />
    </div>
  );
}
