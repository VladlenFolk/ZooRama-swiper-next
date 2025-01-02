import Link from "next/link";
import DraggableFreeCard from "@/components/DraggableFreeCard/DraggableFreeCard";


const CustomFreeDragElement: React.FC = () => {
  return (
    <div className="h-screen w-screen  bg-[url('/i.webp')]  bg-cover flex items-center bg-no-repeat justify-center overflow-hidden">
      <nav>
        <Link
          href={"/"}
          aria-label="Go to Home"
          className={`absolute bg-[url('/home.png')] cursor-pointer bg-cover 
          top-[5px] left-[5px] lg:top-[20px] lg:left-[20px] lg:p-8 h-[50px] w-[50px]
          z-10`}
        ></Link>
      </nav>
      <DraggableFreeCard />
    </div>
  );
};

export default CustomFreeDragElement;
