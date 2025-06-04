"use client";
import { useEffect, useState } from "react";
import { getTarget, deleteTarget } from "@/api/target";
import { deleteNote } from "@/api/note";
import { useRouter } from "next/navigation";
import NotesListAccordion from "@/components/NotesListAccordion";

export default function Target({ id }) {
    const [target, setTarget] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTarget = async () => {
            setLoading(true);
            try {
                const data = await getTarget(id);
                setTarget(data);
                console.log("Fetch:", data);
            } catch (error) {
                console.error("Error fetching target:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTarget();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!target) {
        return <div>Target not found</div>;
    }

    const onDelete = () => {
        const confirmDelete = confirm("Are you sure you want to delete this target?");
        if (!confirmDelete) return;

        const deleteFunc = async (id) => {
            let res;
            try {
                res = await deleteTarget(id);
                console.log("Target deleted successfully!");
                alert("Target deleted successfully!");
                router.push("/missions/" + target.mission.id);
            } catch (error) {
                console.error("Error deleting target:", error);
                alert("Failed to delete target: " + (error.content?.detail || "Unknown error"));
            }
        };
        deleteFunc(id);
    }


    const onNoteCreate = () => {
        if (target.is_complete || target.mission.is_complete) {
            alert("This Note belongs to a completed Target or Mission. Creating a new Note is not allowed.");
            return;
        }
        router.push(`/targets/${id}/note/new`);
    }

    const onNoteEdit = (noteId) => {
        if (target.is_complete || target.mission.is_complete) {
            alert("This Note belongs to a completed Target or Mission. Editing is not allowed.");
            return;
        }
        router.push(`/notes/${noteId}/edit`);
    }

    const onNoteDelete = (noteId) => {
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;

        const deleteFunc = async (id) => {
            setLoading(true);
            try {
                await deleteNote(id);
                alert("Note deleted successfully!");

                const data = await getTarget(id);
                setTarget(data);
                console.log("Fetch:", data);

                alert("If you are not redirected, please refresh the page.");
                router.push(`/targets/${target.id}`, { scroll: false, shallow: false });
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Failed to delete note: " + (error.content?.detail || "Unknown error"));
            } finally {
                setLoading(false);
            }
        };
        deleteFunc(noteId);
    }

    
    return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 gap-8 sm:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Spy Cat Agency
            </h1>
            <h2 className="text-xl text-center sm:text-left font-[var(--font-geist-mono)]">
                Details for target #{id}
            </h2>
            <div className="flex flex-row gap-4">
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => router.push(`/targets/${id}/edit`)}
                >
                    Edit Target
                </button>
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={onDelete}
                >
                    Delete Target
                </button>
            </div>
            <ul className="list-none">
                <li>
                    <span className="text-lg font-semibold">Mission: </span>
                    <a className="underline" href={`/missions/${target.mission.id}`}>Mission #{target.mission.id}</a>
                </li>
                <li>
                    <span className="text-lg font-semibold">Status: </span>
                    <span className={`${target.is_complete ? "text-green-500" : "text-red-500"}`}>{target.is_complete ? "Completed" : "In Progress"}</span>
                </li>
            </ul>
            <h2 className="text-xl font-semibold">Notes:</h2>
            <button
                className="text-md text-center sm:text-left font-[var(--font-geist-mono)] disabled:bg-gray-800
                    bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:cursor-not-allowed"
                onClick={onNoteCreate} disabled={target.is_complete || target.mission.is_complete}
                aria-label="Create New Note"
            >
                Create New Note
            </button>
            {target.notes?.length > 0 ? (
                <NotesListAccordion
                    notes={target.notes} onEdit={onNoteEdit} onDelete={onNoteDelete}
                    missionStatus={target.mission.is_complete} targetStatus={target.is_complete}
                />
            ) : (
                <p className="text-md">No notes available for this target.</p>
            )}
        </div>
    );
}