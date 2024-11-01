import { Status } from "@/utils/interfaces";

interface Props {
  status: Status;
}

export const ContainerCards = ({ status }: Props) => {
  return (
    <div className="border-2 border-solid border-[#ffffff8c] rounded-[5px] transition-all delay-300 ease-linear ">
      <p className="rounded-[5px] bg-black text-center py-4 font-bold capitalize">{status}</p>
      {/* <Cards></Cards> */}
    </div>
  );
};
