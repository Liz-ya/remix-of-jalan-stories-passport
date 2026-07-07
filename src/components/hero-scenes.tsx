import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";

type Scene = {
  label: string;
  background: string;
  pattern: ReactNode;
};

const ARCH_PATTERN = (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <pattern id="arch-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M10 50 L10 25 A20 20 0 0 1 50 25 L50 50 Z"
          fill="#D4A017"
          opacity="0.08"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#arch-pat)" />
  </svg>
);

const TILE_PATTERN = (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <pattern id="tile-pat" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 2 L48 25 L25 48 L2 25 Z" fill="none" stroke="#D4A017" strokeWidth="0.8" opacity="0.1" />
        <circle cx="25" cy="25" r="3" fill="#D4A017" opacity="0.1" />
        <circle cx="25" cy="18" r="1.2" fill="#D4A017" opacity="0.1" />
        <circle cx="25" cy="32" r="1.2" fill="#D4A017" opacity="0.1" />
        <circle cx="18" cy="25" r="1.2" fill="#D4A017" opacity="0.1" />
        <circle cx="32" cy="25" r="1.2" fill="#D4A017" opacity="0.1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#tile-pat)" />
  </svg>
);

const BOWL_PATTERN = (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <pattern id="bowl-pat" x="0" y="0" width="55" height="55" patternUnits="userSpaceOnUse">
        <path d="M12 22 A15 10 0 0 0 42 22 L38 34 A11 5 0 0 1 16 34 Z" fill="#FDF6E3" opacity="0.06" />
        <ellipse cx="27" cy="22" rx="15" ry="2" fill="#FDF6E3" opacity="0.06" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bowl-pat)" />
  </svg>
);

const GEO_PATTERN = (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <pattern id="geo-pat" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M24 4 L44 24 L24 44 L4 24 Z" fill="none" stroke="#D4A017" strokeWidth="0.8" opacity="0.08" />
        <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="none" stroke="#D4A017" strokeWidth="0.6" opacity="0.08" />
        <path d="M24 20 L28 24 L24 28 L20 24 Z" fill="#D4A017" opacity="0.08" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-pat)" />
  </svg>
);

const SCENES: Scene[] = [
  {
    label: "Jalan Besar Road · The Trades Quarter",
    background:
      "linear-gradient(135deg, #2C1810 0%, #8B4513 30%, #C0392B 60%, #1A1A2E 100%)",
    pattern: ARCH_PATTERN,
  },
  {
    label: "Petain Road · Peranakan Heritage",
    background: "linear-gradient(135deg, #1B6B7A 0%, #0F4C5C 40%, #1A1A2E 100%)",
    pattern: TILE_PATTERN,
  },
  {
    label: "Berseh Food Centre · Hawker Heritage",
    background: "linear-gradient(135deg, #7B3F00 0%, #C0392B 40%, #8B0000 100%)",
    pattern: BOWL_PATTERN,
  },
  {
    label: "Syed Alwi Road · Multicultural Quarter",
    background: "linear-gradient(135deg, #1A1A2E 0%, #4A235A 40%, #1B6B7A 100%)",
    pattern: GEO_PATTERN,
  },
];

export function HeroScenes({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SCENES.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const go = (idx: number) => {
    setActive(((idx % SCENES.length) + SCENES.length) % SCENES.length);
    startTimer();
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 md:min-h-[70vh]">
        {SCENES.map((scene, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: i === active ? 1 : 0,
              background: scene.background,
            }}
          >
            <div className="absolute inset-0">{scene.pattern}</div>
            {/* readability overlays */}
            <div
              className="absolute inset-x-0 top-0 h-[20%]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[40%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
              }}
            />
          </div>
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>

      {/* Scene label */}
      <div
        className="absolute bottom-16 left-6 z-20 pointer-events-none"
        style={{
          fontSize: "11px",
          letterSpacing: "0.15em",
          color: "#D4A017",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          textTransform: "uppercase",
        }}
      >
        {SCENES[active].label}
      </div>

      {/* Nav dots */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-3">
        {SCENES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to scene ${i + 1}`}
            onClick={() => go(i)}
            className="h-3 w-3 rounded-full transition-colors"
            style={{
              background:
                i === active ? "#D4A017" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
