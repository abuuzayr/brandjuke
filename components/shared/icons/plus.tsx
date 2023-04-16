export default function Plus({ className }: { className?: string }) {
  return (
    <svg
    className={className}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
