import { Title } from "@/components/Title/Title";
import { DragAndDrop } from "@/components/DragAndDropCards/DragAndDrop/DragAndDrop";

export default function DnD() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center ">
      <Title />
      <DragAndDrop />
    </div>
  );
}
