"use client";

import { getTarget, putTarget } from "@/api/target";
import TargetForm from "@/components/TargetForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditTarget({ id }) {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getTarget(id);
                setName(data.name);
                setCountry(data.country);
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
            name,
            country,
            is_complete: isComplete,
        });

        const putData = async () => {
            try {
                const res = await putTarget(id, {
                    name,
                    country,
                    is_complete: isComplete
                });

                console.log("Target updated:", res);
                alert("Target updated successfully! ID: " + res.id);
                router.push(`/targets/${res.id}`);
            } catch (error) {
                console.error("Error updating Target:", error);
                alert("Failed to update Target: " + (error.content?.detail || "Unknown error"));
            }
        }

        putData();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Edit Target
            </h1>
            <TargetForm onSubmit={onSubmit} setName={setName} setCountry={setCountry}
                setIsComplete={setIsComplete}
                initialData={{ name, country, isComplete }} action="edit" />
        </div>
    )
}