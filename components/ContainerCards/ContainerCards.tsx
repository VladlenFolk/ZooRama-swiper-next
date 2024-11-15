import { Data, Status } from "@/utils/interfaces";
import { CardItem } from "../CardItem/CardItem";
import { data } from "@/utils/data";

interface Props {
  items: Data[];
  status: Status;
  isDragging: boolean;
  handleDragging: (dragging: boolean) => void;
}

export const ContainerCards = ({
  items = [],
  status,
  isDragging,
  handleDragging,
}: Props) => {
  return (
    <div
      className={`border-2 border-solid border-[#ffffff8c] rounded-[5px] transition-all delay-300 ease-linear ${
        isDragging
          ? "bg-[#ffffff17] border-[2px] border-dashed border-[#ffffff8c]"
          : ""
      } `}
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
