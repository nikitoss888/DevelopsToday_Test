"use client";
import { getSpycatList } from "@/api/spycat";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import CatsListAccordion from "@/components/CatsListAccordion";


export default function Cats() {
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    
    const searchParams = useSearchParams();
    console.log("Search Params:", searchParams.toString());
    const pageParam = searchParams.get("page") ? parseInt(searchParams.get("page"), 10) : 1;
    const limitParam = searchParams.get("limit") ? parseInt(searchParams.get("limit"), 10) : 10;

    const [cats, setCats] = useState([]);
    const [page, setPage] = useState(pageParam);
    const [maxPage, setMaxPage] = useState(1);
    const [limit, setLimit] = useState(limitParam);

    useEffect(() => {
        const fetchCats = async () => {
            setLoading(true);

            try {
                const res = await getSpycatList((page - 1) * limit, limit);
                setCats(res["spycats"]);
                setMaxPage(Math.ceil(res["all_count"] / limit));
            } catch (error) {
                console.error("Error fetching cats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, [page, limit]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const onLimitChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        router.push(`/cats?page=1&limit=${newLimit}`, { scroll: false, shallow: true });
        setPage(1);
        setLimit(newLimit);
    };

    const onPageChange = (newPage) => {
        if (newPage < 1) newPage = 1;
        if (newPage > maxPage) newPage = maxPage;
        setPage(newPage);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        router.push(`/cats?page=1&limit=${limit}`, { scroll: true, shallow: true });
        setPage(1);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Spy Cat Agency
            </h1>
            <a className="text-md text-center sm:text-left font-[var(--font-geist-mono)] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                href="/cats/new"
            >
                Add a new Spy Cat Agent
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
            { cats.length === 0 ? (
                <p className="text-lg font-semibold">No cats found.</p>
            ) : (
                <p className="text-lg font-semibold">List of Cat Agents:</p>
            )}
            <Pagination
                currentPage={page}
                totalPages={maxPage}
                onPageChange={onPageChange}
            />
            <CatsListAccordion cats={cats} />
            <Pagination
                currentPage={page}
                totalPages={maxPage}
                onPageChange={onPageChange}
            />
        </div>
    );
}