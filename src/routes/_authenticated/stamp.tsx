import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { STOPS, BADGES, REWARDS, computeBadges, unlockedRewardIds } from "@/lib/trail-data";
import { isDemoMode, getDemoVisitedStopIds } from "@/lib/demo-mode";
import { Award, Download, Stamp, Ticket, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/stamp")({
  head: () => ({
    meta: [
      { title: "My Stamp · Jalan Stories" },
      { name: "description", content: "Your Jalan Besar heritage stamps, badges and rewards." },
    ],
  }),
  component: StampPage,
});

function StampPage() {
  const { user } = Route.useRouteContext();
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode()) {
      setVisitedIds(getDemoVisitedStopIds());
      setLoading(false);
      return;
    }
    supabase
      .from("user_stop_visits")
      .select("stop_id")
      .then(({ data }) => {
        setVisitedIds((data ?? []).map((r) => r.stop_id));
        setLoading(false);
      });
  }, []);

  const earnedBadgeIds = computeBadges(visitedIds);
  const unlockedRewards = unlockedRewardIds(visitedIds);
  const displayName = user.email?.split("@")[0] ?? "Traveller";
  const progress = (visitedIds.length / STOPS.length) * 100;

  function handleDownload() {
    toast.success("Certificate ready — check the print preview");
    window.print();
  }

  return (
    <div className="min-h-screen bg-hero bg-tile pb-24">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Stamp card */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-double border-gold bg-gradient-to-br from-surface via-background to-surface p-8 shadow-deep">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
                <Ticket className="h-3.5 w-3.5" /> Heritage Stamp
              </div>
              <h1 className="mt-3 font-serif text-4xl text-cream md:text-5xl">
                {displayName}'s Jalan Stories
              </h1>
              <p className="mt-2 text-sm text-sand/80">
                Issued in Singapore · Jalan Besar Heritage Programme
              </p>
            </div>
            <div className="rounded-md border border-gold/40 bg-background/40 px-4 py-3 text-right">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Progress
              </div>
              <div className="font-serif text-3xl text-gold">
                {visitedIds.length}/{STOPS.length}
              </div>
              <div className="text-xs text-sand/70">stops discovered</div>
            </div>
          </div>

          <div className="mt-6">
            <Progress value={progress} className="h-2 bg-background/60" />
          </div>

          {/* Stamps */}
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-sand">
              <Stamp className="h-3.5 w-3.5 text-gold" /> Stamps
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {STOPS.map((s) => {
                const done = visitedIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`relative aspect-square rounded-full border-2 border-dashed p-3 text-center transition ${
                      done
                        ? "border-solid border-gold bg-rust-gradient shadow-gold"
                        : "border-white/20 bg-background/40 opacity-60"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <div
                        className={`font-serif text-2xl ${done ? "text-cream" : "text-muted-foreground"}`}
                      >
                        {s.id}
                      </div>
                      <div
                        className={`mt-1 text-[10px] leading-tight ${
                          done ? "text-sand" : "text-muted-foreground"
                        }`}
                      >
                        {done ? s.theme.split(" ")[0] : "Locked"}
                      </div>
                    </div>
                    {done && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase text-background">
                        Stamped
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" />
            <h2 className="font-serif text-2xl text-cream">Badges</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {BADGES.map((b) => {
              const earned = earnedBadgeIds.includes(b.id);
              return (
                <Card
                  key={b.id}
                  className={`p-5 text-center transition ${
                    earned ? "border-gold/50 bg-card" : "border-white/10 bg-card/40 opacity-60"
                  }`}
                >
                  <div className={`mx-auto mb-3 text-4xl ${earned ? "" : "grayscale"}`}>
                    {b.emoji}
                  </div>
                  <div className="font-serif text-sm text-cream">{b.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.description}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Rewards */}
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <h2 className="font-serif text-2xl text-cream">Rewards</h2>
          </div>
          {loading ? null : unlockedRewards.length === 0 ? (
            <Card className="border-white/10 bg-card/60 p-6 text-sm text-muted-foreground">
              Visit stops to unlock partner vouchers.
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {REWARDS.filter((r) => unlockedRewards.includes(r.id)).map((r) => (
                <div
                  key={r.id}
                  className="relative overflow-hidden rounded-lg border border-dashed border-gold/60 bg-card p-5"
                >
                  <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
                  <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
                  <div className="text-xs uppercase tracking-widest text-gold">Voucher</div>
                  <div className="mt-1 font-serif text-lg text-cream">{r.business}</div>
                  <div className="mt-1 text-sm text-sand/80">{r.offer}</div>
                  <div className="mt-3 inline-block rounded border border-gold/40 bg-background/60 px-2 py-1 font-mono text-sm text-gold">
                    {r.code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 flex justify-end">
          <Button
            onClick={handleDownload}
            disabled={visitedIds.length < STOPS.length}
            className="bg-gold-gradient text-background hover:opacity-90"
          >
            <Download className="mr-2 h-4 w-4" />
            {visitedIds.length < STOPS.length
              ? `Complete all stops to unlock certificate (${visitedIds.length}/${STOPS.length})`
              : "Download Certificate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
