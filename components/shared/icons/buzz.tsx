export default function Buzz({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="url(#grad1)"
      strokeWidth="0"
      viewBox="0 0 20 20"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="75%" y2="75%">
          <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
          <stop offset="100%" stopColor="#fde047" stopOpacity={1}/>
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
        clipRule="evenodd">
      </path>
    </svg>
  );
}
