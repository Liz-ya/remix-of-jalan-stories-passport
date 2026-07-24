import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { STOPS, getDemoStatus, type Stop } from "@/lib/trail-data";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LeafletTrailMap } from "@/components/leaflet-trail-map";
import { DemoScheduleBoard } from "@/components/demo-schedule-board";
import { StopPhoto } from "@/components/stop-photo";
import { isDemoMode, getDemoVisitedStopIds } from "@/lib/demo-mode";

export const Route = createFileRoute("/trail")({
  head: () => ({
    meta: [
      { title: "The Trail · Jalan Stories" },
      {
        name: "description",
        content: "Interactive Leaflet map of five heritage stops across Jalan Besar, Singapore.",
      },
    ],
  }),
  component: TrailPage,
});

function TrailPage() {
  const [selected, setSelected] = useState<Stop | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDemoMode()) {
      setVisits(new Set(getDemoVisitedStopIds()));
      return;
    }
    if (!user) {
      setVisits(new Set());
      return;
    }
    supabase
      .from("user_stop_visits")
      .select("stop_id")
      .then(({ data }) => setVisits(new Set((data ?? []).map((r) => r.stop_id))));
  }, [user]);

  return (
    <div className="min-h-dvh bg-hero bg-tile pb-safe">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">The Trail</p>
          <h1 className="mt-2 font-serif text-3xl text-cream md:text-5xl">
            Five stops. Any order.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Tap a marker to see what's there. When you arrive, open the stop and answer the question
            in front of you.
          </p>
        </div>

        <div className="relative z-0 h-[60dvh] w-full md:h-[560px]">
          <LeafletTrailMap
            onSelect={setSelected}
            visits={visits}
            targetStop={selected}
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
            <StopListCard
              key={s.id}
              stop={s}
              onOpen={() => setSelected(s)}
              visited={visits.has(s.id)}
            />
          ))}
        </section>
      </div>

      {/* Bottom sheet for stop details */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
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
                  <span className="text-xs uppercase tracking-widest text-gold">
                    {selected.theme}
                  </span>
                </div>
                <SheetTitle className="font-serif text-2xl text-cream">{selected.name}</SheetTitle>
                <SheetDescription className="text-sand/80">{selected.location}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-5 pb-6">
                {selected.image && <StopPhoto image={selected.image} />}

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>

                {selected.highlights && (
                  <div className="rounded-lg border border-gold/20 bg-black/30 p-4">
                    <div className="mb-3 border-b border-gold/20 pb-2">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-rust">
                        {selected.highlights.subheading}
                      </div>
                      <div className="font-serif text-xl text-gold">
                        {selected.highlights.heading}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selected.highlights.blocks.map((b) => (
                        <div key={b.title}>
                          <div className="font-serif text-sm text-cream">{b.title}</div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {b.body}
                          </p>
                        </div>
                      ))}
                    </div>
                    {selected.highlights.footer && (
                      <p className="mt-4 border-t border-gold/20 pt-3 text-sm italic text-sand/80">
                        {selected.highlights.footer.text}
                      </p>
                    )}
                  </div>
                )}

                <DemoStatusRow stopId={selected.id} />

                <Link
                  to="/puzzle/$stopId"
                  params={{ stopId: String(selected.id) }}
                  className="btn-cta"
                >
                  Answer the Question →
                </Link>
                {!user && (
                  <p className="text-center text-xs text-muted-foreground">
                    <Link to="/auth" className="text-gold underline">
                      Sign in
                    </Link>{" "}
                    to save your progress.
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StopListCard({
  stop,
  onOpen,
  visited,
}: {
  stop: Stop;
  onOpen: () => void;
  visited: boolean;
}) {
  return (
    <Card className="card-hover rounded-2xl border-white/10 bg-card/70 p-6">
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
        <button onClick={onOpen} className="text-sm text-gold hover:text-gold/80">
          Open stop →
        </button>
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
