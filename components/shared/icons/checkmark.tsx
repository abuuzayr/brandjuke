const Checkmark = () => (
    <span
        className="absolute inset-y-0 right-0 grid place-content-center px-4"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    </span>
)

export default Checkmark;