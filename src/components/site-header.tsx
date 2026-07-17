import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-lg pt-safe">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-secondary" />
          <span className="truncate font-serif text-lg tracking-tight text-cream">
            Jalan <span className="text-gold">Stories</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/trail"
            className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-cream"
            activeProps={{ className: "rounded-md px-3 py-2 text-cream" }}
          >
            Trail
          </Link>
          <Link
            to="/stamp"
            className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-cream"
            activeProps={{ className: "rounded-md px-3 py-2 text-cream" }}
          >
            Stamp
          </Link>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-muted-foreground hover:text-cream"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Sign out
            </Button>
          ) : (
            <Link to="/auth" className="ml-2">
              <Button size="sm" className="bg-rust-gradient text-cream hover:opacity-90">
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

