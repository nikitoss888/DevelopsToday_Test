"use client";

import { postNote } from "@/api/note";
import NoteForm from "@/components/NoteForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNote({ targetId }) {
    const [content, setContent] = useState("");

    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            target_id: targetId,
            content
        });

        const postData = async () => {
            try {
                const res = await postNote(targetId, {
                    content
                });

                console.log("Note created:", res);
                alert("Note created successfully! ID: " + res.id);
                router.push(`/targets/${targetId}`);
            } catch (error) {
                console.error("Error creating Note:", error);
                alert("Failed to create Note: " + (error.content?.detail || "Unknown error"));
            }
        }

        postData();
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Create New Note
            </h1>
            <NoteForm onSubmit={onSubmit} setContent={setContent} initialData={content} />
        </div>
    )
}