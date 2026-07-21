import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMap } from "leaflet";
import {
  STOPS,
  DEMOS,
  getActiveOrUpcomingDemo,
  getNextStop,
  walkingMinutes,
  formatTimeRange,
  formatCountdown,
} from "@/lib/trail-data";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { isDemoMode, disableDemoMode } from "@/lib/demo-mode";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/puzzle/$stopId")({
  head: ({ params }) => {
    const stop = STOPS.find((s) => s.id === Number(params.stopId));
    const title = stop ? `${stop.name} · Stop` : "Stop";
    return {
      meta: [
        { title: `${title} · Jalan Stories` },
        {
          name: "description",
          content: "Explore this Jalan Besar heritage stop — story, map, live demo and question.",
        },
      ],
    };
  },
  component: PuzzlePage,
});

const LOCK_DAYS = 180;

function formatReturnDate(fromISO: string): string {
  const d = new Date(fromISO);
  d.setDate(d.getDate() + LOCK_DAYS);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type LockState =
  | { kind: "loading" }
  | { kind: "guest" } // not signed in — puzzle locked until login
  | { kind: "demo" } // demo visitor — view-only, answering needs a real account
  | { kind: "unlocked"; expired?: boolean }
  | { kind: "locked"; completedAt: string; demoAttended: boolean };

function PuzzlePage() {
  const navigate = useNavigate();
  const { stopId } = Route.useParams();
  const sid = Number(stopId);
  const stop = STOPS.find((s) => s.id === sid);
  const next = stop ? getNextStop(stop.id) : null;
  const demo = stop ? getActiveOrUpcomingDemo(stop.id) : null;
  const puzzleRef = useRef<HTMLDivElement | null>(null);
  const [lock, setLock] = useState<LockState>({ kind: "loading" });
  const demoMode = isDemoMode();

  useEffect(() => {
    if (!stop) return;
    if (demoMode) {
      setLock({ kind: "demo" });
      return;
    }
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLock({ kind: "guest" });
        return;
      }
      const { data } = await supabase
        .from("visitor_progress" as never)
        .select("completed_at,demo_attended")
        .eq("user_id", userData.user.id)
        .eq("stop_id", stop.id)
        .order("completed_at", { ascending: false })
        .limit(1);
      const row = (data as Array<{ completed_at: string; demo_attended: boolean }> | null)?.[0];
      if (!row) return setLock({ kind: "unlocked" });
      const ageMs = Date.now() - new Date(row.completed_at).getTime();
      if (ageMs < LOCK_DAYS * 86400 * 1000) {
        setLock({ kind: "locked", completedAt: row.completed_at, demoAttended: row.demo_attended });
      } else {
        setLock({ kind: "unlocked", expired: true });
      }
    })();
  }, [stop, demoMode]);

  if (!stop) {
    return (
      <div className="min-h-dvh bg-hero">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-serif text-3xl text-cream">Stop not found</h1>
          <Link to="/trail" className="mt-4 inline-block text-gold underline">
            Back to trail
          </Link>
        </div>
      </div>
    );
  }

  const scrollToPuzzle = () =>
    puzzleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-dvh bg-hero bg-tile pb-safe">
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl px-4 py-6 md:py-10">
        <Link to="/trail" className="text-xs uppercase tracking-widest text-gold">
          ← Back to trail
        </Link>

        {/* SECTION 1: HERITAGE INFO */}
        <section className="mt-6">
          <span className="inline-flex items-center rounded-full bg-rust-gradient px-3 py-1 text-xs font-semibold text-cream">
            Stop {stop.id}
          </span>
          <h1 className="mt-3 font-serif text-h3 font-bold text-cream">{stop.name}</h1>
          <p className="mt-1 text-small italic text-gold">{stop.theme}</p>
          <p className="mt-4 text-body leading-relaxed text-cream/90">{stop.description}</p>

          {stop.facts && stop.facts.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {stop.facts.map((f) => (
                <div key={f.label} className="rounded-lg border border-gold/25 bg-black/30 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gold">{f.label}</div>
                  <div className="mt-1 font-serif text-cream">{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: LOCATION MAP */}
        <MapSection
          stop={stop}
          nextMinutes={next ? walkingMinutes(stop, next) : null}
          nextName={next?.name ?? null}
        />

        {/* SECTION 4: LIVE DEMO */}
        {demo && <LiveDemoSection stopId={stop.id} demoMode={demoMode} />}

        {/* SECTION 5: QUESTION */}
        <section ref={puzzleRef} className="mt-10">
          <h2 className="font-serif text-lg font-bold text-rust">Heritage Challenge</h2>
          {lock.kind === "loading" && (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          )}
          {lock.kind === "guest" && <GuestLockedPanel />}
          {lock.kind === "demo" && <DemoLockedPanel />}
          {lock.kind === "locked" && (
            <LockedPanel completedAt={lock.completedAt} stopName={stop.name} />
          )}
          {lock.kind === "unlocked" && <UnlockedPuzzle stop={stop} expired={!!lock.expired} />}
        </section>

        {/* Only primary CTA — scrolls to puzzle, or sends guests to sign in */}
        {lock.kind === "unlocked" && (
          <div className="mt-8">
            <button onClick={scrollToPuzzle} className="btn-cta">
              Answer the Question →
            </button>
          </div>
        )}
        {lock.kind === "guest" && (
          <div className="mt-8">
            <Link to="/auth" className="btn-cta">
              Answer the Question →
            </Link>
          </div>
        )}
        {lock.kind === "demo" && (
          <div className="mt-8">
            <button
              onClick={() => {
                disableDemoMode();
                navigate({ to: "/auth" });
              }}
              className="btn-cta"
            >
              Sign in to Answer →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Mini Map ─────────────── */

function MapSection({
  stop,
  nextMinutes,
  nextName,
}: {
  stop: { lat: number; lng: number; id: number };
  nextMinutes: number | null;
  nextName: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;
      const map = L.map(ref.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      }).setView([stop.lat, stop.lng], 17);
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap &copy; CARTO",
      }).addTo(map);
      const icon = L.divIcon({
        className: "jalan-marker",
        html: `<div class="jalan-marker-inner">${stop.id}</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      L.marker([stop.lat, stop.lng], { icon }).addTo(map);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [stop.lat, stop.lng, stop.id]);

  return (
    <section className="mt-10">
      <h2 className="font-serif italic text-gold">You are here</h2>
      <div
        ref={ref}
        className="mt-3 w-full overflow-hidden rounded-xl border border-gold/20"
        style={{ height: "220px", zIndex: 0 }}
      />
      {nextMinutes != null && nextName && (
        <p className="mt-3 text-sm text-cream/80">
          <MapPin className="mr-1 inline h-4 w-4 text-gold" />
          Next stop: <span className="text-cream">{nextName}</span> · ~{nextMinutes} min walk
        </p>
      )}
    </section>
  );
}

/* ─────────────── Live Demo ─────────────── */

function LiveDemoSection({ stopId, demoMode }: { stopId: number; demoMode: boolean }) {
  const [now, setNow] = useState<Date>(new Date());
  const [attended, setAttended] = useState(false);
  const demo = useMemo(() => getActiveOrUpcomingDemo(stopId, now), [stopId, now]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!demo) return null;
  const info = demo.info;
  const label =
    info.state === "live"
      ? `Ends in ${formatCountdown(info.msToEnd)}`
      : `Starts in ${formatCountdown(info.msToStart)}`;

  async function mark() {
    setAttended(true);
    toast.success("Bonus reward unlocked!");
    if (demoMode) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase.from("visitor_progress" as never).upsert({
      user_id: userData.user.id,
      stop_id: stopId,
      demo_attended: true,
    } as never);
  }

  return (
    <section className="mt-10">
      <h2 className="font-serif italic text-gold">Live Now at This Stop</h2>
      <div className="mt-3 rounded-xl border border-gold/30 bg-black/40 p-4">
        <div className="flex items-center gap-2">
          {info.state === "live" && (
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
          )}
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
            {info.state === "live" ? "Live" : "Upcoming"}
          </span>
        </div>
        <div className="mt-1 font-serif text-lg text-cream">{demo.title}</div>
        <div className="text-sm text-muted-foreground">{demo.vendor}</div>
        <div className="mt-1 text-xs text-sand/80">
          {formatTimeRange(demo.start, demo.end)} · {label}
        </div>
        <button
          onClick={mark}
          disabled={attended}
          className="mt-4 w-full rounded-md border border-gold/40 bg-secondary/10 py-2 text-sm text-gold hover:bg-secondary/20 disabled:opacity-60"
          style={{ minHeight: "44px" }}
        >
          {attended ? "✓ Bonus reward unlocked!" : "I attended this demo"}
        </button>
      </div>
    </section>
  );
}

/* ─────────────── Puzzle (Unlocked / Locked) ─────────────── */

function DemoLockedPanel() {
  return (
    <div className="mt-4 rounded-xl border border-gold/25 bg-black/40 p-5 opacity-90">
      <div className="flex items-center gap-2 text-gold">
        <Lock className="h-5 w-5" />
        <span className="font-serif text-lg">Locked in demo mode</span>
      </div>
      <p className="mt-2 text-sm text-cream/80">
        Demo mode is view-only. Create an account or sign in to answer questions and collect stamps.
      </p>
    </div>
  );
}

function GuestLockedPanel() {
  return (
    <div className="mt-4 rounded-xl border border-gold/25 bg-black/40 p-5 opacity-90">
      <div className="flex items-center gap-2 text-gold">
        <Lock className="h-5 w-5" />
        <span className="font-serif text-lg">Locked</span>
      </div>
      <p className="mt-2 text-sm text-cream/80">
        Sign in to check whether you've completed this stop and to answer the question.
      </p>
      <Link to="/auth" className="mt-3 inline-block text-sm text-gold underline underline-offset-4">
        Sign in to unlock →
      </Link>
    </div>
  );
}

function LockedPanel({ completedAt, stopName }: { completedAt: string; stopName: string }) {
  const returnDate = formatReturnDate(completedAt);
  return (
    <div className="mt-4 rounded-xl border border-gold/25 bg-black/40 p-5 opacity-90">
      <div className="flex items-center gap-2 text-gold">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-serif text-lg">You've already completed this stop.</span>
      </div>
      <p className="mt-2 text-sm text-cream/80">
        Come back after <span className="text-gold">{returnDate}</span> to earn rewards again.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-3 py-1 text-xs font-medium text-background">
        <Sparkles className="h-3.5 w-3.5" /> Stamp earned · {stopName}
      </div>
    </div>
  );
}

function UnlockedPuzzle({ stop, expired }: { stop: (typeof STOPS)[number]; expired: boolean }) {
  const [answer, setAnswer] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  // Demo validation: the accepted answer is the first word of the stop's
  // name, case-insensitive (e.g. "Berseh", "Mustafa", "New").
  const correctAnswer = stop.name.split(/\s+/)[0].replace(/[^\p{L}\p{N}]/gu, "");

  async function submit() {
    const given = answer.trim().replace(/[^\p{L}\p{N}]/gu, "");
    if (!given) return;
    if (given.toLowerCase() === correctAnswer.toLowerCase()) {
      setStatus("correct");
      toast.success("Correct! You've earned your stamp.");
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("visitor_progress" as never).insert({
          user_id: userData.user.id,
          stop_id: stop.id,
        } as never);
        await supabase
          .from("user_stop_visits")
          .insert({
            user_id: userData.user.id,
            stop_id: stop.id,
          })
          .then(
            () => {},
            () => {},
          );
      }
    } else {
      setStatus("wrong");
      setWrongCount((w) => w + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="mt-4">
      {expired && (
        <div className="mb-3 rounded-md border border-gold/30 bg-black/30 px-3 py-2 text-xs text-sand">
          Your previous completion has expired. Complete again to earn rewards.
        </div>
      )}
      <p className="font-serif text-lg leading-snug text-cream">{stop.puzzle.question}</p>

      <AnimatePresence>
        {status === "correct" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-xl border border-gold/40 bg-gold-gradient p-5 text-center text-background"
          >
            <CheckCircle2 className="mx-auto h-8 w-8" />
            <div className="mt-2 font-serif text-lg">Correct! You've earned your stamp.</div>
          </motion.div>
        ) : (
          <motion.form
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 flex flex-col gap-[10px]"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer…"
              autoComplete="off"
              autoCapitalize="off"
              className="w-full rounded-md px-4 text-cream placeholder:text-cream/40 transition-all duration-200 focus:outline-none"
              style={{
                minHeight: "52px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(212,160,23,0.4)",
              }}
            />
            <button type="submit" disabled={!answer.trim()} className="btn-cta mt-2">
              Submit Answer
            </button>
            {status === "wrong" && <p className="mt-1 text-sm text-rust">Not quite — try again</p>}
            {wrongCount >= 2 && (
              <p className="mt-1 rounded-md border border-gold/30 bg-black/30 p-3 text-xs text-sand">
                <span className="text-gold">Hint:</span> it's the first word of this stop's name.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// Silence unused import warning in case DEMOS isn't referenced elsewhere.
void DEMOS;
