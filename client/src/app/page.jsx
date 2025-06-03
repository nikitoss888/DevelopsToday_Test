import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-start p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold tracking-tight text-center w-full">
        Spy Cat Agency
      </h1>
      <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        <li className="mb-2 tracking-[-.01em]">
          This client application is built with{" "}
          <a
            className="underline underline-offset-4"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
          , a React framework for building server-rendered applications.
        </li>
        <li className="tracking-[-.01em]">
          The application is styled using{" "}
          <a
            className="underline underline-offset-4"
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tailwind CSS
          </a>
          , a utility-first CSS framework that allows for rapid UI development.
        </li>
      </ol>
      <p>
        Access the details on our agents, missions and more by links in the
        navigation bar above.
      </p>
    </div>
  );
}
