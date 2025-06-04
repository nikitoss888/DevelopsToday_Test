export default function NoteForm({
    onSubmit, setContent, initialData = "",
}) {
    console.log("NoteForm initialData:", initialData);

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <div>
                <label htmlFor="content"
                    className="block mb-2 text-md text-gray-900 dark:text-white">
                    Note content
                </label>
                <textarea
                    placeholder="Notes"
                    defaultValue={initialData}
                    id="content"
                    name="content"
                    onChange={e => setContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}