import NewTarget from "./NewTarget";
import { use } from "react";

export const metadata = {
    title: "Create New Target",
    description: "Create a new Target for the Mission",
};

export default function NewTargetPage({ params }) {
    const { id } = use(params);
    console.log("ID of the Mission of new target:", id);
    return <NewTarget missionId={id} />;
}