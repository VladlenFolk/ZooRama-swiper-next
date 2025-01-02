import DraggableFreeCard from "@/components/DraggableFreeCard/DraggableFreeCard";


const CustomFreeDragElement: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[url('/i.webp')]  bg-cover bg-center flex items-center justify-center">
      <DraggableFreeCard />
    </div>
  );
};

export default CustomFreeDragElement;
