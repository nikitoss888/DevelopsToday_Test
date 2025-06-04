"use client";
import { getMissionList } from "@/api/mission";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import MissionsListAccordion from "@/components/MissionsListAccordion";

export default function Missions() {
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    
    const searchParams = useSearchParams();
    console.log("Search Params:", searchParams.toString());
    const pageParam = searchParams.get("page") ? parseInt(searchParams.get("page"), 10) : 1;
    const limitParam = searchParams.get("limit") ? parseInt(searchParams.get("limit"), 10) : 5;

    const [missions, setMissions] = useState([]);
    const [page, setPage] = useState(pageParam);
    const [maxPage, setMaxPage] = useState(1);
    const [limit, setLimit] = useState(limitParam);

    useEffect(() => {
        const fetchMissions = async () => {
            setLoading(true);

            try {
                const res = await getMissionList((page - 1) * limit, limit);
                setMissions(res["missions"]);
                setMaxPage(Math.ceil(res["all_count"] / limit));
                console.log("Fetched missions:", res);
            } catch (error) {
                console.error("Error fetching missions:", error);
                alert("Failed to fetch missions: " + (error.content?.detail || "Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();
    }, [page, limit]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    const onLimitChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        router.push(`/missions?page=1&limit=${newLimit}`, { scroll: false, shallow: true });
        setPage(1);
        setLimit(newLimit);
    };

    const onPageChange = (newPage) => {
        if (newPage < 1) newPage = 1;
        if (newPage > maxPage) newPage = maxPage;
        setPage(newPage);


        router.push(`/missions?page=${newPage}&limit=${limit}`, { scroll: false, shallow: true });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        router.push(`/missions?page=1&limit=${limit}`, { scroll: true, shallow: true });
        setPage(1);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Spy Cat Agency
            </h1>
            <a className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                href="/missions/new"
            >
                Add a new Mission
            </a>
            <div>
                <form className="flex gap-4 mb-4 items-center" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="limit" className="text-lg font-semibold">
                        Limit:
                    </label>
                    <select className="px-4 py-2 border rounded text-black bg-white"
                        value={limit}
                        onChange={onLimitChange}
                        name="limit"
                    >
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        Search
                    </button>
                </form>

            </div>
            { missions.length === 0 ? (
                <p className="text-lg font-semibold">No missions found.</p>
            ) : (
                <p className="text-lg font-semibold">List of Missions:</p>
            )}
            <Pagination
                currentPage={page}
                totalPages={maxPage}
                onPageChange={onPageChange}
            />
            <MissionsListAccordion missions={missions} />
            <Pagination
                currentPage={page}
                totalPages={maxPage}
                onPageChange={onPageChange}
            />
        </div>
    );
}