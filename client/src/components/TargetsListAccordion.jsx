"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function TargetsListAccordion({ targets }) {
    return (
        <Accordion variant="bordered" className="w-full max-w-3xl border border-gray-300 rounded-lg p-4">
            {targets.map((target, index) => (
                <AccordionItem key={target.id} title={`Target #${index + 1}`} className="my-2" aria-label={`Target ${target.id}`}>
                    <ul className="list-none">
                        <li className="text-md">
                            <a className="underline" href={`/targets/${target.id}`}>ID #{target.id}: {target.name}</a>
                        </li>
                        <li className="text-md">Country: {target.country}</li>
                        <li className="text-md">Status: <span className={`${target.is_complete ? "text-green-500" : "text-red-500"}`}>{target.is_complete ? "Completed" : "In Progress"}</span></li>
                    </ul>
                </AccordionItem>
            ))}
        </Accordion>
    );
}