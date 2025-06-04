import EditNote from "./EditNote";
import { use } from "react";

export const metadata = {
    title: "Edit Note",
    description: "Edit an existing Note",
};

export default function EditNotePage({ params }) {
    const { id } = use(params);

    return <EditNote id={id} />;
}