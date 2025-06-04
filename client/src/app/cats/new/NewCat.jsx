"use client";

import { postSpycat } from "@/api/spycat";
import CatForm from "@/components/CatForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCat() {
    const [name, setName] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState(0);
    const [breed, setBreed] = useState("");
    const [salary, setSalary] = useState(0);

    const router = useRouter();

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
                console.log({
                    name,
                    yearsOfExperience,
                    breed,
                    salary
                })
                const res = await postSpycat({
                    name,
                    years_of_experience: yearsOfExperience,
                    breed,
                    salary
                });
                
                console.log("Spy Cat agent created:", res);
                alert("Spy Cat agent created successfully! ID: " + res.id);
                router.push(`/cats/${res.id}`);
            } catch (error) {
                console.error("Error creating Spy Cat agent:", error);
                alert("Failed to create Spy Cat agent.");
            }
        }

        postData();
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold tracking-tight text-center w-full">
                Create New Spy Cat Agent
            </h1>
            <CatForm onSubmit={onSubmit} setName={setName}
                setYearsOfExperience={setYearsOfExperience} setBreed={setBreed} setSalary={setSalary} />
        </div>
    )
}