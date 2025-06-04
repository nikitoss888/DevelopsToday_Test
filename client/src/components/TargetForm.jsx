export default function TargetForm({
    onSubmit, setName, setCountry, setIsComplete, setNotes, initialData, action
}) {
    console.log("TargetForm initialData:", initialData);

    const handleNotes = (e) => {
        const value = e.target.value;
        setNotes(value.split(";").map(note => note.trim()).filter(note => note.length > 0));
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <div className="flex flex-col gap-2 mb-2">
                <div className="grid grid-cols-2 grid-cols-2 auto-rows-auto gap-4">
                    <label htmlFor="name"
                        className="block text-md text-gray-900 dark:text-white row-start-1 col-start-1">
                        Name
                    </label>
                    <input
                        type="text"
                        placeholder="Target Name"
                        value={initialData.name}
                        id="name"
                        name="name"
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        className="flex-1 p-2 border rounded row-start-2 col-start-1"
                        required
                    />
                    <label htmlFor="country"
                        className="block text-md text-gray-900 dark:text-white row-start-1 col-start-2">
                        Country
                    </label>
                    <input
                        type="text"
                        placeholder="Country"
                        value={initialData.country}
                        id="country"
                        name="country"
                        onChange={e => {
                            setCountry(e.target.value);
                        }}
                        className="flex-1 p-2 border rounded row-start-2 col-start-2"
                        required
                    />
                </div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            name="is_complete"
                            id="is_complete"
                            defaultChecked={initialData.isComplete}
                            onChange={e => {
                                setIsComplete(e.target.checked);
                            }}
                            className="w-4 h-4 mt-2"
                            aria-label="Target is complete"
                        />
                    </div>
                    <label htmlFor="is_complete" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Complete</label>
                </div>
                {action === "create" && (
                    <div title="Separate notes by semicolons (;)">
                        <label htmlFor="notes"
                            className="block mb-2 text-md text-gray-900 dark:text-white">
                            Notes
                        </label>
                        <textarea
                            placeholder="Notes"
                            defaultValue={initialData.notes}
                            id="notes"
                            name="notes"
                            onChange={handleNotes}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                )}
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}