"use client";

import { postMission } from "@/api/mission";
import { getSpycatList } from "@/api/spycat";
import MissionForm from "@/components/MissionForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewMission() {
    const [catId, setCatId] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [targets, setTargets] = useState([]);

    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {

            try {
                const res = await getSpycatList(-1, -1);
                setCats(res["spycats"]);
            } catch (error) {
                console.error("Error fetching cats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, []);

    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            cat_id: catId,
            is_complete: isComplete,
            targets
        });

        const postData = async () => {
            try {
                const res = await postMission({
                    cat_id: catId,
                    is_complete: isComplete,
                    targets
                });

                console.log("Mission created:", res);
                alert("Mission created successfully! ID: " + res.id);
                router.push(`/missions/${res.id}`);
            } catch (error) {
                console.error("Error creating Mission:", error);
                alert("Failed to create Mission: " + (error.content?.detail || "Unknown error"));
            }
        }

        postData();
    }

    if (loading) return <div>Loading...</div>;
    if (!cats || cats.length === 0) {
        return <div>No Spy Cats available. Please create a Spy Cat first.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Create New Mission
            </h1>
            <MissionForm onSubmit={onSubmit} setCatId={setCatId} action="create"
                initialData={{ catId, isComplete, targets }}
                setIsComplete={setIsComplete} setTargets={setTargets} cats={cats} />
        </div>
    )
}