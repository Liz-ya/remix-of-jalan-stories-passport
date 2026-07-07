import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Award, Compass, Users, Ticket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AnimatedTrail } from "@/components/animated-trail";
import { HeroScenes } from "@/components/hero-scenes";
import { AGENCIES } from "@/components/government-logos";
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

function Landing() {
  return (
    <div className="min-h-screen bg-hero bg-tile">
      <SiteHeader />

      {/* Hero with crossfading scenes */}
      <HeroScenes>
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-40 md:pt-32 md:pb-48">
          <div className="max-w-3xl">
            <h1
              className="animate-fade-up font-serif font-bold"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "#FDF6E3",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Jalan Stories
            </h1>

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
      </HeroScenes>

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

      {/* Partners — In Collaboration With */}
      <section
        style={{
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(212,160,23,0.15)",
          borderBottom: "1px solid rgba(212,160,23,0.15)",
          padding: "40px 24px",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="text-center"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "13px",
              color: "#D4A017",
              letterSpacing: "0.1em",
              marginBottom: "24px",
            }}
          >
            In Collaboration With
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6" style={{ gap: "12px" }}>
            {AGENCIES.map(({ Logo, line1, line2 }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="flex w-full items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(212,160,23,0.3)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <Logo className="w-full h-auto" />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#E8D5B0",
                    textAlign: "center",
                    marginTop: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  <div>{line1}</div>
                  <div>{line2}</div>
                </div>
              </div>
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
