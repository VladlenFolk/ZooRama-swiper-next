"use client";

import { useEffect, useState, useRef } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Overlay from "./Overlay";

type Img = {
  id: number;
  img: string;
};

type Card = {
  id: number;
  imgs: Img[];
  name: string;
  age: string;
  description: string;
  owner: string;
  aboutOwner: string;
  ownerDescription: string;
};

/* по идее должен быть массив с такими объектами, которые будут свайпаться, 
сейчас происходит листание и свайпы одного животного */
const card: Card = {
  id: 1,
  imgs: [
    {
      id: 1,
      img: "https://avatars.mds.yandex.net/get-altay/1880508/2a0000016e256861de17b2bc4fbf2ce81b1a/XXL",
    },
    {
      id: 2,
      img: "https://i.pinimg.com/736x/61/b7/72/61b772864029519c45dcbdf78680cdbf.jpg",
    },
    {
      id: 3,
      img: "https://avatars.mds.yandex.net/get-entity_search/5513561/952894097/S600xU_2x",
    },
    {
      id: 4,
      img: "https://avatars.mds.yandex.net/get-entity_search/2069560/952076372/S600xU_2x",
    },
  ],
  name: "Котик",
  age: "45 лет",
  description: "Грызу тапки, мешаю спать",
  owner: "Марина",
  aboutOwner: "Заводчик",
  ownerDescription:
    "Мой кот Барсик - настоящая гордость моего питомника. Он обладатель нескольких титулов и чемпионатов, и я всегда стремлюсь обеспечить ему лучший уход. Благодаря приложению, я могу легко найти нужного ветеринара или грумера для Барсика. Удобный интерфейс и возможность быстро записаться на прием делают жизнь проще, а мой кот всегда получает самое лучшее!",
};

export default function SwiperCards() {
  const [windowWidth, setWindowWidth] = useState(1024);

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // временная проверка регистрации

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const debouncedHandleResize = useDebounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [debouncedHandleResize]);

  const [gone] = useState(new Set<number>());
  // с помощью данного состояния показываю/скрываю плашки лайк/дизлайк (если не произошло необходимого тригера, то не показывать)
  const [reset, setReset] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  // нужо чисто для перерисовки при определенных действиях
  const [count, setCount] = useState(0);
  // проверка для next произошел ли mount компонента
  const [isMounted, setIsMounted] = useState(false);
  const [isAccordeonOpen, setIsAccordeonOpen] = useState(false);
  const [choosen, setChoosen] = useState(false);
  const [animateOverlay, setAimateOverlay] = useState(false);
  const itemRef = useRef<HTMLDivElement | null>(null);

  // настройки useSprings
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
  const [props, api] = useSprings(card.imgs.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setAimateOverlay(false);
      setTimeout(() => {
        setChoosen(false);
      }, 300);
    }
  };

  const handleOverlayOpen = () => {
    setChoosen(true);
    setTimeout(() => {
      setAimateOverlay(true);
    }, 200);
  };
  const handleOverlayClose = () => {
    setAimateOverlay(false);
    setTimeout(() => {
      setChoosen(false);
    }, 300);
  };

  // Функция для проверки авторизации
  function checkAuth() {
    const token = localStorage.getItem("authToken");
    if (token) setIsAuthenticated(true);
    else setIsAuthenticated(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // проверка для next
    setIsMounted(true);
    // запускаем анимацию при старте
    document.addEventListener("keydown", handleKeyDown);
    api.start((i) => ({
      ...to(i),
      config: { friction: 80, tension: 300 },
    }));
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // настройки при перетаскивании карточки
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx, my],
      direction: [xDir],
      velocity: [vx],
    }) => {
      if (gone.has(index)) return undefined;
      const flippedLeft = mx > windowWidth / 10;
      const flippedRight = mx < -windowWidth / 10;
      let flippedDir = 0;
      if (flippedLeft) flippedDir = 1;
      else if (flippedRight) flippedDir = -1;
      if (!active && (flippedLeft || flippedRight)) gone.add(index);
      setReset(true);
      return api.start((i) => {
        if (index !== i) return undefined;
        const isGone = gone.has(index);
        let x;
        if (isGone) x = (200 + windowWidth) * flippedDir;
        else if (active) x = mx;
        else x = 0;
        const y = active ? my : 0;
        const rot = flippedDir ? mx / 100 + (isGone ? xDir * 2 * vx : 0) : 0;
        if (isGone) setCount((prev) => prev + 1);
        const scale = active ? 1.1 : 1;
        const config = { friction: 50, tension: 500 };
        if (active) config.tension = 800;
        else if (isGone) config.tension = 200;
        return {
          x,
          y,
          rot,
          scale,
          config,
        };
      });
    }
  );

  // функция свайпа при нажатии на кнопки
  const swipe = (index: number, direction: number) => {
    if (gone.has(index)) return undefined;
    gone.add(index);
    setReset(true);
    setTimeout(() => {
      api.start((i) => {
        if (index !== i) return undefined;
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
    return undefined;
  };

  // перебор крточек животного при клике
  const onTap = (index: number, direction: number) => {


    if (gone.has(index)) return undefined;
    setReset(false);
    gone.add(index);
    api.start((i) => {
      if (index !== i) return undefined;
      const x = (200 + windowWidth) * direction;
      const rot = direction * 10;
      return {
        x,
        rot,
        config: { friction: 380, tension: 480 },
      };
    });

    return undefined;
  };

  // функция возврата карточек
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

  const doSwipeLeft = () => {
    swipe(card.imgs.length - 1 - gone.size, -1);
    setDislike(true);
    setTimeout(() => setDislike(false), 200);
  };

  const doSwipeRight = () => {
    swipe(card.imgs.length - 1 - gone.size, 1);
    setLike(true);
    setTimeout(() => setLike(false), 200);
  };

  return (
    <div className="w-full h-2/6 overflow-hidden box-border relative flex flex-col items-center mt-5 mb-5">
      {/*  <h3 className="font-normal text-[29px] leading-[35.1px] mb-[20px] -ml-[60px] tracking-[1px]">
        Выбрать животное
      </h3> */}
      <Overlay
        visible={choosen}
        handleOverlayClose={handleOverlayClose}
        animateOverlay={animateOverlay}
      />
      <div className="w-[330px] h-[472px] flex justify-center items-center relative">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div
            className="deck absolute w-full h-full flex justify-center items-center"
            key={card.imgs[i].id}
            style={{ x, y }}
            onClick={() => gone.add(i)}
          >
            {isMounted && (
              <animated.div
                onPointerDown={bind(i).onPointerDown}
                onPointerMove={bind(i).onPointerMove}
                onPointerUp={bind(i).onPointerUp}
                onPointerCancel={bind(i).onPointerCancel}
                className="touch-none h-full w-full absolute max-w-[330px] rounded-[10px] shadow-card bg-no-repeat bg-center bg-cover"
                style={{
                  transform: interpolate([rot, scale], trans),
                  x,
                  y,
                  backgroundImage: `url(${card.imgs[i].img})`,
                }}
                onClick={() => onTap(i, -1)}
              >
                {reset && i === card.imgs.length - 1 - gone.size && (
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
            )}
          </animated.div>
        ))}

        <div className="absolute bottom-[25px] flex gap-[23px] justify-center items-center">
          <button className="w-[24px] h-[24px]" onClick={doReset}>
            <Image
              className="w-[24px] h-[24px]"
              src="refresh.svg"
              alt="перезагрузка"
              width="24"
              height="24"
              priority
            />
          </button>
          <button className="w-[31px] h-[31px]" onClick={doSwipeLeft}>
            <Image
              className="w-[30px] h-[30px]"
              src="nope.svg"
              alt="отклонить"
              width="24"
              height="24"
              priority
            />
          </button>
          <button className="w-[24px] h-[24px]" onClick={handleOverlayOpen}>
            <Image
              className="w-[24px] h-[24px]"
              src="star.svg"
              alt="в избранное"
              width="24"
              height="24"
              priority
            />
          </button>
          <button className="w-[30px] h-[30px]" onClick={doSwipeRight}>
            <Image
              className="w-[30px] h-[30px]"
              src="heart.svg"
              alt="лайк"
              width="24"
              height="24"
              priority
            />
          </button>
          <button
            className="w-[24px] h-[24px]"
            onClick={() => setIsAccordeonOpen(!isAccordeonOpen)}
          >
            <Image
              className="w-[24px] h-[24px]"
              src="exclamation.svg"
              alt="Дополнительная информация"
              width="24"
              height="24"
              priority
            />
          </button>
        </div>
        <div
          className={`flex flex-col gap-[4px]  border-solid border-1 border-white w-[231px] descr-gradient-grey-normal rounded-[5px] absolute p-[9px] box-border inter tracking-[0.5px] left-[25px] bottom-[105px] `}
        >
          <h4
            className={` relative font-semibold text-[18px] leading-[23.4px] `}
          >
            {card.name}, {card.age}
          </h4>
          <p className="text-[14px] leading-[18.2px]">{card.description}</p>
        </div>
      </div>
      <div
        className={` overflow-hidden transition-all ease-in delay-300 ${isAccordeonOpen ? "-mt-[10px]" : "0px"}`}
        style={{
          height: isAccordeonOpen
            ? `${itemRef.current?.scrollHeight}px`
            : "0px",
        }}
      >
        <div
          className="  w-[330px] p-[10px]  bg-[#e5dff9] box-border rounded-[5px] tracking-[0.3px]"
          ref={itemRef}
        >
          <h6 className="text-[12px] mt-[10px] mb-[15px]">{" О животном "}</h6>
          <div className="flex gap-[10px] mb-[10px]">
            <Image
              className="w-[53px] h-[53px] rounded-full"
              src="/noavatar.png"
              alt="аватар"
              width="53"
              height="53"
            />
            <div className="flex flex-col">
              <p className="text-[16px] leading-[22.4px] mt-[5px]">
                {card.owner}
              </p>
              <span className="text-[12px] text-[#8B77CD] leading-[16.8px] mt-[2px]">
                {card.aboutOwner}
              </span>
            </div>
          </div>
          <p className="text-[12px] mt-[1px] leading-[16.8px] tracking-[0.1px] max-w-[308px]">
            {card.ownerDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
