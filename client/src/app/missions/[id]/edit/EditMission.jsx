"use client";

import { getMission, putMission } from "@/api/mission";
import { getSpycatList } from "@/api/spycat";
import MissionForm from "@/components/MissionForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditMission({ id }) {
    const [catId, setCatId] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getSpycatList(-1, -1);
                setCats(res["spycats"]);
                
                const data = await getMission(id);
                
                setCatId(data.cat_id);
                setIsComplete(data.is_complete);

                console.log("Fetch:", data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            cat_id: catId,
            is_complete: isComplete
        });

        const postData = async () => {
            try {
                const res = await putMission(id, {
                    cat_id: catId,
                    is_complete: isComplete
                });

                console.log("Mission updated:", res);
                alert("Mission updated successfully! ID: " + res.id);
                router.push(`/missions/${res.id}`);
            } catch (error) {
                console.error("Error updating Mission:", error);
                alert("Failed to update Mission: " + (error.content?.detail || "Unknown error"));
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
                Edit Mission
            </h1>
            <MissionForm onSubmit={onSubmit} setCatId={setCatId} action="edit"
                initialData={{ catId, isComplete }}
                setIsComplete={setIsComplete} cats={cats} />
        </div>
    )
}