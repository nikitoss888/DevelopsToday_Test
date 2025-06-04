import EditMission from "./EditMission";
import { use } from "react";

export const metadata = {
    title: "Edit Spy Mission",
    description: "Edit an existing Spy Mission",
};

export default function EditMissionPage({ params }) {
    const { id } = use(params);

    return <EditMission id={id} />;
}