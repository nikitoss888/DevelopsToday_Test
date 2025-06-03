export default function CatForm({ onSubmit, setName, setYearsOfExperience, setBreed, setSalary, initialData = {} }) {
    console.log("CatForm initialData:", initialData);
    
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <div>
                <label htmlFor="name" className="block mb-2 text-md text-gray-900 dark:text-white">Name</label>
                <input type="text" id="name" defaultValue={initialData.name || ''}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            </div>
            <div>
                <label htmlFor="years_of_experience" className="block mb-2 text-md text-gray-900 dark:text-white">Years of Experience</label>
                <input type="number" id="years_of_experience" defaultValue={Number(initialData.yearsOfExperience) || 0}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="5" required />
            </div>
            <div>
                <label htmlFor="breed" className="block mb-2 text-md text-gray-900 dark:text-white">Breed</label>
                <input type="text" id="breed" defaultValue={initialData.breed || ''}
                    onChange={(e) => setBreed(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Siamese" required />
            </div>
            <div>
                <label htmlFor="salary" className="block mb-2 text-md text-gray-900 dark:text-white">Salary</label>
                <input type="number" id="salary" defaultValue={initialData.salary || ''}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="50000" required />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}