import { Data } from "@/utils/interfaces";

interface Props {
    data: Data
}

export const CardItem = ({data, handleDragging}: Props) => {
    return (
        <div className="mx-4 mt-4 bg-[#6a5acd] rounded-[5px] p-4 cursor-pointer animate-[fadeIn]">
            <p className="font-bold text-[1.5rem]">{data.content}</p>
        </div>
    )
}