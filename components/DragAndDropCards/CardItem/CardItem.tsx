import { Data } from "@/utils/interfaces";

interface Props {
  data: Data;
  handleDragging: (dragging: boolean) => void;
}

export const CardItem = ({ data, handleDragging }: Props) => {
  const handleDragEnd = () => handleDragging(false);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) =>{
    e.dataTransfer.setData('text', `${data.id}`)
    handleDragging(true)
  }
  return (
    <div
      className="mx-4 mt-4 bg-[#6a5acd] rounded-[5px] p-4 cursor-pointer animate-[fadeIn]"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <p className="font-bold text-[1.5rem]">{data.content}</p>
    </div>
  );
};
