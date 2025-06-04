export default function MissionForm({
    onSubmit, setCatId, setIsComplete, cats, action, setTargets=() => {}, initialData = {}
}) {
    console.log("MissionForm initialData:", initialData);

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <div>
                <label htmlFor="cat_id" className="block mb-2 text-md text-gray-900 dark:text-white">Cat ID</label>
                <select id="cat_id" defaultValue={initialData.catId || ''}
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        setCatId(selectedValue ? Number(selectedValue) : null);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option key="default" value="">Select a Cat</option>
                    <option key="none" value="0">No Cat Assigned</option>
                    {cats.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                    <input id="is_complete" type="checkbox" value="" onChange={(e) => setIsComplete(e.target.checked)}
                        defaultChecked={initialData.isComplete || false}
                        className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    />
                </div>
                <label htmlFor="is_complete" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Complete</label>
            </div>
            {action === "create" && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Targets</h2>
                    {initialData.targets && initialData.targets.length > 0
                        ? null
                        : <p className="text-xs text-gray-500 mb-2">Click to add targets</p>}
                    {(initialData.targets || []).map((target, idx) => (
                        <div key={idx} className="flex flex-col gap-2 mb-2">
                            <div className="grid md:grid-cols-[1fr_1fr_minmax(80px,0.5fr)] grid-cols-2 auto-rows-auto gap-4">
                                <label htmlFor={`target_name_${idx}`} 
                                    className="block text-sm text-gray-900 dark:text-white row-start-1 col-start-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Target Name"
                                    value={target.name}
                                    id={`target_name_${idx}`}
                                    name={`target_name_${idx}`}
                                    onChange={e => {
                                        const newTargets = [...initialData.targets];
                                        newTargets[idx] = { ...newTargets[idx], name: e.target.value };
                                        setTargets(newTargets);
                                    }}
                                    className="flex-1 p-2 border rounded row-start-2 col-start-1"
                                    required
                                />
                                <label htmlFor={`target_country_${idx}`}
                                    className="block text-sm text-gray-900 dark:text-white row-start-1 col-start-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={target.country}
                                    id={`target_country_${idx}`}
                                    name={`target_country_${idx}`}
                                    onChange={e => {
                                        const newTargets = [...initialData.targets];
                                        newTargets[idx] = { ...newTargets[idx], country: e.target.value };
                                        setTargets(newTargets);
                                    }}
                                    className="flex-1 p-2 border rounded row-start-2 col-start-2"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTargets = initialData.targets.filter((_, i) => i !== idx);
                                        setTargets(newTargets);
                                    }}
                                    className="px-2 py-1 bg-red-500 text-white rounded my-1
                                        md:row-start-2 md:col-start-3 row-start-3 col-start-1 col-span-2"
                                    aria-label="Delete target"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="flex items-start mb-6">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        name={`target_complete_${idx}`}
                                        id={`target_complete_${idx}`}
                                        defaultChecked={target.is_complete || false}
                                        onChange={e => {
                                            const newTargets = [...initialData.targets];
                                            newTargets[idx] = { ...newTargets[idx], is_complete: e.target.checked };
                                            setTargets(newTargets);
                                        }}
                                        className="w-4 h-4 mt-2"
                                        aria-label="Target is complete"
                                    />
                                </div>
                                <label htmlFor={`target_complete_${idx}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Complete</label>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            const newTargets = [...(initialData.targets || []), { name: '', country: '', is_complete: false }];
                            setTargets(newTargets);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                        Add Target
                    </button>
                </div>
            )}
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}