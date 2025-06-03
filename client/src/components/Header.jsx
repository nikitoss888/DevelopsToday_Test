export default function Header() {
    return (
        <header className="flex items-end p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold mr-5">
                <a href="/" className="hover:underline">Spy Cat Agency</a>
            </h1>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/cats" className="hover:underline">Cats</a></li>
                    <li><a href="/missions" className="hover:underline">Missions</a></li>
                </ul>
            </nav>
        </header>
    );
}
