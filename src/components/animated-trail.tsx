interface Props {
  className?: string;
}

/** Hand-drawn dashed trail SVG — animated draw + marching ants. */
export function AnimatedTrail({ className }: Props) {
  return (
    <svg
      viewBox="0 0 800 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="trailStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.77 0.14 82)" />
          <stop offset="100%" stopColor="oklch(0.52 0.17 30)" />
        </linearGradient>
      </defs>
      <path
        d="M20,220 C120,60 220,260 340,140 S560,60 700,200 L780,180"
        stroke="url(#trailStroke)"
        strokeWidth="3"
        strokeDasharray="10 12"
        strokeLinecap="round"
        className="animate-trail-march"
        style={{ strokeDashoffset: 0 }}
      />
      {[
        { x: 20, y: 220 },
        { x: 200, y: 150 },
        { x: 400, y: 140 },
        { x: 580, y: 130 },
        { x: 780, y: 180 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="10" fill="oklch(0.24 0.05 265)" stroke="oklch(0.77 0.14 82)" strokeWidth="2" />
          <circle cx={p.x} cy={p.y} r="3" fill="oklch(0.77 0.14 82)" />
        </g>
      ))}
    </svg>
  );
}
