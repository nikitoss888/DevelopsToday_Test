import EditTarget from "./EditTarget";
import { use } from "react";

export const metadata = {
    title: "Edit Target",
    description: "Edit an existing Target",
};

export default function EditTargetPage({ params }) {
    const { id } = use(params);

    return <EditTarget id={id} />;
}