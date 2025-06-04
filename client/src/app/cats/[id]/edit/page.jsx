import EditCat from "./EditCat";
import { use } from "react";

export const metadata = {
    title: "Edit Spy Cat Agent",
    description: "Edit an existing Spy Cat Agent",
};

export default function EditCatPage({ params }) {
    const { id } = use(params);

    return <EditCat id={id} />;
}