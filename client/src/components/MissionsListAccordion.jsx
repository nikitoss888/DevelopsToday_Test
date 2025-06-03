"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function MissionsListAccordion({ missions }) {
    return (
        <Accordion variant="bordered" className="w-full max-w-3xl border border-gray-300 rounded-lg p-4">
            {missions.map((mission) => (
                <AccordionItem key={mission.id} title={`Mission #${mission.id}`} className="my-2" aria-label={`Spy Mission ${mission.id}`}>
                    <ul className="list-none">
                        <li className="text-md">
                            <a className="underline" href={`/missions/${mission.id}`}>Mission #{mission.id}</a>
                        </li>
                        {mission.cat ? (
                            <li className="text-md">
                                <a href={`/cats/${mission.cat.id}`}>Assigned Cat: {mission.cat.name}</a>
                            </li>
                        ) : (
                            <li className="text-md">No cat assigned</li>
                        )}
                    </ul>
                </AccordionItem>
            ))}
        </Accordion>
    );
}