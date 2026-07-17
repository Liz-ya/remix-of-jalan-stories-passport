import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy redirect: /passport → /stamp (preserves old links & QR codes)
export const Route = createFileRoute("/passport")({
  beforeLoad: () => {
    throw redirect({ to: "/stamp" });
  },
});
