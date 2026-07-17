import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import { STOPS } from "@/lib/trail-data";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Camera, Sparkles, CheckCircle2, MapPin } from "lucide-react";

// Note: getUserMedia + BarcodeDetector require HTTPS (or localhost).

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

// Accepted QR payload formats:
//   jalan-stories:stop:<id>
//   https://jalan-stories.app/stop/<id>
function parsePayload(text: string): { stopId: number } | null {
  const t = text.trim();
  const m1 = /^jalan-stories:stop:(\d+)$/i.exec(t);
  if (m1) return { stopId: Number(m1[1]) };
  const m2 = /\/stop\/(\d+)\b/i.exec(t);
  if (m2) return { stopId: Number(m2[1]) };
  return null;
}

function PuzzlePage() {
  const { stopId } = Route.useParams();
  const stop = STOPS.find((s) => s.id === Number(stopId));
  const navigate = useNavigate();
  const [arOpen, setArOpen] = useState(false);
  const [scannedPayloads, setScannedPayloads] = useState<Set<string>>(new Set());
  const alreadyScanned = useMemo(
    () => stop ? [...scannedPayloads].some((p) => parsePayload(p)?.stopId === stop.id) : false,
    [scannedPayloads, stop],
  );

  // Load saved scans on mount so progress survives reload
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase.from("scans").select("qr_payload");
      if (data) setScannedPayloads(new Set(data.map((r) => r.qr_payload as string)));
    })();
  }, []);

  if (!stop) {
    return (
      <div className="min-h-dvh bg-hero">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-serif text-3xl text-cream">Stop not found</h1>
          <Link to="/trail" className="mt-4 inline-block text-gold underline">Back to trail</Link>
        </div>
      </div>
    );
  }

  async function persistScan(payload: string, sid: number): Promise<"saved" | "duplicate" | "unauth" | "error"> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return "unauth";
    const { error } = await supabase
      .from("scans")
      .insert({ user_id: userData.user.id, stop_id: sid, qr_payload: payload });
    if (error) {
      if (error.code === "23505" || error.message.toLowerCase().includes("duplicate")) return "duplicate";
      console.error(error);
      return "error";
    }
    // Also mark stop visit (idempotent — table has its own unique behavior; ignore duplicate errors)
    await supabase
      .from("user_stop_visits")
      .insert({ user_id: userData.user.id, stop_id: sid })
      .then(() => {}, () => {});
    return "saved";
  }

  async function handleScanResult(payload: string) {
    const parsed = parsePayload(payload);
    if (!parsed) {
      toast.error("Invalid QR code");
      return false;
    }
    if (parsed.stopId !== stop!.id) {
      toast.error(`This QR belongs to stop ${parsed.stopId}. Head there to scan it.`);
      return false;
    }
    if (scannedPayloads.has(payload)) {
      toast("Already collected", { description: `You already scanned ${stop!.name}.` });
      return true;
    }
    const result = await persistScan(payload, parsed.stopId);
    if (result === "unauth") {
      toast.error("Sign in to save your scan", {
        action: { label: "Sign in", onClick: () => (window.location.href = "/auth") },
      });
      return false;
    }
    if (result === "error") {
      toast.error("Couldn't save your scan. Please try again.");
      return false;
    }
    setScannedPayloads((prev) => new Set(prev).add(payload));
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(200);
    if (result === "duplicate") {
      toast("Already collected", { description: `You already scanned ${stop!.name}.` });
    } else {
      toast.success(`Heritage marker unlocked at ${stop!.name}!`);
    }
    return true;
  }

  return (
    <div className="min-h-dvh bg-hero bg-tile pb-safe">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <Link to="/trail" className="text-xs uppercase tracking-widest text-gold">← Back to trail</Link>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold">Stop {stop.id} · {stop.theme}</p>
        <h1 className="mt-2 font-serif text-3xl text-cream sm:text-4xl md:text-5xl">{stop.name}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {stop.location}
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-card/70 p-5 md:p-6">
          <h2 className="font-serif text-xl text-cream">The Heritage Story</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stop.description}</p>
          {alreadyScanned && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-secondary/10 px-3 py-1 text-xs text-gold">
              <CheckCircle2 className="h-4 w-4" /> Stamp collected
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => setArOpen(true)}
            className="min-h-11 bg-rust-gradient text-cream shadow-gold hover:opacity-90"
          >
            <Camera className="mr-2 h-4 w-4" /> Activate AR Scanner
          </Button>
          <Link
            to="/trail"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold/50 bg-secondary/10 px-4 py-2 text-sm text-gold"
          >
            Back to map
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Expected QR format: <code className="text-gold">jalan-stories:stop:{stop.id}</code>
        </p>
      </div>

      {arOpen && (
        <ArScanner
          stopName={stop.name}
          story={stop.description}
          onExit={() => setArOpen(false)}
          onScan={handleScanResult}
          onDone={() => {
            setArOpen(false);
            setTimeout(() => navigate({ to: "/stamp" }), 700);
          }}
        />
      )}
    </div>
  );
}

type ArState = "requesting" | "scanning" | "success" | "denied" | "unavailable" | "timeout";

function ArScanner({
  stopName,
  story,
  onExit,
  onScan,
  onDone,
}: {
  stopName: string;
  story: string;
  onExit: () => void;
  onScan: (payload: string) => Promise<boolean>;
  onDone: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanningRef = useRef(true);
  const [state, setState] = useState<ArState>("requesting");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function stopCamera() {
    scanningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.srcObject = null; } catch { /* noop */ }
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("unavailable");
        setErrorMsg("No camera available on this device.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setState("scanning");
        scanLoop();

        // 45s timeout — user hasn't scanned anything
        timeoutRef.current = setTimeout(() => {
          if (scanningRef.current) {
            setState("timeout");
            stopCamera();
          }
        }, 45000);
      } catch (e) {
        console.error(e);
        const err = e as { name?: string };
        if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
          setState("denied");
          setErrorMsg("Camera permission denied. Enable camera access in your browser settings.");
        } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
          setState("unavailable");
          setErrorMsg("No camera found on this device.");
        } else {
          setState("unavailable");
          setErrorMsg("Unable to open camera. Please try again.");
        }
      }
    })();

    function scanLoop() {
      if (!scanningRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const img = ctx.getImageData(0, 0, w, h);
            const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
            if (code?.data) {
              scanningRef.current = false;
              playSuccessTone();
              onScan(code.data).then((ok) => {
                if (ok) {
                  setState("success");
                  stopCamera();
                  setTimeout(onDone, 900);
                } else {
                  scanningRef.current = true;
                  rafRef.current = requestAnimationFrame(scanLoop);
                }
              });
              return;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(scanLoop);
    }

    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleExit() {
    stopCamera();
    onExit();
  }

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

  const isError = state === "denied" || state === "unavailable" || state === "timeout";

  return (
    <div className="fixed inset-0 z-[9999] bg-black pt-safe pb-safe pl-safe pr-safe">
      <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Flash on success */}
      <div className={`pointer-events-none absolute inset-0 bg-gold/40 transition-opacity duration-300 ${state === "success" ? "opacity-100" : "opacity-0"}`} />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))] text-cream">
        <button
          onClick={handleExit}
          aria-label="Exit AR"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">AR Scanner</div>
          <div className="font-serif text-sm">{stopName}</div>
        </div>
      </div>

      {/* Scan frame */}
      <ScanFrame active={state === "scanning"} />

      {/* Status text */}
      {state === "scanning" && (
        <div className="absolute left-1/2 top-[calc(50%+140px)] -translate-x-1/2 text-center text-cream">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/50 px-4 py-1.5 text-xs backdrop-blur">
            Scanning for heritage marker
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "300ms" }}>.</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-cream">
          <div className="max-w-sm">
            <p className="font-serif text-xl">
              {state === "timeout" ? "No QR code detected" : errorMsg}
            </p>
            {state === "timeout" && (
              <p className="mt-2 text-sm text-muted-foreground">
                Move closer to the marker and try again.
              </p>
            )}
            <Button onClick={handleExit} className="mt-4 min-h-11">Close</Button>
          </div>
        </div>
      )}

      {/* Bottom heritage panel */}
      {!isError && (
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-gold/40 bg-background/85 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-cream backdrop-blur-lg animate-fade-up">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gold/40" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Heritage Story</p>
          <h3 className="mt-1 font-serif text-lg text-cream">{stopName}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{story}</p>
          {state === "success" && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-sm font-medium text-background">
              <CheckCircle2 className="h-4 w-4" /> Stamp claimed!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScanFrame({ active }: { active: boolean }) {
  const cornerBase =
    "absolute h-10 w-10 border-gold transition-all duration-300 " + (active ? "animate-pulse" : "");
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 sm:h-64 sm:w-64">
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
