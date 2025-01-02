import DraggableFreeCard from "@/components/DraggableFreeCard/DraggableFreeCard";


const CustomFreeDragElement: React.FC = () => {
  return (
    <div className="h-screen w-screen  bg-[url('/i.webp')]  bg-cover flex items-center bg-no-repeat justify-center overflow-hidden">
      <DraggableFreeCard />
    </div>
  );
};

export default CustomFreeDragElement;
