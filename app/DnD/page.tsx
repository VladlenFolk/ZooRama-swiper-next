import Link from "next/link";
import { Title } from "@/components/Title/Title";
import { DragAndDrop } from "@/components/DragAndDropCards/DragAndDrop/DragAndDrop";

export default function DnD() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center ">
       <nav>
        <Link
          href={"/"}
          className={`absolute bg-[url('/home.png')] cursor-pointer bg-cover 
          top-[5px] left-[5px] lg:top-[20px] lg:left-[20px] lg:p-8 h-[50px] w-[50px]
          z-10`}
        ></Link>
      </nav>
      <Title />
      <DragAndDrop />
    </div>
  );
}
