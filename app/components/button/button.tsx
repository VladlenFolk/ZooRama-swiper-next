
export default function Button({
  canSwipe,
  text,
  swipe,
}: {
  canSwipe: boolean;
  text: string;
  swipe: () => void;
}) {
  return (
    <button
      style={{
        backgroundColor: !canSwipe ? "#c3c4d3" : undefined,
      }}
      className="shrink-0 p-2.5 rounded-[5px] border-0 text-white  bg-button-color m-[10px] text-[18px] w-[180px] font-bold transform  transition duration-200 hover:scale-105"
      onClick={swipe}
    >
      {text}
    </button>
  );
}
