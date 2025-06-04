"use client";
import { useEffect, useState } from "react";
import { getMission, deleteMission } from "@/api/mission";
import { useRouter } from "next/navigation";
import TargetsListAccordion from "@/components/TargetsListAccordion";

export default function Mission({ id }) {
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMission = async () => {
            setLoading(true);
            try {
                const data = await getMission(id);
                setMission(data);
                console.log("Fetch:", data);
            } catch (error) {
                console.error("Error fetching mission:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!mission) {
        return <div>Mission not found</div>;
    }

    const onDelete = () => {
        const confirmDelete = confirm("Are you sure you want to delete this mission?");
        if (!confirmDelete) return;

        const deleteFunc = async (id) => {
            let res;
            try {
                res = await deleteMission(id);
                console.log("Mission deleted successfully!");
                alert("Mission deleted successfully!");
                router.push("/missions");
            } catch (error) {
                console.error("Error deleting mission:", error);
                alert("Failed to delete mission: " + (error.content?.detail || "Unknown error"));
            }
        };
        deleteFunc(id);
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 gap-8 sm:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Spy Cat Agency
            </h1>
            <h2 className="text-xl text-center sm:text-left font-[var(--font-geist-mono)]">
                Details for mission #{id}
            </h2>
            <div className="flex flex-row gap-4">
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => router.push(`/missions/${id}/edit`)}
                >
                    Edit Mission
                </button>
                <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={onDelete}
                >
                    Delete Mission
                </button>
            </div>
            <ul className="list-none">
                {mission.cat ? (
                    <li>
                        <span className="text-lg font-semibold">Assigned to: </span>
                        <a className="underline" href={`/cats/${mission.cat.id}`}>{mission.cat.name}</a>
                    </li>
                ) : (
                    <li>
                        <span className="text-lg font-semibold">Assigned to: </span>
                        <span className="text-red-500">No cat assigned</span>
                    </li>
                )}
                <li>
                    <span className="text-lg font-semibold">Status: </span>
                    <span className={`${mission.is_complete ? "text-green-500" : "text-red-500"}`}>{mission.is_complete ? "Completed" : "In Progress"}</span>
                </li>
            </ul>
            <h2 className="text-xl font-semibold">Targets:</h2>
            <button className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                onClick={() => router.push(`/missions/${id}/target/new`)}
            >
                Create Target
            </button>
            {mission.targets?.length > 0 ? (
                <TargetsListAccordion targets={mission.targets} />
            ) : (
                <p className="text-md">No targets assigned to this mission.</p>
            )}
        </div>
    );
}