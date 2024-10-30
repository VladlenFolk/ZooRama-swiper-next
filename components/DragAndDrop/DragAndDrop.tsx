import { Status } from "@/utils/interfaces";
import { ContainerCards } from "../ContainerCards/ContainerCards";

const typesHero: Status[] = ["good", "normal", "bad"];

export const DragAndDrop = () => {
  return (
    <div>
      {typesHero.map((container) => (
        <ContainerCards status={container} key={container} />
      ))}
    </div>
  );
};
