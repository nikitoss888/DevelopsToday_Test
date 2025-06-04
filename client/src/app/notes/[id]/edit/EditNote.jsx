"use client";

import { getNote, putNote } from "@/api/note";
import NoteForm from "@/components/NoteForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditNote({ id }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const data = await getNote(id);

                    console.log("Fetched Note:", data);
                    if (data.target.is_complete || data.mission.is_complete) {
                        alert("This Note belongs to a completed Target or Mission. Editing is not allowed.");
                        router.push(`/targets/${data.target.id}`);
                        return;
                    }

                    setContent(data.content);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    alert("Failed to fetch Note: " + (error.content?.detail || "Unknown error"));
                }
                finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            id,
            content
        });

        const putData = async () => {
            try {
                const res = await putNote(id, {
                    content
                });

                console.log("Note updated:", res);
                alert("Note updated successfully! ID: " + res.id);
                router.push(`/targets/${res.target_id}`);
            } catch (error) {
                console.error("Error updating Note:", error);
                alert("Failed to update Note: " + (error.content?.detail || "Unknown error"));
            }
        }

        putData();
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Edit Note
            </h1>
            <NoteForm onSubmit={onSubmit} setContent={setContent} initialData={content} />
        </div>
    )
}