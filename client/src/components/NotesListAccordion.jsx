"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { deleteNote } from "@/api/note";


export default function NotesListAccordion({
    notes, onDelete, onEdit, missionStatus, targetStatus
}) {
    const canEdit = !missionStatus && !targetStatus;

    return (
        <Accordion variant="bordered" selectionMode="multiple" collapsible
            className="w-full max-w-3xl border border-gray-300 rounded-lg p-4">
            {notes.map((note, index) => (
                <AccordionItem key={note.id} title={`Note #${index + 1}`} className="my-2" aria-label={`Note ${note.id}`}>
                    <p className="mb-2">
                        {note.content}
                    </p>
                    <div className="flex items-start justify-start gap-2 mb-2">
                        <button onClick={() => onEdit(note.id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors
                                disabled:bg-gray-800 disabled:cursor-not-allowed"
                            aria-label={`Edit Note ${note.id}`}
                            disabled={!canEdit}
                            title={!canEdit ? "Editing is disabled for completed targets or missions" : ""}
                        >
                            Edit
                        </button>
                        <button onClick={() => onDelete(note.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                            aria-label={`Delete Note ${note.id}`}>
                            Delete
                        </button>
                    </div>
                </AccordionItem>
            ))}
        </Accordion>
    );
}