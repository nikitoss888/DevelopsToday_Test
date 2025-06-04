"use client";
import { useEffect, useState } from "react";
import { getSpycat, deleteSpycat } from "@/api/spycat";
import { useRouter } from "next/navigation";

export default function Cat({ id }) {
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCat = async () => {
            setLoading(true);
            try {
                const data = await getSpycat(id);
                setCat(data);
                console.log("Fetch:", data);
            } catch (error) {
                console.error(error);
                alert(error.content?.detail || "Failed to fetch Spy Cat agent details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [id]);

    const onDelete = () => {
        const confirmDelete = confirm("Are you sure you want to delete this Spy Cat agent?");
        if (!confirmDelete) return;

        const deleteFunc = async (id) => {
            try {
                await deleteSpycat(id);
                console.log("Spy Cat agent deleted successfully!");
                alert("Spy Cat agent deleted successfully!");
                router.push("/cats");
            } catch (error) {
                console.error("Error deleting cat:", error);
                alert("Failed to delete Spy Cat agent: " + (error.content?.detail || "Unknown error"));
            }
        }
        deleteFunc(id);
    };

    if (loading) return <div>Loading...</div>;

    if (!cat) return <div>No cat found with ID: {id}</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 gap-8 sm:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Spy Cat Agency
            </h1>
            <h2 className="text-xl text-center sm:text-left font-[var(--font-geist-mono)]">
                Details for cat agent #{id}
            </h2>
            <div className="flex flex-row gap-4">
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => router.push(`/cats/${id}/edit`)}
                >
                    Edit Spy Cat Agent
                </button>
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={onDelete}
                >
                    Delete Spy Cat Agent
                </button>
            </div>
            <ul className="list-none">
                <li><span className="text-lg font-semibold">Name: </span>{cat.name}</li>
                <li><span className="text-lg font-semibold">Years of Experience: </span>{cat.years_of_experience}</li>
                <li><span className="text-lg font-semibold">Breed: </span>{cat.breed}</li>
                <li><span className="text-lg font-semibold">Salary: </span>${cat.salary}</li>
            </ul>
            <h2 className="text-xl font-semibold">Missions:</h2>
            {cat.missions?.length > 0 ? (
                <ol className="list-decimal pl-6">
                    {cat.missions.map((mission, index) => (
                        <li key={index} className="text-md font-[var(--font-geist-mono)]">
                            <a href={`/missions/${mission.id}`} className="font-semibold">Mission #{index + 1} (ID: {mission.id})</a> {mission.description}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-md">No missions assigned to this cat agent.</p>
            )}
        </div>
    )
}