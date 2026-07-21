import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket } from "lucide-react";
import { enableDemoMode, isDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Jalan Stories" },
      { name: "description", content: "Sign in to save your Jalan Stories stamp progress." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode()) {
      navigate({ to: "/trail" });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/stamp" });
    });
  }, [navigate]);

  function handleDemoMode() {
    enableDemoMode();
    toast.success("Demo mode enabled — enjoy the trail!");
    navigate({ to: "/trail" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/stamp" },
        });
        if (error) throw error;
        toast.success("Account created — you're in!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/stamp" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero bg-tile">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-10">
        <Card className="w-full border-gold/30 bg-card/80 p-8 shadow-deep">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-background">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-xl text-cream">Claim your stamp</div>
              <div className="text-xs text-muted-foreground">
                {mode === "signin"
                  ? "Welcome back to Jalan Stories"
                  : "Create your traveller account"}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sand">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-background/60"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sand">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-background/60"
                placeholder="At least 6 characters"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-rust-gradient text-cream hover:opacity-90"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create stamp"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to the trail? " : "Already have a stamp? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-gold underline-offset-4 hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>

          <div className="mt-8 border-t border-gold/30 pt-6 text-center">
            <p className="mb-3 text-[11px] italic text-gold">For presentation purposes only</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoMode}
              className="w-full border-gold/40 bg-transparent text-gold hover:bg-gold/10"
            >
              Enter as Demo Visitor
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
