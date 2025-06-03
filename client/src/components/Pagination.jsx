import PropTypes from "prop-types";

export default function Pagination({ currentPage, totalPages = 10, onPageChange }) {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        start = 1;
        end = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
        end = totalPages;
        start = Math.max(1, totalPages - 4);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="flex justify-center mt-4 space-x-2">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black disabled:cursor-not-allowed"
            >
                First
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black disabled:cursor-not-allowed"
            >
                Previous
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${
                        page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-black"
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black disabled:cursor-not-allowed"
            >
                Next
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-black disabled:cursor-not-allowed"
            >
                Last
            </button>
        </div>
    )
}


Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
};