import Target from "./Target";

import { use } from "react";

export const metadata = {
    title: "Target Details",
    description: "Details of a specific Target",
};

export default function TargetPage({ params }) {
    const { id } = use(params);
    console.log("Target params:", use(params));
    console.log("Target id:", id);

    return <Target id={id} />;
}
