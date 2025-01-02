import Link from "next/link";

const Home: React.FC = () => {
  return (
    <nav className="flex gap-[40px] flex-col items-center justify-center w-full h-full">
      <Link
        href={"/HandleFreeDrag"}
        className={`nav-link flex
                  text-[#3bb8fc] border-[#3bb8fc] [text-shadow:0_0_10px_#3bb8fc] shadow-[0_0_10px_#3bb8fc] 
                    lg:hover:shadow-[0_0_20px_#3bb8fc,0_0_40px_#3bb8fc]
                    active:shadow-[0_0_20px_#3bb8fc,0_0_40px_#3bb8fc]
                    `}
      >
        Свободное перемещение
      </Link>
      <Link
        href={"/HandleCardsDragging"}
        className={`nav-link flex
                 text-[#00CC00] border-[#00CC00] [text-shadow:0_0_10px_#00CC00] shadow-[0_0_10px_#00CC00] 
                   lg:hover:shadow-[0_0_20px_#00CC00,0_0_40px_#00CC00]
                   active:shadow-[0_0_20px_#00CC00,0_0_40px_#00CC00]
                    `}
      >
        Свайпер карточек
      </Link>
      <Link
        href={"/DnD"}
        className={`nav-link 
                 text-[#FFFF00] border-[#FFFF00] [text-shadow:0_0_10px_#FFFF00] shadow-[0_0_10px_#FFFF00] 
                   lg:hover:shadow-[0_0_20px_#FFFF00,0_0_40px_#FFFF00]
                   active:shadow-[0_0_20px_#FFFF00,0_0_40px_#FFFF00]
                   hidden lg:flex
                    `}
      >
        Drag-and-Drop
      </Link>
    </nav>
  );
};

export default Home;
