import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, QrCode, Radio, Clock, CheckCircle2, List, Map as MapIcon, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { STOPS, getDemoStatus, type Stop } from "@/lib/trail-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/trail")({
  head: () => ({
    meta: [
      { title: "The Trail · Jalan Stories" },
      {
        name: "description",
        content: "Interactive map of five heritage stops across Jalan Besar, Singapore.",
      },
    ],
  }),
  component: TrailPage,
});

function TrailPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setVisits(new Set());
      return;
    }
    supabase
      .from("user_stop_visits")
      .select("stop_id")
      .then(({ data }) => setVisits(new Set((data ?? []).map((r) => r.stop_id))));
  }, [user]);

  const selected = useMemo(
    () => STOPS.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  async function markVisited(stopId: number) {
    if (!user) {
      toast.error("Sign in to record your progress", {
        action: { label: "Sign in", onClick: () => (window.location.href = "/auth") },
      });
      return;
    }
    const { error } = await supabase
      .from("user_stop_visits")
      .insert({ user_id: user.id, stop_id: stopId });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    setVisits((prev) => new Set(prev).add(stopId));
    toast.success("Stamp added to your passport!");
    setQrOpen(false);
  }

  return (
    <div className="min-h-screen bg-hero bg-tile pb-20">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold">The Trail</p>
            <h1 className="mt-2 font-serif text-4xl text-cream md:text-5xl">Five stops. Any order.</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Tap a marker to read the story, check live demos, and scan the on-site QR to earn your stamp.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-white/10 bg-card/60 p-1">
            <button
              onClick={() => setView("map")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                view === "map" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
              }`}
            >
              <MapIcon className="h-4 w-4" /> Map
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                view === "list" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
              }`}
            >
              <List className="h-4 w-4" /> List
            </button>
          </div>
        </div>

        {view === "map" ? (
          <TrailMap onSelect={setSelectedId} visits={visits} />
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {STOPS.map((s) => (
              <StopListCard key={s.id} stop={s} onOpen={() => setSelectedId(s.id)} visited={visits.has(s.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Side panel */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto border-l-white/10 bg-card sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-background">
                    {selected.id}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-gold">{selected.theme}</span>
                </div>
                <SheetTitle className="font-serif text-2xl text-cream">{selected.name}</SheetTitle>
                <SheetDescription className="text-sand/80">{selected.location}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

                <DemoStatusRow stopId={selected.id} />

                <div>
                  <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Puzzle</div>
                  <div className="flex items-center gap-2 rounded-md border border-white/10 bg-background/60 p-3 text-sm">
                    {visits.has(selected.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-gold" />
                        <span className="text-cream">Completed</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Locked — scan QR at this stop</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => setQrOpen(true)}
                  className="w-full bg-rust-gradient text-cream hover:opacity-90 shadow-gold"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR at this stop
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-cream">Point your camera</DialogTitle>
            <DialogDescription>
              Scan the QR code posted at this stop to unlock its stamp.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto my-4 flex h-52 w-52 items-center justify-center rounded-lg bg-cream p-3">
            {/* Placeholder QR — repeating dot pattern */}
            <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={((i * 7 + (i % 5)) % 3 === 0) ? "bg-background" : "bg-cream"}
                />
              ))}
            </div>
          </div>
          {selected && (
            <Button
              onClick={() => markVisited(selected.id)}
              className="bg-gold-gradient text-background hover:opacity-90"
            >
              Simulate scan · Earn stamp
            </Button>
          )}
          {!user && (
            <p className="text-center text-xs text-muted-foreground">
              You'll need to{" "}
              <Link to="/auth" className="text-gold underline">
                sign in
              </Link>{" "}
              to save your progress.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrailMap({
  onSelect,
  visits,
}: {
  onSelect: (id: number) => void;
  visits: Set<number>;
}) {
  const pathD = useMemo(() => {
    const pts = STOPS.map((s) => `${s.x},${s.y}`);
    return `M${pts[0]} C ${pts.slice(1).join(" ")}`;
  }, []);
  return (
    <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-deep">
      {/* Faux street grid */}
      <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M6 0H0V6" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="56" fill="url(#grid)" />
        {/* River / spine */}
        <path
          d="M0,50 Q30,44 50,50 T100,48"
          stroke="oklch(0.52 0.08 210 / 0.3)"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Trail path */}
        <path
          d={pathD}
          stroke="oklch(0.77 0.14 82)"
          strokeWidth="0.6"
          strokeDasharray="1.2 1.6"
          strokeLinecap="round"
          fill="none"
          className="animate-trail-march"
        />
      </svg>

      {/* Neighbourhood label */}
      <div className="absolute left-6 top-5 font-serif text-sm tracking-[0.3em] text-sand/60">
        JALAN BESAR · SINGAPORE
      </div>

      {/* Markers */}
      {STOPS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
          aria-label={`Stop ${s.id}: ${s.name}`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-serif font-bold shadow-gold transition group-hover:scale-110 ${
              visits.has(s.id)
                ? "border-gold bg-gold-gradient text-background"
                : "border-gold bg-background text-gold animate-glow"
            }`}
          >
            {s.id}
          </div>
          <div className="absolute left-1/2 top-full mt-2 w-40 -translate-x-1/2 rounded-md bg-background/90 px-2 py-1 text-center text-xs text-cream opacity-0 shadow-deep backdrop-blur transition group-hover:opacity-100">
            {s.name}
          </div>
        </button>
      ))}
    </div>
  );
}

function StopListCard({ stop, onOpen, visited }: { stop: Stop; onOpen: () => void; visited: boolean }) {
  return (
    <Card className="border-white/10 bg-card/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-background">
              {stop.id}
            </span>
            {stop.theme}
          </div>
          <h3 className="mt-2 font-serif text-xl text-cream">{stop.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {stop.location}
          </p>
        </div>
        {visited && (
          <Badge className="bg-gold-gradient text-background hover:opacity-90">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Stamped
          </Badge>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{stop.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <DemoStatusRow stopId={stop.id} compact />
        <Button variant="ghost" size="sm" onClick={onOpen} className="text-gold hover:text-gold">
          Open stop →
        </Button>
      </div>
    </Card>
  );
}

function DemoStatusRow({ stopId, compact = false }: { stopId: number; compact?: boolean }) {
  const status = getDemoStatus(stopId);
  if (status.kind === "live") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs text-cream">
        <Radio className="h-3 w-3 animate-pulse text-primary" />
        Active demo now: {status.demo.title}
      </div>
    );
  }
  if (status.kind === "upcoming") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-secondary/10 px-3 py-1 text-xs text-sand">
        <Clock className="h-3 w-3 text-gold" />
        Next demo: {status.demo.time} · {compact ? "" : status.demo.title}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
      No demo today
    </div>
  );
}
