import Mission from "./Mission";

import { use } from "react";

export const metadata = {
    title: "Mission Details",
    description: "Details of a specific Mission",
};

export default function MissionPage({ params }) {
    const { id } = use(params);
    console.log("Mission params:", use(params));
    console.log("Mission id:", id);

    return <Mission id={id} />;
}
