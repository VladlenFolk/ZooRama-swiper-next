import SwiperCards from "@/components/swiper-cards/SwiperCards";
import CustomDraggables from "./HandleCardsDragging/page";
import CustomFreeDragElement from "./HandleFreeDrag/page";

export default function App() {
  return (
    <div className="w-full h-2/6">
      <CustomFreeDragElement />
    </div>
  );
}
