import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (isDemoMode()) {
      return {
        user: {
          id: "demo-visitor",
          email: "demo@jalan-stories.local",
          app_metadata: {},
          user_metadata: { demo: true },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as import("@supabase/supabase-js").User,
      };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
