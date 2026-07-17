import { useEffect, useState } from "react";
import { sortedDemos, formatCountdown, formatCountdownSeconds, formatTimeRange, STOPS, type DemoState } from "@/lib/trail-data";
import { Radio, Clock, MapPin } from "lucide-react";

const STATE_META: Record<DemoState, { label: string; dot: string; badge: string }> = {
  live:     { label: "Live Now",       dot: "🔴", badge: "border-red-500/60 bg-red-500/15 text-red-300" },
  soon:     { label: "Starting Soon",  dot: "🟡", badge: "border-yellow-500/60 bg-yellow-500/15 text-yellow-200" },
  upcoming: { label: "Upcoming",       dot: "🟢", badge: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200" },
  ended:    { label: "Ended",          dot: "⚫", badge: "border-white/20 bg-white/5 text-muted-foreground" },
};

export function DemoScheduleBoard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Tick every second so live countdown updates smoothly.
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const demos = sortedDemos(now);

  return (
    <div className="rounded-2xl border-4 border-double border-gold/40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%),linear-gradient(180deg,#0f1a2a,#0a1220)] p-6 shadow-deep">
      <div className="mb-5 flex items-end justify-between border-b border-gold/20 pb-4">
        <div>
          <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-rust">Today's Board</p>
          <h2 className="mt-1 font-serif text-3xl text-gold" style={{ textShadow: "0 0 12px rgba(212,160,23,0.25)" }}>
            Live Demos
          </h2>
        </div>
        <div className="text-right font-mono text-xs text-gold/70">
          SGT {now.toLocaleTimeString("en-SG", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <ul className="space-y-3">
        {demos.map((d) => {
          const meta = STATE_META[d.info.state];
          const stop = STOPS.find((s) => s.id === d.stopId)!;
          return (
            <li
              key={d.id}
              className={`group flex flex-col gap-3 rounded-lg border border-white/5 bg-black/30 p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                d.info.state === "ended" ? "opacity-50" : "hover:border-gold/30"
              }`}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${meta.badge}`}>
                    <span>{meta.dot}</span> {meta.label}
                  </span>
                  <span className="font-mono text-xs text-gold/80">{formatTimeRange(d.start, d.end)}</span>
                </div>
                <div className="mt-2 font-serif text-lg text-cream" style={{ textShadow: "0 0 8px rgba(212,160,23,0.15)" }}>
                  {d.title}
                </div>
                <div className="mt-0.5 text-xs text-sand/70">by {d.vendor}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 text-rust" />
                  Stop {stop.id} · {stop.location}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <CountdownLabel state={d.info.state} msToStart={d.info.msToStart} msToEnd={d.info.msToEnd} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CountdownLabel({
  state,
  msToStart,
  msToEnd,
}: {
  state: DemoState;
  msToStart: number;
  msToEnd: number;
}) {
  if (state === "live") {
    return (
      <div className="inline-flex flex-col items-end">
        <span className="inline-flex items-center gap-1 text-xs text-red-300">
          <Radio className="h-3 w-3 animate-pulse" /> Ends in
        </span>
        <span className="font-mono text-lg text-gold">{formatCountdownSeconds(msToEnd)}</span>
      </div>
    );
  }
  if (state === "soon" || state === "upcoming") {
    return (
      <div className="inline-flex flex-col items-end">
        <span className="inline-flex items-center gap-1 text-xs text-sand/70">
          <Clock className="h-3 w-3" /> Starts in
        </span>
        <span className="font-mono text-lg text-gold">{formatCountdown(msToStart)}</span>
      </div>
    );
  }
  return <span className="font-mono text-xs text-muted-foreground">Ended</span>;
}
