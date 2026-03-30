export function HeroCoffeeMark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full text-coffee-dark/85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="60" cy="60" r="44" className="fill-accent/10" />
        <g
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 38 44 L 38 68 Q 38 78 60 78 Q 82 78 82 68 L 82 44" />
          <path d="M 82 50 Q 96 50 96 62 Q 96 72 86 74" />
          <path d="M 38 44 Q 60 38 82 44" />
          <path d="M 50 34 Q 52 24 50 16" opacity="0.4" />
          <path d="M 60 34 Q 62 22 60 14" opacity="0.35" />
          <path d="M 70 34 Q 72 24 70 16" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
