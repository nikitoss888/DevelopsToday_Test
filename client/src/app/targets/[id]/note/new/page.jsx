import NewNote from "./NewNote";
import { use } from "react";

export const metadata = {
    title: "Create New Note",
    description: "Create a new Note for the Target",
};

export default function CreateNotePage({ params }) {
    const { id } = use(params);

    return <NewNote targetId={id} />;
}