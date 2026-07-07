import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { STOPS } from "@/lib/trail-data";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Camera, Sparkles, CheckCircle2, MapPin } from "lucide-react";

export const Route = createFileRoute("/puzzle/$stopId")({
  head: ({ params }) => {
    const stop = STOPS.find((s) => s.id === Number(params.stopId));
    const title = stop ? `${stop.name} · AR Puzzle` : "AR Puzzle";
    return {
      meta: [
        { title: `${title} · Jalan Stories` },
        { name: "description", content: "Point your camera to unlock the heritage story at this Jalan Besar stop." },
      ],
    };
  },
  component: PuzzlePage,
});

function PuzzlePage() {
  const { stopId } = Route.useParams();
  const stop = STOPS.find((s) => s.id === Number(stopId));
  const navigate = useNavigate();
  const [arOpen, setArOpen] = useState(false);

  if (!stop) {
    return (
      <div className="min-h-screen bg-hero">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-serif text-3xl text-cream">Stop not found</h1>
          <Link to="/trail" className="mt-4 inline-block text-gold underline">Back to trail</Link>
        </div>
      </div>
    );
  }

  async function onSuccess() {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user && stop) {
      await supabase.from("user_stop_visits").insert({ user_id: userData.user.id, stop_id: stop.id });
    }
    toast.success(`Heritage marker unlocked at ${stop!.name}!`);
    setArOpen(false);
    setTimeout(() => navigate({ to: "/passport" }), 800);
  }

  return (
    <div className="min-h-screen bg-hero bg-tile">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/trail" className="text-xs uppercase tracking-widest text-gold">← Back to trail</Link>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold">Stop {stop.id} · {stop.theme}</p>
        <h1 className="mt-2 font-serif text-4xl text-cream md:text-5xl">{stop.name}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {stop.location}
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-card/70 p-6">
          <h2 className="font-serif text-xl text-cream">The Heritage Story</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stop.description}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setArOpen(true)} className="bg-rust-gradient text-cream shadow-gold hover:opacity-90">
            <Camera className="mr-2 h-4 w-4" /> Activate AR View
          </Button>
          <Link
            to="/trail"
            className="inline-flex items-center justify-center rounded-md border border-gold/50 bg-secondary/10 px-4 py-2 text-sm text-gold"
          >
            Back to map
          </Link>
        </div>
      </div>

      {arOpen && <ArOverlay stopName={stop.name} story={stop.description} onExit={() => setArOpen(false)} onSuccess={onSuccess} />}
    </div>
  );
}

function ArOverlay({
  stopName,
  story,
  onExit,
  onSuccess,
}: {
  stopName: string;
  story: string;
  onExit: () => void;
  onSuccess: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error(e);
        setError("Camera access denied. Enable camera permissions to use AR mode.");
      }
    })();

    // Simulate scan after 4 seconds
    const t = setTimeout(() => {
      if (cancelled) return;
      setFlash(true);
      playSuccessTone();
      setScanned(true);
      setTimeout(() => setFlash(false), 400);
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(t);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
  }, []);

  function playSuccessTone() {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.32);
      });
      setTimeout(() => ctx.close(), 1000);
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-cream">
          <div>
            <p className="font-serif text-xl">{error}</p>
            <Button onClick={onExit} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {/* Gold flash on scan */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gold/40 transition-opacity duration-300 ${flash ? "opacity-100" : "opacity-0"}`}
      />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 text-cream">
        <button
          onClick={onExit}
          aria-label="Exit AR"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">AR Mode</div>
          <div className="font-serif text-sm">{stopName}</div>
        </div>
      </div>

      {/* Scan frame corners */}
      <ScanFrame active={!scanned} />

      {/* Scanning text */}
      {!scanned && (
        <div className="absolute left-1/2 top-[calc(50%+120px)] -translate-x-1/2 text-center text-cream">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/50 px-4 py-1.5 text-xs backdrop-blur">
            Scanning for heritage marker
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "300ms" }}>.</span>
          </div>
        </div>
      )}

      {/* Bottom heritage panel — 30% screen height */}
      <div className="absolute inset-x-0 bottom-0 h-[30vh] rounded-t-2xl border-t border-gold/40 bg-background/85 p-5 text-cream backdrop-blur-lg animate-fade-up">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gold/40" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Heritage Story</p>
        <h3 className="mt-1 font-serif text-lg text-cream">{stopName}</h3>
        <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">{story}</p>
        {scanned && (
          <Button onClick={onSuccess} className="mt-3 w-full bg-gold-gradient text-background hover:opacity-90">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Claim Stamp
          </Button>
        )}
      </div>
    </div>
  );
}

function ScanFrame({ active }: { active: boolean }) {
  const cornerBase =
    "absolute h-10 w-10 border-gold transition-all duration-300 " + (active ? "animate-pulse" : "");
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2">
      <div className={cornerBase + " left-0 top-0 border-l-4 border-t-4 rounded-tl-lg"} />
      <div className={cornerBase + " right-0 top-0 border-r-4 border-t-4 rounded-tr-lg"} />
      <div className={cornerBase + " bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg"} />
      <div className={cornerBase + " bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg"} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/70">
        <Sparkles className="h-8 w-8" />
      </div>
    </div>
  );
}
