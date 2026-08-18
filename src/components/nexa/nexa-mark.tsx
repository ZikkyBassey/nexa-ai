export function NexaMark({ className = "size-7" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[10px] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-full">
        <defs>
          <linearGradient id="nexa-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.19 165)" />
            <stop offset="100%" stopColor="oklch(0.9 0.13 195)" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#nexa-mark)" opacity="0.16" />
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="9"
          fill="none"
          stroke="url(#nexa-mark)"
          strokeWidth="1.4"
          opacity="0.7"
        />
        <path
          d="M10 22V10l12 12V10"
          fill="none"
          stroke="url(#nexa-mark)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
