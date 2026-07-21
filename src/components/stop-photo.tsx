import { useState } from "react";
import type { StopImage } from "@/lib/trail-data";

/**
 * Location photo card. Hotlinked from Wikimedia Commons — if the image
 * fails to load (offline, file moved), the whole card disappears rather
 * than showing a broken frame.
 */
export function StopPhoto({ image, className = "" }: { image: StopImage; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <figure
      className={`card-hover overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-deep ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-52 w-full object-cover sm:h-64 md:h-72"
      />
      <figcaption className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="truncate">{image.alt}</span>
        <a
          href={image.creditUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 underline-offset-2 transition-colors hover:text-gold"
        >
          {image.credit}
        </a>
      </figcaption>
    </figure>
  );
}
