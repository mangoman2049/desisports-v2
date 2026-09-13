import { revalidatePath } from "next/cache";

/**
 * Ensures all key tables, tournament pages, match listings, player profiles,
 * and captain dashboards are immediately purged of stale cache upon ingestion or outgestion.
 */
export function revalidateCricketCache(
  tournamentId?: number,
  matchId?: number,
  playerId?: number
) {
  try {
    // 1. Match listings and core directories
    revalidatePath("/matches");
    revalidatePath("/tournaments");
    revalidatePath("/players");
    revalidatePath("/captain");
    revalidatePath("/");

    // 2. Specific tournaments
    revalidatePath("/tournaments/0");
    revalidatePath("/tournaments/1");
    revalidatePath("/tournaments/2");
    if (tournamentId !== undefined && tournamentId !== null) {
      revalidatePath(`/tournaments/${tournamentId}`);
    }

    // 3. Match detail routes
    if (matchId) {
      revalidatePath(`/matches/${matchId}`);
    }
    revalidatePath("/matches/[id]", "page");

    // 4. Player profile routes
    if (playerId) {
      revalidatePath(`/player/${playerId}`);
      revalidatePath(`/players/${playerId}`);
    }
    revalidatePath("/player/[id]", "page");
    revalidatePath("/players/[id]", "page");

    // 5. Team pages
    revalidatePath("/tournaments/[tournamentId]/teams/[teamId]", "page");
    revalidatePath("/teams/[id]", "page");
  } catch (err) {
    console.warn("Cache revalidation note:", err);
  }
}
