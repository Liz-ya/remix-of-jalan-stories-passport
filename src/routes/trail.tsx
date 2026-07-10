import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, QrCode, CheckCircle2, Lock, Sparkles } from "lucide-react";
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
import { LeafletTrailMap } from "@/components/leaflet-trail-map";
import { DemoScheduleBoard } from "@/components/demo-schedule-board";

export const Route = createFileRoute("/trail")({
  head: () => ({
    meta: [
      { title: "The Trail · Jalan Stories" },
      { name: "description", content: "Interactive Leaflet map of five heritage stops across Jalan Besar, Singapore." },
    ],
  }),
  component: TrailPage,
});

function TrailPage() {
  const [selected, setSelected] = useState<Stop | null>(null);
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
    <div className="min-h-dvh bg-hero bg-tile pb-safe">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">The Trail</p>
          <h1 className="mt-2 font-serif text-3xl text-cream md:text-5xl">Five stops. Any order.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Tap a marker to read the story, check live demos, and scan the on-site QR to earn your stamp.
          </p>
        </div>

        {/* Map wrapper: sits below any Radix modal (z-0) */}
        <div className="relative z-0 h-[60dvh] w-full md:h-[560px]">
          <LeafletTrailMap
            onSelect={setSelected}
            visits={visits}
            targetStop={selected}
            suppressed={qrOpen}
            className="h-full w-full"
          />
        </div>

        {/* Live Demos board */}
        <section className="mt-10">
          <DemoScheduleBoard />
        </section>

        {/* Stop list */}
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {STOPS.map((s) => (
            <StopListCard key={s.id} stop={s} onOpen={() => setSelected(s)} visited={visits.has(s.id)} />
          ))}
        </section>
      </div>

      {/* Bottom sheet for stop details — unmounted while QR scanner is open so map/popup can't cover it */}
      <Sheet open={!!selected && !qrOpen} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="bottom"
          className="z-[9990] max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-gold/30 bg-card pb-safe"
        >
          {selected && (
            <>
              <SheetHeader className="text-left">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-background">
                    {selected.id}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-gold">{selected.theme}</span>
                </div>
                <SheetTitle className="font-serif text-2xl text-cream">{selected.name}</SheetTitle>
                <SheetDescription className="text-sand/80">{selected.location}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-5 pb-6">
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

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    onClick={() => setQrOpen(true)}
                    className="min-h-11 bg-rust-gradient text-cream hover:opacity-90 shadow-gold"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan QR
                  </Button>
                  <Link
                    to="/puzzle/$stopId"
                    params={{ stopId: String(selected.id) }}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold/50 bg-secondary/10 px-4 py-2 text-sm font-medium text-gold hover:bg-secondary/20"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> AR Puzzle
                  </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="z-[9999] max-w-[95vw] bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-cream">Point your camera</DialogTitle>
            <DialogDescription>Scan the QR code posted at this stop to unlock its stamp.</DialogDescription>
          </DialogHeader>
          <div className="mx-auto my-4 flex aspect-square w-full max-w-[13rem] items-center justify-center rounded-lg bg-cream p-3">
            <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={((i * 7 + (i % 5)) % 3 === 0) ? "bg-background" : "bg-cream"} />
              ))}
            </div>
          </div>
          {selected && (
            <Button
              onClick={() => markVisited(selected.id)}
              className="min-h-11 bg-gold-gradient text-background hover:opacity-90"
            >
              Simulate scan · Earn stamp
            </Button>
          )}
          {selected && (
            <Link
              to="/puzzle/$stopId"
              params={{ stopId: String(selected.id) }}
              onClick={() => setQrOpen(false)}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md border border-gold/40 bg-secondary/10 px-4 py-2 text-sm text-gold"
            >
              Open live camera scanner →
            </Link>
          )}
          {!user && (
            <p className="text-center text-xs text-muted-foreground">
              You'll need to <Link to="/auth" className="text-gold underline">sign in</Link> to save your progress.
            </p>
          )}
        </DialogContent>
      </Dialog>
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
        🔴 Live demo now: {status.demo.title}
      </div>
    );
  }
  if (status.kind === "upcoming") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-secondary/10 px-3 py-1 text-xs text-sand">
        Next: {status.demo.start} {compact ? "" : "· " + status.demo.title}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
      No demo today
    </div>
  );
}
