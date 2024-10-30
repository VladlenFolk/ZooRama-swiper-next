import { Status } from "@/utils/interfaces";

interface Props {
    status: Status;
}

export const ContainerCards = ({status}: Props) => {
    return (
        <div>
            <p>{status}</p>
            {/* <Cards></Cards> */}
        </div>
    )
}