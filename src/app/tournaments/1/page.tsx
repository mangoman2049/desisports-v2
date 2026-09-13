import { getTournamentDetails } from "@/lib/tournament-service";
import TournamentView from "../TournamentView";

export const metadata = {
  title: "Desi Boys Tournament May 2026 | DesiSports V2",
  description:
    "Official Spawtz 16-Over Indoor Cricket standings, squads, statistics, and scorecards for Desi Boys Tournament May 2026.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TournamentOnePage() {
  const data = await getTournamentDetails(1);

  return (
    <div className="py-2">
      <TournamentView data={data as any} />
    </div>
  );
}

