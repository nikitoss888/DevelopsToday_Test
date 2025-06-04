"use client";

import { postTarget } from "@/api/target";
import TargetForm from "@/components/TargetForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewTarget({ missionId }) {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [notes, setNotes] = useState([]);

    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            mission_id: missionId,
            name,
            country,
            is_complete: isComplete,
            notes: notes.map(note => ({ content: note }))
        });

        const postData = async () => {
            try {
                const res = await postTarget(missionId, {
                    name,
                    country,
                    is_complete: isComplete,
                    notes: notes.map(note => ({ content: note }))
                });

                console.log("Target created:", res);
                alert("Target created successfully! ID: " + res.id);
                router.push(`/targets/${res.id}`);
            } catch (error) {
                console.error("Error creating Target:", error);
                alert("Failed to create Target: " + (error.content?.detail || "Unknown error"));
            }
        }

        postData();
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Create New Target
            </h1>
            <TargetForm onSubmit={onSubmit} setName={setName} setCountry={setCountry}
                setIsComplete={setIsComplete} setNotes={setNotes}
                initialData={{ name, country, isComplete, notes }} action="create" />
        </div>
    )
}