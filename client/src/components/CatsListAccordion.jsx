"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function CatsListAccordion({ cats }) {
    return (
        <Accordion variant="bordered" className="w-full max-w-3xl border border-gray-300 rounded-lg p-4">
            {cats.map((cat) => (
                <AccordionItem key={cat.id} title={`${cat.name}`} className="my-2" aria-label={`Spy Cat Agent ${cat.id}`}>
                    <ul className="list-none">
                        <li className="text-md">
                            <a className="underline" href={`/cats/${cat.id}`}>Agent #{cat.id}</a>
                        </li>
                        <li className="text-md">Years of Experience: {cat.years_of_experience}</li>
                        <li className="text-md">Breed: {cat.breed}</li>
                        <li className="text-md">Salary: ${cat.salary}</li>
                    </ul>
                </AccordionItem>
            ))}
        </Accordion>
    );
}