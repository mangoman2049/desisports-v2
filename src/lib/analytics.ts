/**
 * Google Analytics Helper (G-SH3KLTD7S2)
 * 
 * Tracks page views and Calls-to-Action (CTAs) segmented by User Persona:
 * - CAPTAIN: Team captains reviewing lineups, tactical briefings, and match matchups.
 * - REVIEWER: Scorers and referees verifying and approving scorecard extractions.
 * - ADMIN: Tournament administrators managing rosters, points tables, and database hygiene.
 * - PLAYER: Registered players viewing their career DNA, bowling/batting stats, and synergies.
 * - ANALYST: Coaches and tacticians exploring team DNA, Bazooka strategies, and skin analytics.
 * - VISITOR: General fans checking tournament schedules, standings, and results.
 */

export const GA_TRACKING_ID = "G-SH3KLTD7S2";

export type UserPersona =
  | "CAPTAIN"
  | "REVIEWER"
  | "ADMIN"
  | "PLAYER"
  | "ANALYST"
  | "VISITOR";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a CTA click segmented by persona
 */
export function trackCTA(
  ctaName: string,
  persona: UserPersona = "VISITOR",
  metadata: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "cta_click", {
      event_category: "CTA",
      event_label: ctaName,
      persona: persona,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}

/**
 * Tracks custom persona engagement events (e.g. scorecard approval, AI brief generation)
 */
export function trackPersonaEvent(
  eventName: string,
  persona: UserPersona,
  eventParams: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      persona: persona,
      timestamp: new Date().toISOString(),
      ...eventParams,
    });
  }
}

/**
 * Tracks page view with persona context
 */
export function trackPageView(url: string, persona: UserPersona = "VISITOR") {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
      persona: persona,
    });
  }
}
