"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, UserPersona } from "@/lib/analytics";

function inferPersonaFromPath(path: string): UserPersona {
  if (path.startsWith("/captain")) return "CAPTAIN";
  if (path.startsWith("/admin/scorecards/new") || path.includes("/review")) return "REVIEWER";
  if (path.startsWith("/admin")) return "ADMIN";
  if (path.startsWith("/player/")) return "PLAYER";
  if (path.startsWith("/matches/") || path.includes("/teams/")) return "ANALYST";
  return "VISITOR";
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const persona = inferPersonaFromPath(pathname);
      trackPageView(pathname, persona);
    }
  }, [pathname]);

  return <>{children}</>;
}
