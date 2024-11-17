import { Data, Status } from "@/utils/interfaces";
import { CardItem } from "../CardItem/CardItem";
import { data } from "@/utils/data";

interface Props {
  items: Data[];
  status: Status;
  isDragging: boolean;
  handleDragging: (dragging: boolean) => void;
  handleUpdateList: (id: number, status: Status) => void;
}

export const ContainerCards = ({
  items = [],
  status,
  isDragging,
  handleDragging,
  handleUpdateList,
}: Props) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUpdateList(+e.dataTransfer.getData("text"), status);
    handleDragging(false);
  };
  return (
    <div
      className={`border-2 border-solid border-[#ffffff8c] rounded-[5px] transition-all delay-300 ease-linear ${
        isDragging
          ? "bg-[#ffffff17] border-[2px] border-dashed border-[#ffffff8c]"
          : ""
      } `}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="rounded-[5px] bg-black text-center py-4 font-bold capitalize">
        {status} hero
      </p>
      {items.map(
        (item) =>
          status === item.status && (
            <CardItem
              data={item}
              key={item.id}
              handleDragging={handleDragging}
            />
          )
      )}
    </div>
  );
};
