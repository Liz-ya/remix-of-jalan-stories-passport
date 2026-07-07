import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Sparkles, Award, Compass, Users, Ticket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AnimatedTrail } from "@/components/animated-trail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jalan Stories — Discover the Soul of Jalan Besar" },
      {
        name: "description",
        content:
          "Self-guided heritage trail, live craft demos and digital passport through Singapore's Jalan Besar.",
      },
    ],
  }),
  component: Landing,
});

const PARTNERS = ["URA", "NHB", "STB", "SLA", "CDC", "NAC"];

function Landing() {
  return (
    <div className="min-h-screen bg-hero bg-tile">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="max-w-3xl">
            <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-gold/40 bg-secondary/5 px-3 py-1 text-xs text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              A living heritage experience · Singapore
            </div>
            <h1 className="mt-6 animate-fade-up font-serif text-5xl leading-[1.05] text-cream md:text-7xl">
              Jalan <span className="text-gold">Stories</span> —
              <br />
              Discover the Soul of{" "}
              <span className="italic text-sand">Jalan Besar</span>
            </h1>
            <p
              className="mt-6 animate-fade-up text-lg text-muted-foreground md:text-xl"
              style={{ animationDelay: "120ms" }}
            >
              A self-guided heritage trail through Singapore's most storied
              neighbourhood. Five stops, live craft demonstrations, an AR puzzle
              hunt and a digital passport of stamps you keep forever.
            </p>

            <div
              className="mt-10 grid animate-fade-up gap-4 md:grid-cols-3"
              style={{ animationDelay: "240ms" }}
            >
              <CtaCard
                to="/trail"
                icon={<Compass className="h-5 w-5" />}
                title="Start the Trail"
                sub="Open the map"
                accent="rust"
              />
              <CtaCard
                to="/trail"
                icon={<Users className="h-5 w-5" />}
                title="View Live Demos"
                sub="Who's crafting now"
                accent="teal"
              />
              <CtaCard
                to="/passport"
                icon={<Ticket className="h-5 w-5" />}
                title="Claim Your Passport"
                sub="Collect stamps & rewards"
                accent="gold"
              />
            </div>
          </div>
        </div>

        {/* Animated dashed trail across the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-70">
          <AnimatedTrail className="h-full w-full" />
        </div>
      </section>

      {/* Feature highlights */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Why walk it</p>
          <h2 className="mt-3 font-serif text-4xl text-cream md:text-5xl">
            Not a tour. A neighbourhood, told by itself.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={<MapPin className="h-6 w-6" />}
            title="The Trail"
            body="Self-guided and flexible — start anywhere, in any order, at your own pace. Five stops woven along Jalan Besar's most tellable streets."
          />
          <Feature
            icon={<Users className="h-6 w-6" />}
            title="Live Demos"
            body="Real craftspeople, working in real time. Watch keys cut, tiles restored, sari draped and kopi brewed the way it's been done for generations."
          />
          <Feature
            icon={<Award className="h-6 w-6" />}
            title="Digital Rewards"
            body="Collect stamps in your passport, unlock heritage badges, and earn discount vouchers from partner businesses along the way."
          />
        </div>
      </section>

      {/* Partners */}
      <section className="border-y border-white/5 bg-black/20 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
            In partnership with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="font-serif text-2xl tracking-widest text-sand/60 transition hover:text-gold"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="font-serif text-2xl text-cream">
              Jalan <span className="text-gold">Stories</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              A heritage collaboration between residents, craftspeople and
              cultural agencies across Jalan Besar.
            </p>
          </div>
          <Link
            to="/trail"
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-card/60 p-4 transition hover:border-gold/40"
          >
            <div className="h-16 w-24 overflow-hidden rounded-md bg-background">
              <AnimatedTrail className="h-full w-full" />
            </div>
            <div className="text-sm">
              <div className="font-serif text-cream">Open the trail map</div>
              <div className="text-muted-foreground">5 stops · self-paced</div>
            </div>
          </Link>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jalan Stories · Made with heritage in mind.
        </div>
      </footer>
    </div>
  );
}

function CtaCard({
  to,
  icon,
  title,
  sub,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  accent: "rust" | "teal" | "gold";
}) {
  const accentClass =
    accent === "rust"
      ? "from-primary/30 to-primary/5 border-primary/40"
      : accent === "teal"
        ? "from-accent/30 to-accent/5 border-accent/40"
        : "from-secondary/30 to-secondary/5 border-secondary/40";
  return (
    <Link to={to} className="group block">
      <Card
        className={`relative overflow-hidden border bg-gradient-to-br ${accentClass} p-5 transition duration-300 group-hover:-translate-y-1 shadow-deep`}
      >
        <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-gold">
          {icon}
        </div>
        <div className="font-serif text-xl text-cream">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{sub}</div>
        <div className="mt-4 text-xs uppercase tracking-widest text-gold opacity-0 transition group-hover:opacity-100">
          Enter →
        </div>
      </Card>
    </Link>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-white/10 bg-card/70 p-8 backdrop-blur transition hover:border-gold/30">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold">
        {icon}
      </div>
      <h3 className="mb-3 font-serif text-2xl text-cream">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </Card>
  );
}
