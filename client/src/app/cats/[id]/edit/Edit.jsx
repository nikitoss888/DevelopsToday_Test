"use client";

import { getSpycat, putSpycat } from "@/api/spycat";
import CatForm from "@/components/CatForm";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditCat({ id }) {
    const [name, setName] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState(0);
    const [breed, setBreed] = useState("");
    const [salary, setSalary] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCat = async () => {
            setLoading(true);
            try {
                const data = await getSpycat(id);
                
                setName(data.name);
                setYearsOfExperience(data.years_of_experience);
                setBreed(data.breed);
                setSalary(data.salary);

                console.log("Fetch:", data);
            } catch (error) {
                console.error("Error fetching cat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    const onSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with values:", {
            name,
            years_of_experience: yearsOfExperience,
            breed,
            salary
        });

        const postData = async () => {
            try {
                const res = await putSpycat(id, {
                    name,
                    years_of_experience: yearsOfExperience,
                    breed,
                    salary
                });

                console.log("Spy Cat agent updated:", res);
                alert("Spy Cat agent updated successfully!");
            } catch (error) {
                console.error("Error updating Spy Cat agent:", error);
                alert("Failed to update Spy Cat agent.");
            }
        }

        postData();
        redirect(`/cats/${id}`);
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Edit Spy Cat Agent
            </h1>
            <CatForm onSubmit={onSubmit} setName={setName}
                setYearsOfExperience={setYearsOfExperience} setBreed={setBreed} setSalary={setSalary} initialData={{
                    name,
                    yearsOfExperience: Number(yearsOfExperience),
                    breed,
                    salary: Number(salary)
                }} />
        </div>
    )
}