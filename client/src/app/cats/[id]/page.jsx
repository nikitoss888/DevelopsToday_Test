import Cat from "./Cat";

import { use } from "react";

export const metadata = {
    title: "Spy Cat Details",
    description: "Details of a specific Spy Cat Agent",
};

export default function CatPage({ params }) {
    const { id } = use(params);
    console.log("CatPage params:", use(params));
    console.log("CatPage id:", id);

    return <Cat id={id} />;
}
